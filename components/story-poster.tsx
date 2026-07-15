'use client'

import { Award, Heart, Share2, Volume2 } from 'lucide-react'

interface StoryPosterProps {
  title?: string
  author?: string
  role?: string
  company?: string
}

export function StoryPoster({ 
  title = "Transforming customer insights with AI", 
  author = "Sarah Chen",
  role = "Senior Analyst",
  company = "Sales Team"
}: StoryPosterProps) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-xl font-bold text-foreground">Story Poster</h2>
        <p className="text-sm text-muted-foreground mt-1">Review and confirm your generated story</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Poster Card */}
          <div className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 rounded-2xl border border-border shadow-lg overflow-hidden">
            {/* Poster Header Background */}
            <div className="h-40 bg-gradient-to-r from-primary to-secondary opacity-20"></div>

            {/* Content */}
            <div className="px-8 py-6 relative -mt-20">
              {/* Author Info */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{author.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{author}</h3>
                    <p className="text-sm text-muted-foreground">{role} • {company}</p>
                  </div>
                </div>
              </div>

              {/* Story Title */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground leading-tight mb-2">{title}</h1>
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              </div>

              {/* Story Sections */}
              <div className="space-y-6 mb-8">
                {/* Before */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">Before</span>
                    <span className="text-xs text-muted-foreground">Half a year ago</span>
                  </div>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Our customer analysis process was manual and time-consuming. We spent hours compiling data from different sources, creating reports manually, and couldn&apos;t identify patterns quickly enough to act on market opportunities.
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="text-primary text-2xl">→</div>
                </div>

                {/* After */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-secondary">After</span>
                    <span className="text-xs text-muted-foreground">Now with AI</span>
                  </div>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    Implemented AI-powered analytics to automate data compilation and create dynamic reports. Now we can analyze customer sentiment, identify trends, and generate insights in real-time, allowing us to respond to market changes within hours instead of days.
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="text-primary text-2xl">→</div>
                </div>

                {/* Value */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-accent">Value Created</span>
                    <span className="text-xs text-muted-foreground">True impact</span>
                  </div>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    We&apos;ve reduced analysis time by 75% and increased customer insight accuracy by 40%. This enabled our team to propose 3 new product features based on customer data, resulting in projected Q4 revenue increase of $2M+. More importantly, our team now focuses on strategic thinking rather than data processing.
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="text-primary text-2xl">→</div>
                </div>

                {/* Next */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">Next</span>
                    <span className="text-xs text-muted-foreground">Future vision</span>
                  </div>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    We want to expand this to include predictive customer behavior modeling. Our next challenge is to build an AI system that not only analyzes current customer data but predicts future trends, enabling us to stay ahead of market shifts and proactively shape customer solutions.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">Business Value</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">ChatGPT</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">Data Analysis</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">Efficiency</span>
              </div>

              {/* Quote */}
              <div className="p-4 bg-primary/5 border-l-4 border-primary rounded">
                <p className="text-sm italic text-foreground">
                  &quot;AI helped us transform how we make decisions. Instead of managing data, we&apos;re now shaping strategy.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Story Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">75%</div>
              <p className="text-sm text-muted-foreground mt-1">Time Reduction</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold text-secondary">40%</div>
              <p className="text-sm text-muted-foreground mt-1">Accuracy Gain</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl font-bold text-accent">$2M+</div>
              <p className="text-sm text-muted-foreground mt-1">Revenue Impact</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-border px-6 py-4 bg-card flex justify-between items-center">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-border hover:bg-muted transition-colors">
            <Heart className="w-4 h-4" />
            Support (0)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-border hover:bg-muted transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-md text-sm font-medium border border-border hover:bg-muted transition-colors">
            Regenerate
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Confirm & Enter Award
          </button>
        </div>
      </div>
    </div>
  )
}
