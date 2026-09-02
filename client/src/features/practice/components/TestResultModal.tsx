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
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        
        {/* ═══════════════════════════════════════════════════════════════
            FRIENDLY, HUMAN-CENTERED HEADER
            ═══════════════════════════════════════════════════════════════ */}
        <div className="p-5 sm:p-6 pb-4 border-b-2 border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50 dark:bg-[#161B22]">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-2xl shrink-0 shadow-3xs border-2 ${
                isPassedAll
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-400 border-rose-300 dark:border-rose-800'
              }`}
            >
              {isPassedAll ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                {isPassedAll ? 'All Test Cases Passed!' : 'Some Tests Need Attention'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 font-medium">
                <span>{passedCount} of {totalCount} tests passed</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {runtimeMs}ms
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-300"
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
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 flex items-start gap-3 text-xs text-slate-900 dark:text-slate-100 shadow-3xs">
              <Bot className="w-5 h-5 text-[#005F02] dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 flex-1">
                <span className="font-black text-[#005F02] dark:text-emerald-400 block text-xs uppercase font-mono">
                  Tutor Note:
                </span>
                <p className="leading-relaxed text-slate-800 dark:text-slate-200 font-normal">
                  {feedback}
                </p>
              </div>
            </div>
          )}

          {/* Test Case Selection Tabs (Only show if multiple test cases) */}
          {testCases.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {testCases.map((tc, idx) => {
                const isActive = activeCaseIdx === idx
                return (
                  <button
                    key={tc.id}
                    type="button"
                    onClick={() => setActiveCaseIdx(idx)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 shadow-3xs active:scale-95 ${
                      isActive
                        ? 'bg-[#005F02] text-white border-[#005F02]'
                        : 'bg-white dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
                    }`}
                  >
                    <span>Test {idx + 1}</span>
                    <span className="font-bold">
                      {tc.passed ? '✓' : '✕'}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Active Test Case Card */}
          {activeCase && (
            <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] p-4 space-y-3 shadow-3xs">
              
              {/* Input Arguments */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Input</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`in-${activeCase.id}`, activeCase.input)}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {copiedId === `in-${activeCase.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[#005F02] dark:text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#0E1318] border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-100 shadow-3xs">
                  {activeCase.input}
                </div>
              </div>

              {/* Expected Output */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Expected Output</span>
                  <span className="text-xs font-bold text-[#005F02] dark:text-emerald-400">
                    Matches Solution ✓
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#0E1318] border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold text-[#005F02] dark:text-emerald-400 shadow-3xs">
                  {activeCase.expectedOutput}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            CLEAN FOOTER ACTIONS
            ═══════════════════════════════════════════════════════════════ */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#161B22] border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="font-bold text-xs h-10 px-4 cursor-pointer border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] hover:border-[#005F02] rounded-xl shadow-3xs active:scale-95"
          >
            Back to Code
          </Button>

          {isPassedAll && onNextProblem && (
            <Button
              variant="primary"
              size="sm"
              onClick={onNextProblem}
              className="font-black text-xs h-10 px-5 bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] text-white shadow-xs cursor-pointer rounded-xl active:scale-95"
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
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
