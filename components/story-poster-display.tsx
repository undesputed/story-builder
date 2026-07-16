'use client'

import { Button } from '@/components/ui/button'
import { RotateCcw, Sparkles, Stamp } from 'lucide-react'

export type StoryLength = 'short' | 'medium' | 'long'
export type StoryFocus = 'value' | 'transformation' | 'people' | 'balanced'

export interface StoryData {
  employeeId: string
  employeeName: string
  company: string
  role: string
  periodStart: string
  periodEnd: string
  before: string
  after: string
  value: string
  next: string
  language: string
  tone: number
  length: StoryLength
  focus: StoryFocus
  version: number
}

export interface StoryPosterDisplayProps {
  story: Partial<StoryData>
  onReject: () => void
  onSave: () => void
  onOpenControls?: () => void
  canGenerate?: boolean
  isLoading?: boolean
  isGenerated?: boolean
  collectedData?: Partial<StoryData>
}

const FOCUS_LABELS: Record<StoryFocus, string> = {
  value: 'Value',
  transformation: 'Transformation',
  people: 'People',
  balanced: 'Balanced',
}

/* The four story blocks form a timeline: ink color encodes time.
   Faded past → indigo present → gold value → vermilion future. */
const BLOCKS = [
  {
    key: 'before' as const,
    label: 'Before',
    kanji: '前',
    caption: 'Half a year ago',
    node: 'bg-fade',
    labelColor: 'text-muted-foreground',
  },
  {
    key: 'after' as const,
    label: 'After',
    kanji: '後',
    caption: 'Now, with AI',
    node: 'bg-primary',
    labelColor: 'text-primary',
  },
  {
    key: 'value' as const,
    label: 'Value',
    kanji: '価値',
    caption: 'True value created',
    node: 'bg-gold',
    labelColor: 'text-gold',
  },
  {
    key: 'next' as const,
    label: 'Next',
    kanji: '次',
    caption: 'Half a year from now',
    node: 'bg-stamp',
    labelColor: 'text-stamp',
  },
]

export function StoryPosterDisplay({
  story,
  onReject,
  onSave,
  onOpenControls,
  canGenerate = false,
  isLoading = false,
  isGenerated = false,
  collectedData = {},
}: StoryPosterDisplayProps) {
  const identityFields = [
    collectedData.employeeId,
    collectedData.employeeName,
    collectedData.company,
    collectedData.role,
    collectedData.periodStart,
    collectedData.periodEnd,
  ]
  const storyFields = [
    collectedData.before,
    collectedData.after,
    collectedData.value,
    collectedData.next,
  ]
  const allFields = [...identityFields, ...storyFields]
  const collectedCount = allFields.filter((f) => f && f.trim()).length
  const progress = Math.round((collectedCount / allFields.length) * 100)

  const filled = (value?: string) => Boolean(value && value.trim())
  const period =
    filled(story.periodStart) || filled(story.periodEnd)
      ? `${story.periodStart || '…'} — ${story.periodEnd || '…'}`
      : null

  return (
    <div className="flex h-full flex-col bg-muted/40">
      {/* Panel label — fixed h-12 to line up with the interview panel;
          the collection progress strip runs along the bottom border */}
      <div className="relative flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-5">
        <p className="truncate font-mono text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Story sheet · ものがたりシート
        </p>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {isGenerated ? 'Generated · v' + (story.version ?? 1) : `${collectedCount} / ${allFields.length} collected`}
        </p>
        <div
          className="absolute inset-x-0 -bottom-px h-0.5"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Collection progress"
        >
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* The sheet */}
      <div className="flex-1 overflow-y-auto p-5 lg:p-7">
        <article className="relative mx-auto max-w-xl rounded-xl border border-border bg-card px-6 py-7 shadow-[0_1px_2px_rgba(20,22,28,0.04),0_12px_32px_-16px_rgba(20,22,28,0.18)] lg:px-8">
          {/* Hanko seal — stamps the sheet once the story is generated */}
          {isGenerated && (
            <div
              className="animate-stamp-in absolute top-6 right-6 flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-sm border-2 border-stamp text-stamp"
              aria-label={`Story generated, version ${story.version ?? 1}`}
            >
              <span className="font-display text-2xl leading-none font-bold">語</span>
              <span className="font-mono text-[9px] tracking-wider">
                v{story.version ?? 1}
              </span>
            </div>
          )}

          {/* Masthead */}
          <header className={isGenerated ? 'pr-20' : ''}>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              New Work Stories
            </p>
            <h2 className="mt-2.5 font-display text-2xl leading-snug font-bold text-card-foreground">
              {filled(story.employeeName) ? (
                story.employeeName
              ) : (
                <span className="text-fade">Your name here</span>
              )}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filled(story.role) || filled(story.company) ? (
                <>
                  {story.role || '—'} · {story.company || '—'}
                </>
              ) : (
                'Role and team appear as you answer'
              )}
            </p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              {period ?? 'Period · —'}
              {filled(story.employeeId) && <> · ID {story.employeeId}</>}
            </p>
          </header>

          <hr className="my-6 border-border" />

          {/* Timeline */}
          <ol className="relative space-y-7 border-none pl-0">
            {BLOCKS.map((block) => {
              const text = story[block.key]
              const isFilled = filled(text)
              return (
                <li key={block.key} className="relative flex gap-4">
                  {/* Node + connecting line */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] ${
                        isFilled
                          ? `${block.node} animate-node-pop`
                          : 'border border-fade bg-transparent'
                      }`}
                      aria-hidden="true"
                    />
                    {block.key !== 'next' && (
                      <span
                        className="mt-2 w-px flex-1 bg-border"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3
                        className={`font-mono text-[11px] font-semibold tracking-[0.18em] uppercase ${
                          isFilled ? block.labelColor : 'text-muted-foreground'
                        }`}
                      >
                        {block.label}
                      </h3>
                      <span className="font-display text-xs text-muted-foreground">
                        {block.kanji}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {block.caption}
                      </span>
                    </div>
                    <p
                      className={`mt-1.5 text-sm leading-relaxed ${
                        isFilled ? 'text-card-foreground' : 'text-fade'
                      }`}
                    >
                      {isFilled ? text : 'Waiting for your answer · 回答待ち'}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>

          {/* Colophon — how this version was composed */}
          {isGenerated && (
            <>
              <hr className="my-6 border-border" />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[11px] sm:grid-cols-4">
                <div>
                  <dt className="tracking-[0.14em] text-muted-foreground uppercase">Tone</dt>
                  <dd className="mt-0.5 text-card-foreground">
                    {(story.tone ?? 0) <= 50 ? 'Natural' : 'Dramatic'} {story.tone ?? 0}
                  </dd>
                </div>
                <div>
                  <dt className="tracking-[0.14em] text-muted-foreground uppercase">Length</dt>
                  <dd className="mt-0.5 text-card-foreground capitalize">
                    {story.length ?? 'medium'}
                  </dd>
                </div>
                <div>
                  <dt className="tracking-[0.14em] text-muted-foreground uppercase">Focus</dt>
                  <dd className="mt-0.5 text-card-foreground">
                    {FOCUS_LABELS[story.focus ?? 'balanced']}
                  </dd>
                </div>
                <div>
                  <dt className="tracking-[0.14em] text-muted-foreground uppercase">Version</dt>
                  <dd className="mt-0.5 text-card-foreground">v{story.version ?? 1}</dd>
                </div>
              </dl>
            </>
          )}
        </article>
      </div>

      {/* Actions */}
      {isGenerated ? (
        <div className="shrink-0 border-t border-border bg-background px-5 py-4">
          <div className="mx-auto flex max-w-xl gap-2.5">
            <button
              onClick={onSave}
              disabled={isLoading}
              className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-stamp text-sm font-medium text-stamp-foreground transition-all duration-200 hover:bg-stamp/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stamp focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
            >
              <Stamp className="h-4 w-4" aria-hidden="true" />
              Confirm &amp; save · 保存
            </button>
            <Button
              onClick={onReject}
              disabled={isLoading}
              variant="outline"
              className="h-11 flex-1 gap-2 rounded-xl text-sm"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Regenerate · 再生成
            </Button>
          </div>
        </div>
      ) : (
        canGenerate &&
        onOpenControls && (
          <div className="shrink-0 border-t border-border bg-background px-5 py-4">
            <div className="mx-auto max-w-xl">
              <button
                onClick={onOpenControls}
                disabled={isLoading}
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Compose story · ものがたりを生成
              </button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
