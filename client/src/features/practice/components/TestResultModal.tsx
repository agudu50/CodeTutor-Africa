import React, { useState, useEffect, memo } from 'react'
import { TestCase } from '@/types'
import {
  CheckCircle2,
  XCircle,
  Clock,
  Bot,
  Copy,
  Check,
  X,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui'

interface TestResultModalProps {
  isOpen: boolean
  onClose: () => void
  testCases: TestCase[]
  isPassedAll?: boolean
  feedback?: string
  runtimeMs?: number
  onNextProblem?: () => void
}

export const TestResultModal: React.FC<TestResultModalProps> = memo(({
  isOpen,
  onClose,
  testCases,
  isPassedAll,
  feedback,
  runtimeMs = 38,
  onNextProblem,
}) => {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      const firstFail = testCases.findIndex((t) => !t.passed)
      setActiveCaseIdx(firstFail >= 0 ? firstFail : 0)
    }
  }, [isOpen, testCases])

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const passedCount = testCases.filter((t) => t.passed).length
  const totalCount = testCases.length
  const activeCase = testCases[activeCaseIdx] || testCases[0]

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        
        {/* ═══════════════════════════════════════════════════════════════
            FRIENDLY, HUMAN-CENTERED HEADER
            ═══════════════════════════════════════════════════════════════ */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-2xl shrink-0 shadow-xs ${
                isPassedAll
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80'
                  : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/80'
              }`}
            >
              {isPassedAll ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-0.5">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                {isPassedAll ? 'All Test Cases Passed! 🎉' : 'Some Tests Need Attention'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>{passedCount} of {totalCount} tests passed</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {runtimeMs}ms
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            MODAL BODY
            ═══════════════════════════════════════════════════════════════ */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* AI Tutor Friendly Note */}
          {feedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
              <Bot className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 flex-1">
                <span className="font-bold text-[#005F02] dark:text-emerald-400 block text-[11px]">
                  Tutor Note:
                </span>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  {feedback}
                </p>
              </div>
            </div>
          )}

          {/* Test Case Selection Tabs (Only show if multiple test cases) */}
          {testCases.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {testCases.map((tc, idx) => {
                const isActive = activeCaseIdx === idx
                return (
                  <button
                    key={tc.id}
                    type="button"
                    onClick={() => setActiveCaseIdx(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    <span>Test {idx + 1}</span>
                    <span className="text-[11px] font-bold">
                      {tc.passed ? '✓' : '✕'}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Active Test Case Card */}
          {activeCase && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-3">
              
              {/* Input Arguments */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>Input</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`in-${activeCase.id}`, activeCase.input)}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {copiedId === `in-${activeCase.id}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200">
                  {activeCase.input}
                </div>
              </div>

              {/* Expected Output */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>Expected Output</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Matches Solution ✓
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 font-mono text-xs font-bold text-[#005F02] dark:text-emerald-400">
                  {activeCase.expectedOutput}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            CLEAN FOOTER ACTIONS
            ═══════════════════════════════════════════════════════════════ */}
        <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="font-semibold text-xs h-9 px-4 cursor-pointer"
          >
            Back to Code
          </Button>

          {isPassedAll && onNextProblem && (
            <Button
              variant="primary"
              size="sm"
              onClick={onNextProblem}
              className="font-bold text-xs h-9 px-5 bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs cursor-pointer"
              rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}
            >
              Next Problem
            </Button>
          )}
        </div>
      </div>
    </div>
  )
})

TestResultModal.displayName = 'TestResultModal'
