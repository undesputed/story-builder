'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const VOICE_PREF_KEY = 'nws_voice_enabled'

/**
 * Speaks text through the /api/tts route (ElevenLabs).
 * Audio for each message id is fetched once and cached as an object URL,
 * so replaying a message costs no additional API characters.
 */
export function useSpeech() {
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cacheRef = useRef<Map<string, string>>(new Map())
  // Bumped on every stop/new request so a stale fetch can't hijack playback
  const requestSeqRef = useRef(0)

  useEffect(() => {
    if (window.localStorage.getItem(VOICE_PREF_KEY) === 'false') {
      setVoiceEnabled(false)
    }
  }, [])

  useEffect(() => {
    const cache = cacheRef.current
    return () => {
      audioRef.current?.pause()
      cache.forEach((url) => URL.revokeObjectURL(url))
      cache.clear()
    }
  }, [])

  const stop = useCallback(() => {
    requestSeqRef.current += 1
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setSpeakingId(null)
  }, [])

  const speak = useCallback(
    async (id: string, text: string) => {
      // Tapping the message that's already speaking stops it
      if (speakingId === id) {
        stop()
        return
      }

      stop()
      const seq = requestSeqRef.current
      setError(null)
      setSpeakingId(id)

      try {
        let url = cacheRef.current.get(id)
        if (!url) {
          const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          })
          if (!response.ok) {
            const detail = await response.json().catch(() => null)
            throw new Error(detail?.error || `TTS request failed (${response.status})`)
          }
          const blob = await response.blob()
          if (seq !== requestSeqRef.current) return
          url = URL.createObjectURL(blob)
          cacheRef.current.set(id, url)
        }

        if (seq !== requestSeqRef.current) return
        let audio = audioRef.current
        if (!audio) {
          audio = new Audio()
          audioRef.current = audio
        }
        audio.src = url
        audio.onended = () => setSpeakingId((cur) => (cur === id ? null : cur))
        await audio.play()
      } catch (err) {
        if (seq !== requestSeqRef.current) return
        setSpeakingId(null)
        // Browsers block audio before the first user interaction — not a
        // failure worth surfacing. Everything else is.
        if (
          err instanceof DOMException &&
          (err.name === 'NotAllowedError' || err.name === 'AbortError')
        ) {
          return
        }
        console.warn('Voice playback failed:', err)
        setError('Voice unavailable')
      }
    },
    [speakingId, stop]
  )

  const toggleVoice = useCallback(() => {
    const next = !voiceEnabled
    setVoiceEnabled(next)
    setError(null)
    window.localStorage.setItem(VOICE_PREF_KEY, String(next))
    if (!next) stop()
  }, [voiceEnabled, stop])

  return { voiceEnabled, toggleVoice, speak, stop, speakingId, error }
}
