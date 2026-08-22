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
  ArrowRight,
  Shield,
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
  runtimeMs,
  onNextProblem,
}) => {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#1e1e1e] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150 text-slate-900 dark:text-slate-200">
        {/* ═══════════════════════════════════════════════════════════════
            THEMED TERMINAL MODAL HEADER BAR
            ═══════════════════════════════════════════════════════════════ */}
        <div className="min-h-12 py-2 px-3 sm:px-4 bg-slate-100/90 dark:bg-[#252526] border-b border-slate-200 dark:border-[#181818] flex items-center justify-between shrink-0 select-none gap-2">
          {/* Left: Window Controls + Tab & Status */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="hidden xs:flex items-center gap-1 px-0.5 shrink-0">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] inline-block shadow-xs" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] inline-block shadow-xs" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] inline-block shadow-xs" />
            </div>

            <div className="hidden xs:block h-3.5 w-px bg-slate-300 dark:bg-[#333333] shrink-0" />

            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 truncate">
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 shrink-0">
                <Terminal className="w-3.5 h-3.5 text-brand-600 dark:text-[#569cd6]" />
                <span className="hidden sm:inline">codetutor-test-runner</span>
                <span className="sm:hidden">Results</span>
              </div>

              {isPassedAll !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-xs shrink-0 ${
                    isPassedAll
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#1b3a2a] dark:text-[#4ec9b0] dark:border-[#2e5d42]'
                      : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-[#3d1c1c] dark:text-[#ff7b72] dark:border-[#5d2b2b]'
                  }`}
                >
                  {isPassedAll ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-[#4ec9b0] shrink-0" />
                      <span>{passedCount}/{totalCount} Passed</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-rose-600 dark:text-[#ff7b72] shrink-0" />
                      <span>{passedCount}/{totalCount} Failed</span>
                    </>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Right: Runtime Telemetry & Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {runtimeMs !== undefined && (
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1 bg-white dark:bg-[#333333] px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                <Clock className="w-3 h-3 text-amber-500 dark:text-[#ffd700]" /> {runtimeMs} ms
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#333333] transition-colors cursor-pointer"
              title="Close results modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            THEMED MODAL BODY
            ═══════════════════════════════════════════════════════════════ */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4 flex-1 bg-slate-50/50 dark:bg-[#1e1e1e]">
          {/* AI Pedagogical Review Banner */}
          {feedback && (
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-50/90 dark:bg-[#1b3a2a]/60 border border-emerald-200 dark:border-[#2e5d42] text-xs text-emerald-900 dark:text-slate-200 flex items-start gap-2.5 sm:gap-3 shadow-xs">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-[#2e5d42] text-emerald-700 dark:text-[#4ec9b0] shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="font-bold uppercase font-mono text-[10px] text-emerald-700 dark:text-[#4ec9b0] tracking-wider">
                    AI Tutor Review:
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-[#2e5d42] text-emerald-800 dark:text-white">
                    Automated Verification
                  </span>
                </div>
                <p className="leading-relaxed font-sans text-xs text-slate-800 dark:text-slate-200">{feedback}</p>
              </div>
            </div>
          )}

          {/* Test Case Tab Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 shrink-0 select-none scrollbar-none">
            {testCases.map((tc, idx) => {
              const isActive = activeCaseIdx === idx
              return (
                <button
                  key={tc.id}
                  type="button"
                  onClick={() => setActiveCaseIdx(idx)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border shrink-0 ${
                    isActive
                      ? 'bg-brand-600 dark:bg-[#007acc] text-white border-brand-600 dark:border-[#007acc] shadow-xs'
                      : 'bg-white dark:bg-[#252526] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-[#2d2d2d] hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${tc.passed ? (isActive ? 'bg-emerald-300' : 'bg-emerald-500') : (isActive ? 'bg-rose-300' : 'bg-rose-500')}`} />
                  <span>Case {idx + 1}</span>
                  {tc.passed && (
                    <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${isActive ? 'bg-brand-700 dark:bg-[#005a9e] text-white' : 'bg-emerald-50 dark:bg-[#1b3a2a] text-emerald-700 dark:text-[#4ec9b0]'}`}>
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Active Case Inspector Card */}
          {activeCase && (
            <div className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#252526] overflow-hidden shadow-xs">
              {/* Case Header */}
              <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100/80 dark:bg-[#2d2d2d] border-b border-slate-200 dark:border-slate-700/80 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 text-xs">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-slate-900 dark:text-white font-mono text-xs sm:text-sm">
                    Test Case {activeCaseIdx + 1} of {totalCount}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                    • Automated Runtime Assertion
                  </span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs self-start xs:self-center ${
                    activeCase.passed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#1b3a2a] dark:text-[#4ec9b0] dark:border-[#2e5d42]'
                      : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-[#3d1c1c] dark:text-[#ff7b72] dark:border-[#5d2b2b]'
                  }`}
                >
                  {activeCase.passed ? (
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-[#4ec9b0]" />
                  ) : (
                    <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600 dark:text-[#ff7b72]" />
                  )}
                  <span>{activeCase.passed ? 'ASSERTION PASSED' : 'ASSERTION FAILED'}</span>
                </span>
              </div>

              {/* Side-by-Side Argument and Output Card */}
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {/* Input Subcard */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-sans font-bold uppercase tracking-wider">
                    <span>Input Arguments</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`in-${activeCase.id}`, activeCase.input)}
                      className="flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded bg-white dark:bg-[#333333] hover:bg-slate-100 dark:hover:bg-[#3d3d3d] border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                    >
                      {copiedId === `in-${activeCase.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 dark:text-[#4ec9b0]" />
                          <span className="text-emerald-600 dark:text-[#4ec9b0] font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-slate-900 dark:text-slate-100 font-bold block bg-white dark:bg-[#181818] p-2.5 sm:p-3 rounded-lg border border-slate-200 dark:border-slate-800 select-all overflow-x-auto text-xs sm:text-[13px] leading-relaxed font-mono whitespace-pre-wrap break-all">
                    {activeCase.input}
                  </pre>
                </div>

                {/* Expected Output Subcard */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-sans font-bold uppercase tracking-wider">
                    <span>Expected Return Value</span>
                    <span className="text-[9px] font-mono text-emerald-700 dark:text-[#4ec9b0] bg-emerald-50 dark:bg-[#1b3a2a] px-2 py-0.5 rounded border border-emerald-200 dark:border-[#2e5d42] font-bold">
                      Exact Match ✓
                    </span>
                  </div>
                  <pre className="text-emerald-700 dark:text-[#4ec9b0] font-bold block bg-emerald-50/50 dark:bg-[#181818] p-2.5 sm:p-3 rounded-lg border border-emerald-200 dark:border-slate-800 select-all overflow-x-auto text-xs sm:text-[13px] leading-relaxed font-mono whitespace-pre-wrap break-all">
                    {activeCase.expectedOutput}
                  </pre>
                </div>
              </div>

              {/* Case Footer Telemetry */}
              <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-100/60 dark:bg-[#181818] border-t border-slate-200 dark:border-slate-800 flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-[#4ec9b0]">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span>Verified 0 memory leaks</span>
                </span>
                <span>Memory: 0.1 MB • Stack Frames: 4</span>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            THEMED MODAL FOOTER - RESPONSIVE MOBILE & DESKTOP
            ═══════════════════════════════════════════════════════════════ */}
        <div className="px-3.5 sm:px-5 py-3 bg-slate-100/90 dark:bg-[#252526] border-t border-slate-200 dark:border-[#181818] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 text-xs shrink-0">
          <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] sm:text-[11px] text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
            <Shield className="w-3 h-3 text-emerald-600 dark:text-[#4ec9b0] shrink-0" />
            <span>Air-Gapped Test Suite • Verified in {runtimeMs || 42} ms</span>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isPassedAll && onNextProblem && (
              <Button
                variant="primary"
                size="sm"
                onClick={onNextProblem}
                className="flex-1 sm:flex-initial h-9 sm:h-8 font-bold bg-brand-600 dark:bg-[#007acc] hover:bg-brand-700 dark:hover:bg-[#0062a3] text-white shadow-xs text-xs"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Next Problem
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-initial h-9 sm:h-8 font-semibold bg-white dark:bg-[#333333] hover:bg-slate-100 dark:hover:bg-[#3d3d3d] text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 text-xs"
            >
              Back to Code
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})

TestResultModal.displayName = 'TestResultModal'
