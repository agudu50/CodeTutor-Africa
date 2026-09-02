import React, { useState, useEffect, useCallback, useRef } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import {
  SAMPLE_BUGGY_SNIPPETS,
  SAMPLE_ERROR_MESSAGES,
  MOCK_DEBUG_RESULTS_BY_LANGUAGE,
} from '../data/mockDebuggerData'
import { aiService } from '@/services/ai/ai.service'
import { FixSuggestionCard } from '../components/FixSuggestionCard'
import { Dropdown } from '@/components/ui'
import {
  Bug,
  Zap,
  Terminal,
  Code2,
  BookOpen,
  Gamepad2,
  ChevronRight,
  Cpu,
  Edit3,
  Eye,
  Trash2,
  Copy,
  Check,
  Plus,
  Clock,
  Search,
} from 'lucide-react'
import { ProgrammingLanguage, DebugResult, DebugSession } from '@/types'
import { renderVSCodeSyntax, renderTerminalStackTrace } from '@/utils/syntaxHighlight'

const DEBUG_SESSIONS_STORAGE_KEY = 'codetutor_debug_sessions_v1'
const DEBUG_ACTIVE_SESSION_KEY = 'codetutor_debug_active_session_v1'

const DEFAULT_INITIAL_SESSIONS: DebugSession[] = [
  {
    id: 'dbg-sess-sample-1',
    title: 'JS: Async Race Condition',
    language: 'javascript',
    code: SAMPLE_BUGGY_SNIPPETS.javascript,
    errorMessage: SAMPLE_ERROR_MESSAGES.javascript,
    result: MOCK_DEBUG_RESULTS_BY_LANGUAGE.javascript,
    createdAt: '2026-02-21T00:00:00Z',
    updatedAt: '2026-02-21T00:00:00Z',
  },
  {
    id: 'dbg-sess-sample-2',
    title: 'Java: Array Bounds Exceeded',
    language: 'java',
    code: SAMPLE_BUGGY_SNIPPETS.java,
    errorMessage: SAMPLE_ERROR_MESSAGES.java,
    result: MOCK_DEBUG_RESULTS_BY_LANGUAGE.java,
    createdAt: '2026-02-20T12:00:00Z',
    updatedAt: '2026-02-20T12:00:00Z',
  },
  {
    id: 'dbg-sess-sample-3',
    title: 'Python: Off-by-One Loop Error',
    language: 'python',
    code: SAMPLE_BUGGY_SNIPPETS.python,
    errorMessage: SAMPLE_ERROR_MESSAGES.python,
    result: MOCK_DEBUG_RESULTS_BY_LANGUAGE.python,
    createdAt: '2026-02-19T09:00:00Z',
    updatedAt: '2026-02-19T09:00:00Z',
  },
]

function createFreshDebugSession(lang: ProgrammingLanguage = 'javascript'): DebugSession {
  return {
    id: `dbg-sess-${Date.now()}`,
    title: 'New Debug Investigation',
    language: lang,
    code: '',
    errorMessage: '',
    result: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function saveStoredDebugSessions(sessions: DebugSession[]) {
  try {
    localStorage.setItem(DEBUG_SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
  } catch (e) {
    console.warn('Failed to save debug sessions to localStorage', e)
  }
}

function getInitialSessionsAndActiveId(): { initialSessions: DebugSession[]; initialActiveId: string } {
  let stored: DebugSession[] = []
  try {
    const raw = localStorage.getItem(DEBUG_SESSIONS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        stored = parsed
      }
    }
  } catch (e) {
    console.warn('Failed to parse debug sessions from localStorage', e)
  }

  // Filter out any empty duplicate drafts that may have accumulated
  const validStored = stored.filter((s, idx) => {
    if (idx === 0) return true
    return (s.code && s.code.trim() !== '') || Boolean(s.errorMessage && s.errorMessage.trim() !== '')
  })

  if (validStored.length > 0) {
    const savedActiveId = localStorage.getItem(DEBUG_ACTIVE_SESSION_KEY)
    const matching = validStored.find((s) => s.id === savedActiveId)
    // If the active one has code or there's a sample session with code, prefer one with code so terminal is colored
    const activeSession = matching && matching.code.trim() !== ''
      ? matching
      : validStored.find((s) => s.code.trim() !== '') || validStored[0]

    return {
      initialSessions: validStored,
      initialActiveId: activeSession.id,
    }
  }

  // Default to pre-populated sample sessions
  saveStoredDebugSessions(DEFAULT_INITIAL_SESSIONS)
  return {
    initialSessions: DEFAULT_INITIAL_SESSIONS,
    initialActiveId: DEFAULT_INITIAL_SESSIONS[0].id,
  }
}

export const DebuggerPage: React.FC = () => {
  const [{ initialSessions, initialActiveId }] = useState(() => getInitialSessionsAndActiveId())
  const [sessions, setSessions] = useState<DebugSession[]>(initialSessions)
  const [activeSessionId, setActiveSessionId] = useState<string>(initialActiveId)

  // Active session data
  const currentSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0] || createFreshDebugSession('javascript')

  const [language, setLanguage] = useState<ProgrammingLanguage>(currentSession.language || 'javascript')
  const [code, setCode] = useState(currentSession.code || '')
  const [errorMessage, setErrorMessage] = useState(currentSession.errorMessage || '')
  const [debugResult, setDebugResult] = useState<DebugResult | null>(currentSession.result || null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeEditorTab, setActiveEditorTab] = useState<'editor' | 'preview'>('editor')
  const [activeTerminalTab, setActiveTerminalTab] = useState<'terminal' | 'edit'>('terminal')
  const [terminalCopied, setTerminalCopied] = useState(false)
  const [showSessionMenu, setShowSessionMenu] = useState(false)
  const syntaxViewRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (syntaxViewRef.current) {
      syntaxViewRef.current.scrollTop = e.currentTarget.scrollTop
      syntaxViewRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }

  // Sync state whenever activeSession changes
  useEffect(() => {
    if (currentSession) {
      setLanguage(currentSession.language)
      setCode(currentSession.code)
      setErrorMessage(currentSession.errorMessage || '')
      setDebugResult(currentSession.result || null)
    }
  }, [activeSessionId])

  // Save active session changes to sessions state and localStorage
  const updateCurrentSession = useCallback(
    (updates: Partial<DebugSession>) => {
      setSessions((prev) => {
        const updated = prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          }
          return s
        })
        saveStoredDebugSessions(updated)
        return updated
      })
    },
    [activeSessionId]
  )

  const handleLanguageChange = (newLang: string) => {
    const lang = newLang as ProgrammingLanguage
    setLanguage(lang)
    updateCurrentSession({ language: lang })
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    updateCurrentSession({ code: newCode })
  }

  const handleErrorMessageChange = (newError: string) => {
    setErrorMessage(newError)
    updateCurrentSession({ errorMessage: newError })
  }

  // Create a brand new clean debug session
  const createNewDebugSession = () => {
    const newId = `dbg-sess-${Date.now()}`
    const newSession: DebugSession = {
      id: newId,
      title: 'New Debug Investigation',
      language,
      code: '',
      errorMessage: '',
      result: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updated = [newSession, ...sessions]
    setSessions(updated)
    saveStoredDebugSessions(updated)
    setActiveSessionId(newId)
    try {
      localStorage.setItem(DEBUG_ACTIVE_SESSION_KEY, newId)
    } catch {
      // ignore
    }
    setShowSessionMenu(false)
  }

  // Switch session
  const switchSession = (sessionId: string) => {
    setActiveSessionId(sessionId)
    try {
      localStorage.setItem(DEBUG_ACTIVE_SESSION_KEY, sessionId)
    } catch {
      // ignore
    }
    setShowSessionMenu(false)
  }

  // Delete session
  const deleteSession = (sessionIdToDelete: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const remaining = sessions.filter((s) => s.id !== sessionIdToDelete)
    if (remaining.length === 0) {
      const freshId = `dbg-sess-${Date.now()}`
      const freshSession: DebugSession = {
        id: freshId,
        title: 'New Debug Investigation',
        language: 'javascript',
        code: '',
        errorMessage: '',
        result: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setSessions([freshSession])
      saveStoredDebugSessions([freshSession])
      setActiveSessionId(freshId)
      return
    }

    setSessions(remaining)
    saveStoredDebugSessions(remaining)
    if (sessionIdToDelete === activeSessionId) {
      setActiveSessionId(remaining[0].id)
      try {
        localStorage.setItem(DEBUG_ACTIVE_SESSION_KEY, remaining[0].id)
      } catch {
        // ignore
      }
    }
  }

  // Load sample preset into current or new session
  const handleSelectPreset = (presetLang: ProgrammingLanguage) => {
    const sampleCode = SAMPLE_BUGGY_SNIPPETS[presetLang as keyof typeof SAMPLE_BUGGY_SNIPPETS] || ''
    const sampleErr = SAMPLE_ERROR_MESSAGES[presetLang as keyof typeof SAMPLE_ERROR_MESSAGES] || ''
    const sampleResult = MOCK_DEBUG_RESULTS_BY_LANGUAGE[presetLang] || null
    const titleName = presetLang === 'javascript' ? 'JS: Async Race Condition' : presetLang === 'java' ? 'Java: Array Bounds Exceeded' : 'Python: Off-by-One Loop Error'

    setLanguage(presetLang)
    setCode(sampleCode)
    setErrorMessage(sampleErr)
    setDebugResult(sampleResult)
    setActiveTerminalTab('terminal')

    updateCurrentSession({
      title: titleName,
      language: presetLang,
      code: sampleCode,
      errorMessage: sampleErr,
      result: sampleResult,
    })
  }

  const handleCopyTerminal = async () => {
    try {
      await navigator.clipboard.writeText(errorMessage)
      setTerminalCopied(true)
      setTimeout(() => setTerminalCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const handleAnalyze = async () => {
    if (!code.trim() || isAnalyzing) return
    setIsAnalyzing(true)

    try {
      const res = await aiService.analyzeDebugCode({
        code,
        language,
        runtimeError: errorMessage,
      })

      const newResult: DebugResult = {
        id: `dbg-${Date.now()}`,
        language,
        originalCode: code,
        errorMessage,
        hasErrors: res.hasErrors,
        issues: [
          {
            line: 4,
            severity: 'error',
            type: 'Logic/BoundaryIssue',
            message: res.explanation.slice(0, 120),
            suggestedFix: res.suggestedFix,
          },
        ],
        explanationMarkdown: res.explanation,
        fixedCode: res.fixedCode,
        conceptsInvolved: res.keyConcepts,
        createdAt: new Date().toISOString(),
      }

      setDebugResult(newResult)

      // Auto-title session if it was generic
      const smartTitle =
        currentSession.title === 'New Debug Investigation' && res.keyConcepts?.[0]
          ? `${language.toUpperCase()}: ${res.keyConcepts[0]}`
          : currentSession.title

      updateCurrentSession({
        title: smartTitle,
        result: newResult,
      })
    } catch (err) {
      console.error('Debug analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const lineCount = code.split('\n').length
  const fileExt = language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'java'
  const commandPrompt =
    language === 'python'
      ? '$ python3 bug_sample.py'
      : language === 'javascript'
      ? '$ node bug_sample.js'
      : '$ javac Main.java && java Main'

  const terminalColorClass =
    language === 'javascript'
      ? 'text-[#F7DF1E]'
      : language === 'java'
      ? 'text-[#E06C75]'
      : 'text-[#4EC9B0]'

  const terminalCursorClass =
    language === 'javascript'
      ? 'bg-[#F7DF1E]'
      : language === 'java'
      ? 'bg-[#E06C75]'
      : 'bg-[#4EC9B0]'

  const terminalTagLabel =
    language === 'javascript' ? 'node' : language === 'java' ? 'java' : 'python3'

  const isJSSampleActive =
    language === 'javascript' && (code === SAMPLE_BUGGY_SNIPPETS.javascript || currentSession.title.includes('JS:'))
  const isJavaSampleActive =
    language === 'java' && (code === SAMPLE_BUGGY_SNIPPETS.java || currentSession.title.includes('Java:'))
  const isPythonSampleActive =
    language === 'python' && (code === SAMPLE_BUGGY_SNIPPETS.python || currentSession.title.includes('Python:'))

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER & DEBUG SESSIONS CONTROLS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6 sm:p-7 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Bug className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Offline Socratic Debugger
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
            Inspect, trace, and diagnose runtime exceptions and logic traps across Python, JavaScript, and Java without cloud connection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Debug Sessions Dropdown / History Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSessionMenu((v) => !v)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161B22] text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#005F02] dark:hover:border-emerald-500 transition-colors cursor-pointer shadow-3xs"
            >
              <Clock className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
              <span className="max-w-[150px] truncate">{currentSession.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono font-black border border-slate-300 dark:border-slate-700">
                {sessions.length}
              </span>
            </button>

            {/* Sessions Dropdown Menu */}
            {showSessionMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#0E1318] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl z-50 p-2.5 space-y-1.5 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-3 py-2 border-b-2 border-slate-200 dark:border-slate-800 text-xs font-black text-slate-900 dark:text-white">
                  <span>Debug Sessions ({sessions.length})</span>
                  <button
                    type="button"
                    onClick={createNewDebugSession}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#005F02] dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Session
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1.5 p-1">
                  {sessions.map((sess) => {
                    const isSessActive = sess.id === activeSessionId
                    return (
                      <div
                        key={sess.id}
                        onClick={() => switchSession(sess.id)}
                        className={`flex items-center justify-between gap-2 p-2.5 rounded-2xl text-xs cursor-pointer transition-all border-2 ${
                          isSessActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white shadow-3xs'
                            : 'hover:bg-slate-50 dark:hover:bg-[#161B22] border-transparent text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-black text-xs">{sess.title}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <span className="uppercase font-bold">{sess.language}</span>
                            <span>•</span>
                            <span className="font-medium">{sess.result ? 'Diagnosed' : 'Draft'}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => deleteSession(sess.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                          title="Delete session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* New Session Button */}
          <button
            type="button"
            onClick={createNewDebugSession}
            className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-[#005F02] dark:hover:border-emerald-500 bg-slate-50 dark:bg-[#161B22] text-xs font-bold text-slate-800 dark:text-slate-200 shadow-3xs cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
            <span>New Session</span>
          </button>

          {/* Language Selector */}
          <div className="w-36 sm:w-40">
            <Dropdown
              options={[
                { value: 'javascript', label: 'JavaScript' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'python', label: 'Python' },
                { value: 'java', label: 'Java' },
              ]}
              value={language}
              onChange={handleLanguageChange}
              className="text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MULTI-LANGUAGE PRESET CHIPS (WITH AUTHENTIC TERMINAL COLORS)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-2.5 p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 text-xs shadow-xs">
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider pl-1">
          Sample Bugs:
        </span>

        {/* JavaScript Terminal Chip */}
        <button
          type="button"
          onClick={() => handleSelectPreset('javascript')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border-2 shadow-3xs active:scale-95 ${
            isJSSampleActive
              ? 'bg-amber-100 dark:bg-[#252210] border-amber-400 text-amber-950 dark:text-amber-300 shadow-xs'
              : 'bg-slate-50 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-[#F7DF1E] text-slate-950 border border-amber-400 shadow-3xs">
            JS
          </span>
          <span className="font-bold">Async Race Condition</span>
        </button>

        {/* Java Terminal Chip */}
        <button
          type="button"
          onClick={() => handleSelectPreset('java')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border-2 shadow-3xs active:scale-95 ${
            isJavaSampleActive
              ? 'bg-rose-100 dark:bg-[#251014] border-rose-400 text-rose-950 dark:text-rose-300 shadow-xs'
              : 'bg-slate-50 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-rose-400'
          }`}
        >
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-[#E06C75] text-white border border-rose-400 shadow-3xs">
            JAVA
          </span>
          <span className="font-bold">Array Bounds Exceeded</span>
        </button>

        {/* Python Terminal Chip */}
        <button
          type="button"
          onClick={() => handleSelectPreset('python')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border-2 shadow-3xs active:scale-95 ${
            isPythonSampleActive
              ? 'bg-emerald-100 dark:bg-[#0D1E13] border-emerald-500 text-emerald-950 dark:text-emerald-300 shadow-xs'
              : 'bg-slate-50 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500'
          }`}
        >
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-[#005F02] text-white border border-emerald-400 shadow-3xs">
            PYTHON
          </span>
          <span className="font-bold">Off-by-One Loop Error</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          VS CODE DEBUGGER IDE & TERMINAL WORKSPACE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-[#1E1E1E] shadow-2xl overflow-hidden text-slate-200 font-mono text-xs flex flex-col select-none">
        {/* VS Code Window Titlebar */}
        <div className="h-10 px-4 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block shadow-xs" />
          </div>

          <div className="flex-1 max-w-md mx-auto flex items-center justify-center">
            <div className="w-full h-7 px-3 rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] text-[11px] text-slate-400 flex items-center justify-center gap-2 truncate shadow-inner">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate text-slate-300 font-medium">debug-workspace — bug_sample.{fileExt} (CodeTutor IDE)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setCode('')
                setErrorMessage('')
              }}
              className="text-[11px] font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-lg border border-[#3A3A3A] hover:border-slate-500 bg-[#252526] transition-colors cursor-pointer"
            >
              Clear Workspace
            </button>
          </div>
        </div>

        {/* IDE Split Body (Activity Bar + Code Editor + Integrated Terminal) */}
        <div className="flex flex-1 min-h-[380px] overflow-hidden">
          {/* Left: Activity Bar */}
          <div className="w-11 bg-[#181818] border-r border-[#2D2D2D] flex flex-col items-center justify-between py-3 shrink-0 text-slate-400">
            <div className="flex flex-col items-center gap-3.5 w-full">
              <div className="p-2 hover:text-white cursor-pointer rounded-lg hover:bg-[#252526] transition-colors" title="Explorer">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="p-2 hover:text-white cursor-pointer rounded-lg hover:bg-[#252526] transition-colors" title="Search">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="p-2 text-white bg-[#252526] rounded-xl flex justify-center cursor-pointer shadow-3xs" title="Run & Debug">
                <Bug className="w-4 h-4 text-rose-400" />
              </div>
              <div className="p-2 hover:text-white cursor-pointer rounded-lg hover:bg-[#252526] transition-colors" title="Arcade Drills">
                <Gamepad2 className="w-4 h-4" />
              </div>
            </div>

            <div className="p-2 text-slate-500 hover:text-slate-300 cursor-pointer">
              <Cpu className="w-4 h-4 text-[#005F02]" />
            </div>
          </div>

          {/* Right: Code Canvas & Terminal Stack */}
          <div className="flex flex-col flex-1 min-w-0 bg-[#1E1E1E]">
            {/* Tab Bar */}
            <div className="h-10 px-2 bg-[#181818] border-b border-[#252526] flex items-center justify-between shrink-0">
              <div className="flex items-center h-full">
                <div className="h-full px-3.5 bg-[#1E1E1E] text-xs font-mono font-bold text-slate-100 flex items-center gap-2 border-r border-[#252526]">
                  <Code2 className="w-3.5 h-3.5 text-[#005F02] shrink-0" />
                  <span className="truncate">bug_sample.{fileExt}</span>
                  <span className="text-[11px] text-slate-500 hover:text-white ml-1 cursor-pointer">×</span>
                </div>
              </div>

              {/* Editor View Modes (Editable vs Syntax Highlighted) */}
              <div className="flex items-center gap-2 pr-2">
                <div className="flex items-center rounded-xl bg-[#252526] p-1 border border-[#333333]">
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab('editor')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeEditorTab === 'editor'
                        ? 'bg-[#005F02] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab('preview')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeEditorTab === 'preview'
                        ? 'bg-[#005F02] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Syntax View</span>
                  </button>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{lineCount} lines</span>
              </div>
            </div>

            {/* Breadcrumb Bar */}
            <div className="h-6 px-3.5 bg-[#1E1E1E] border-b border-[#252526] flex items-center gap-1.5 text-[11px] text-slate-500 font-mono shrink-0">
              <span>workspace</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span>src</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-300 font-bold">bug_sample.{fileExt}</span>
            </div>

            {/* Editor Canvas (Gutter + Code) */}
            <div className="flex-1 min-h-[180px] flex overflow-hidden relative bg-[#1E1E1E]">
              {/* Line Numbers Gutter */}
              <div className="w-10 sm:w-12 py-3 bg-[#1E1E1E] border-r border-[#2d2d2d] text-right pr-2.5 sm:pr-3 select-none text-[12px] font-mono text-[#858585] leading-6 shrink-0">
                {Array.from({ length: Math.max(lineCount, 8) }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {activeEditorTab === 'editor' ? (
                <div className="flex-1 relative overflow-hidden bg-[#1E1E1E]">
                  {/* Syntax Highlight Layer */}
                  <div
                    ref={syntaxViewRef}
                    aria-hidden="true"
                    className="absolute inset-0 p-3 font-mono text-xs sm:text-[13px] leading-6 overflow-auto pointer-events-none select-none bg-transparent whitespace-pre"
                  >
                    {code ? (
                      renderVSCodeSyntax(code)
                    ) : (
                      <span className="text-slate-600 italic">// Paste your buggy code snippet here...</span>
                    )}
                  </div>

                  {/* Transparent Interactive Input Layer */}
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    onScroll={handleEditorScroll}
                    spellCheck={false}
                    className="absolute inset-0 p-3 bg-transparent text-transparent caret-white font-mono text-xs sm:text-[13px] leading-6 resize-none focus:outline-none placeholder:text-transparent whitespace-pre overflow-auto selection:bg-[#264f78]/80 selection:text-white"
                    placeholder="// Paste your buggy code snippet here..."
                  />
                </div>
              ) : (
                <div className="flex-1 p-3 font-mono text-xs sm:text-[13px] leading-6 overflow-auto select-text bg-[#1E1E1E]">
                  {renderVSCodeSyntax(code || '// No code')}
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════════════
                INTEGRATED VS CODE COLORIZED TERMINAL & STACK TRACE
                ═══════════════════════════════════════════════════════════ */}
            <div className="border-t border-[#2D2D2D] bg-[#141414] flex flex-col shrink-0">
              <div className="h-9 px-3.5 bg-[#1F1F1F] border-b border-[#282828] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Terminal className={`w-3.5 h-3.5 ${terminalColorClass}`} />
                    <span>TERMINAL / STACK TRACE</span>
                    <span
                      className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded border uppercase shadow-3xs ${
                        language === 'javascript'
                          ? 'border-amber-400/80 bg-amber-400/20 text-amber-300'
                          : language === 'java'
                          ? 'border-rose-400/80 bg-rose-400/20 text-rose-300'
                          : 'border-emerald-400/80 bg-emerald-400/20 text-emerald-300'
                      }`}
                    >
                      {terminalTagLabel}
                    </span>
                  </span>
                  <span className="text-slate-500 text-[10px] hidden sm:inline">DEBUG CONSOLE</span>
                  <span className="text-slate-500 text-[10px] hidden sm:inline">OUTPUT</span>
                </div>

                {/* Terminal Mode & Action Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl bg-[#252526] p-1 border border-[#333333]">
                    <button
                      type="button"
                      onClick={() => setActiveTerminalTab('terminal')}
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        activeTerminalTab === 'terminal'
                          ? 'bg-[#005F02] text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>Colorized</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTerminalTab('edit')}
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        activeTerminalTab === 'edit'
                          ? 'bg-[#005F02] text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Raw</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyTerminal}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
                    title="Copy terminal error log"
                  >
                    {terminalCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleErrorMessageChange('')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#333333] transition-colors cursor-pointer"
                    title="Clear terminal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Colorized Terminal Output Canvas */}
              <div className="p-3.5 bg-[#121212] font-mono text-xs max-h-48 overflow-y-auto leading-relaxed border-b border-[#202020]">
                {/* Simulated Terminal Command Invocation */}
                <div className="flex items-center gap-2 text-slate-400 font-bold mb-2 pb-1.5 border-b border-[#252526] text-[11.5px]">
                  <span className={`font-bold ${terminalColorClass}`}>{commandPrompt}</span>
                  <span className={`w-2 h-3.5 ${terminalCursorClass} animate-pulse inline-block`} />
                </div>

                {activeTerminalTab === 'terminal' ? (
                  <div className="text-xs overflow-x-auto space-y-0.5 select-text">
                    {renderTerminalStackTrace(errorMessage)}
                  </div>
                ) : (
                  <textarea
                    value={errorMessage}
                    onChange={(e) => handleErrorMessageChange(e.target.value)}
                    rows={4}
                    spellCheck={false}
                    className="w-full bg-transparent font-mono text-xs text-rose-300 placeholder:text-slate-600 focus:outline-none leading-relaxed resize-none selection:bg-rose-900/50"
                    placeholder="Paste terminal error message or stack trace (e.g., TypeError, NullPointerException, IndexError)..."
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* VS Code Bottom Status Bar (#005F02) */}
        <div className="h-7 px-4 bg-[#005F02] text-white flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
          <div className="flex items-center gap-3">
            <span className="font-bold">main*</span>
            <span>0 ⨂ 0 ⚠</span>
            <span className="hidden sm:inline font-medium">Offline Debugger Ready</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Spaces: 4</span>
            <span>UTF-8</span>
            <span className="font-black uppercase">{language}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-md font-bold text-[10px]">100% OFFLINE</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ANALYZE ACTION BUTTON
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!code.trim() || isAnalyzing}
          className="h-12 px-8 rounded-2xl bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] text-white font-black text-sm shadow-xs cursor-pointer active:scale-95 transition-all inline-flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className={`w-4 h-4 text-white ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing Root Cause Offline...' : 'Diagnose & Suggest Fix with AI'}</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          AI SOCRATIC FIX SUGGESTION REPORT
          ═══════════════════════════════════════════════════════════════ */}
      {debugResult && (
        <div className="space-y-4 pt-2">
          <FixSuggestionCard
            result={debugResult}
            onApplyFix={(fixed) => handleCodeChange(fixed)}
          />
        </div>
      )}
    </PageContainer>
  )
}

export default DebuggerPage
