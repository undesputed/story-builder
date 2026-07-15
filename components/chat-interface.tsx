'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Plus, Mic, Paperclip } from 'lucide-react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading?: boolean
  isDisabled?: boolean
  onNewStory?: () => void
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  isDisabled = false,
  onNewStory,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasScrolledOnceRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (hasScrolledOnceRef.current) {
      scrollToBottom()
    } else {
      hasScrolledOnceRef.current = true
    }
  }, [messages, mounted])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading && !isDisabled) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Work Stories</h1>
          <p className="text-sm text-muted-foreground">
            Share your AI-driven work transformation / AIで変わった仕事のストーリーを共有しましょう
          </p>
        </div>
        {onNewStory && (
          <Button
            onClick={onNewStory}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            新しいストーリー
          </Button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
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
                Ready to share your story? / 仕事のストーリーを共有できますか？
              </h2>
              <p className="text-muted-foreground">
                Answer a few questions about how AI transformed your work. / AIで変わった仕事の内容について、いくつかの質問に答えてください。
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-card text-foreground border border-border rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {mounted && (
                  <span
                    className={`text-xs mt-1 block ${
                      message.role === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card text-foreground border border-border px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        {isDisabled && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            Chat is disabled while you review your story. Click Save or Reject to continue.
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          {/* File Upload Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isLoading || isDisabled}
            className="flex-shrink-0"
            title="Upload file / ファイルをアップロード"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Input Field */}
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isDisabled
                ? 'Chat disabled while reviewing... / レビュー中はチャットできません...'
                : 'Type your response... / 返信を入力してください...'
            }
            disabled={isLoading || isDisabled}
            className="flex-1"
          />

          {/* Audio Recording Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isLoading || isDisabled}
            className="flex-shrink-0"
            title="Record audio / 音声を録音"
          >
            <Mic className="w-4 h-4" />
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={isLoading || isDisabled || !inputValue.trim()}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
