'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Feather, Mic, Send, Square, Volume2, VolumeX } from 'lucide-react'
import { useSpeech } from '@/lib/use-speech'
import { useVoiceInput } from '@/lib/use-voice-input'
import { SCRIPT, type InterviewLanguage } from '@/lib/interview-script'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  language: InterviewLanguage
  onChangeLanguage: (language: InterviewLanguage) => void
  isLoading?: boolean
  isDisabled?: boolean
}

export function ChatInterface({
  messages,
  onSendMessage,
  language,
  onChangeLanguage,
  isLoading = false,
  isDisabled = false,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const [mounted, setMounted] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasScrolledOnceRef = useRef(false)
  const lastAutoSpokenRef = useRef<string | null>(null)
  const liveTranscriptRef = useRef('')
  const wasListeningRef = useRef(false)
  liveTranscriptRef.current = liveTranscript
  const {
    voiceEnabled,
    toggleVoice,
    speak,
    stop: stopSpeech,
    speakingId,
    error: voiceError,
  } = useSpeech()
  const {
    isSupported: micSupported,
    isListening,
    error: micError,
    start: startListening,
    stop: stopListening,
  } = useVoiceInput(language, setLiveTranscript)

  // Dictation speaks straight into its own bubble. When recording stops —
  // by tap or by the browser noticing silence — whatever was heard is sent
  // as the answer, the same as pressing send on typed text.
  useEffect(() => {
    if (wasListeningRef.current && !isListening) {
      const finalText = liveTranscriptRef.current.trim()
      if (finalText && !isLoading && !isDisabled) {
        onSendMessage(finalText)
      }
      setLiveTranscript('')
    }
    wasListeningRef.current = isListening
  }, [isListening, isLoading, isDisabled, onSendMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (hasScrolledOnceRef.current) {
      scrollToBottom()
    } else {
      hasScrolledOnceRef.current = true
    }
  }, [messages, mounted, isListening, liveTranscript])

  // The interviewer reads each new question aloud. The very first greeting may
  // be blocked by the browser's autoplay policy — its replay button still works.
  useEffect(() => {
    if (!mounted || !voiceEnabled) return
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'assistant') return
    if (lastAutoSpokenRef.current === last.id) return
    lastAutoSpokenRef.current = last.id
    speak(last.id, last.content)
  }, [messages, mounted, voiceEnabled, speak])

  // As soon as the interviewer finishes asking, the answer field is ready to type in
  useEffect(() => {
    if (!mounted || isLoading || isDisabled) return
    const last = messages[messages.length - 1]
    if (last?.role === 'assistant') inputRef.current?.focus()
  }, [messages, mounted, isLoading, isDisabled])

  // Dictation has no business running while the chat is paused
  useEffect(() => {
    if (isLoading || isDisabled) stopListening()
  }, [isLoading, isDisabled, stopListening])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading && !isDisabled) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      // Silence the interviewer so the mic doesn't transcribe her voice,
      // and clear the box — this turn's answer is being spoken, not typed
      stopSpeech()
      setInputValue('')
      setLiveTranscript('')
      startListening()
    }
  }

  const micErrorText =
    micError === 'blocked'
      ? SCRIPT[language].micBlocked
      : micError === 'failed'
        ? SCRIPT[language].micFailed
        : null

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Panel label — fixed h-12 so the border lines up with the story sheet */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-5">
        <div className="flex min-w-0 items-center gap-3">
          <p className="truncate font-mono text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Interview · インタビュー
          </p>
          <span
            className="hidden items-center gap-1.5 font-mono text-[11px] text-muted-foreground sm:flex"
            role="status"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isDisabled ? 'bg-stamp' : 'bg-primary'
              }`}
              aria-hidden="true"
            />
            {isDisabled ? 'Reviewing' : 'Listening'}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {voiceError && (
            <span className="font-mono text-[10px] text-destructive" role="status">
              {voiceError}
            </span>
          )}
          <div
            role="group"
            aria-label="Interview language"
            className="flex h-8 overflow-hidden rounded-lg border border-border"
          >
            <button
              type="button"
              onClick={() => onChangeLanguage('en')}
              aria-pressed={language === 'en'}
              className={`cursor-pointer px-2.5 font-mono text-[11px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                language === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguage('ja')}
              aria-pressed={language === 'ja'}
              className={`cursor-pointer px-2.5 text-[11px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                language === 'ja'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              日本語
            </button>
          </div>
          <button
            type="button"
            onClick={toggleVoice}
            aria-pressed={voiceEnabled}
            aria-label={voiceEnabled ? 'Turn interviewer voice off' : 'Turn interviewer voice on'}
            title={voiceEnabled ? 'Voice on · click to mute' : 'Voice off · click to unmute'}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              voiceEnabled
                ? 'border-primary/30 bg-accent text-primary'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {voiceEnabled ? (
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/25 bg-accent">
                <Feather className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Ready to tell your story?
              </h2>
              <p className="mt-1 font-display text-sm text-muted-foreground">
                仕事のものがたりを聞かせてください
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Answer a few questions about how AI changed your work. Your
                answers are typeset into the story sheet as you go.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) =>
            message.role === 'assistant' ? (
              <div key={message.id} className="animate-fade-up flex max-w-[85%] gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-accent">
                  <Feather className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                      Interviewer
                    </p>
                    {speakingId === message.id && (
                      <span className="flex h-3 items-center gap-[3px]" aria-hidden="true">
                        <span className="speak-bar h-full w-[2.5px] rounded-full bg-primary" />
                        <span className="speak-bar h-full w-[2.5px] rounded-full bg-primary" />
                        <span className="speak-bar h-full w-[2.5px] rounded-full bg-primary" />
                      </span>
                    )}
                  </div>
                  <div className="rounded-xl rounded-tl-sm border border-border bg-card px-4 py-3">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-card-foreground">
                      {message.content}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    {mounted && (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => speak(message.id, message.content)}
                      aria-label={
                        speakingId === message.id
                          ? 'Stop reading this message'
                          : 'Read this message aloud'
                      }
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {speakingId === message.id ? (
                        <Square className="h-3 w-3 fill-current" aria-hidden="true" />
                      ) : (
                        <Volume2 className="h-3 w-3" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={message.id} className="animate-fade-up flex justify-end">
                <div className="max-w-[85%]">
                  <div className="rounded-xl rounded-br-sm bg-primary px-4 py-3 text-primary-foreground">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  {mounted && (
                    <span className="mt-1 block text-right font-mono text-[10px] text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>
            )
          )
        )}

        {isListening && (
          <div className="animate-fade-up flex justify-end">
            <div className="max-w-[85%]">
              <div className="mb-1 flex items-center justify-end gap-1.5">
                <span className="rec-dot h-1.5 w-1.5 rounded-full bg-stamp" aria-hidden="true" />
                <span
                  role="status"
                  className="font-mono text-[10px] tracking-[0.12em] text-stamp uppercase"
                >
                  {SCRIPT[language].micLabel}
                </span>
              </div>
              {liveTranscript ? (
                <div className="rounded-xl rounded-br-sm border-2 border-dashed border-stamp/40 bg-primary px-4 py-3 text-primary-foreground">
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {liveTranscript}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-xl rounded-br-sm border-2 border-dashed border-stamp/40 bg-primary/90 px-4 py-4">
                  <span className="think-dot h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  <span className="think-dot h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  <span className="think-dot h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                </div>
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="animate-fade-up flex max-w-[85%] gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-accent">
              <Feather className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            </div>
            <div
              className="flex items-center gap-1.5 rounded-xl rounded-tl-sm border border-border bg-card px-4 py-4"
              role="status"
              aria-label="Interviewer is typing"
            >
              <span className="think-dot h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="think-dot h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="think-dot h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-background px-5 py-4">
        {isDisabled && (
          <div className="mb-3 rounded-lg border border-stamp/30 bg-stamp/10 px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
            {SCRIPT[language].reviewBanner}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="Your answer"
            placeholder={
              isDisabled
                ? SCRIPT[language].inputPlaceholderDisabled
                : SCRIPT[language].inputPlaceholder
            }
            disabled={isLoading || isDisabled || isListening}
            className="h-11 flex-1 rounded-xl"
          />
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading || isDisabled || (mounted && !micSupported)}
            aria-pressed={isListening}
            aria-label={isListening ? 'Stop voice input' : 'Answer by voice'}
            title={
              mounted && !micSupported
                ? SCRIPT[language].micUnsupported
                : isListening
                  ? 'Stop voice input'
                  : 'Answer by voice'
            }
            className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-40 ${
              isListening
                ? 'mic-pulse border-transparent bg-stamp text-stamp-foreground'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Mic className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="submit"
            disabled={isLoading || isDisabled || isListening || !inputValue.trim()}
            aria-label="Send answer"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
        {micErrorText && (
          <p role="status" className="mt-2 font-mono text-[11px] text-destructive">
            {micErrorText}
          </p>
        )}
      </div>
    </div>
  )
}
