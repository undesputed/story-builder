'use client'

import { Button } from '@/components/ui/button'
import { ThumbsDown, ThumbsUp } from 'lucide-react'

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
  length: number
  focus: number
  version: string
}

export interface StoryposterDisplayProps {
  story: Partial<StoryData>
  onReject: () => void
  onSave: () => void
  isLoading?: boolean
  isGenerated?: boolean
  isDisabled?: boolean
  collectedData?: Partial<StoryData>
}

export function StoryPosterDisplay({
  story,
  onReject,
  onSave,
  isLoading = false,
  isGenerated = false,
  isDisabled = false,
  collectedData = {},
}: StoryposterDisplayProps) {
  // Helper to show placeholder for empty fields
  const renderField = (value: string | undefined, placeholder: string = 'Not filled yet') => {
    return value && value.trim() ? value : <span className="italic text-muted-foreground">{placeholder}</span>
  }

  // Calculate progress for each section
  const calculateProgress = (fields: (string | undefined)[]): number => {
    if (fields.length === 0) return 0
    const filled = fields.filter(f => f && f.trim()).length
    return Math.round((filled / fields.length) * 100)
  }

  const employeeProgress = calculateProgress([
    collectedData.employeeId,
    collectedData.employeeName,
    collectedData.company,
    collectedData.role,
    collectedData.periodStart,
    collectedData.periodEnd,
  ])

  const beforeProgress = calculateProgress([collectedData.before])
  const afterProgress = calculateProgress([collectedData.after])
  const valueProgress = calculateProgress([collectedData.value])
  const nextProgress = calculateProgress([collectedData.next])

  // Progress bar component
  const ProgressBar = ({ progress, label }: { progress: number; label: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold text-foreground">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            progress === 100
              ? 'bg-green-500 dark:bg-green-400'
              : progress >= 50
                ? 'bg-primary dark:bg-primary'
                : 'bg-amber-400 dark:bg-amber-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
  return (
    <div className="flex flex-col w-full h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground">
          {isGenerated ? 'Generated Story' : 'Story Preview'}
        </h2>
        <p className="text-xs text-muted-foreground">
          {isGenerated ? '生成されたストーリー' : 'ストーリープレビュー'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isGenerated ? 'Review and scroll down for actions' : 'Data will appear as you answer questions'}
        </p>
        <p className="text-xs text-muted-foreground">
          {isGenerated ? 'レビューしてアクションを実行してください' : '質問に答えると、データが表示されます'}
        </p>
      </div>

      {/* Story Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Employee Info */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <div className="mb-4">
            <p className="text-sm font-semibold text-primary">Employee Profile</p>
            <p className="text-xs text-muted-foreground">従業員プロフィール</p>
          </div>
          <ProgressBar progress={employeeProgress} label="Completion / 完成度" />
        </div>

        {/* Story Blocks */}
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="mb-3">
              <div>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Before
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">前</p>
              </div>
              <ProgressBar progress={beforeProgress} label="Status / ステータス" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{renderField(story.before, 'Waiting for your response...')}</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="mb-3">
              <div>
                <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">
                  After
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mb-2">後</p>
              </div>
              <ProgressBar progress={afterProgress} label="Status / ステータス" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{renderField(story.after, 'Waiting for your response...')}</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="mb-3">
              <div>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  Value
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">価値</p>
              </div>
              <ProgressBar progress={valueProgress} label="Status / ステータス" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{renderField(story.value, 'Waiting for your response...')}</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="mb-3">
              <div>
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  Next
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">次へ</p>
              </div>
              <ProgressBar progress={nextProgress} label="Status / ステータス" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{renderField(story.next, 'Waiting for your response...')}</p>
          </div>
        </div>

        {/* Generation Parameters - Only show if generated */}
        {isGenerated && (
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Generation Settings
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tone</span>
                <span className="font-medium text-foreground">{story.tone}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Length</span>
                <span className="font-medium text-foreground">{story.length}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Focus</span>
                <span className="font-medium text-foreground">{story.focus}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium text-foreground">{story.version}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Only show if generated */}
      {isGenerated && (
        <div className="border-t border-border bg-card p-4 space-y-2 flex-shrink-0">
          <div className="flex gap-2">
            <Button
              onClick={onSave}
              disabled={isLoading}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              <ThumbsUp className="w-4 h-4" />
              <div className="flex flex-col items-center">
                <span>Save Story</span>
                <span className="text-xs">ストーリーを保存</span>
              </div>
            </Button>
            <Button
              onClick={onReject}
              disabled={isLoading}
              variant="outline"
              className="flex-1 gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              <div className="flex flex-col items-center">
                <span>Reject & Regenerate</span>
                <span className="text-xs">再生成</span>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
