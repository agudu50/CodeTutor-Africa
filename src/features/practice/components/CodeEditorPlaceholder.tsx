import React from 'react'
import { ProgrammingLanguage } from '@/types'
import { Button, Badge } from '@/components/ui'
import { Play, RotateCcw, CheckCircle, Sparkles } from 'lucide-react'

interface CodeEditorProps {
  code: string
  onChange: (newCode: string) => void
  language: ProgrammingLanguage
  onRun: () => void
  onSubmit: () => void
  onReset: () => void
  isRunning?: boolean
  isSubmitting?: boolean
}

export const CodeEditorPlaceholder: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false,
}) => {
  const lineCount = code.split('\n').length

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-lg">
      {/* Editor Header Bar */}
      <div className="h-11 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm" className="font-mono uppercase text-[10px]">
            {language}
          </Badge>
          <span className="text-xs text-slate-400 font-mono">solution.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'java'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            className="h-7 text-xs text-slate-400 hover:text-slate-200"
            leftIcon={<RotateCcw className="w-3 h-3" />}
          >
            Reset
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onRun}
            isLoading={isRunning}
            className="h-7 text-xs"
            leftIcon={<Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />}
          >
            Run Tests
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={onSubmit}
            isLoading={isSubmitting}
            className="h-7 text-xs"
            leftIcon={<CheckCircle className="w-3 h-3" />}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Code Textarea with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative bg-slate-950">
        {/* Line Numbers column */}
        <div className="w-10 py-3 bg-slate-950/80 border-r border-slate-800/80 text-right pr-2 select-none text-[11px] font-mono text-slate-600 space-y-0 leading-5">
          {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Input Canvas */}
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-xs leading-5 resize-none focus:outline-none selection:bg-brand-500/30 overflow-y-auto whitespace-pre tab-4"
          placeholder="# Type your solution here..."
        />
      </div>

      {/* Editor Footer */}
      <div className="h-7 px-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono shrink-0">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Sparkles className="w-3 h-3" /> Offline Engine Ready (Mock)
        </span>
        <span>Spaces: 4 • UTF-8</span>
      </div>
    </div>
  )
}
