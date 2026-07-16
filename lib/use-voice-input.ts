'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { InterviewLanguage } from '@/lib/interview-script'

export type VoiceInputError = 'blocked' | 'failed' | null

/* Minimal typings for the Web Speech API (not in TS's DOM lib) */
interface SpeechRecognitionAlternativeLike {
  transcript: string
}
interface SpeechRecognitionResultLike {
  isFinal: boolean
  0: SpeechRecognitionAlternativeLike
}
interface SpeechRecognitionEventLike {
  resultIndex: number
  results: {
    length: number
    [index: number]: SpeechRecognitionResultLike
  }
}
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onend: (() => void) | null
  onerror: ((event: { error: string }) => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
}

/**
 * Dictation via the browser's built-in speech recognition (Chrome/Edge).
 * Streams live interim text through onTranscript while the user speaks,
 * in the interview language ('en' → en-US, 'ja' → ja-JP).
 */
export function useVoiceInput(
  language: InterviewLanguage,
  onTranscript: (text: string) => void
) {
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<VoiceInputError>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const onTranscriptRef = useRef(onTranscript)
  onTranscriptRef.current = onTranscript

  useEffect(() => {
    setIsSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition))
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setIsListening(false)
  }, [])

  const start = useCallback(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) {
      setError('failed')
      return
    }
    recognitionRef.current?.abort()

    const recognition = new Recognition()
    recognition.lang = language === 'ja' ? 'ja-JP' : 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    let finalTranscript = ''
    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }
      onTranscriptRef.current((finalTranscript + interim).trim())
    }
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('blocked')
      } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setError('failed')
      }
    }
    // The browser ends recognition itself after a stretch of silence
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null
        setIsListening(false)
      }
    }

    recognitionRef.current = recognition
    setError(null)
    setIsListening(true)
    try {
      recognition.start()
    } catch {
      recognitionRef.current = null
      setIsListening(false)
      setError('failed')
    }
  }, [language])

  // A language switch mid-dictation would transcribe in the wrong language
  useEffect(() => {
    stop()
  }, [language, stop])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  return { isSupported, isListening, error, start, stop }
}
