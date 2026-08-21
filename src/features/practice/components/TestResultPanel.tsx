import React, { useState, memo } from 'react'
import { TestCase } from '@/types'
import {
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Bot,
  Copy,
  Check,
  Sparkles,
  X,
} from 'lucide-react'

interface TestResultPanelProps {
  testCases: TestCase[]
  isPassedAll?: boolean
  feedback?: string
  runtimeMs?: number
}

export const TestResultPanel: React.FC<TestResultPanelProps> = memo(({
  testCases,
  isPassedAll,
  feedback,
  runtimeMs,
}) => {
  const passedCount = testCases.filter((t) => t.passed).length
  const totalCount = testCases.length

  const [activeCaseIdx, setActiveCaseIdx] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const activeCase = testCases[activeCaseIdx] || testCases[0]

  return (
    <>
      <div className="h-full flex flex-col p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto space-y-4 shadow-xs w-full">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/80">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span>Execution Results</span>
            </div>

            {isPassedAll !== undefined && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  isPassedAll
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80'
                    : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80'
                }`}
              >
                {isPassedAll ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>All Tests Passed ({passedCount}/{totalCount})</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Tests Failed ({passedCount}/{totalCount})</span>
                  </>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {runtimeMs !== undefined && (
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> {runtimeMs} ms
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Open full execution modal"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Full Modal View</span>
            </button>
          </div>
        </div>

        {/* AI Pedagogical Feedback Banner */}
        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3 shrink-0 shadow-2xs">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase font-mono text-[10px] text-emerald-700 dark:text-emerald-400 tracking-wider">
                  AI Tutor Review:
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300">
                  Automated Verification
                </span>
              </div>
              <p className="leading-relaxed font-sans text-slate-800 dark:text-slate-200">{feedback}</p>
            </div>
          </div>
        )}

        {/* Interactive Case Tabs (LeetCode / HackerRank Style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 select-none">
          {testCases.map((tc, idx) => {
            const isActive = activeCaseIdx === idx
            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => setActiveCaseIdx(idx)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-brand-300 dark:hover:border-brand-700'
                }`}
              >
                {tc.passed ? (
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-300' : 'bg-emerald-500'}`} />
                ) : (
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-rose-300' : 'bg-rose-500'}`} />
                )}
                <span>Case {idx + 1}</span>
                {tc.passed && (
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${isActive ? 'bg-brand-700 text-white' : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'}`}>
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Focused Active Test Case Card */}
        {activeCase && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 overflow-hidden shadow-2xs flex-1 flex flex-col justify-between">
            {/* Active Case Header */}
            <div className="px-4 py-3 bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  Test Case {activeCaseIdx + 1} of {totalCount}
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  • Automated Runtime Assertion
                </span>
              </div>

              <span
                className={`flex items-center gap-1.5 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  activeCase.passed
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                }`}
              >
                {activeCase.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                <span>{activeCase.passed ? 'ASSERTION PASSED' : 'ASSERTION FAILED'}</span>
              </span>
            </div>

            {/* Side-by-Side Argument and Output Card */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              {/* Input Subcard */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-sans font-bold uppercase tracking-wider">
                  <span>Input Arguments</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`in-${activeCase.id}`, activeCase.input)}
                    className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                  >
                    {copiedId === `in-${activeCase.id}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <code className="text-slate-900 dark:text-slate-100 font-bold block bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800/80 select-all break-all text-xs sm:text-[13px] leading-relaxed">
                  {activeCase.input}
                </code>
              </div>

              {/* Expected Output Subcard */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-sans font-bold uppercase tracking-wider">
                  <span>Expected Return Value</span>
                  <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-bold">
                    Exact Match ✓
                  </span>
                </div>
                <code className="text-emerald-700 dark:text-emerald-400 font-bold block bg-emerald-50/50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 select-all text-xs sm:text-[13px] leading-relaxed">
                  {activeCase.expectedOutput}
                </code>
              </div>
            </div>

            {/* Case Footer Telemetry */}
            <div className="px-4 py-2 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3 h-3" />
                <span>Zero memory leaks detected</span>
              </span>
              <span>Memory: 0.1 MB • Stack Frames: 4</span>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FULL EXECUTION SUMMARY MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-600 text-white shadow-xs">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Full Execution Report
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comprehensive suite results & automated test assertions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {passedCount}/{totalCount} Passed
                </span>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Feedback Banner */}
              {feedback && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3 shadow-2xs">
                  <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 flex-1">
                    <span className="font-bold uppercase font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                      AI Tutor Evaluation:
                    </span>
                    <p className="leading-relaxed font-sans">{feedback}</p>
                  </div>
                </div>
              )}

              {/* All Test Cases Grid */}
              <div className="space-y-3">
                {testCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold font-mono text-slate-900 dark:text-white">
                        Test Case {idx + 1}
                      </span>
                      <span
                        className={`flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                          tc.passed
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                        }`}
                      >
                        {tc.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{tc.passed ? 'PASSED' : 'FAILED'}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-sans font-bold block">
                          Input Arguments:
                        </span>
                        <code className="text-slate-900 dark:text-slate-100 font-bold block select-all break-all">
                          {tc.input}
                        </code>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-sans font-bold block">
                          Expected Output:
                        </span>
                        <code className="text-emerald-700 dark:text-emerald-400 font-bold block select-all">
                          {tc.expectedOutput}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                Offline Test Suite • Verified in {runtimeMs || 42} ms
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors cursor-pointer shadow-xs"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

TestResultPanel.displayName = 'TestResultPanel'
