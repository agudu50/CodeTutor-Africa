import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MOCK_PRACTICE_QUESTIONS } from '../data/mockPracticeData'
import { practiceService } from '@/services/practice/practice.service'
import { CodeEditorPlaceholder } from '../components/CodeEditorPlaceholder'
import { TestResultModal } from '../components/TestResultModal'
import { Button, Dropdown } from '@/components/ui'
import {
  ChevronLeft,
  Bot,
  Lightbulb,
  BookOpen,
  Shield,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  ArrowRight,
  X,
  Terminal,
} from 'lucide-react'
import { TestCase } from '@/types'

export const PracticeWorkspacePage: React.FC = () => {
  const { practiceId } = useParams<{ practiceId: string }>()
  const navigate = useNavigate()
  const problem = MOCK_PRACTICE_QUESTIONS.find((p) => p.id === practiceId) || MOCK_PRACTICE_QUESTIONS[0]

  const [code, setCode] = useState(problem.starterCode)
  const [activeTab, setActiveTab] = useState<'problem' | 'hints'>('problem')
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor'>('editor')

  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<TestCase[]>(problem.testCases)
  const [submissionFeedback, setSubmissionFeedback] = useState<string>()
  const [runtimeMs, setRuntimeMs] = useState<number>()
  const [showHintIndex, setShowHintIndex] = useState<number>(-1)
  const [copiedInput, setCopiedInput] = useState(false)

  // Interactive Modals
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'info'
    title: string
    detail: string
  } | null>(null)

  useEffect(() => {
    setCode(problem.starterCode)
    setTestResults(problem.testCases)
    setSubmissionFeedback(undefined)
    setShowHintIndex(-1)
    setIsResultModalOpen(false)
    setIsSubmitModalOpen(false)
    setToastMessage(null)
  }, [problem])

  // Toast Auto-dismiss
  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => {
      setToastMessage(null)
    }, 3500)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const handleRun = async () => {
    setIsRunning(true)
    const res = await practiceService.submitSolution(problem.id, code)
    setTestResults(res.testResults)
    setRuntimeMs(res.runtimeMs)
    setIsRunning(false)

    // Open the Execution Results Modal
    setIsResultModalOpen(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const res = await practiceService.submitSolution(problem.id, code)
    setTestResults(res.testResults)
    setSubmissionFeedback(res.feedback)
    setRuntimeMs(res.runtimeMs)
    setIsSubmitting(false)

    // Open Completion Modal
    setIsSubmitModalOpen(true)
  }

  const handleReset = () => {
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

  const difficultyVariant =
    problem.difficulty === 'beginner'
      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80'
      : problem.difficulty === 'intermediate'
      ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80'
      : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80'

  const problemOptions = MOCK_PRACTICE_QUESTIONS.map((q) => ({
    value: q.id,
    label: `${q.language.toUpperCase()} • ${q.title}`,
  }))

  const currentIndex = MOCK_PRACTICE_QUESTIONS.findIndex((q) => q.id === problem.id)
  const nextProblem = MOCK_PRACTICE_QUESTIONS[(currentIndex + 1) % MOCK_PRACTICE_QUESTIONS.length]
  const isPassedAll = testResults.every((t) => t.passed)
  const passedCount = testResults.filter((t) => t.passed).length

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
            className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
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

          <span className={`inline-flex items-center text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border shrink-0 ${difficultyVariant}`}>
            {problem.difficulty}
          </span>
        </div>

        {/* View Results Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsResultModalOpen(true)}
            className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 shadow-2xs px-2.5 cursor-pointer"
            leftIcon={<Terminal className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
          >
            <span>Results ({passedCount}/{testResults.length})</span>
          </Button>

          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-500" /> 100% Offline
          </span>
          <Link to="/tutor">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 shadow-2xs px-2.5 cursor-pointer"
              leftIcon={<Bot className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
            >
              Ask Tutor
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile 2-Tier Subheader (sm:hidden) */}
      <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 space-y-2 shrink-0 shadow-2xs w-full">
        {/* Tier 1: Navigation & Actions */}
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/practice"
            className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors py-0.5"
          >
            <ChevronLeft className="w-4 h-4 text-slate-400" />
            <span>All Problems</span>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsResultModalOpen(true)}
              className="h-7 text-xs font-semibold px-2 cursor-pointer"
            >
              Results ({passedCount}/{testResults.length})
            </Button>
            <Link to="/tutor">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 px-2 cursor-pointer"
                leftIcon={<Bot className="w-3 h-3 text-brand-600 dark:text-brand-400" />}
              >
                Ask Tutor
              </Button>
            </Link>
          </div>
        </div>

        {/* Tier 2: Dynamic Problem Switcher Dropdown */}
        <div className="pt-0.5 border-t border-slate-100 dark:border-slate-800/80">
          <Dropdown
            options={problemOptions}
            value={problem.id}
            onChange={(newId) => navigate(`/practice/${newId}`)}
            className="text-xs font-bold w-full"
          />
        </div>

        {/* Tier 3: Mobile Section Tab Switcher (Problem / Editor) */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMobileTab('problem')}
            className={`py-1 text-center text-xs font-bold rounded-lg transition-all ${
              mobileTab === 'problem'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-2xs'
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
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            VS Code Editor
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          WORKSPACE LAYOUT
          - Left: Problem Description (Full height)
          - Right: VS Code Dark+ Code Editor (100% Full Height)
          - Results: Opens directly in interactive modal!
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
                    ? 'bg-brand-600 text-white shadow-2xs'
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
                    ? 'bg-brand-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Hints ({problem.hints.length})</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-2.5 py-0.5 rounded border border-brand-200 dark:border-brand-800/80 font-bold uppercase pr-2">
              {problem.language}
            </span>
          </div>

          {/* Tab Body */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
            {activeTab === 'problem' ? (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80">
                      {problem.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                    {problem.title}
                  </h3>
                </div>

                {/* Formatted Problem Statement */}
                <div className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 space-y-2.5">
                  <p>{problem.description}</p>
                </div>

                {/* Examples & Constraints */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Examples & Constraints
                  </h4>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs shadow-2xs">
                    {/* Sample Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="uppercase font-sans font-bold">Sample Input:</span>
                        <button
                          type="button"
                          onClick={() => handleCopySample(problem.testCases[0]?.input || '')}
                          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                          {copiedInput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedInput ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <code className="text-brand-600 dark:text-brand-400 font-bold block bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 select-all break-all">
                        {problem.testCases[0]?.input}
                      </code>
                    </div>

                    {/* Sample Output */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="uppercase font-sans font-bold">Sample Expected Output:</span>
                      </div>
                      <code className="text-emerald-600 dark:text-emerald-400 font-bold block bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 select-all">
                        {problem.testCases[0]?.expectedOutput}
                      </code>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Progressive Hints help you build your own solution step-by-step.</span>
                </div>

                {problem.hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                        Hint {idx + 1} of {problem.hints.length}
                      </span>
                      {showHintIndex < idx && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs font-bold text-brand-600 dark:text-brand-400 border-slate-200 dark:border-slate-700 hover:border-brand-500 cursor-pointer"
                          onClick={() => setShowHintIndex(idx)}
                        >
                          Reveal Hint
                        </Button>
                      )}
                    </div>
                    {showHintIndex >= idx ? (
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans animate-in fade-in">
                        {hint}
                      </p>
                    ) : (
                      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md filter blur-xs select-none" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 100% Full-Height VS Code Dark+ Editor */}
        <div
          className={`lg:col-span-7 flex flex-col h-full overflow-hidden ${
            mobileTab === 'problem' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <CodeEditorPlaceholder
            code={code}
            onChange={setCode}
            language={problem.language}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onOpenResults={() => setIsResultModalOpen(true)}
            testStats={{
              passed: passedCount,
              total: testResults.length,
              isPassedAll,
            }}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          EXECUTION RESULTS MODAL (Opens on Run Tests or Clicking Results)
          ═══════════════════════════════════════════════════════════════ */}
      <TestResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        testCases={testResults}
        isPassedAll={isPassedAll}
        feedback={submissionFeedback}
        runtimeMs={runtimeMs}
        onNextProblem={() => {
          setIsResultModalOpen(false)
          navigate(`/practice/${nextProblem.id}`)
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          SUBMISSION COMPLETION DIALOG / MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-2xl ${
                    isPassedAll
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {isPassedAll ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                  ) : (
                    <XCircle className="w-7 h-7 text-rose-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    {isPassedAll ? 'Solution Accepted' : 'Submission Needs Revision'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isPassedAll
                      ? 'All test assertions executed and verified offline.'
                      : 'Some test cases did not meet the expected return values.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Telemetry Metrics Row */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-center">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-400 block font-sans font-bold">Status</span>
                <span className={`text-xs font-bold ${isPassedAll ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {passedCount}/{testResults.length} Passed
                </span>
              </div>
              <div className="space-y-0.5 border-x border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block font-sans font-bold">Runtime</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {runtimeMs || 42} ms
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-400 block font-sans font-bold">Memory</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  0.1 MB
                </span>
              </div>
            </div>

            {/* AI Pedagogical Feedback Box */}
            {submissionFeedback && (
              <div className="p-3.5 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/60 text-xs space-y-1">
                <span className="font-bold text-[10px] uppercase font-mono text-brand-700 dark:text-brand-300 block">
                  AI Tutor Pedagogical Review:
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                  {submissionFeedback}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              {isPassedAll ? (
                <Button
                  variant="primary"
                  className="w-full sm:flex-1 h-10 font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs cursor-pointer"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => {
                    setIsSubmitModalOpen(false)
                    navigate(`/practice/${nextProblem.id}`)
                  }}
                >
                  Next Problem
                </Button>
              ) : (
                <Link to="/tutor" className="w-full sm:flex-1">
                  <Button
                    variant="primary"
                    className="w-full h-10 font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs cursor-pointer"
                    leftIcon={<Bot className="w-4 h-4" />}
                  >
                    Ask Tutor to Explain Bug
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                className="w-full sm:w-auto h-10 text-xs font-bold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 cursor-pointer"
                onClick={() => {
                  setIsSubmitModalOpen(false)
                  setIsResultModalOpen(true)
                }}
              >
                Inspect Test Cases
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PracticeWorkspacePage
