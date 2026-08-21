import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MOCK_PRACTICE_QUESTIONS } from '../data/mockPracticeData'
import { practiceService } from '@/services/practice/practice.service'
import { CodeEditorPlaceholder } from '../components/CodeEditorPlaceholder'
import { TestResultPanel } from '../components/TestResultPanel'
import { Button } from '@/components/ui'
import {
  ChevronLeft,
  Bot,
  Lightbulb,
  BookOpen,
  Shield,
  Copy,
  Check,
} from 'lucide-react'
import { TestCase } from '@/types'

export const PracticeWorkspacePage: React.FC = () => {
  const { practiceId } = useParams<{ practiceId: string }>()
  const problem = MOCK_PRACTICE_QUESTIONS.find((p) => p.id === practiceId) || MOCK_PRACTICE_QUESTIONS[0]

  const [code, setCode] = useState(problem.starterCode)
  const [activeTab, setActiveTab] = useState<'problem' | 'hints'>('problem')

  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<TestCase[]>(problem.testCases)
  const [submissionFeedback, setSubmissionFeedback] = useState<string>()
  const [runtimeMs, setRuntimeMs] = useState<number>()
  const [showHintIndex, setShowHintIndex] = useState<number>(-1)
  const [copiedInput, setCopiedInput] = useState(false)

  useEffect(() => {
    setCode(problem.starterCode)
    setTestResults(problem.testCases)
    setSubmissionFeedback(undefined)
    setShowHintIndex(-1)
  }, [problem])

  const handleRun = async () => {
    setIsRunning(true)
    const res = await practiceService.submitSolution(problem.id, code)
    setTestResults(res.testResults)
    setRuntimeMs(res.runtimeMs)
    setIsRunning(false)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const res = await practiceService.submitSolution(problem.id, code)
    setTestResults(res.testResults)
    setSubmissionFeedback(res.feedback)
    setRuntimeMs(res.runtimeMs)
    setIsSubmitting(false)
  }

  const handleReset = () => {
    setCode(problem.starterCode)
    setSubmissionFeedback(undefined)
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

  return (
    <div className="flex-1 flex flex-col min-h-0 lg:h-[calc(100vh-4rem)] lg:overflow-hidden bg-slate-50 dark:bg-slate-950 w-full">
      {/* ═══════════════════════════════════════════════════════════════
          WORKSPACE SUBHEADER BAR
          ═══════════════════════════════════════════════════════════════ */}
      {/* Desktop Bar (sm:flex) */}
      <div className="hidden sm:flex h-13 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 items-center justify-between shrink-0 shadow-2xs w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link
            to="/practice"
            className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Problems</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {problem.title}
          </h2>
          <span className={`inline-flex items-center text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border shrink-0 ${difficultyVariant}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
              Ask Tutor for Help
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile 2-Tier Subheader (sm:hidden) */}
      <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 space-y-2 shrink-0 shadow-2xs w-full">
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
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3 text-emerald-500" /> 100% Offline
            </span>
            <Link to="/tutor">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 px-2 cursor-pointer"
                leftIcon={<Bot className="w-3 h-3 text-brand-600 dark:text-brand-400" />}
              >
                Ask Tutor
              </Button>
            </Link>
          </div>
        </div>

        {/* Tier 2: Title & Badges */}
        <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-slate-100 dark:border-slate-800/80">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {problem.title}
          </h2>
          <span className={`inline-flex items-center text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border shrink-0 ${difficultyVariant}`}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          WORKSPACE LAYOUT
          - MOBILE: Fluid full-page vertical flow with auto heights
          - DESKTOP: Side-by-side 2-column split with fixed height
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:overflow-hidden p-3 sm:p-4 gap-4 w-full max-w-7xl mx-auto pb-10 lg:pb-4">
        {/* Left Column: Problem Description & Progressive Hints */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs h-auto lg:h-full lg:overflow-hidden">
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

            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase pr-2">
              {problem.language}
            </span>
          </div>

          {/* Tab Body */}
          <div className="p-4 sm:p-5 lg:flex-1 lg:overflow-y-auto space-y-4">
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
                  <p>
                    Write a recursive function{' '}
                    <code className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 px-1.5 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                      is_palindrome(s: str) -&gt; bool
                    </code>{' '}
                    that determines if a string is a palindrome.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    You must use recursion and not slice reversal like{' '}
                    <code className="font-mono text-xs text-rose-600 dark:text-rose-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                      s[::-1]
                    </code>
                    . Ignore spaces and casing.
                  </p>
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
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                  <span>💡 Progressive Hints help you build your own solution step-by-step.</span>
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

        {/* Right Column: Code Editor & Test Results */}
        <div className="lg:col-span-7 flex flex-col gap-4 h-auto lg:h-full lg:overflow-hidden">
          {/* Editor Container */}
          <div className="h-[340px] sm:h-[380px] lg:flex-[6] lg:h-auto">
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

          {/* Test Results Container */}
          <div className="h-auto lg:flex-[4] lg:h-auto lg:overflow-hidden">
            <TestResultPanel
              testCases={testResults}
              isPassedAll={testResults.every((t) => t.passed)}
              feedback={submissionFeedback}
              runtimeMs={runtimeMs}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticeWorkspacePage
