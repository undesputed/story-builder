'use client'

import { useState } from 'react'
import { StoryForm } from './story-form'
import { StoryPoster } from './story-poster'
import { Menu, X } from 'lucide-react'

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 border-r border-border bg-card flex flex-col overflow-hidden`}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-lg font-bold text-foreground">NWS</h1>
          <p className="text-xs text-muted-foreground mt-1">New Work Stories</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {[
              { label: 'My Stories', active: true, count: 2 },
              { label: 'In Progress', active: false, count: 1 },
              { label: 'Work Coin', active: false },
              { label: 'Museum', active: false, count: 128 },
              { label: 'Awards', active: false, count: 5 },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.count && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.active ? 'bg-primary-foreground/20' : 'bg-muted'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent Stories</p>
            <div className="space-y-2">
              {[
                { title: 'Customer Analysis with AI', date: '2 days ago' },
                { title: 'Automating Report Generation', date: '1 week ago' },
              ].map((story) => (
                <button
                  key={story.title}
                  className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors group"
                >
                  <p className="text-xs font-medium text-foreground group-hover:text-primary truncate">
                    {story.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{story.date}</p>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button className="w-full px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            + New Story
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>

          <div className="flex-1 px-4">
            <p className="text-sm text-muted-foreground">
              Story Collection & Generation Interface
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Connected
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-hidden flex gap-4 p-4">
          {/* Left Panel - Form */}
          <div className="flex-1 min-w-0 rounded-lg border border-border overflow-hidden bg-card shadow-sm">
            <StoryForm />
          </div>

          {/* Right Panel - Poster Preview */}
          <div className="flex-1 min-w-0 rounded-lg border border-border overflow-hidden bg-card shadow-sm">
            <StoryPoster />
          </div>
        </div>
      </div>
    </div>
  )
}
