'use client'

import { useState } from 'react'
import { ChevronDown, Volume2, Plus } from 'lucide-react'

export function StoryForm() {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    company: '',
    role: '',
    periodStart: '',
    periodEnd: '',
  })

  const [currentStep, setCurrentStep] = useState(0)
  const steps = ['Identity', 'Dialogue', 'Generate', 'Review']

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Work Stories</h1>
            <p className="text-sm text-muted-foreground mt-1">Share your AI-powered work journey</p>
          </div>
          <div className="flex gap-2">
            {steps.map((step, idx) => (
              <button
                key={step}
                onClick={() => setCurrentStep(idx)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  idx === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : idx < currentStep
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Employee Information */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Employee Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Employee ID</label>
                <input
                  type="text"
                  placeholder="e.g., EMP001234"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Employee Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company/Team</label>
                <input
                  type="text"
                  placeholder="e.g., Sales / Marketing"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role Title</label>
                <input
                  type="text"
                  placeholder="Your role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Period Start</label>
                <input
                  type="date"
                  value={formData.periodStart}
                  onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Period End</label>
                <input
                  type="date"
                  value={formData.periodEnd}
                  onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Story Collection Sections */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Your Story</h2>
            <div className="space-y-4">
              {/* Before */}
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">A</div>
                  <div>
                    <h3 className="font-semibold text-foreground">Before — Half a year ago</h3>
                    <p className="text-xs text-muted-foreground">What were you struggling with?</p>
                  </div>
                </div>
                <textarea
                  placeholder="Describe your challenges and pain points before using AI..."
                  rows={4}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* After */}
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">B</div>
                  <div>
                    <h3 className="font-semibold text-foreground">After — Now (with AI)</h3>
                    <p className="text-xs text-muted-foreground">What did you do with AI? How did work change?</p>
                  </div>
                </div>
                <textarea
                  placeholder="Describe how you used AI and what changed in your work..."
                  rows={4}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Value */}
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">C</div>
                  <div>
                    <h3 className="font-semibold text-foreground">Value — True value created</h3>
                    <p className="text-xs text-muted-foreground">Not just time saved—what new value appeared?</p>
                  </div>
                </div>
                <textarea
                  placeholder="Describe the real value created for company, customers, team, or yourself..."
                  rows={4}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Next */}
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">D</div>
                  <div>
                    <h3 className="font-semibold text-foreground">Next — Half a year later</h3>
                    <p className="text-xs text-muted-foreground">What do you want to try next?</p>
                  </div>
                </div>
                <textarea
                  placeholder="Share your future goals and next challenges..."
                  rows={4}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Generation Controls */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Generation Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Tone</label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Natural</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="50"
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-xs text-muted-foreground">Dramatic</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Length</label>
                <div className="flex gap-2">
                  {['Short', 'Medium', 'Long'].map((length) => (
                    <button
                      key={length}
                      className="px-4 py-2 rounded-md text-sm font-medium border border-border bg-muted/50 hover:bg-muted transition-colors"
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Focus</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Value', 'Transformation', 'People', 'Balanced'].map((focus) => (
                    <button
                      key={focus}
                      className="px-4 py-2 rounded-md text-sm font-medium border border-border bg-muted/50 hover:bg-muted transition-colors"
                    >
                      {focus}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-border px-6 py-4 bg-card flex justify-between items-center">
        <button className="px-4 py-2 rounded-md text-sm font-medium border border-border hover:bg-muted transition-colors">
          Save as Draft
        </button>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-md text-sm font-medium border border-border hover:bg-muted transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Generate Story
          </button>
        </div>
      </div>
    </div>
  )
}
