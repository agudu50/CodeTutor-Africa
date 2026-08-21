import React, { memo } from 'react'
import { TestCase } from '@/types'
import { CheckCircle2, XCircle, Clock, Terminal } from 'lucide-react'

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

  return (
    <div className="h-full flex flex-col p-3.5 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto space-y-3.5 shadow-xs w-full">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-600 dark:text-brand-400" />
            <span>Execution Results</span>
          </div>

          {isPassedAll !== undefined && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isPassedAll
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80'
                  : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80'
              }`}
            >
              {isPassedAll ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>All Tests Passed ({passedCount}/{totalCount})</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 text-rose-500" />
                  <span>Tests Failed ({passedCount}/{totalCount})</span>
                </>
              )}
            </span>
          )}
        </div>

        {runtimeMs !== undefined && (
          <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            <Clock className="w-3 h-3 text-amber-500" /> {runtimeMs} ms
          </span>
        )}
      </div>

      {/* AI Pedagogical Feedback Banner */}
      {feedback && (
        <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5 shrink-0 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1 min-w-0">
            <span className="font-bold block uppercase font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
              AI Tutor Feedback:
            </span>
            <p className="leading-relaxed font-sans">{feedback}</p>
          </div>
        </div>
      )}

      {/* Test Cases List */}
      <div className="space-y-2.5 flex-1 w-full">
        {testCases.map((tc, idx) => (
          <div
            key={tc.id}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2 shadow-2xs w-full"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                Test Case {idx + 1}
              </span>
              {tc.passed !== undefined && (
                <span
                  className={`flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded border ${
                    tc.passed
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                  }`}
                >
                  {tc.passed ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-500" />}
                  <span>{tc.passed ? 'PASSED' : 'FAILED'}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-sans font-bold">
                  Input:
                </span>
                <span className="text-slate-800 dark:text-slate-200 break-all select-all font-semibold block">
                  {tc.input}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-sans font-bold">
                  Expected Output:
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 break-all select-all font-semibold block">
                  {tc.expectedOutput}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

TestResultPanel.displayName = 'TestResultPanel'
