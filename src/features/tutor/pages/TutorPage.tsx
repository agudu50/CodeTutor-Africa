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
  X,
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
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
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java 21' },
    { value: 'typescript', label: 'TypeScript' },
  ]

  const modeOptions = [
    { value: 'socratic', label: 'Socratic Tutor', description: 'Guided questions' },
    { value: 'direct_explanation', label: 'Direct Explanations', description: 'Step-by-step summary' },
    { value: 'code_review', label: 'Code Review Mode', description: 'Complexity & style' },
    { value: 'concept_deepdive', label: 'Concept Deep Dive', description: 'Memory model & architecture' },
  ]

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 w-full">
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE TOP CONTROL BAR (MD:HIDDEN)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden px-3 sm:px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 shrink-0 shadow-2xs w-full">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-200 min-w-0 max-w-[200px] cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
          <span className="truncate">{activeSession?.title || 'Discussions'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={createNewSession}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="h-8 text-xs font-semibold px-2.5 border-slate-200 dark:border-slate-700"
          >
            New
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          LEFT SIDEBAR: DISCUSSIONS & SESSIONS (DESKTOP + MOBILE DRAWER)
          ═══════════════════════════════════════════════════════════════ */}
      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      <div
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-72 sm:w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 transition-transform duration-200 ease-in-out ${
          mobileDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
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

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                createNewSession()
                setMobileDrawerOpen(false)
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs font-semibold h-8 border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-700 dark:text-slate-200"
            >
              New Chat
            </Button>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
          {sessions.map((sess) => {
            const isActive = sess.id === activeSessionId
            return (
              <button
                key={sess.id}
                type="button"
                onClick={() => {
                  switchSession(sess.id)
                  setMobileDrawerOpen(false)
                }}
                className={`w-full text-left p-3 rounded-xl text-xs transition-all duration-150 border cursor-pointer ${
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
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden w-full min-w-0">
        {/* Top Controls Bar: Language & Mode Selectors */}
        <div className="px-3 sm:px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2.5 shrink-0 shadow-2xs w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-36 sm:w-44 shrink-0">
              <Dropdown
                options={languageOptions}
                value={selectedLanguage}
                onChange={(val) => setSelectedLanguage(val as ProgrammingLanguage)}
              />
            </div>
            <div className="w-44 sm:w-56 shrink-0">
              <Dropdown
                options={modeOptions}
                value={tutorMode}
                onChange={(val) => setTutorMode(val as TutorMode)}
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono shrink-0">
            <span className="hidden lg:flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Air-Gapped
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 font-semibold text-[11px]">
              <Sparkles className="w-3 h-3 text-brand-600 dark:text-brand-400" />
              On-Device Neural Tutor
            </span>
          </div>
        </div>

        {/* Chat Feed (Centered with strictly equal symmetrical margins) */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 w-full">
          <div className="max-w-3xl w-full mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center py-8 sm:py-12">
                <EmptyState
                  icon={<Bot className="w-9 h-9 sm:w-10 sm:h-10 text-brand-600 dark:text-brand-400" />}
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
                          className="text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-400 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs font-medium cursor-pointer"
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
              <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs animate-pulse w-full">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center border border-brand-500 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="truncate">CodeTutor AI is formulating step-by-step guidance...</span>
                  </div>
                  <div className="h-2 w-36 sm:w-48 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="px-3 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 w-full">
          <div className="max-w-3xl w-full mx-auto">
            <form onSubmit={handleSend} className="relative flex items-center gap-2 w-full">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={`Ask your ${selectedLanguage} tutor anything...`}
                disabled={isLoading}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all min-w-0"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputVal.trim() || isLoading}
                isLoading={isLoading}
                rightIcon={<CornerDownLeft className="w-3.5 h-3.5" />}
                className="h-10 sm:h-11 px-3.5 sm:px-5 font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs text-xs shrink-0 cursor-pointer"
              >
                Send
              </Button>
            </form>
            <div className="text-center mt-1.5 hidden sm:block">
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Offline Mode active • Runs on local device memory • Press Enter to submit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorPage
