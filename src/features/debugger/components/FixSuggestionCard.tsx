import React, { useState, memo } from 'react'
import { DebugResult } from '@/types'
import { Card, CardHeader, CardTitle, CardContent, Button, MarkdownRenderer } from '@/components/ui'
import { Check, Copy, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react'
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
    <div className="h-full flex flex-col justify-between space-y-4">
      {/* Root Cause Analysis Card */}
      <Card className="border-rose-200 dark:border-rose-900/80 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Root Cause Diagnostics
              </CardTitle>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80">
              Bug Identified
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-3.5 pt-4">
          {/* Formatted Markdown Explanation */}
          <MarkdownRenderer content={result.explanationMarkdown} />

          {/* Key Concept Badges */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Related Core Concepts:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.conceptsInvolved.map((concept) => (
                <span
                  key={concept}
                  className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  #{concept}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Fix and Patch Panel with VS Code Colors */}
      <Card className="border-slate-700/80 bg-[#1e1e1e] overflow-hidden shadow-xl">
        <CardHeader className="p-3.5 bg-[#252526] border-b border-[#181818]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-100">
                Recommended Patch (VS Code Dark+)
              </CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#333333]"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-3 h-3 text-[#4ec9b0]" /> : <Copy className="w-3 h-3 text-slate-400" />}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                className="h-7 text-xs font-bold bg-[#007acc] hover:bg-[#0062a3] text-white shadow-xs"
                onClick={() => onApplyFix(result.fixedCode)}
                leftIcon={<CheckCircle2 className="w-3 h-3" />}
              >
                Apply Fix
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="p-4 bg-[#1e1e1e] font-mono text-xs sm:text-[13px] overflow-x-auto leading-6 selection:bg-[#264f78]/80 selection:text-white">
            <pre className="whitespace-pre">
              {renderVSCodeSyntax(result.fixedCode)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

FixSuggestionCard.displayName = 'FixSuggestionCard'
