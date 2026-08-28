import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTutorSession } from '../hooks/useTutorSession'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { ChatMessageItem } from '../components/ChatMessageItem'
import { Button, Dropdown, EmptyState } from '@/components/ui'
import {
  Plus,
  Bot,
  MessageSquare,
  CornerDownLeft,
  ShieldCheck,
  X,
  Wifi,
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
    deleteSession,
  } = useTutorSession(sessionId)

  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'

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
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'typescript', label: 'TypeScript' },
  ]

  const modeOptions = [
    {
      value: 'socratic',
      label: 'Guided Learning',
      description: 'Gives hints to help you figure out the answer',
    },
    {
      value: 'direct_explanation',
      label: 'Direct Answers',
      description: 'Gives clear, simple explanations with examples',
    },
    {
      value: 'code_review',
      label: 'Check My Code',
      description: 'Finds mistakes and shows how to fix them',
    },
    {
      value: 'concept_deepdive',
      label: 'How It Works',
      description: 'Explains what happens step-by-step behind the scenes',
    },
  ]

  const currentModeInfo = modeOptions.find((m) => m.value === tutorMode) || modeOptions[0]
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 w-full">
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE TOP CONTROL BAR
          ═══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden px-3 sm:px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 shrink-0 shadow-2xs w-full">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-200 min-w-0 max-w-[220px] cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
          <span className="truncate">{activeSession?.title || 'Discussions'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={createNewSession}
            leftIcon={<Plus className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />}
            className="h-8 text-xs font-bold px-2.5 border-slate-200 dark:border-slate-700 text-[#005F02] dark:text-emerald-400"
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
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-72 sm:w-80 border-r border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 flex flex-col shrink-0 transition-transform duration-200 ease-in-out ${
          mobileDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Discussions Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200/90 dark:border-slate-800/90 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 shadow-3xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white block leading-tight truncate">
                Discussions
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">
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
              className="text-xs font-bold h-8 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-[#005F02] dark:hover:text-emerald-400 text-slate-700 dark:text-slate-200 shadow-3xs"
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
              <div
                key={sess.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  switchSession(sess.id)
                  setMobileDrawerOpen(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    switchSession(sess.id)
                    setMobileDrawerOpen(false)
                  }
                }}
                className={`group/session relative w-full text-left p-3 sm:p-3.5 rounded-2xl text-xs transition-all duration-150 border cursor-pointer select-none ${
                  isActive
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700/80 text-slate-900 dark:text-white font-semibold shadow-3xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`truncate font-bold ${isActive ? 'text-[#005F02] dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {sess.title}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700/60">
                      {sess.language}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(sess.id)
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors opacity-80 sm:opacity-0 sm:group-hover/session:opacity-100 focus:opacity-100 cursor-pointer"
                      title="Delete this discussion"
                      aria-label={`Delete ${sess.title}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {sess.lastMessagePreview}
                </p>
              </div>
            )
          })}
        </div>

        {/* Local AI Status Footer */}
        <div className="p-3.5 border-t border-slate-200/90 dark:border-slate-800/90 bg-slate-50 dark:bg-slate-950/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Bot className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
            {isOffline ? 'Offline AI Tutor' : 'Online AI Tutor'}
          </span>
          <span
            className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400"
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block bg-emerald-500 animate-pulse"
            />
            {isOffline ? 'No Internet Needed' : 'Online Synced'}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CHAT WORKSPACE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden w-full min-w-0">
        {/* Top Controls Bar: Language & Mode Selectors + Dynamic Mode Feedback */}
        <div className="px-3 sm:px-6 py-2.5 border-b border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2.5 shrink-0 shadow-2xs w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-36 sm:w-44 shrink-0">
              <Dropdown
                options={languageOptions}
                value={selectedLanguage}
                onChange={(val) => setSelectedLanguage(val as ProgrammingLanguage)}
              />
            </div>
            <div className="w-48 sm:w-60 shrink-0">
              <Dropdown
                options={modeOptions}
                value={tutorMode}
                onChange={(val) => setTutorMode(val as TutorMode)}
              />
            </div>
          </div>

          {/* Dynamic Human-Centered Mode & Privacy Indicator */}
          <div className="hidden sm:flex items-center gap-2.5 text-xs shrink-0">
            {/* Active Mode Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 text-[#005F02] dark:text-emerald-400 font-semibold text-[11px] shadow-3xs">
              <Bot className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Mode:</strong> {currentModeInfo.label}
              </span>
            </div>

            {/* Simple Offline Reassurance */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 shadow-3xs">
              {isOffline ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Works 100% Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Online Synced</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 w-full">
          <div className="max-w-3xl w-full mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center py-8 sm:py-12">
                <EmptyState
                  icon={<Bot className="w-9 h-9 sm:w-10 sm:h-10 text-[#005F02] dark:text-emerald-400" />}
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
                          className="text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-[#005F02] dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs font-medium cursor-pointer"
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
                <div className="w-8 h-8 rounded-xl bg-[#005F02] text-white flex items-center justify-center border border-emerald-500 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="truncate">CodeTutor AI is formulating step-by-step Socratic guidance...</span>
                  </div>
                  <div className="h-2 w-36 sm:w-48 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="px-3 sm:px-6 py-3 border-t border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shrink-0 w-full">
          <div className="max-w-3xl w-full mx-auto">
            <form onSubmit={handleSend} className="relative flex items-center gap-2 w-full">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={`Ask your ${selectedLanguage} tutor anything...`}
                disabled={isLoading}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-w-0"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputVal.trim() || isLoading}
                isLoading={isLoading}
                rightIcon={<CornerDownLeft className="w-3.5 h-3.5" />}
                className="h-10 sm:h-11 px-3.5 sm:px-5 font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs text-xs shrink-0 cursor-pointer"
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
