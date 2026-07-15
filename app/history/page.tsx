'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit2, RotateCcw, Trash2 } from 'lucide-react'
import type { StoryData } from '@/components/story-poster-display'

interface SavedStory extends StoryData {
  id: string
  timestamp: string
}

export default function HistoryPage() {
  const [stories, setStories] = useState<SavedStory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load stories from localStorage
    const storiesJson = localStorage.getItem('nws_stories')
    if (storiesJson) {
      const parsed = JSON.parse(storiesJson)
      setStories(parsed)
    }
    setIsLoading(false)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      const updated = stories.filter((s) => s.id !== id)
      setStories(updated)
      localStorage.setItem('nws_stories', JSON.stringify(updated))
    }
  }

  const handleEdit = (story: SavedStory) => {
    // Store the story to edit in sessionStorage
    sessionStorage.setItem('nws_edit_story', JSON.stringify(story))
    window.location.href = '/'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary mx-auto mb-4" />
          <p className="text-foreground">Loading your stories...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Story History</h1>
            <p className="text-muted-foreground mt-1">
              {stories.length} {stories.length === 1 ? 'story' : 'stories'} saved
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              New Story
            </Button>
          </Link>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h-6m0 0H0"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No stories yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start creating your first story
            </p>
            <Link href="/">
              <Button className="gap-2">Create Story</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card Header */}
                <div className="bg-primary/5 border-b border-border p-4">
                  <h3 className="font-semibold text-foreground">
                    {story.employeeName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {story.role} • {story.company}
                  </p>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Before
                    </p>
                    <p className="text-sm text-foreground line-clamp-2">
                      {story.before}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      After
                    </p>
                    <p className="text-sm text-foreground line-clamp-2">
                      {story.after}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Value
                    </p>
                    <p className="text-sm text-foreground line-clamp-2">
                      {story.value}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
                    <p>
                      Saved:{' '}
                      {new Date(story.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p>Version: {story.version}</p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="border-t border-border bg-muted/30 p-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 text-xs"
                    onClick={() => handleEdit(story)}
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 text-xs"
                    onClick={() => handleDelete(story.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
