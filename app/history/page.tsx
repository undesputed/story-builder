'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Landmark, PenLine, Plus, Trash2 } from 'lucide-react'
import type { StoryData } from '@/components/story-poster-display'

interface SavedStory extends Omit<Partial<StoryData>, 'version'> {
  id: string
  timestamp: string
  // Stories saved by older builds carry a string version like "v2"
  version?: number | string
}

const EXCERPTS = [
  { key: 'before' as const, label: 'Before', rule: 'border-fade' },
  { key: 'after' as const, label: 'After', rule: 'border-primary' },
  { key: 'value' as const, label: 'Value', rule: 'border-gold' },
  { key: 'next' as const, label: 'Next', rule: 'border-stamp' },
]

function formatVersion(version: SavedStory['version']): string {
  if (typeof version === 'number') return `v${version}`
  if (typeof version === 'string' && version) return version
  return 'v1'
}

export default function HistoryPage() {
  const [stories, setStories] = useState<SavedStory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storiesJson = localStorage.getItem('nws_stories')
    if (storiesJson) {
      try {
        setStories(JSON.parse(storiesJson))
      } catch {
        // Unreadable archive — show the empty museum rather than crash
      }
    }
    setIsLoading(false)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Delete this story from the museum? This cannot be undone.')) {
      const updated = stories.filter((s) => s.id !== id)
      setStories(updated)
      localStorage.setItem('nws_stories', JSON.stringify(updated))
    }
  }

  const handleEdit = (story: SavedStory) => {
    sessionStorage.setItem('nws_edit_story', JSON.stringify(story))
    window.location.href = '/'
  }

  return (
    <main className="min-h-dvh bg-background">
      {/* App bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur-sm lg:px-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-stamp font-display text-lg font-bold text-stamp-foreground"
            aria-hidden="true"
          >
            語
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] leading-tight font-bold text-foreground">
              New Work Stories
            </p>
            <p className="font-mono text-[9px] tracking-[0.24em] text-muted-foreground">
              仕事のものがたり
            </p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">New story</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 lg:px-6">
        {/* Title */}
        <div className="mb-10">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            Museum · ものがたり館
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground lg:text-4xl">
            The Museum
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLoading
              ? 'Opening the archive…'
              : `${stories.length} ${stories.length === 1 ? 'story' : 'stories'} on display`}
          </p>
        </div>

        {isLoading ? (
          <div
            className="flex items-center justify-center py-24"
            role="status"
            aria-label="Loading stories"
          >
            <div className="flex items-center gap-1.5">
              <span className="think-dot h-2 w-2 rounded-full bg-primary" />
              <span className="think-dot h-2 w-2 rounded-full bg-primary" />
              <span className="think-dot h-2 w-2 rounded-full bg-primary" />
            </div>
          </div>
        ) : stories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/25 bg-accent">
              <Landmark className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">
              The museum is empty
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Every saved story hangs here as a sheet. Sit down for an
              interview and create the first one.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Start your story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <article
                key={story.id}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(20,22,28,0.04)] transition-shadow duration-200 hover:shadow-[0_12px_32px_-16px_rgba(20,22,28,0.25)]"
              >
                {/* Plaque header */}
                <div className="border-b border-border px-5 pt-5 pb-4">
                  <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground uppercase">
                    New Work Stories
                  </p>
                  <h3 className="mt-1.5 font-display text-lg leading-snug font-bold text-card-foreground">
                    {story.employeeName || 'Untitled story'}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {[story.role, story.company].filter(Boolean).join(' · ') || '—'}
                  </p>
                  {(story.periodStart || story.periodEnd) && (
                    <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                      {story.periodStart || '…'} — {story.periodEnd || '…'}
                    </p>
                  )}
                </div>

                {/* Story excerpts, ink-coded by time */}
                <div className="flex-1 space-y-3 px-5 py-4">
                  {EXCERPTS.map((section) => (
                    <div key={section.key} className={`border-l-2 pl-3 ${section.rule}`}>
                      <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                        {section.label}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-card-foreground">
                        {story[section.key] || '—'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Colophon + actions */}
                <div className="border-t border-border px-5 py-3.5">
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Saved{' '}
                    {new Date(story.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    · {formatVersion(story.version)}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(story)}
                      className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                      Open in interview
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      aria-label={`Delete ${story.employeeName || 'this'} story`}
                      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-destructive transition-colors duration-150 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
