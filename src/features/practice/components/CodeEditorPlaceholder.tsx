import React, { memo } from 'react'
import { ProgrammingLanguage } from '@/types'
import { Button, Badge } from '@/components/ui'
import { Play, RotateCcw, CheckCircle2, Terminal } from 'lucide-react'

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

export const CodeEditorPlaceholder: React.FC<CodeEditorProps> = memo(({
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

  // Handle Tab key for proper indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      onChange(newCode)
      // Set cursor position after the 4 spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4
      }, 0)
    }
  }

  const fileExtension = language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'java'

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-xs w-full">
      {/* Editor Header Bar */}
      <div className="h-11 sm:h-12 px-3 sm:px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 select-none gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="hidden sm:block h-4 w-px bg-slate-800 shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            <Badge variant="brand" size="sm" className="font-mono uppercase font-bold text-[9px] sm:text-[10px] bg-brand-950 text-brand-300 border-brand-800 shrink-0">
              {language}
            </Badge>
            <span className="text-xs text-slate-300 font-mono flex items-center gap-1 truncate">
              <Terminal className="w-3 h-3 text-brand-400 shrink-0" />
              <span className="truncate">solution.{fileExtension}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            className="h-7 sm:h-8 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2 sm:px-2.5 cursor-pointer"
            leftIcon={<RotateCcw className="w-3 h-3" />}
          >
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onRun}
            isLoading={isRunning}
            className="h-7 sm:h-8 text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700 shadow-xs px-2.5 cursor-pointer"
            leftIcon={<Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />}
          >
            <span className="hidden sm:inline">Run Tests</span>
            <span className="sm:hidden">Run</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={onSubmit}
            isLoading={isSubmitting}
            className="h-7 sm:h-8 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs px-2.5 cursor-pointer"
            leftIcon={<CheckCircle2 className="w-3 h-3" />}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Code Textarea with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative bg-slate-950 min-h-[220px]">
        {/* Line Numbers column */}
        <div className="w-10 sm:w-11 py-3 bg-slate-950 border-r border-slate-900 text-right pr-2.5 sm:pr-3 select-none text-[11px] font-mono text-slate-600 space-y-0 leading-6 shrink-0">
          {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Input Canvas */}
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-xs sm:text-[13px] leading-6 resize-none focus:outline-none selection:bg-brand-600/40 overflow-y-auto whitespace-pre tab-4"
          placeholder="# Type your solution here..."
        />
      </div>

      {/* Editor Footer */}
      <div className="h-7 sm:h-8 px-3 sm:px-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono shrink-0 select-none">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="hidden sm:inline">Offline Test Engine Ready</span>
          <span className="sm:hidden">Engine Ready</span>
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          <span>Spaces: 4</span>
          <span>•</span>
          <span className="text-slate-300 font-semibold">{lineCount} lines</span>
        </div>
      </div>
    </div>
  )
})

CodeEditorPlaceholder.displayName = 'CodeEditorPlaceholder'
