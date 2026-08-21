import React from 'react'
import { TestCase } from '@/types'
import { Badge } from '@/components/ui'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'

interface TestResultPanelProps {
  testCases: TestCase[]
  isPassedAll?: boolean
  feedback?: string
  runtimeMs?: number
}

export const TestResultPanel: React.FC<TestResultPanelProps> = ({
  testCases,
  isPassedAll,
  feedback,
  runtimeMs,
}) => {
  return (
    <div className="h-full flex flex-col p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Execution Results
          </span>
          {isPassedAll !== undefined && (
            <Badge variant={isPassedAll ? 'success' : 'error'} size="sm">
              {isPassedAll ? 'All Tests Passed' : 'Test Failures'}
            </Badge>
          )}
        </div>
        {runtimeMs !== undefined && (
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {runtimeMs} ms
          </span>
        )}
      </div>

      {/* AI Feedback Banner */}
      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">AI Feedback:</span>
            <p className="mt-0.5 leading-relaxed">{feedback}</p>
          </div>
        </div>
      )}

      {/* Test Cases List */}
      <div className="space-y-3">
        {testCases.map((tc, idx) => (
          <div
            key={tc.id}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Case {idx + 1}
              </span>
              {tc.passed !== undefined && (
                <span
                  className={`flex items-center gap-1 font-mono text-[11px] font-bold ${
                    tc.passed ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  {tc.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {tc.passed ? 'PASSED' : 'FAILED'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Input</span>
                <span className="text-slate-800 dark:text-slate-200">{tc.input}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Expected</span>
                <span className="text-slate-800 dark:text-slate-200">{tc.expectedOutput}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
