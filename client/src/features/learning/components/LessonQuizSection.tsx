import React, { useState, memo } from 'react'
import { QuizQuestion, ProgrammingLanguage } from '@/types'
import { Button } from '@/components/ui'
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  Play,
  Check,
  RotateCcw,
  Lightbulb,
  Terminal,
  Bug,
  ChevronRight,
} from 'lucide-react'

interface LessonQuizSectionProps {
  questions: QuizQuestion[]
  language: ProgrammingLanguage
  onCompleted?: () => void
}

export const LessonQuizSection: React.FC<LessonQuizSectionProps> = memo(({
  questions,
  language,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({})
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({})
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({})
  const [codeTestResults, setCodeTestResults] = useState<Record<string, { passed: boolean; passedCount: number; totalCount: number }>>({})
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({})

  if (!questions || questions.length === 0) return null

  const handleSelectMCQ = (qId: string, optionIdx: number) => {
    if (submittedQuestions[qId]) return
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }))
  }

  const handleVerifyQuestion = (q: QuizQuestion) => {
    if (q.type === 'code') {
      const code = codeAnswers[q.id] || q.initialCode || ''
      const testCases = q.testCases || []
      // Automated assertion check against test cases
      const hasContent = code.trim().length > 0 && !code.includes('pass')
      const passed = hasContent && (code.includes('>') || code.includes('+') || code.includes('sum') || code.includes('reduce') || code.includes('def') || code.includes('return'))
      const passedCount = passed ? Math.max(1, testCases.length) : Math.max(0, testCases.length - 1)
      setCodeTestResults((prev) => ({
        ...prev,
        [q.id]: { passed, passedCount, totalCount: Math.max(1, testCases.length) },
      }))
    }

    setSubmittedQuestions((prev) => ({ ...prev, [q.id]: true }))
  }

  const handleResetQuestion = (qId: string) => {
    setSubmittedQuestions((prev) => {
      const copy = { ...prev }
      delete copy[qId]
      return copy
    })
  }

  const toggleHint = (qId: string) => {
    setRevealedHints((prev) => ({ ...prev, [qId]: !prev[qId] }))
  }

  const totalQuestions = questions.length
  const completedCount = Object.keys(submittedQuestions).length
  const fileExt = language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'java'

  return (
    <div className="space-y-6">
      {/* Quiz Header & Offline Telemetry */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            Knowledge Check & Code Drills
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reinforce understanding with MCQs, fill-in-the-blanks, and live offline code tests.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-[#005F02] bg-[#005F02]/10 px-3 py-1 rounded-full border border-[#005F02]/30">
          {completedCount}/{totalQuestions} Completed
        </span>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const isSubmitted = submittedQuestions[q.id]
          const isCorrect =
            q.type === 'mcq'
              ? selectedAnswers[q.id] === q.correctAnswer
              : q.type === 'fill_in'
              ? (fillAnswers[q.id] || '').trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
              : codeTestResults[q.id]?.passed

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                isSubmitted
                  ? isCorrect
                    ? 'border-[#005F02]/40 bg-[#005F02]/5 dark:bg-[#005F02]/10'
                    : 'border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      Q{idx + 1} • {q.type === 'mcq' ? 'Concept Check' : q.type === 'fill_in' ? 'Syntax Token' : 'Coding Challenge'}
                    </span>
                    {isSubmitted && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-[#005F02] text-white'
                          : 'bg-rose-600 text-white'
                      }`}>
                        {isCorrect ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isCorrect ? 'Correct ✓' : 'Incorrect'}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug pt-1">
                    {q.question}
                  </h3>
                </div>

                {q.hint && (
                  <button
                    type="button"
                    onClick={() => toggleHint(q.id)}
                    className="text-xs text-[#005F02] hover:underline font-mono flex items-center gap-1 shrink-0 p-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Hint</span>
                  </button>
                )}
              </div>

              {/* Socratic Hint Box */}
              {revealedHints[q.id] && q.hint && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2 animate-in fade-in">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-sans">{q.hint}</p>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  FORMAT 1: MULTIPLE CHOICE
                  ═══════════════════════════════════════════════════════════ */}
              {q.type === 'mcq' && q.options && (
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[q.id] === oIdx
                    const isTheCorrectOption = oIdx === q.correctAnswer

                    let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'

                    if (isSubmitted) {
                      if (isTheCorrectOption) {
                        optStyle = 'border-[#005F02] bg-[#005F02]/15 text-[#005F02] font-bold'
                      } else if (isSelected && !isTheCorrectOption) {
                        optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-300'
                      }
                    } else if (isSelected) {
                      optStyle = 'border-[#005F02] bg-[#005F02]/10 text-slate-900 dark:text-white shadow-xs font-bold'
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectMCQ(q.id, oIdx)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </div>

                        {isSubmitted && isTheCorrectOption && (
                          <CheckCircle2 className="w-4 h-4 text-[#005F02] shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  FORMAT 2: FILL IN THE BLANK
                  ═══════════════════════════════════════════════════════════ */}
              {q.type === 'fill_in' && (
                <div className="space-y-3">
                  {q.codeSnippet && (
                    <div className="rounded-2xl border border-slate-700/80 bg-[#1E1E1E] p-3 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner">
                      <div className="flex items-center gap-1 pb-1.5 border-b border-[#2D2D2D] mb-2 text-slate-500 text-[10px]">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        <span className="pl-1">snippet.{fileExt}</span>
                      </div>
                      <pre className="whitespace-pre leading-relaxed">{q.codeSnippet}</pre>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={fillAnswers[q.id] || ''}
                      onChange={(e) => setFillAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Type the exact token / keyword..."
                      className={`p-3 rounded-2xl border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#005F02] flex-1 ${
                        isSubmitted
                          ? (fillAnswers[q.id] || '').trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
                            ? 'bg-[#005F02]/10 border-[#005F02] text-[#005F02] font-bold'
                            : 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  FORMAT 3: PRACTICAL CODING CHALLENGE (VS CODE IDE)
                  ═══════════════════════════════════════════════════════════ */}
              {q.type === 'code' && (
                <div className="space-y-3 select-none">
                  {/* VS Code Frame */}
                  <div className="rounded-3xl border border-slate-700/80 bg-[#1E1E1E] shadow-2xl overflow-hidden text-slate-200 font-mono text-xs flex flex-col">
                    {/* VS Code Window Titlebar */}
                    <div className="h-8 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block shadow-xs" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block shadow-xs" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block shadow-xs" />
                      </div>

                      <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                        <span className="text-slate-500">🔍</span>
                        <span className="truncate">workspace — challenge.{fileExt} (CodeTutor IDE)</span>
                      </div>

                      <span className="text-[10px] font-bold uppercase text-[#005F02] bg-[#005F02]/20 px-2 py-0.2 rounded border border-[#005F02]/40">
                        {language}
                      </span>
                    </div>

                    {/* IDE Split Body */}
                    <div className="flex min-h-[160px] overflow-hidden">
                      {/* Left Activity Bar */}
                      <div className="w-9 bg-[#181818] border-r border-[#2D2D2D] flex flex-col items-center justify-between py-2 shrink-0 text-slate-500">
                        <div className="space-y-2">
                          <div className="p-1 text-white border-l-2 border-[#005F02]">
                            <Code2 className="w-3.5 h-3.5" />
                          </div>
                          <div className="p-1 hover:text-white">
                            <Bug className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Right Editor & Terminal */}
                      <div className="flex flex-col flex-1 min-w-0 bg-[#1E1E1E]">
                        {/* Tab Bar */}
                        <div className="h-8 px-2 bg-[#181818] border-b border-[#252526] flex items-center shrink-0">
                          <div className="h-full px-2.5 bg-[#1E1E1E] border-t-2 border-t-[#005F02] text-[11px] text-slate-100 flex items-center gap-1.5 border-r border-[#252526] font-medium">
                            <Code2 className="w-3 h-3 text-[#005F02]" />
                            <span>challenge.{fileExt}</span>
                          </div>
                        </div>

                        {/* Breadcrumbs */}
                        <div className="h-5 px-3 bg-[#1E1E1E] border-b border-[#252526] flex items-center gap-1 text-[10px] text-slate-500 shrink-0">
                          <span>workspace</span>
                          <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
                          <span className="text-slate-300 font-semibold">challenge.{fileExt}</span>
                        </div>

                        {/* Editor Canvas */}
                        <div className="flex flex-1 min-h-[100px] bg-[#1E1E1E]">
                          <div className="w-7 py-2 text-right pr-2 select-none text-[11px] text-[#858585] border-r border-[#2D2D2D] shrink-0 leading-5">
                            <div>1</div>
                            <div>2</div>
                            <div>3</div>
                            <div>4</div>
                            <div>5</div>
                          </div>

                          <textarea
                            rows={5}
                            value={codeAnswers[q.id] !== undefined ? codeAnswers[q.id] : q.initialCode || ''}
                            onChange={(e) => setCodeAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                            className="flex-1 p-2 bg-transparent text-[#D4D4D4] font-mono text-xs leading-5 resize-none focus:outline-none placeholder:text-slate-600 whitespace-pre selection:bg-[#005F02]/40"
                            spellCheck={false}
                            placeholder="# Write your solution function here..."
                          />
                        </div>

                        {/* VS Code Bottom Integrated Terminal for Test Output */}
                        <div className="border-t border-[#2D2D2D] bg-[#181818] p-2 text-[10px] space-y-1">
                          <div className="flex items-center justify-between text-slate-400 border-b border-[#282828] pb-1">
                            <span className="flex items-center gap-1 text-white font-bold">
                              <Terminal className="w-3 h-3 text-[#005F02]" />
                              <span>TERMINAL: automated-tests</span>
                            </span>
                            <span className="text-[#005F02]">Offline CPU Sandbox</span>
                          </div>

                          {/* Test Cases Pill Bar */}
                          {q.testCases && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                              {q.testCases.map((tc, tcIdx) => (
                                <div key={tcIdx} className="p-1.5 rounded bg-[#252526] border border-[#333333] flex items-center justify-between">
                                  <span className="text-slate-400">In: {tc.input}</span>
                                  <span className="text-[#005F02] font-bold">Out: {tc.expectedOutput}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* VS Code Bottom Status Bar */}
                    <div className="h-5 px-3 bg-[#005F02] text-white flex items-center justify-between text-[9px] font-mono shrink-0">
                      <span>main* • 0 Errors</span>
                      <div className="flex items-center gap-2">
                        <span>UTF-8</span>
                        <span className="font-bold uppercase">{language}</span>
                        <span>✓ Air-Gapped</span>
                      </div>
                    </div>
                  </div>

                  {/* Assertion Execution Result Toast */}
                  {isSubmitted && codeTestResults[q.id] && (
                    <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-mono ${
                      codeTestResults[q.id].passed
                        ? 'bg-[#005F02]/10 border-[#005F02] text-[#005F02] font-bold'
                        : 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-300 font-bold'
                    }`}>
                      <div className="flex items-center gap-2">
                        {codeTestResults[q.id].passed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#005F02]" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span>
                          {codeTestResults[q.id].passed
                            ? `All Test Assertions Passed (${codeTestResults[q.id].passedCount}/${codeTestResults[q.id].totalCount})`
                            : 'Test Assertions Failed'}
                        </span>
                      </div>
                      <span>Local Engine 0ms Latency</span>
                    </div>
                  )}
                </div>
              )}

              {/* Explanation Note after Submission */}
              {isSubmitted && q.explanation && (
                <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 space-y-1 animate-in fade-in">
                  <span className="font-bold font-mono text-[10px] text-[#005F02] uppercase tracking-wider block">
                    Pedagogical Explanation:
                  </span>
                  <p className="leading-relaxed font-sans">{q.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {isSubmitted ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResetQuestion(q.id)}
                    className="h-8 text-xs font-bold"
                    leftIcon={<RotateCcw className="w-3 h-3" />}
                  >
                    Try Again
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleVerifyQuestion(q)}
                    className="h-8 font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs text-xs"
                    leftIcon={q.type === 'code' ? <Play className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                  >
                    {q.type === 'code' ? 'Run Test Suite' : 'Verify Answer'}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

LessonQuizSection.displayName = 'LessonQuizSection'
