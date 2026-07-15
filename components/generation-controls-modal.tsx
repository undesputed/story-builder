'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export interface GenerationControlsProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (controls: GenerationControls) => void
  isLoading?: boolean
}

export interface GenerationControls {
  tone: number
  length: number
  focus: number
  version: string
}

export function GenerationControlsModal({
  isOpen,
  onClose,
  onGenerate,
  isLoading = false,
}: GenerationControlsProps) {
  const [tone, setTone] = useState(50)
  const [length, setLength] = useState(50)
  const [focus, setFocus] = useState(50)
  const [version, setVersion] = useState('v1')

  const handleGenerate = () => {
    onGenerate({
      tone,
      length,
      focus,
      version,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6 sticky top-0 bg-card">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Generation Controls</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Customize how your story is generated
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground">Tone</label>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {tone}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={tone}
              onChange={(e) => setTone(parseInt(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {tone < 33
                ? 'Formal and professional'
                : tone < 66
                ? 'Balanced tone'
                : 'Casual and conversational'}
            </p>
          </div>

          {/* Length */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground">Length</label>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {length}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {length < 33
                ? 'Concise and brief'
                : length < 66
                ? 'Moderate length'
                : 'Detailed and comprehensive'}
            </p>
          </div>

          {/* Focus */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground">Focus</label>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {focus}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={focus}
              onChange={(e) => setFocus(parseInt(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {focus < 33
                ? 'Business impact focused'
                : focus < 66
                ? 'Balanced perspective'
                : 'Personal growth focused'}
            </p>
          </div>

          {/* Version */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">
              Generation Version
            </label>
            <div className="space-y-2">
              {['v1', 'v2', 'v3', 'v4', 'v5'].map((ver) => (
                <label
                  key={ver}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <input
                    type="radio"
                    name="version"
                    value={ver}
                    checked={version === ver}
                    onChange={(e) => setVersion(e.target.value)}
                    disabled={isLoading}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span className="text-sm text-foreground font-medium">{ver}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 bg-muted/5 sticky bottom-0 space-y-2">
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Generating...' : 'Generate Story'}
          </Button>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
