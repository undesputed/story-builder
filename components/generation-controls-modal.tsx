'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, X } from 'lucide-react'
import type { StoryFocus, StoryLength } from '@/components/story-poster-display'

export interface GenerationControls {
  tone: number
  length: StoryLength
  focus: StoryFocus
}

export interface GenerationControlsProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (controls: GenerationControls) => void
  isLoading?: boolean
  nextVersion?: number
}

const LENGTH_OPTIONS: { value: StoryLength; label: string; hint: string }[] = [
  { value: 'short', label: 'Short', hint: 'Poster / card size' },
  { value: 'medium', label: 'Medium', hint: 'Default detail' },
  { value: 'long', label: 'Long', hint: 'Full page narrative' },
]

const FOCUS_OPTIONS: { value: StoryFocus; label: string; hint: string }[] = [
  { value: 'value', label: 'Value', hint: 'Business & customer outcomes' },
  { value: 'transformation', label: 'Transformation', hint: 'How the work changed' },
  { value: 'people', label: 'People', hint: 'Learning, confidence, growth' },
  { value: 'balanced', label: 'Balanced', hint: 'Even Before / After / Value / Next' },
]

export function GenerationControlsModal({
  isOpen,
  onClose,
  onGenerate,
  isLoading = false,
  nextVersion = 1,
}: GenerationControlsProps) {
  const [tone, setTone] = useState(30)
  const [length, setLength] = useState<StoryLength>('medium')
  const [focus, setFocus] = useState<StoryFocus>('balanced')

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const toneDescription =
    tone < 34
      ? 'Calm, factual, understated'
      : tone < 67
        ? 'Warm with a clear arc'
        : 'Emotional, strong Before / After contrast'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      onClick={() => !isLoading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="generation-title"
        className="animate-fade-up flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              Generation · 生成設定
            </p>
            <h2
              id="generation-title"
              className="mt-1.5 font-display text-xl font-bold text-card-foreground"
            >
              Compose your story
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Same facts, your choice of telling. Regenerate anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
          {/* Tone */}
          <div>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="tone-slider"
                className="font-mono text-[11px] font-semibold tracking-[0.18em] text-card-foreground uppercase"
              >
                Tone
              </label>
              <span className="font-mono text-[11px] text-muted-foreground">{tone}</span>
            </div>
            <input
              id="tone-slider"
              type="range"
              min="0"
              max="100"
              value={tone}
              onChange={(e) => setTone(parseInt(e.target.value))}
              disabled={isLoading}
              className="mt-3 w-full cursor-pointer accent-primary"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
              <span>Natural · 自然</span>
              <span>Dramatic · ドラマチック</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{toneDescription}</p>
          </div>

          {/* Length */}
          <fieldset>
            <legend className="font-mono text-[11px] font-semibold tracking-[0.18em] text-card-foreground uppercase">
              Length
            </legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {LENGTH_OPTIONS.map((option) => {
                const selected = length === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLength(option.value)}
                    disabled={isLoading}
                    aria-pressed={selected}
                    className={`cursor-pointer rounded-xl border px-3 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      selected
                        ? 'border-primary bg-accent'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <span
                      className={`block text-sm font-medium ${
                        selected ? 'text-accent-foreground' : 'text-card-foreground'
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                      {option.hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Focus */}
          <fieldset>
            <legend className="font-mono text-[11px] font-semibold tracking-[0.18em] text-card-foreground uppercase">
              Focus
            </legend>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FOCUS_OPTIONS.map((option) => {
                const selected = focus === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFocus(option.value)}
                    disabled={isLoading}
                    aria-pressed={selected}
                    className={`cursor-pointer rounded-xl border px-3.5 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      selected
                        ? 'border-primary bg-accent'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <span
                      className={`block text-sm font-medium ${
                        selected ? 'text-accent-foreground' : 'text-card-foreground'
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                      {option.hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        {/* Footer */}
        <div className="shrink-0 space-y-2.5 border-t border-border bg-muted/40 px-6 py-5">
          <button
            onClick={() => onGenerate({ tone, length, focus })}
            disabled={isLoading}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {isLoading ? 'Composing…' : `Generate story · v${nextVersion}`}
          </button>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="ghost"
            className="h-10 w-full rounded-xl text-sm text-muted-foreground"
          >
            Not yet — keep talking
          </Button>
        </div>
      </div>
    </div>
  )
}
