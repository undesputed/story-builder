'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChatInterface, type Message } from '@/components/chat-interface'
import {
  StoryPosterDisplay,
  type StoryData,
} from '@/components/story-poster-display'
import {
  GenerationControlsModal,
  type GenerationControls,
} from '@/components/generation-controls-modal'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  SCRIPT,
  normalizeLanguage,
  type InterviewLanguage,
} from '@/lib/interview-script'
import { ChevronRight, Landmark, MessagesSquare, ScrollText } from 'lucide-react'

interface CollectedData {
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
}

type InterviewPhase =
  | 'identity'
  | 'before'
  | 'after'
  | 'value'
  | 'next'
  | 'complete'

const STEPS = [
  { n: '01', en: 'Collect', ja: '聞く' },
  { n: '02', en: 'Compose', ja: '綴る' },
  { n: '03', en: 'Confirm', ja: '確かめる' },
]

const LANGUAGE_PREF_KEY = 'nws_language'

/* Pure function of its inputs — always pass the freshest data, never rely on
   component state here, or the question will lag one answer behind. */
function getNextQuestion(
  currentPhase: InterviewPhase,
  lang: InterviewLanguage,
  data: Partial<CollectedData>
): string {
  const t = SCRIPT[lang]
  switch (currentPhase) {
    case 'identity':
      if (!data.employeeId) return t.employeeId
      if (!data.employeeName) return t.employeeName
      if (!data.company) return t.company
      if (!data.role) return t.role
      if (!data.periodStart) return t.periodStart
      if (!data.periodEnd) return t.periodEnd
      return t.beforeIntro

    case 'before':
      return data.before ? t.after : t.before

    case 'after':
      return data.after ? t.value : t.afterRepeat

    case 'value':
      return data.value ? t.next : t.valueRepeat

    case 'next':
      return data.next ? t.complete : t.nextRepeat

    default:
      return t.thanks
  }
}

export function StoryInterview() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      role: 'assistant',
      content: SCRIPT.en.greeting,
      timestamp: new Date(),
    },
  ])
  const [language, setLanguage] = useState<InterviewLanguage>('en')
  const [collectedData, setCollectedData] = useState<Partial<CollectedData>>({})
  const [phase, setPhase] = useState<InterviewPhase>('identity')
  const [showGenerationModal, setShowGenerationModal] = useState(false)
  const [showPoster, setShowPoster] = useState(false)
  const [generatedStory, setGeneratedStory] = useState<StoryData | null>(null)
  const [generationVersion, setGenerationVersion] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [chatDisabled, setChatDisabled] = useState(false)
  const [mobileView, setMobileView] = useState<'chat' | 'sheet'>('chat')

  // A story opened from the Museum resumes here, ready to recompose.
  // Otherwise, restore the last chosen interview language.
  const initializedRef = useRef(false)
  useEffect(() => {
    // React Strict Mode re-runs mount effects in dev; initialize only once
    if (initializedRef.current) return
    initializedRef.current = true

    const raw = sessionStorage.getItem('nws_edit_story')
    if (raw) {
      sessionStorage.removeItem('nws_edit_story')
      try {
        const saved = JSON.parse(raw)
        const savedLanguage = normalizeLanguage(saved.language)
        setLanguage(savedLanguage)
        setCollectedData({
          employeeId: saved.employeeId || '',
          employeeName: saved.employeeName || '',
          company: saved.company || '',
          role: saved.role || '',
          periodStart: saved.periodStart || '',
          periodEnd: saved.periodEnd || '',
          before: saved.before || '',
          after: saved.after || '',
          value: saved.value || '',
          next: saved.next || '',
        })
        setPhase('complete')
        const savedVersion =
          typeof saved.version === 'number'
            ? saved.version
            : parseInt(String(saved.version || '').replace(/\D/g, ''), 10) || 0
        setGenerationVersion(savedVersion)
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: SCRIPT[savedLanguage].editLoaded(saved.employeeName || ''),
            timestamp: new Date(),
          },
        ])
        return
      } catch {
        // Corrupt draft — start a fresh interview instead
      }
    }

    if (localStorage.getItem(LANGUAGE_PREF_KEY) === 'ja') {
      setLanguage('ja')
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: SCRIPT.ja.greeting,
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  const handleChangeLanguage = useCallback(
    (next: InterviewLanguage) => {
      if (next === language) return
      setLanguage(next)
      localStorage.setItem(LANGUAGE_PREF_KEY, next)
      if (chatDisabled) return

      const t = SCRIPT[next]
      // Nothing answered yet — simply restate the greeting in the new language
      if (messages.length <= 1 && phase === 'identity' && !collectedData.employeeId) {
        setMessages([
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: t.greeting,
            timestamp: new Date(),
          },
        ])
        return
      }

      const question =
        phase === 'complete'
          ? t.completeAgain
          : getNextQuestion(phase, next, collectedData)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `${t.switchAck}\n\n${question}`,
          timestamp: new Date(),
        },
      ])
    },
    [language, chatDisabled, messages.length, phase, collectedData]
  )

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      let newPhase = phase
      const updatedData = { ...collectedData }

      switch (phase) {
        case 'identity':
          if (!collectedData.employeeId) {
            updatedData.employeeId = userMessage
          } else if (!collectedData.employeeName) {
            updatedData.employeeName = userMessage
          } else if (!collectedData.company) {
            updatedData.company = userMessage
          } else if (!collectedData.role) {
            updatedData.role = userMessage
          } else if (!collectedData.periodStart) {
            updatedData.periodStart = userMessage
          } else if (!collectedData.periodEnd) {
            updatedData.periodEnd = userMessage
            newPhase = 'before'
          }
          break

        case 'before':
          updatedData.before = userMessage
          newPhase = 'after'
          break

        case 'after':
          updatedData.after = userMessage
          newPhase = 'value'
          break

        case 'value':
          updatedData.value = userMessage
          newPhase = 'next'
          break

        case 'next':
          updatedData.next = userMessage
          newPhase = 'complete'
          break

        case 'complete':
          break
      }

      setCollectedData(updatedData)
      setPhase(newPhase)

      // Simulate AI thinking delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const t = SCRIPT[language]
      let assistantResponse = ''
      if (newPhase === 'complete' && phase !== 'complete') {
        assistantResponse = t.complete
        setShowGenerationModal(true)
      } else if (phase === 'complete') {
        assistantResponse = t.completeAgain
      } else if (phase === 'identity' && newPhase === 'before') {
        assistantResponse = t.beforeIntro
      } else {
        // Ask against the data that now includes this turn's answer
        assistantResponse = getNextQuestion(newPhase, language, updatedData)
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setIsLoading(false)
    },
    [phase, collectedData, language]
  )

  const handleGenerateStory = useCallback(
    (controls: GenerationControls) => {
      setIsLoading(true)
      setChatDisabled(true)
      const version = generationVersion + 1

      // Simulate generation
      setTimeout(() => {
        const story: StoryData = {
          employeeId: collectedData.employeeId || '',
          employeeName: collectedData.employeeName || '',
          company: collectedData.company || '',
          role: collectedData.role || '',
          periodStart: collectedData.periodStart || '',
          periodEnd: collectedData.periodEnd || '',
          before: collectedData.before || '',
          after: collectedData.after || '',
          value: collectedData.value || '',
          next: collectedData.next || '',
          language,
          tone: controls.tone,
          length: controls.length,
          focus: controls.focus,
          version,
        }

        setGeneratedStory(story)
        setGenerationVersion(version)
        setShowPoster(true)
        setShowGenerationModal(false)
        setIsLoading(false)
        setMobileView('sheet')

        const msg: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: SCRIPT[language].generated(version),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, msg])
      }, 1500)
    },
    [collectedData, generationVersion, language]
  )

  const handleReject = useCallback(() => {
    setChatDisabled(false)
    setShowPoster(false)
    setGeneratedStory(null)
    setShowGenerationModal(true)

    const msg: Message = {
      id: (Date.now() + 3).toString(),
      role: 'assistant',
      content: SCRIPT[language].rejected,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, msg])
  }, [language])

  const handleSave = useCallback(() => {
    const storyToSave = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...generatedStory,
    }

    const existingStories = JSON.parse(
      localStorage.getItem('nws_stories') || '[]'
    )
    existingStories.push(storyToSave)
    localStorage.setItem('nws_stories', JSON.stringify(existingStories))

    setChatDisabled(false)
    setShowPoster(false)
    setGeneratedStory(null)
    setCollectedData({})
    setPhase('identity')
    setGenerationVersion(0)
    setMobileView('chat')

    setMessages([
      {
        id: (Date.now() + 4).toString(),
        role: 'assistant',
        content: SCRIPT[language].saved,
        timestamp: new Date(),
      },
    ])
  }, [generatedStory, language])

  const currentStep = showPoster ? 2 : phase === 'complete' ? 1 : 0
  const previewStory =
    generatedStory ||
    ({
      employeeId: collectedData.employeeId || '',
      employeeName: collectedData.employeeName || '',
      company: collectedData.company || '',
      role: collectedData.role || '',
      periodStart: collectedData.periodStart || '',
      periodEnd: collectedData.periodEnd || '',
      before: collectedData.before || '',
      after: collectedData.after || '',
      value: collectedData.value || '',
      next: collectedData.next || '',
      language,
    } as Partial<StoryData>)

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* App bar */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 py-2.5 lg:px-5">
        <div className="flex min-w-0 items-center gap-3">
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
        </div>

        {/* Flow steps */}
        <ol className="hidden items-center gap-2 md:flex" aria-label="Story flow">
          {STEPS.map((step, i) => (
            <li key={step.n} className="flex items-center gap-2">
              {i > 0 && (
                <ChevronRight
                  className="h-3 w-3 text-muted-foreground/60"
                  aria-hidden="true"
                />
              )}
              <span
                aria-current={i === currentStep ? 'step' : undefined}
                className={`flex items-baseline gap-1.5 border-b-2 pb-0.5 ${
                  i === currentStep
                    ? 'border-primary'
                    : 'border-transparent'
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${
                    i <= currentStep ? 'text-primary' : 'text-muted-foreground/70'
                  }`}
                >
                  {step.n}
                </span>
                <span
                  className={`text-xs font-medium ${
                    i === currentStep
                      ? 'text-foreground'
                      : i < currentStep
                        ? 'text-primary'
                        : 'text-muted-foreground'
                  }`}
                >
                  {step.en}
                </span>
                <span className="hidden font-display text-[10px] text-muted-foreground lg:inline">
                  {step.ja}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/history"
            className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Landmark className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="hidden sm:inline">Museum</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Studio: interview | story sheet */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
        <div
          className={`h-full min-h-0 ${
            mobileView === 'chat' ? 'block' : 'hidden'
          } lg:block`}
        >
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            language={language}
            onChangeLanguage={handleChangeLanguage}
            isLoading={isLoading}
            isDisabled={chatDisabled}
          />
        </div>

        <div
          className={`h-full min-h-0 border-border lg:border-l ${
            mobileView === 'sheet' ? 'block' : 'hidden'
          } lg:block`}
        >
          <StoryPosterDisplay
            story={previewStory}
            onReject={handleReject}
            onSave={handleSave}
            onOpenControls={() => setShowGenerationModal(true)}
            canGenerate={phase === 'complete' && !showPoster}
            isLoading={isLoading}
            isGenerated={showPoster}
            collectedData={collectedData}
          />
        </div>
      </div>

      {/* Mobile panel switch */}
      <nav
        className="grid shrink-0 grid-cols-2 border-t border-border bg-background lg:hidden"
        aria-label="Panels"
      >
        <button
          type="button"
          onClick={() => setMobileView('chat')}
          aria-pressed={mobileView === 'chat'}
          className={`flex h-14 cursor-pointer flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
            mobileView === 'chat'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessagesSquare className="h-4.5 w-4.5" aria-hidden="true" />
          Interview
        </button>
        <button
          type="button"
          onClick={() => setMobileView('sheet')}
          aria-pressed={mobileView === 'sheet'}
          className={`relative flex h-14 cursor-pointer flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
            mobileView === 'sheet'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ScrollText className="h-4.5 w-4.5" aria-hidden="true" />
          Story sheet
          {showPoster && mobileView === 'chat' && (
            <span
              className="absolute top-2.5 right-[calc(50%-1.4rem)] h-1.5 w-1.5 rounded-full bg-stamp"
              aria-hidden="true"
            />
          )}
        </button>
      </nav>

      <GenerationControlsModal
        isOpen={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
        onGenerate={handleGenerateStory}
        isLoading={isLoading}
        nextVersion={generationVersion + 1}
      />
    </div>
  )
}
