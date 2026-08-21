import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MOCK_PRACTICE_QUESTIONS } from '../data/mockPracticeData'
import { practiceService } from '@/services/practice/practice.service'
import { CodeEditorPlaceholder } from '../components/CodeEditorPlaceholder'
import { TestResultPanel } from '../components/TestResultPanel'
import { Badge, Button, Tabs } from '@/components/ui'
import { ChevronLeft, HelpCircle, Lightbulb, BookOpen } from 'lucide-react'
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

  useEffect(() => {
    setCode(problem.starterCode)
    setTestResults(problem.testCases)
    setSubmissionFeedback(undefined)
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

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Workspace Subheader Bar */}
      <div className="h-12 px-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/practice"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> All Problems
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:border-slate-800" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
            {problem.title}
          </h2>
          <Badge variant="brand" size="sm" className="font-mono text-[10px]">
            {problem.difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/tutor`}>
            <Button variant="ghost" size="sm" className="h-8 text-xs" leftIcon={<HelpCircle className="w-3.5 h-3.5" />}>
              Ask Tutor for Help
            </Button>
          </Link>
        </div>
      </div>

      {/* Split Workspace: Problem/Hints (Left), Editor + Output (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100 dark:bg-slate-950 p-2 gap-2">
        {/* Left Column: Problem description & hints */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Tabs
              items={[
                { id: 'problem', label: 'Description', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: 'hints', label: `Hints (${problem.hints.length})`, icon: <Lightbulb className="w-3.5 h-3.5" /> },
              ]}
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as 'problem' | 'hints')}
            />
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeTab === 'problem' ? (
              <>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{problem.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="neutral" size="sm">{problem.category}</Badge>
                    <Badge variant="brand" size="sm">{problem.language}</Badge>
                  </div>
                </div>

                <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {problem.description}
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Examples & Constraints</h4>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs">
                    <div>
                      <span className="text-slate-400 font-sans text-[10px] block">Sample Input:</span>
                      <code className="text-brand-600 dark:text-brand-400">{problem.testCases[0]?.input}</code>
                    </div>
                    <div>
                      <span className="text-slate-400 font-sans text-[10px] block">Sample Expected Output:</span>
                      <code className="text-emerald-600 dark:text-emerald-400">{problem.testCases[0]?.expectedOutput}</code>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Click to reveal progressive hints without spoiling the entire solution.
                </p>
                {problem.hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Hint {idx + 1}
                      </span>
                      {showHintIndex < idx && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[11px]"
                          onClick={() => setShowHintIndex(idx)}
                        >
                          Reveal
                        </Button>
                      )}
                    </div>
                    {showHintIndex >= idx ? (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in">
                        {hint}
                      </p>
                    ) : (
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-sm filter blur-xs" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor (Top 65%) + Test Results (Bottom 35%) */}
        <div className="lg:col-span-7 flex flex-col gap-2 overflow-hidden h-full">
          <div className="flex-[6] min-h-[300px]">
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

          <div className="flex-[4] min-h-[180px]">
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
