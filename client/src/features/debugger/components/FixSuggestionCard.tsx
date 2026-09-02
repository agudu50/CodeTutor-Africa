import React, { useState, memo } from 'react'
import { DebugResult } from '@/types'
import { MarkdownRenderer } from '@/components/ui'
import { Check, Copy, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react'
import { renderVSCodeSyntax } from '@/utils/syntaxHighlight'

interface FixSuggestionCardProps {
  result: DebugResult
  onApplyFix: (fixedCode: string) => void
}

export const FixSuggestionCard: React.FC<FixSuggestionCardProps> = memo(({
  result,
  onApplyFix,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.fixedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div className="h-full flex flex-col justify-between space-y-5">
      {/* Root Cause Analysis Card */}
      <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800 flex items-center justify-center shrink-0 shadow-3xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Root Cause Diagnostics
            </h3>
          </div>
          <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-800 shadow-3xs">
            Bug Identified
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Formatted Markdown Explanation */}
          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
            <MarkdownRenderer content={result.explanationMarkdown} />
          </div>

          {/* Key Concept Badges */}
          <div className="space-y-2 pt-3 border-t-2 border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-mono font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Related Core Concepts:
            </span>
            <div className="flex flex-wrap gap-2">
              {result.conceptsInvolved.map((concept) => (
                <span
                  key={concept}
                  className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-3xs"
                >
                  #{concept}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Fix and Patch Panel with VS Code Colors */}
      <div className="rounded-3xl border-2 border-slate-700/80 bg-[#1E1E1E] overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#252526] border-b-2 border-[#181818] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 font-mono">
              Recommended Patch (VS Code Dark+)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="h-9 px-3.5 rounded-xl font-bold text-xs bg-[#333333] hover:bg-[#444444] border-2 border-slate-600 text-white shadow-3xs cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#4ec9b0]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => onApplyFix(result.fixedCode)}
              className="h-9 px-4 rounded-xl font-black text-xs bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] text-white shadow-xs cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply Fix</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#1E1E1E] font-mono text-xs sm:text-[13px] overflow-x-auto leading-6 selection:bg-[#264f78]/80 selection:text-white">
          <pre className="whitespace-pre">
            {renderVSCodeSyntax(result.fixedCode)}
          </pre>
        </div>
      </div>
    </div>
  )
})

FixSuggestionCard.displayName = 'FixSuggestionCard'
