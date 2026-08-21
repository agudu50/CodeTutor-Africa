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
  Shield,
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
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      {/* ═══════════════════════════════════════════════════════════════
          LEFT SIDEBAR: DISCUSSIONS & SESSIONS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full md:w-72 lg:w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
        {/* Discussions Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/80">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block leading-none">
                Discussions
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {sessions.length} local sessions
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={createNewSession}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-semibold h-8 border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-700 dark:text-slate-200"
          >
            New Chat
          </Button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
          {sessions.map((sess) => {
            const isActive = sess.id === activeSessionId
            return (
              <button
                key={sess.id}
                type="button"
                onClick={() => switchSession(sess.id)}
                className={`w-full text-left p-3 rounded-xl text-xs transition-all duration-150 border ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/70 border-brand-300 dark:border-brand-700 text-brand-900 dark:text-brand-200 font-semibold shadow-2xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-bold text-slate-900 dark:text-white">
                    {sess.title}
                  </span>
                  <Badge variant="brand" size="sm" className="font-mono text-[10px] uppercase font-bold shrink-0">
                    {sess.language}
                  </Badge>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {sess.lastMessagePreview}
                </p>
              </button>
            )
          })}
        </div>

        {/* Local Hardware Status Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Gemma 2B (Local)
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            100% Offline
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CHAT WORKSPACE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* Top Controls Bar: Language & Mode Selectors */}
        <div className="p-3 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-44">
              <Dropdown
                options={languageOptions}
                value={selectedLanguage}
                onChange={(val) => setSelectedLanguage(val as ProgrammingLanguage)}
              />
            </div>
            <div className="w-56">
              <Dropdown
                options={modeOptions}
                value={tutorMode}
                onChange={(val) => setTutorMode(val as TutorMode)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="hidden lg:flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Air-Gapped Private
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 font-semibold text-[11px]">
              <Sparkles className="w-3 h-3 text-brand-600 dark:text-brand-400" />
              On-Device Neural Tutor
            </span>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 max-w-4xl w-full mx-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center py-12">
              <EmptyState
                icon={<Bot className="w-10 h-10 text-brand-600 dark:text-brand-400" />}
                title="How can I assist your coding journey today?"
                description="Ask any question about algorithms, recursion, data structures, syntax, or debugging in Python, JavaScript, or Java."
                action={
                  <div className="flex flex-wrap gap-2 justify-center max-w-lg mt-4">
                    {[
                      'Explain recursion call stack memory in Python',
                      'Why is Two Sum faster with a Hash Map?',
                      'How do Promises work under the hood in JS?',
                      'Explain Java interfaces vs abstract classes',
                    ].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => sendMessage(sample)}
                        className="text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-400 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs font-medium"
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

          {/* Thinking / Loading State */}
          {isLoading && (
            <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center border border-brand-500">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span>CodeTutor AI is formulating step-by-step guidance...</span>
                </div>
                <div className="h-2 w-48 bg-slate-200 dark:bg-slate-700 rounded-full" />
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
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputVal.trim() || isLoading}
              isLoading={isLoading}
              rightIcon={<CornerDownLeft className="w-3.5 h-3.5" />}
              className="h-11 px-5 font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
            >
              Send
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Offline Mode active • Runs on local device memory • Press Enter to submit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorPage
