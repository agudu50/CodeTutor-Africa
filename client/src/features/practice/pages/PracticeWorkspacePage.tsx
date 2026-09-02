import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { practiceStoreService } from '@/services/practice/practice-store.service'
import { practiceService } from '@/services/practice/practice.service'
import { CodeEditorPlaceholder } from '../components/CodeEditorPlaceholder'
import { TestResultModal } from '../components/TestResultModal'
import { Button } from '@/components/ui'
import {
  ChevronLeft,
  ChevronRight,
  Bot,
  Lightbulb,
  BookOpen,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  ArrowRight,
  X,
  Terminal,
  Clock,
  Shield,
  Play,
  ChevronDown,
  Search,
} from 'lucide-react'
import { TestCase } from '@/types'

export const PracticeWorkspacePage: React.FC = () => {
  const { practiceId } = useParams<{ practiceId: string }>()
  const navigate = useNavigate()
  const [allProblems, setAllProblems] = useState(() => practiceStoreService.getAllQuestions())
  
  useEffect(() => {
    const handlePracticeUpdate = () => setAllProblems(practiceStoreService.getAllQuestions())
    window.addEventListener('practice_updated', handlePracticeUpdate)
    return () => window.removeEventListener('practice_updated', handlePracticeUpdate)
  }, [])

  const problem = allProblems.find((p) => p.id === practiceId || p.slug === practiceId) || allProblems[0]

  const [code, setCode] = useState(problem?.starterCode || '')
  const [activeTab, setActiveTab] = useState<'problem' | 'hints'>('problem')
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor'>('editor')

  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<TestCase[]>(problem?.testCases || [])
  const [submissionFeedback, setSubmissionFeedback] = useState<string>()
  const [runtimeMs, setRuntimeMs] = useState<number>()
  const [showHintIndex, setShowHintIndex] = useState<number>(-1)
  const [copiedInput, setCopiedInput] = useState(false)
  const [hasRunTests, setHasRunTests] = useState(false)

  // Problem Switcher Popover State
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
  const [switcherSearch, setSwitcherSearch] = useState('')
  const [switcherLang, setSwitcherLang] = useState<string>('all')
  const switcherRef = useRef<HTMLDivElement>(null)

  // Bottom Console / Quick Test Drawer State
  const [isConsoleOpen, setIsConsoleOpen] = useState(false)
  const [activeConsoleCaseIdx, setActiveConsoleCaseIdx] = useState(0)

  // Clock & Attempt State
  const defaultMinutes = problem?.timeLimitMinutes || 15
  const [timeLeftSecs, setTimeLeftSecs] = useState<number>(defaultMinutes * 60)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true)
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0)
  const maxAttempts = problem?.maxAttempts ?? 3

  // Interactive Submit Modal
  const [isSubmitResultModalOpen, setIsSubmitResultModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'info'
    title: string
    detail: string
  } | null>(null)

  // Close Switcher on Outside Click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setIsSwitcherOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset when problem changes
  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode)
      setTestResults(problem.testCases || [])
      setSubmissionFeedback(undefined)
      setShowHintIndex(-1)
      setIsSubmitResultModalOpen(false)
      setIsConsoleOpen(false)
      setHasRunTests(false)
      setIsSwitcherOpen(false)
      setToastMessage(null)
      setTimeLeftSecs((problem.timeLimitMinutes || 15) * 60)
      setIsTimerRunning(true)
      setAttemptsUsed(0)
    }
  }, [problem])

  // Countdown timer tick
  useEffect(() => {
    if (!isTimerRunning || timeLeftSecs <= 0) return

    const interval = setInterval(() => {
      setTimeLeftSecs((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false)
          setToastMessage({
            type: 'error',
            title: "Time's Up!",
            detail: 'The allocated time limit for this practice problem has expired.',
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeftSecs])

  // Toast Auto-dismiss
  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => {
      setToastMessage(null)
    }, 3500)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  // ═══════════════════════════════════════════════════════════════
  // 1. RUN TEST CASES (Developer Local Sandbox - 0 Attempts Deducted)
  // ═══════════════════════════════════════════════════════════════
  const handleRun = async () => {
    if (!problem) return

    if (!code || !code.trim()) {
      setToastMessage({
        type: 'error',
        title: 'Empty Code Editor',
        detail: 'Please write your solution implementation before running test cases.',
      })
    }

    setIsRunning(true)
    const res = await practiceService.runSampleTests(problem.id, code)
    setTestResults(res.testResults)
    setSubmissionFeedback(res.feedback)
    setRuntimeMs(res.runtimeMs)
    setIsRunning(false)
    setHasRunTests(true)

    // Open inline Console / Test Results Drawer directly below the editor
    setIsConsoleOpen(true)
    const passedCount = res.testResults.filter((t) => t.passed).length
    const total = res.testResults.length

    if (passedCount === total) {
      setToastMessage({
        type: 'success',
        title: 'Sample Tests Passed',
        detail: `All ${total} sample test cases passed in ${res.runtimeMs}ms! You are ready to Submit.`,
      })
    } else {
      setToastMessage({
        type: 'error',
        title: 'Tests Failed',
        detail: `${passedCount}/${total} sample tests passed. Inspect the bottom console below.`,
      })
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. SUBMIT SOLUTION (Official Graded Assessment - Deducts 1 Attempt)
  // ═══════════════════════════════════════════════════════════════
  const handleSubmit = async () => {
    if (!problem) return

    if (maxAttempts > 0 && attemptsUsed >= maxAttempts) {
      setToastMessage({
        type: 'error',
        title: 'Attempt Limit Reached',
        detail: `You have used all ${maxAttempts} submission attempts allowed for this challenge. Review the hints or reset your workspace.`,
      })
      return
    }

    if (!code || !code.trim()) {
      setToastMessage({
        type: 'error',
        title: 'Empty Code Editor',
        detail: 'Cannot submit an empty solution. Please write your code first.',
      })
      return
    }

    if (!hasRunTests) {
      setToastMessage({
        type: 'error',
        title: 'Run Tests First',
        detail: 'Please test your code with "Run Test Cases" before submitting your final solution.',
      })
      setIsConsoleOpen(true)
      return
    }

    setIsSubmitting(true)
    const newAttemptCount = attemptsUsed + 1
    setAttemptsUsed(newAttemptCount)

    const res = await practiceService.submitSolution(problem.id, code)
    setTestResults(res.testResults)
    setSubmissionFeedback(res.feedback)
    setRuntimeMs(res.runtimeMs)
    setIsSubmitting(false)

    // Open Official Result Modal (Evaluation complete)
    setIsSubmitResultModalOpen(true)
  }

  const handleReset = () => {
    if (!problem) return
    setCode(problem.starterCode)
    setHasRunTests(false)
    setIsConsoleOpen(false)
    setSubmissionFeedback(undefined)
    setToastMessage({
      type: 'info',
      title: 'Code Reset',
      detail: 'Starter boilerplate restored to original state.',
    })
  }

  const handleCopySample = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedInput(true)
    setTimeout(() => setCopiedInput(false), 2000)
  }

  if (!problem) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-100/60 dark:bg-[#080B0E]">
        <div className="text-center space-y-4 max-w-sm p-8 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs">
          <p className="text-sm font-black text-slate-800 dark:text-slate-200">No practice problem available.</p>
          <Link to="/practice">
            <Button size="sm" variant="primary" className="border-2 border-[#005F02] font-bold">Return to Practice List</Button>
          </Link>
        </div>
      </div>
    )
  }

  const difficultyVariant =
    problem.difficulty === 'beginner'
      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 font-bold'
      : problem.difficulty === 'intermediate'
      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-800 font-bold'
      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-800 font-bold'

  const currentIndex = allProblems.findIndex((q) => q.id === problem.id)
  const prevProblem = currentIndex > 0 ? allProblems[currentIndex - 1] : null
  const nextProblem = currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : null
  
  const isPassedAll = testResults.every((t) => t.passed)
  const passedCount = testResults.filter((t) => t.passed).length
  const attemptsLeft = maxAttempts > 0 ? Math.max(0, maxAttempts - attemptsUsed) : null
  const activeConsoleCase = testResults[activeConsoleCaseIdx] || testResults[0]

  // Filter problems in switcher
  const filteredSwitcherProblems = allProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(switcherSearch.toLowerCase()) ||
      (p.moduleTitle && p.moduleTitle.toLowerCase().includes(switcherSearch.toLowerCase())) ||
      p.tags.some((t) => t.toLowerCase().includes(switcherSearch.toLowerCase()))
    const matchesLang = switcherLang === 'all' || p.language === switcherLang
    return matchesSearch && matchesLang
  })

  return (
    <div className="flex-1 flex flex-col min-h-0 lg:h-[calc(100vh-4rem)] lg:overflow-hidden bg-slate-100/60 dark:bg-[#080B0E] w-full relative">
      {/* ═══════════════════════════════════════════════════════════════
          FLOATING RUN NOTIFICATION TOAST
          ═══════════════════════════════════════════════════════════════ */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in slide-in-from-top-3 fade-in duration-200 shadow-2xl max-w-sm w-full">
          <div
            className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 shadow-xl ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 text-white border-emerald-500'
                : toastMessage.type === 'error'
                ? 'bg-rose-950 text-white border-rose-500'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : toastMessage.type === 'error' ? (
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
                <XCircle className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700">
                <Terminal className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-black font-mono tracking-tight block">
                  {toastMessage.title}
                </span>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="text-slate-400 hover:text-white p-0.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5 leading-snug">
                {toastMessage.detail}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          WORKSPACE SUBHEADER BAR
          ═══════════════════════════════════════════════════════════════ */}
      {/* Desktop Bar (sm:flex) */}
      <div className="hidden sm:flex h-16 px-4 sm:px-6 border-b-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0C1015] items-center justify-between shrink-0 shadow-xs w-full gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Link
            to="/practice"
            className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 hover:text-[#005F02] dark:hover:text-emerald-400 font-bold transition-colors px-3 py-1.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] hover:border-[#005F02] dark:hover:border-emerald-500 shadow-3xs shrink-0 cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Catalog</span>
          </Link>
          <div className="h-5 w-px bg-slate-300 dark:border-slate-700 shrink-0" />

          {/* ═══════════════════════════════════════════════════════════
              ENHANCED PROBLEM SELECTOR & STEPPER
              ═══════════════════════════════════════════════════════════ */}
          <div className="relative flex items-center gap-1" ref={switcherRef}>
            {/* Prev Problem Arrow */}
            <button
              type="button"
              disabled={!prevProblem}
              onClick={() => prevProblem && navigate(`/practice/${prevProblem.id}`)}
              title={prevProblem ? `Previous: ${prevProblem.title}` : 'First Problem'}
              className="p-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#005F02] dark:hover:text-white border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] hover:border-slate-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer shadow-3xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Custom Interactive Switcher Trigger */}
            <button
              type="button"
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161B22] hover:border-[#005F02] dark:hover:border-emerald-500 transition-all text-left shadow-3xs cursor-pointer max-w-sm"
            >
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-3xs shrink-0">
                {problem.language}
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                {problem.title}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSwitcherOpen ? 'rotate-180 text-[#005F02] dark:text-emerald-400' : ''}`} />
            </button>

            {/* Next Problem Arrow */}
            <button
              type="button"
              disabled={!nextProblem}
              onClick={() => nextProblem && navigate(`/practice/${nextProblem.id}`)}
              title={nextProblem ? `Next: ${nextProblem.title}` : 'Last Problem'}
              className="p-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#005F02] dark:hover:text-white border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] hover:border-slate-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer shadow-3xs active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* ═══════════════════════════════════════════════════════════
                ENHANCED PROBLEM SELECTOR POPOVER
                ═══════════════════════════════════════════════════════════ */}
            {isSwitcherOpen && (
              <div className="absolute top-12 left-0 z-50 w-96 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-3 space-y-2.5">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search practice challenges..."
                    value={switcherSearch}
                    onChange={(e) => setSwitcherSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#005F02] shadow-3xs"
                  />
                </div>

                {/* Language Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono select-none">
                  {['all', 'python', 'javascript', 'java', 'typescript'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSwitcherLang(lang)}
                      className={`px-2.5 py-1 rounded-lg font-bold uppercase transition-all shrink-0 cursor-pointer shadow-3xs ${
                        switcherLang === lang
                          ? 'bg-[#005F02] text-white border-2 border-[#005F02]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-[#005F02]'
                      }`}
                    >
                      {lang === 'all' ? 'All' : lang}
                    </button>
                  ))}
                </div>

                {/* Challenges List */}
                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {filteredSwitcherProblems.map((p) => {
                    const isSelected = p.id === problem.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          navigate(`/practice/${p.id}`)
                          setIsSwitcherOpen(false)
                        }}
                        className={`w-full flex items-start justify-between gap-2 p-3 rounded-2xl text-left transition-all cursor-pointer border-2 shadow-3xs ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white'
                            : 'hover:bg-slate-50 dark:hover:bg-[#161B22] border-transparent hover:border-slate-200 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shrink-0">
                              {p.language}
                            </span>
                            {p.moduleTitle && (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate font-medium">
                                {p.moduleTitle}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#005F02] dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                            {p.title}
                          </p>
                        </div>

                        <span
                          className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md shrink-0 border ${
                            p.difficulty === 'beginner'
                              ? 'text-[#005F02] bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800'
                              : p.difficulty === 'intermediate'
                              ? 'text-amber-900 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800'
                              : 'text-rose-900 bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <span className={`inline-flex items-center text-[10px] font-mono font-black uppercase px-3 py-1 rounded-xl shadow-3xs shrink-0 ${difficultyVariant}`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Timer, Attempts & Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Countdown Clock */}
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-xl border-2 shadow-3xs transition-colors ${
              timeLeftSecs === 0
                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                : timeLeftSecs < 180
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 animate-pulse'
                : 'bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeftSecs === 0 ? "Time's Up" : formatTimer(timeLeftSecs)}</span>
          </div>

          {/* Attempts Left Badge */}
          {maxAttempts > 0 && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-xl border-2 shadow-3xs ${
                attemptsUsed >= maxAttempts
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>
                {attemptsLeft !== null ? `${attemptsLeft}/${maxAttempts} Attempts Left` : 'Unlimited'}
              </span>
            </span>
          )}

          {/* Toggle Console Output */}
          <button
            type="button"
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-bold border-2 shadow-3xs cursor-pointer active:scale-95 transition-all ${
              isConsoleOpen
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
            <span>Console ({passedCount}/{testResults.length})</span>
          </button>

          <Link to="/tutor">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-bold border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 hover:bg-[#005F02] hover:text-white dark:hover:bg-[#005F02] dark:hover:text-white shadow-3xs cursor-pointer active:scale-95 transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask Tutor</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile 2-Tier Subheader (sm:hidden) */}
      <div className="sm:hidden border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C1015] px-3 py-2.5 space-y-2 shrink-0 shadow-xs w-full">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/practice"
            className="flex items-center gap-1 text-xs text-slate-800 dark:text-slate-200 font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161B22]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 border border-amber-300">
              <Clock className="w-3 h-3" />
              {formatTimer(timeLeftSecs)}
            </span>
            <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md ${difficultyVariant}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-[#161B22] p-1.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setMobileTab('problem')}
            className={`py-1.5 text-center text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'problem'
                ? 'bg-white dark:bg-[#0E1318] text-[#005F02] dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Problem Description
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`py-1.5 text-center text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'editor'
                ? 'bg-white dark:bg-[#0E1318] text-[#005F02] dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Code Editor
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          WORKSPACE LAYOUT
          - Left: Problem Description & Interactive Hints
          - Right: VS Code Code Editor + Inline Test Console
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:overflow-hidden p-3 sm:p-4 gap-4 w-full max-w-7xl mx-auto pb-6 lg:pb-4">
        {/* Left Column: Problem Description & Progressive Hints */}
        <div
          className={`lg:col-span-5 flex flex-col rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs h-full overflow-hidden ${
            mobileTab !== 'problem' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Tab Selector Bar */}
          <div className="p-3 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#0E1318] p-1 rounded-2xl border-2 border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('problem')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'problem'
                    ? 'bg-[#005F02] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Description</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hints')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'hints'
                    ? 'bg-[#005F02] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Hints ({problem.hints.length})</span>
              </button>
            </div>

            <span className="text-xs font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border-2 border-slate-300 dark:border-slate-700 font-black uppercase shadow-3xs">
              {problem.language}
            </span>
          </div>

          {/* Tab Body */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
            {activeTab === 'problem' ? (
              <>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {problem.courseTitle && (
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1 shadow-3xs">
                        <BookOpen className="w-3 h-3 text-[#005F02] dark:text-emerald-400" />
                        <span>{problem.courseTitle}</span>
                      </span>
                    )}
                    {problem.moduleTitle && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shadow-3xs">
                        {problem.moduleTitle}
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                      {problem.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-3xs">
                      {problem.language}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-snug">
                    {problem.title}
                  </h3>
                </div>

                {/* Formatted Problem Statement */}
                <div className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 space-y-2.5 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 shadow-3xs">
                  <span className="font-black text-[#005F02] dark:text-emerald-400 flex items-center gap-1.5 text-xs uppercase font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    Instructions & Goal
                  </span>
                  <p className="leading-relaxed whitespace-pre-line font-normal">{problem.description}</p>
                </div>

                {/* Examples & Test Cases */}
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                    Examples & Test Cases
                  </h4>
                  <div className="space-y-2.5">
                    {problem.testCases.map((tc, idx) => (
                      <div
                        key={tc.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 text-xs space-y-2 shadow-3xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">
                            Example {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopySample(tc.input)}
                            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedInput ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedInput ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <div className="font-mono text-xs bg-white dark:bg-[#0E1318] p-3 rounded-xl border border-slate-300 dark:border-slate-700 space-y-1 shadow-3xs">
                          <p className="text-slate-700 dark:text-slate-300 truncate">
                            <span className="text-slate-500 font-medium">Input: </span>
                            <span className="font-bold">{tc.input}</span>
                          </p>
                          <p className="text-[#005F02] dark:text-emerald-400 font-bold truncate">
                            <span className="text-slate-500 font-medium">Expected Output: </span>
                            {tc.expectedOutput}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Progressive Hints Tab */
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1 shadow-3xs">
                  <div className="flex items-center gap-1.5 font-black">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Socratic Hints</span>
                  </div>
                  <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300 font-normal">
                    Stuck? Reveal hints step-by-step to guide your problem-solving without giving away the answer.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {problem.hints.map((hint, idx) => {
                    const isRevealed = idx <= showHintIndex
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border-2 transition-all shadow-3xs ${
                          isRevealed
                            ? 'bg-white dark:bg-[#0E1318] border-amber-400 dark:border-amber-700'
                            : 'bg-slate-50 dark:bg-[#161B22] border-slate-200 dark:border-slate-800 opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-400 uppercase">
                            Hint #{idx + 1}
                          </span>
                          {!isRevealed && (
                            <button
                              type="button"
                              onClick={() => setShowHintIndex(idx)}
                              className="text-xs font-black text-[#005F02] dark:text-emerald-400 hover:underline cursor-pointer"
                            >
                              Unlock Hint
                            </button>
                          )}
                        </div>
                        {isRevealed ? (
                          <p className="text-xs text-slate-800 dark:text-slate-200 mt-2 leading-relaxed font-normal">
                            {hint}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-500 italic mt-1.5 font-normal">
                            Click 'Unlock Hint' to reveal this clue.
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor + Inline Test Console */}
        <div
          className={`lg:col-span-7 flex flex-col rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs h-full overflow-hidden ${
            mobileTab !== 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Editor Area */}
          <div className="flex-1 min-h-[280px] lg:min-h-0 bg-[#1e1e1e] flex flex-col overflow-hidden">
            <CodeEditorPlaceholder
              code={code}
              onChange={(newCode) => {
                setCode(newCode)
                setHasRunTests(false)
              }}
              language={problem.language}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════
              INLINE TEST RESULTS CONSOLE (Opens on "Run Code")
              ═══════════════════════════════════════════════════════════ */}
          {isConsoleOpen && (
            <div className="border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] p-3.5 space-y-3 max-h-48 overflow-y-auto shrink-0 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                    <span>Sample Test Results</span>
                  </span>
                  <span
                    className={`text-[11px] font-mono font-black px-2.5 py-0.5 rounded-lg border shadow-3xs ${
                      isPassedAll
                        ? 'bg-emerald-100 text-[#005F02] dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {passedCount}/{testResults.length} Passed ({runtimeMs || 12}ms)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsConsoleOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title="Collapse console"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Case Tabs */}
              <div className="flex items-center gap-2">
                {testResults.map((tc, idx) => {
                  const isActive = activeConsoleCaseIdx === idx
                  return (
                    <button
                      key={tc.id}
                      type="button"
                      onClick={() => setActiveConsoleCaseIdx(idx)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border-2 flex items-center gap-1.5 shadow-3xs active:scale-95 ${
                        isActive
                          ? 'bg-[#005F02] text-white border-[#005F02]'
                          : 'bg-white dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <span>Case {idx + 1}</span>
                      <span>{tc.passed ? '✓' : '✕'}</span>
                    </button>
                  )
                })}
              </div>

              {/* Active Case Details */}
              {activeConsoleCase && (
                <div className="p-3 rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1.5 shadow-3xs">
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="text-slate-400">Input: </span>
                    <span className="text-slate-900 dark:text-white font-bold">{activeConsoleCase.input}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="text-slate-400">Expected: </span>
                    <span className="text-[#005F02] dark:text-emerald-400 font-bold">{activeConsoleCase.expectedOutput}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="text-slate-400">Your Output: </span>
                    <span className={`font-bold ${activeConsoleCase.passed ? 'text-[#005F02] dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {activeConsoleCase.actualOutput || '(No return value)'}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Editor Bottom Actions Bar (Run vs Submit) */}
          <div className="p-3.5 sm:p-4 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] flex items-center justify-between gap-3 shrink-0">
            {/* Left: Run Button (Sandbox Test - 0 Attempts) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="inline-flex items-center gap-2 h-10 px-4 sm:px-5 font-bold text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 hover:border-[#005F02] hover:text-[#005F02] dark:hover:border-emerald-500 bg-white dark:bg-[#0E1318] rounded-2xl shadow-3xs cursor-pointer active:scale-95 transition-all text-xs sm:text-sm"
              >
                <Play className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 fill-current" />
                <span>{isRunning ? 'Testing...' : 'Run Test Cases'}</span>
              </button>
            </div>

            {/* Right: Submit Button (Graded - Deducts 1 Attempt) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting || (maxAttempts > 0 && attemptsUsed >= maxAttempts)}
                title={!hasRunTests ? 'Click "Run Test Cases" first to verify your code before submitting' : 'Submit your solution for grading'}
                className={`inline-flex items-center gap-2 h-10 px-5 sm:px-6 font-black text-white rounded-2xl shadow-xs cursor-pointer active:scale-95 transition-all text-xs sm:text-sm ${
                  maxAttempts > 0 && attemptsUsed >= maxAttempts
                    ? 'bg-slate-400 cursor-not-allowed border-2 border-slate-400'
                    : !hasRunTests
                    ? 'bg-slate-600 hover:bg-slate-700 border-2 border-slate-600'
                    : 'bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02]'
                }`}
              >
                <span>{isSubmitting ? 'Evaluating...' : !hasRunTests ? 'Run Tests to Submit' : 'Submit Solution'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          OFFICIAL SUBMISSION RESULT MODAL (Opens only on Submit)
          ═══════════════════════════════════════════════════════════════ */}
      <TestResultModal
        isOpen={isSubmitResultModalOpen}
        onClose={() => setIsSubmitResultModalOpen(false)}
        testCases={testResults}
        feedback={submissionFeedback}
        runtimeMs={runtimeMs}
        isPassedAll={isPassedAll}
        onNextProblem={() => {
          setIsSubmitResultModalOpen(false)
          if (nextProblem) navigate(`/practice/${nextProblem.id}`)
        }}
      />
    </div>
  )
}

export default PracticeWorkspacePage
