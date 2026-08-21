import React, { useState } from 'react'
import { DebugResult } from '@/types'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui'
import { Check, Copy, AlertTriangle, Sparkles } from 'lucide-react'

interface FixSuggestionCardProps {
  result: DebugResult
  onApplyFix: (fixedCode: string) => void
}

export const FixSuggestionCard: React.FC<FixSuggestionCardProps> = ({
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
    <div className="space-y-4">
      {/* Root Cause Analysis Banner */}
      <Card className="border-red-500/20 bg-red-500/5 dark:bg-red-950/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <CardTitle className="text-sm text-red-700 dark:text-red-300">
              Root Cause Diagnostics
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
            {result.explanationMarkdown}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {result.conceptsInvolved.map((concept) => (
              <Badge key={concept} variant="accent" size="sm">
                {concept}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Fix and Diff Panel */}
      <Card className="border-emerald-500/30 bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="pb-2 bg-emerald-500/5 dark:bg-emerald-950/20 border-b border-emerald-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">
                Recommended Patch
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onApplyFix(result.fixedCode)}
              >
                Apply Fix
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-5">
            {result.fixedCode}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
