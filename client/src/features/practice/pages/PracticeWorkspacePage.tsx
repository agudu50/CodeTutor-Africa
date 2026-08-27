import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { practiceStoreService } from '@/services/practice/practice-store.service'
import { practiceService } from '@/services/practice/practice.service'
import { CodeEditorPlaceholder } from '../components/CodeEditorPlaceholder'
import { TestResultModal } from '../components/TestResultModal'
import { Button, Dropdown } from '@/components/ui'
import {
  ChevronLeft,
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
  RotateCcw,
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

  // Clock & Attempt State
  const defaultMinutes = problem?.timeLimitMinutes || 15
  const [timeLeftSecs, setTimeLeftSecs] = useState<number>(defaultMinutes * 60)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true)
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0)
  const maxAttempts = problem?.maxAttempts ?? 3

  // Interactive Modals
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'info'
    title: string
    detail: string
  } | null>(null)

  // Reset when problem changes
  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode)
      setTestResults(problem.testCases || [])
      setSubmissionFeedback(undefined)
      setShowHintIndex(-1)
      setIsResultModalOpen(false)
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

  const handleRun = async () => {
    if (!problem) return
    setIsRunning(true)
    const res = await practiceService.submitSolution(problem.id, code)
    setTestResults(res.testResults)
    setRuntimeMs(res.runtimeMs)
    setIsRunning(false)

    // Open the Execution Results Modal
    setIsResultModalOpen(true)
  }

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

    setIsSubmitting(true)
    const newAttemptCount = attemptsUsed + 1
    setAttemptsUsed(newAttemptCount)

    const res = await practiceService.submitSolution(problem.id, code)
    setTestResults(res.testResults)
    setSubmissionFeedback(res.feedback)
    setRuntimeMs(res.runtimeMs)
    setIsSubmitting(false)

    // Open Completion Modal
    setIsResultModalOpen(true)
  }

  const handleReset = () => {
    if (!problem) return
    setCode(problem.starterCode)
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
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No practice problem available.</p>
          <Link to="/practice">
            <Button size="sm" variant="primary">Return to Practice List</Button>
          </Link>
        </div>
      </div>
    )
  }

  const difficultyVariant =
    problem.difficulty === 'beginner'
      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80'
      : problem.difficulty === 'intermediate'
      ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80'
      : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80'

  const problemOptions = allProblems.map((q) => ({
    value: q.id,
    label: `${q.language.toUpperCase()} • ${q.title}`,
  }))

  const currentIndex = allProblems.findIndex((q) => q.id === problem.id)
  const nextProblem = allProblems.length > 0 ? allProblems[(currentIndex + 1) % allProblems.length] : problem
  const isPassedAll = testResults.every((t) => t.passed)
  const passedCount = testResults.filter((t) => t.passed).length
  const attemptsLeft = maxAttempts > 0 ? Math.max(0, maxAttempts - attemptsUsed) : null

  return (
    <div className="flex-1 flex flex-col min-h-0 lg:h-[calc(100vh-4rem)] lg:overflow-hidden bg-slate-50 dark:bg-slate-950 w-full relative">
      {/* ═══════════════════════════════════════════════════════════════
          FLOATING RUN NOTIFICATION TOAST
          ═══════════════════════════════════════════════════════════════ */}
      {toastMessage && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 animate-in slide-in-from-top-3 fade-in duration-200 shadow-2xl max-w-sm w-full">
          <div
            className={`p-3.5 rounded-2xl border flex items-start gap-3 backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900/95 text-white border-emerald-500 shadow-emerald-950/40'
                : toastMessage.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-500 shadow-rose-950/40'
                : 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/40'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : toastMessage.type === 'error' ? (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Terminal className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold font-mono tracking-tight block">
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
              <p className="text-[11px] text-slate-200 font-sans mt-0.5 leading-snug">
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
      <div className="hidden sm:flex h-14 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 items-center justify-between shrink-0 shadow-2xs w-full gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link
            to="/practice"
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Problems</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Interactive Problem / Language Switcher */}
          <div className="w-72 max-w-sm">
            <Dropdown
              options={problemOptions}
              value={problem.id}
              onChange={(newId) => navigate(`/practice/${newId}`)}
              className="text-xs font-bold"
            />
          </div>

          <span className={`inline-flex items-center text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-lg border shrink-0 ${difficultyVariant}`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Timer, Attempts & Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Countdown Clock */}
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-xl border shadow-3xs transition-colors ${
              timeLeftSecs === 0
                ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                : timeLeftSecs < 180
                ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeftSecs === 0 ? "Time's Up" : formatTimer(timeLeftSecs)}</span>
          </div>

          {/* Attempts Left Badge */}
          {maxAttempts > 0 && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-xl border shadow-3xs ${
                attemptsUsed >= maxAttempts
                  ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>
                {attemptsLeft !== null ? `${attemptsLeft}/${maxAttempts} Attempts` : 'Unlimited'}
              </span>
            </span>
          )}

          {/* View Results Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsResultModalOpen(true)}
            className="h-8 text-xs font-bold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-3xs px-3 cursor-pointer"
            leftIcon={<Terminal className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />}
          >
            <span>Results ({passedCount}/{testResults.length})</span>
          </Button>

          <Link to="/tutor">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-bold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-[#005F02] dark:hover:text-emerald-400 shadow-3xs px-3 cursor-pointer"
              leftIcon={<Bot className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />}
            >
              Ask Tutor
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile 2-Tier Subheader (sm:hidden) */}
      <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 space-y-2 shrink-0 shadow-2xs w-full">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/practice"
            className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors py-0.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Problems</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimer(timeLeftSecs)}
            </span>
            <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${difficultyVariant}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMobileTab('problem')}
            className={`py-1 text-center text-xs font-bold rounded-lg transition-all ${
              mobileTab === 'problem'
                ? 'bg-white dark:bg-slate-900 text-[#005F02] dark:text-emerald-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Problem Description
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`py-1 text-center text-xs font-bold rounded-lg transition-all ${
              mobileTab === 'editor'
                ? 'bg-white dark:bg-slate-900 text-[#005F02] dark:text-emerald-400 shadow-2xs'
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
          - Right: VS Code Code Editor (100% Full Height)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:overflow-hidden p-3 sm:p-4 gap-4 w-full max-w-7xl mx-auto pb-6 lg:pb-4">
        {/* Left Column: Problem Description & Progressive Hints */}
        <div
          className={`lg:col-span-5 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs h-full overflow-hidden ${
            mobileTab !== 'problem' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Tab Selector Bar */}
          <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('problem')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'problem'
                    ? 'bg-[#005F02] text-white shadow-3xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Description</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hints')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'hints'
                    ? 'bg-[#005F02] text-white shadow-3xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Hints ({problem.hints.length})</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-bold uppercase">
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
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1">
                        <BookOpen className="w-2.5 h-2.5" />
                        <span>{problem.courseTitle}</span>
                      </span>
                    )}
                    {problem.moduleTitle && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {problem.moduleTitle}
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                      {problem.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {problem.language}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
                    {problem.title}
                  </h3>
                </div>

                {/* Formatted Problem Statement */}
                <div className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-3xs">
                  <span className="font-bold text-[#005F02] dark:text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Instructions & Goal
                  </span>
                  <p className="leading-relaxed whitespace-pre-line">{problem.description}</p>
                </div>

                {/* Examples & Test Cases */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Examples & Test Cases
                  </h4>
                  <div className="space-y-2">
                    {problem.testCases.map((tc, idx) => (
                      <div
                        key={tc.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 shadow-3xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                            Example {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopySample(tc.input)}
                            className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedInput ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedInput ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <div className="font-mono text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80 space-y-0.5">
                          <p className="text-slate-600 dark:text-slate-400 truncate">
                            <span className="text-slate-400 dark:text-slate-500">Input: </span>
                            {tc.input}
                          </p>
                          <p className="text-slate-900 dark:text-emerald-400 font-bold truncate">
                            <span className="text-slate-400 dark:text-slate-500 font-normal">Expected Output: </span>
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
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 space-y-1 shadow-3xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Socratic Hints</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
                    Stuck? Reveal hints step-by-step to guide your problem-solving without giving away the answer.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {problem.hints.map((hint, idx) => {
                    const isRevealed = idx <= showHintIndex
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isRevealed
                            ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800/70 shadow-2xs'
                            : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                            Hint #{idx + 1}
                          </span>
                          {!isRevealed && (
                            <button
                              type="button"
                              onClick={() => setShowHintIndex(idx)}
                              className="text-[11px] font-bold text-[#005F02] dark:text-emerald-400 hover:underline cursor-pointer"
                            >
                              Unlock Hint
                            </button>
                          )}
                        </div>
                        {isRevealed ? (
                          <p className="text-xs text-slate-800 dark:text-slate-200 mt-1.5 leading-relaxed">
                            {hint}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-1">
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

        {/* Right Column: Interactive Code Editor & Actions */}
        <div
          className={`lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs h-full overflow-hidden ${
            mobileTab !== 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Editor Header Bar */}
          <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-[#1e1e1e] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                solution.{problem.language === 'python' ? 'py' : problem.language === 'java' ? 'java' : problem.language === 'typescript' ? 'ts' : 'js'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                title="Reset code to starter template"
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 min-h-[300px] lg:min-h-0 bg-[#1e1e1e] p-2 flex flex-col">
            <CodeEditorPlaceholder
              code={code}
              onChange={setCode}
              language={problem.language}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Editor Bottom Actions Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="text-xs font-bold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-3xs cursor-pointer h-9 px-4"
                leftIcon={<Terminal className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />}
              >
                {isRunning ? 'Running Tests...' : 'Run Test Cases'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting || (maxAttempts > 0 && attemptsUsed >= maxAttempts)}
                className={`text-xs font-bold text-white shadow-xs cursor-pointer h-9 px-5 ${
                  maxAttempts > 0 && attemptsUsed >= maxAttempts
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-[#005F02] hover:bg-[#004e02]'
                }`}
                rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Solution'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          INTERACTIVE TEST RESULT MODAL
          ═══════════════════════════════════════════════════════════════ */}
      <TestResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        testCases={testResults}
        feedback={submissionFeedback}
        runtimeMs={runtimeMs}
        isPassedAll={isPassedAll}
        onNextProblem={() => {
          setIsResultModalOpen(false)
          navigate(`/practice/${nextProblem.id}`)
        }}
      />
    </div>
  )
}

export default PracticeWorkspacePage
