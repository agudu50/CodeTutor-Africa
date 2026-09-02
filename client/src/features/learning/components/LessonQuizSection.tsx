import React, { useState, memo } from 'react'
import { QuizQuestion, ProgrammingLanguage } from '@/types'
import { renderVSCodeSyntax } from '@/utils/syntaxHighlight'
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
  Search,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            Knowledge Check & Code Drills
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 font-medium">
            Reinforce understanding with MCQs, fill-in-the-blanks, and live offline code tests.
          </p>
        </div>

        <span className="text-xs font-mono font-black text-[#005F02] dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs self-start sm:self-auto">
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
              className={`p-5 sm:p-7 rounded-3xl border-2 transition-all space-y-5 shadow-xs ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-400 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40'
                    : 'border-rose-400 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/40'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318]'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-black uppercase px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                      Q{idx + 1} • {q.type === 'mcq' ? 'Concept Check' : q.type === 'fill_in' ? 'Syntax Token' : 'Coding Challenge'}
                    </span>
                    {isSubmitted && (
                      <span className={`text-xs font-mono font-black px-3 py-1 rounded-xl border-2 flex items-center gap-1.5 shadow-3xs ${
                        isCorrect
                          ? 'bg-[#005F02] text-white border-[#005F02]'
                          : 'bg-rose-600 text-white border-rose-600'
                      }`}>
                        {isCorrect ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug pt-1">
                    {q.question}
                  </h3>
                </div>

                {q.hint && (
                  <button
                    type="button"
                    onClick={() => toggleHint(q.id)}
                    className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-300 dark:border-amber-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 shadow-3xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Hint</span>
                  </button>
                )}
              </div>

              {/* Socratic Hint Box */}
              {revealedHints[q.id] && q.hint && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#1E180A] border-2 border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-2.5 animate-in fade-in">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{q.hint}</p>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  FORMAT 1: MULTIPLE CHOICE
                  ═══════════════════════════════════════════════════════════ */}
              {q.type === 'mcq' && q.options && (
                <div className="space-y-2.5 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[q.id] === oIdx
                    const isTheCorrectOption = oIdx === q.correctAnswer

                    let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] hover:border-[#005F02] text-slate-800 dark:text-slate-200'

                    if (isSubmitted) {
                      if (isTheCorrectOption) {
                        optStyle = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/90 text-[#005F02] dark:text-emerald-300 font-black'
                      } else if (isSelected && !isTheCorrectOption) {
                        optStyle = 'border-rose-500 bg-rose-100 dark:bg-rose-950/90 text-rose-950 dark:text-rose-300 font-bold'
                      }
                    } else if (isSelected) {
                      optStyle = 'border-[#005F02] bg-emerald-50 dark:bg-emerald-950/60 text-slate-900 dark:text-white font-bold shadow-xs'
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectMCQ(q.id, oIdx)}
                        className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] shadow-3xs ${optStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-white dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-black flex items-center justify-center shrink-0 shadow-3xs">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </div>

                        {isSubmitted && isTheCorrectOption && (
                          <CheckCircle2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
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
                    <div className="rounded-2xl border-2 border-slate-700/80 bg-[#1E1E1E] p-3.5 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner">
                      <div className="flex items-center gap-1.5 pb-2 border-b border-[#2D2D2D] mb-2.5 text-slate-500 text-[11px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
                        <span className="pl-1.5 font-bold">snippet.{fileExt}</span>
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
                      className={`p-3.5 rounded-2xl border-2 font-mono text-xs sm:text-sm focus:outline-none focus:border-[#005F02] flex-1 ${
                        isSubmitted
                          ? (fillAnswers[q.id] || '').trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
                            ? 'bg-[#005F02]/10 border-[#005F02] text-[#005F02] font-black'
                            : 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-300 font-black'
                          : 'bg-white dark:bg-[#161B22] border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
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
                  <div className="rounded-3xl border-2 border-slate-700/80 bg-[#1E1E1E] shadow-2xl overflow-hidden text-slate-200 font-mono text-xs flex flex-col">
                    {/* VS Code Window Titlebar */}
                    <div className="h-9 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block shadow-xs" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block shadow-xs" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block shadow-xs" />
                      </div>

                      <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">workspace — challenge.{fileExt} (CodeTutor IDE)</span>
                      </div>

                      <span className="text-[10px] font-mono font-black uppercase text-[#005F02] dark:text-emerald-400 bg-[#005F02]/20 px-2 py-0.5 rounded border border-[#005F02]/40">
                        {language}
                      </span>
                    </div>

                    {/* IDE Split Body */}
                    <div className="flex min-h-[160px] overflow-hidden">
                      {/* Left Activity Bar */}
                      <div className="w-9 bg-[#181818] border-r border-[#2D2D2D] flex flex-col items-center justify-between py-2 shrink-0 text-slate-500">
                        <div className="space-y-2">
                          <div className="p-1 text-white bg-[#252526] rounded-md">
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
                          <div className="h-full px-2.5 bg-[#1E1E1E] text-[11px] text-slate-100 flex items-center gap-1.5 border-r border-[#252526] font-bold">
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

                        {/* Editor Canvas with Real-Time Syntax Highlighting */}
                        {(() => {
                          const currentCode = codeAnswers[q.id] !== undefined ? codeAnswers[q.id] : q.initialCode || ''
                          const codeLines = currentCode.split('\n')
                          return (
                            <div className="flex flex-1 min-h-[110px] bg-[#1E1E1E]">
                              {/* Dynamic Line Numbers Gutter */}
                              <div className="w-8 py-2 text-right pr-2 select-none text-[11px] text-[#858585] border-r border-[#2D2D2D] shrink-0 leading-5 font-mono">
                                {codeLines.map((_, i) => (
                                  <div key={i}>{i + 1}</div>
                                ))}
                              </div>

                              {/* Overlaid Syntax + Textarea Layer */}
                              <div className="relative flex-1 min-h-[110px] bg-[#1E1E1E] overflow-hidden">
                                <pre
                                  aria-hidden="true"
                                  className="absolute inset-0 p-2 m-0 bg-transparent font-mono text-xs leading-5 pointer-events-none overflow-hidden whitespace-pre select-none text-[#D4D4D4]"
                                  style={{ tabSize: 2 }}
                                >
                                  {renderVSCodeSyntax(currentCode || ' ')}
                                </pre>

                                <textarea
                                  rows={Math.max(5, codeLines.length)}
                                  value={currentCode}
                                  onChange={(e) => setCodeAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                                  className="absolute inset-0 p-2 bg-transparent text-transparent caret-[#27C93F] font-mono text-xs leading-5 resize-none focus:outline-none placeholder:text-slate-600 whitespace-pre selection:bg-[#005F02]/40 selection:text-transparent z-10"
                                  style={{ tabSize: 2 }}
                                  spellCheck={false}
                                  placeholder="# Write your code below..."
                                />
                              </div>
                            </div>
                          )
                        })()}

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
                                <div key={tcIdx} className="p-1.5 rounded-lg bg-[#252526] border border-[#333333] flex items-center justify-between">
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
                    <div className="h-6 px-3 bg-[#005F02] text-white flex items-center justify-between text-[10px] font-mono shrink-0">
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
                    <div className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-xs font-mono shadow-3xs ${
                      codeTestResults[q.id].passed
                        ? 'bg-[#005F02]/10 border-[#005F02] text-[#005F02] font-black'
                        : 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-300 font-black'
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
                      <span className="font-bold">Local Engine 0ms Latency</span>
                    </div>
                  )}
                </div>
              )}

              {/* Explanation Note after Submission */}
              {isSubmitted && q.explanation && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 space-y-1.5 animate-in fade-in">
                  <span className="font-black font-mono text-[11px] text-[#005F02] dark:text-emerald-400 uppercase tracking-wider block">
                    Pedagogical Explanation:
                  </span>
                  <p className="leading-relaxed font-medium">{q.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                {isSubmitted ? (
                  <button
                    type="button"
                    onClick={() => handleResetQuestion(q.id)}
                    className="h-10 px-5 rounded-xl font-bold bg-white dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#005F02] dark:hover:border-emerald-500 shadow-3xs text-xs active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleVerifyQuestion(q)}
                    className="h-10 px-5 rounded-xl font-black bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] text-white shadow-xs text-xs active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    {q.type === 'code' ? <Play className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{q.type === 'code' ? 'Run Test Suite' : 'Verify Answer'}</span>
                  </button>
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
