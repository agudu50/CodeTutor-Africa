import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTutorSession } from '../hooks/useTutorSession'
import { ChatMessageItem } from '../components/ChatMessageItem'
import { Button, Badge, Dropdown, EmptyState } from '@/components/ui'
import {
  Plus,
  Bot,
  Sparkles,
  MessageSquare,
  Cpu,
  CornerDownLeft,
} from 'lucide-react'
import { ProgrammingLanguage, TutorMode } from '@/types'

export const TutorPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>()
  const {
    sessions,
    activeSessionId,
    messages,
    selectedLanguage,
    setSelectedLanguage,
    tutorMode,
    setTutorMode,
    isLoading,
    sendMessage,
    switchSession,
    createNewSession,
  } = useTutorSession(sessionId || 'session-1')

  const [inputVal, setInputVal] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputVal.trim() || isLoading) return
    const text = inputVal
    setInputVal('')
    sendMessage(text)
  }

  const languageOptions = [
    { value: 'python', label: 'Python 3.12' },
    { value: 'javascript', label: 'JavaScript (ESNext)' },
    { value: 'java', label: 'Java 21 (LTS)' },
    { value: 'typescript', label: 'TypeScript 5.x' },
  ]

  const modeOptions = [
    { value: 'socratic', label: 'Socratic Tutor', description: 'Guides with thoughtful questions' },
    { value: 'direct_explanation', label: 'Direct Explanations', description: 'Concise step-by-step breakdown' },
    { value: 'code_review', label: 'Code Review Mode', description: 'Best practices & time complexity' },
    { value: 'concept_deepdive', label: 'Concept Deep Dive', description: 'Memory model & computer architecture' },
  ]

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)]">
      {/* Sessions Sidebar */}
      <div className="w-full md:w-72 lg:w-80 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 flex flex-col shrink-0">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Discussions
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={createNewSession}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Chat
          </Button>
        </div>

        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sessions.map((sess) => {
            const isActive = sess.id === activeSessionId
            return (
              <button
                key={sess.id}
                type="button"
                onClick={() => switchSession(sess.id)}
                className={`w-full text-left p-3 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-brand-500/10 border border-brand-500/30 text-brand-700 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate pr-1 font-semibold">{sess.title}</span>
                  <Badge variant="neutral" size="sm">{sess.language}</Badge>
                </div>
                <p className="mt-1 text-[11px] text-slate-400 truncate">
                  {sess.lastMessagePreview}
                </p>
              </button>
            )
          })}
        </div>

        {/* Local model status footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono">
            <Cpu className="w-3 h-3 text-brand-500" /> Gemma 2B (Local)
          </span>
          <span className="text-emerald-500 font-semibold">100% Offline</span>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
        {/* Top Controls: Language & Mode */}
        <div className="p-3 px-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-40">
              <Dropdown
                options={languageOptions}
                value={selectedLanguage}
                onChange={(val) => setSelectedLanguage(val as ProgrammingLanguage)}
              />
            </div>
            <div className="w-52">
              <Dropdown
                options={modeOptions}
                value={tutorMode}
                onChange={(val) => setTutorMode(val as TutorMode)}
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>On-Device Neural Tutor</span>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center py-12">
              <EmptyState
                icon={<Bot className="w-10 h-10 text-brand-500" />}
                title="How can I assist your coding journey today?"
                description="Ask any question about algorithms, recursion, data structures, syntax, or debugging in Python, JavaScript, or Java."
                action={
                  <div className="flex flex-wrap gap-2 justify-center max-w-md mt-3">
                    {[
                      'Explain recursion call stack memory in Python',
                      'Why is Two Sum faster with a Hash Map?',
                      'How do Promises work under the hood in JS?',
                    ].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => sendMessage(sample)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 hover:text-brand-500 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                }
              />
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onSelectFollowup={(f) => sendMessage(f)}
              />
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <span>CodeTutor AI is thinking...</span>
                </div>
                <div className="h-2.5 w-48 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Ask your ${selectedLanguage} programming tutor anything...`}
              disabled={isLoading}
              className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-inner"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputVal.trim() || isLoading}
              isLoading={isLoading}
              rightIcon={<CornerDownLeft className="w-3.5 h-3.5" />}
              className="h-11 px-4"
            >
              Send
            </Button>
          </form>
          <div className="text-center mt-1.5">
            <span className="text-[10px] text-slate-400">
              Offline Mode active • Runs on local device memory • Press Enter to submit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorPage
