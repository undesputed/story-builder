'use client'

import { useState, useCallback } from 'react'
import { ChatInterface, type Message } from '@/components/chat-interface'
import { StoryPosterDisplay, type StoryData } from '@/components/story-poster-display'
import {
  GenerationControlsModal,
  type GenerationControls,
} from '@/components/generation-controls-modal'

interface CollectedData {
  employeeId: string
  employeeName: string
  company: string
  role: string
  periodStart: string
  periodEnd: string
  language: string
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

export function StoryInterview() {
  const [messages, setMessages] = useState<Message[]>([])
  const [collectedData, setCollectedData] = useState<Partial<CollectedData>>({})
  const [phase, setPhase] = useState<InterviewPhase>('identity')
  const [showGenerationModal, setShowGenerationModal] = useState(false)
  const [showPoster, setShowPoster] = useState(false)
  const [generatedStory, setGeneratedStory] = useState<StoryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [chatDisabled, setChatDisabled] = useState(false)

  // Add initial greeting
  const addInitialGreeting = useCallback(() => {
    const greeting: Message = {
      id: '1',
      role: 'assistant',
      content:
        'Welcome! I\'m here to help you share your AI-driven work transformation story. Let\'s start by collecting some basic information about you.\n\nWhat is your employee ID?',
      timestamp: new Date(),
    }
    setMessages([greeting])
  }, [])

  // Initialize on mount
  useState(() => {
    addInitialGreeting()
  }, [])

  const getNextQuestion = useCallback(
    (currentPhase: InterviewPhase): string => {
      switch (currentPhase) {
        case 'identity':
          if (!collectedData.employeeId)
            return 'What is your employee ID?'
          if (!collectedData.employeeName)
            return 'What is your full name?'
          if (!collectedData.company)
            return 'What company or team do you work for?'
          if (!collectedData.role)
            return 'What is your job role or title?'
          if (!collectedData.periodStart)
            return 'When did this AI transformation period start? (e.g., January 2024)'
          if (!collectedData.periodEnd)
            return 'When did it end or is it ongoing? (e.g., March 2024 or Ongoing)'
          if (!collectedData.language)
            return 'What is your preferred language? (e.g., English, Japanese)'
          return 'Great! Now let\'s dive into your story. What was the situation BEFORE AI transformed your work?'

        case 'before':
          return collectedData.before
            ? 'What changed AFTER you started using AI? How did things improve?'
            : 'What was the situation BEFORE AI transformed your work? Please describe the challenges or processes you faced.'

        case 'after':
          return collectedData.after
            ? 'What VALUE or impact did this transformation bring? What improved?'
            : 'What changed AFTER you started using AI? How did things improve? Please be specific.'

        case 'value':
          return collectedData.value
            ? 'What comes NEXT? How do you see this evolving or what are your plans?'
            : 'What VALUE or impact did this transformation bring? What metrics or results improved?'

        case 'next':
          return collectedData.next
            ? 'Perfect! I have all the information I need. Let me generate your story poster.'
            : 'What comes NEXT? How do you see this evolving in the future or what are your next steps?'

        default:
          return 'Thank you for sharing your story!'
      }
    },
    [collectedData]
  )

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      // Add user message
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      // Parse and store the response based on current phase
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
          } else if (!collectedData.language) {
            updatedData.language = userMessage
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
      }

      setCollectedData(updatedData)
      setPhase(newPhase)

      // Simulate AI thinking delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Get next question or show generation modal
      let assistantResponse = ''

      if (newPhase === 'complete') {
        assistantResponse =
          'Perfect! I have collected all the information I need. Now let\'s customize how your story should be generated. Please click the "Generate" button to adjust the tone, length, focus, and version of your story.'
        setShowGenerationModal(true)
      } else {
        assistantResponse = getNextQuestion(newPhase)
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
    [phase, collectedData, getNextQuestion]
  )

  const handleGenerateStory = useCallback(
    (controls: GenerationControls) => {
      setIsLoading(true)
      setChatDisabled(true)

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
          language: collectedData.language || '',
          tone: controls.tone,
          length: controls.length,
          focus: controls.focus,
          version: controls.version,
        }

        setGeneratedStory(story)
        setShowPoster(true)
        setShowGenerationModal(false)
        setIsLoading(false)

        const msg: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content:
            'Your story has been generated! Review it on the right side. If you\'d like to make changes, click "Reject & Regenerate" to adjust the generation settings, or you can ask me to update specific parts of your story through conversation.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, msg])
      }, 1500)
    },
    [collectedData]
  )

  const handleReject = useCallback(() => {
    setChatDisabled(false)
    setShowPoster(false)
    setGeneratedStory(null)
    setShowGenerationModal(true)

    const msg: Message = {
      id: (Date.now() + 3).toString(),
      role: 'assistant',
      content:
        'I\'ve reopened the generation controls. You can adjust the parameters and try generating your story again. Or, if you\'d like to update any of your responses, just let me know!',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, msg])
  }, [])

  const handleSave = useCallback(() => {
    // Save to history (file handler)
    const storyToSave = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...generatedStory,
    }

    // Save to localStorage for now (client-side file handling)
    const existingStories = JSON.parse(
      localStorage.getItem('nws_stories') || '[]'
    )
    existingStories.push(storyToSave)
    localStorage.setItem('nws_stories', JSON.stringify(existingStories))

    setChatDisabled(false)
    setShowPoster(false)
    setGeneratedStory(null)
    setMessages([])
    setCollectedData({})
    setPhase('identity')

    const msg: Message = {
      id: (Date.now() + 4).toString(),
      role: 'assistant',
      content:
        'Wonderful! Your story has been saved to history. Would you like to share another story? Just let me know!',
      timestamp: new Date(),
    }
    setMessages([msg])
  }, [generatedStory])

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Chat Panel - Full Screen */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="h-screen flex flex-col">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isDisabled={chatDisabled}
          />
        </div>

        {/* Poster Panel - Below Chat, Revealed on Scroll */}
        <div className="h-screen bg-background flex flex-col">
          <StoryPosterDisplay
            story={generatedStory || {
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
              language: collectedData.language || '',
              tone: 0,
              length: 0,
              focus: 0,
              version: '',
            }}
            onReject={handleReject}
            onSave={handleSave}
            isLoading={isLoading}
            isGenerated={showPoster}
            isDisabled={chatDisabled}
            collectedData={collectedData}
          />
        </div>
      </div>

      {/* Generation Controls Modal */}
      <GenerationControlsModal
        isOpen={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
        onGenerate={handleGenerateStory}
        isLoading={isLoading}
      />
    </div>
  )
}
