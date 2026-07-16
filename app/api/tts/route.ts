import { NextResponse } from 'next/server'

// Keeps the ElevenLabs key server-side; the browser only ever sees audio.
export async function POST(request: Request) {
  let text: unknown
  try {
    ;({ text } = await request.json())
  } catch {
    return NextResponse.json({ error: 'Send JSON with a "text" field.' }, { status: 400 })
  }

  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Send JSON with a non-empty "text" field.' }, { status: 400 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID
  if (!apiKey || !voiceId) {
    return NextResponse.json(
      { error: 'Voice is not configured. Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID.' },
      { status: 503 }
    )
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Interview questions are short; cap defensively so a runaway request
        // can't drain the character quota.
        text: text.slice(0, 2000),
        model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          // ElevenLabs accepts 0.7 (slowest) to 1.2 (fastest); 1.0 is default
          speed: 1.1,
        },
      }),
    }
  )

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => '')
    console.error(`ElevenLabs TTS failed (${response.status}): ${detail}`)
    return NextResponse.json(
      { error: 'Voice generation failed. Check the server logs for details.' },
      { status: 502 }
    )
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  })
}
