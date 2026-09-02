import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTutorSession } from '../hooks/useTutorSession'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { ChatMessageItem } from '../components/ChatMessageItem'
import { Dropdown } from '@/components/ui'
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
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML / HTML5' },
    { value: 'css', label: 'CSS / CSS3' },
    { value: 'git', label: 'Git & GitHub' },
    { value: 'java', label: 'Java' },
    { value: 'sql', label: 'SQL & Databases' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
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
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)] bg-slate-100/60 dark:bg-[#080B0E] w-full">
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE TOP CONTROL BAR
          ═══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden px-3 sm:px-4 py-2.5 border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C1015] flex items-center justify-between gap-2 shrink-0 shadow-xs w-full">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] text-xs font-bold text-slate-800 dark:text-slate-200 min-w-0 max-w-[220px] cursor-pointer shadow-3xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
          <span className="truncate">{activeSession?.title || 'Discussions'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={createNewSession}
            className="inline-flex items-center gap-1 h-8 px-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] hover:border-[#005F02] hover:text-[#005F02] text-slate-800 dark:text-slate-200 text-xs font-bold shadow-3xs cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
            <span>New</span>
          </button>
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
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-72 sm:w-80 border-r-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0C1015] flex flex-col shrink-0 transition-transform duration-200 ease-in-out ${
          mobileDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Discussions Header */}
        <div className="p-3.5 sm:p-4 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block leading-tight truncate">
                Discussions
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
                {sessions.length} local sessions
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                createNewSession()
                setMobileDrawerOpen(false)
              }}
              className="inline-flex items-center gap-1 h-8 px-2.5 sm:px-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161B22] hover:border-[#005F02] hover:text-[#005F02] text-slate-800 dark:text-slate-200 text-xs font-bold shadow-3xs cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
              <span>New Chat</span>
            </button>
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
                className={`group/session relative w-full text-left p-3 sm:p-3.5 rounded-2xl text-xs transition-all duration-150 border-2 cursor-pointer select-none shadow-3xs ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white font-bold'
                    : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B22] hover:border-slate-200 dark:hover:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`truncate font-bold ${isActive ? 'text-[#005F02] dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {sess.title}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-mono text-[10px] uppercase font-black px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-3xs">
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
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                  {sess.lastMessagePreview}
                </p>
              </div>
            )
          })}
        </div>

        {/* Local AI Status Footer */}
        <div className="p-3.5 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <Bot className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
            {isOffline ? 'Offline AI Tutor' : 'Online AI Tutor'}
          </span>
          <span className="inline-flex items-center gap-1.5 font-black text-[#005F02] dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full inline-block bg-emerald-500 animate-pulse" />
            {isOffline ? 'No Internet Needed' : 'Online Synced'}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CHAT WORKSPACE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-slate-100/40 dark:bg-[#0A0D12] overflow-hidden w-full min-w-0">
        {/* Top Controls Bar: Language & Mode Selectors + Dynamic Mode Feedback */}
        <div className="px-3 sm:px-6 py-3 border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C1015] flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs w-full">
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
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[#005F02] dark:text-emerald-400 font-bold text-xs shadow-3xs">
              <Bot className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Mode:</strong> {currentModeInfo.label}
              </span>
            </div>

            {/* Simple Offline Reassurance */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 shadow-3xs">
              {isOffline ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
                  <span>Works 100% Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
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
              <div className="h-full flex items-center justify-center py-6 sm:py-10">
                <div className="max-w-2xl w-full mx-auto p-6 sm:p-8 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 text-[#005F02] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs">
                    <Bot className="w-7 h-7" />
                  </div>

                  <span className="text-[11px] font-mono font-black px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 inline-block shadow-3xs">
                    100% OFFLINE AI TUTOR
                  </span>

                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      How can I assist your coding journey today?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-normal">
                      Ask any question about algorithms, recursion, data structures, syntax, or debugging in Python, JavaScript, or Java.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-left">
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
                        className="text-xs px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] hover:border-[#005F02] dark:hover:border-emerald-500 hover:text-[#005F02] dark:hover:text-emerald-400 text-slate-800 dark:text-slate-200 font-bold transition-all shadow-3xs cursor-pointer active:scale-95 text-left"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
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

            {/* Thinking / Loading Animated Dots */}
            {isLoading && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs max-w-fit animate-in fade-in">
                <div className="w-8 h-8 rounded-xl bg-[#005F02] text-white flex items-center justify-center border border-emerald-600 shrink-0 shadow-3xs">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5 py-1 px-1.5 self-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="px-3 sm:px-6 py-3.5 border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C1015] shrink-0 w-full shadow-xs">
          <div className="max-w-3xl w-full mx-auto">
            <form onSubmit={handleSend} className="relative flex items-center gap-2.5 w-full">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={`Ask your ${selectedLanguage} tutor anything...`}
                disabled={isLoading}
                className="flex-1 bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#005F02] dark:focus:border-emerald-500 shadow-3xs transition-all min-w-0 font-medium"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                className="inline-flex items-center gap-1.5 h-11 sm:h-12 px-5 font-bold bg-[#005F02] hover:bg-[#004e02] disabled:opacity-40 disabled:hover:bg-[#005F02] text-white rounded-2xl shadow-xs text-xs sm:text-sm shrink-0 cursor-pointer active:scale-95 transition-all"
              >
                <span>Send</span>
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </form>
            <div className="text-center mt-2 hidden sm:block">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
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
