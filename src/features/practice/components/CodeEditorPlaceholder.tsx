import React, { useState, useRef, useEffect, memo } from 'react'
import { ProgrammingLanguage } from '@/types'
import { Button } from '@/components/ui'
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Code2,
  Check,
  Copy,
  Terminal,
} from 'lucide-react'
import { renderVSCodeSyntax } from '@/utils/syntaxHighlight'

interface CodeEditorProps {
  code: string
  onChange: (newCode: string) => void
  language: ProgrammingLanguage
  onRun: () => void
  onSubmit: () => void
  onReset: () => void
  onOpenResults?: () => void
  testStats?: { passed: number; total: number; isPassedAll: boolean }
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
  onOpenResults,
  testStats,
  isRunning = false,
  isSubmitting = false,
}) => {
  const lineCount = code.split('\n').length
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 })
  const [copied, setCopied] = useState(false)

  // Keep background syntax highlighted layer scrolled in lockstep with textarea
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop
      preRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  // Update cursor position Ln X, Col Y for the status bar
  const updateCursorPosition = () => {
    if (!textareaRef.current) return
    const selStart = textareaRef.current.selectionStart
    const textBefore = code.substring(0, selStart)
    const lines = textBefore.split('\n')
    setCursorPos({
      line: lines.length,
      col: (lines[lines.length - 1]?.length || 0) + 1,
    })
  }

  // Handle Tab key for 4 spaces indentation and Ctrl+Enter to Run
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      onChange(newCode)
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4
        updateCursorPosition()
      }, 0)
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onRun()
    }
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    handleScroll()
  }, [code])

  const fileExtension = language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'java'
  const langLabel = language === 'python' ? 'Python 3.12' : language === 'javascript' ? 'JavaScript' : 'Java 21'
  const fileIconColor = language === 'python' ? 'text-[#4ec9b0]' : language === 'javascript' ? 'text-[#ffd700]' : 'text-[#e06c75]'

  return (
    <div className="flex flex-col h-full min-h-0 rounded-2xl border border-slate-700/90 bg-[#1e1e1e] overflow-hidden shadow-2xl w-full text-slate-200">
      {/* ═══════════════════════════════════════════════════════════════
          RESPONSIVE VS CODE TOP TAB & TOOLBAR (#252526)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="h-11 px-2.5 bg-[#252526] border-b border-[#181818] flex items-center justify-between shrink-0 select-none gap-1.5 sm:gap-2">
        {/* Left: Window Dots + Active Tab */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 h-full">
          {/* macOS Traffic Dots */}
          <div className="hidden sm:flex items-center gap-1 px-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-xs" />
          </div>

          {/* Active Tab */}
          <div className="h-full flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 bg-[#1e1e1e] border-t-2 border-[#007acc] text-xs font-mono font-medium text-slate-100 shrink-0">
            <Code2 className={`w-3.5 h-3.5 ${fileIconColor} shrink-0`} />
            <span className="font-semibold truncate">solution.{fileExtension}</span>
          </div>

          {/* Quick Results Trigger Pill */}
          {testStats && onOpenResults && (
            <button
              type="button"
              onClick={onOpenResults}
              className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all border shadow-xs cursor-pointer truncate ${
                testStats.isPassedAll
                  ? 'bg-[#1b3a2a] text-[#4ec9b0] border-[#2e5d42] hover:bg-[#234b36]'
                  : 'bg-[#3d1c1c] text-[#ff7b72] border-[#5d2b2b] hover:bg-[#4d2323]'
              }`}
              title="View test assertion modal"
            >
              <Terminal className="w-3 h-3 shrink-0" />
              <span>{testStats.passed}/{testStats.total}</span>
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            className="h-7 px-1.5 sm:px-2 text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-[#333333] rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-3 h-3 text-[#4ec9b0]" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            className="h-7 px-1.5 sm:px-2 text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-[#333333] rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset code"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Run Tests */}
          <Button
            size="sm"
            variant="secondary"
            onClick={onRun}
            isLoading={isRunning}
            className="h-7 sm:h-7.5 text-xs font-bold bg-[#2d2d2d] hover:bg-[#3d3d3d] text-slate-100 border-[#444444] shadow-xs px-2 sm:px-2.5 cursor-pointer"
            leftIcon={<Play className="w-3 h-3 text-[#4ec9b0] fill-[#4ec9b0]" />}
          >
            <span className="hidden sm:inline">Run Tests</span>
            <span className="sm:hidden">Run</span>
          </Button>

          {/* Submit */}
          <Button
            size="sm"
            variant="primary"
            onClick={onSubmit}
            isLoading={isSubmitting}
            className="h-7 sm:h-7.5 text-xs font-bold bg-[#007acc] hover:bg-[#0062a3] text-white shadow-xs px-2.5 sm:px-3 cursor-pointer"
            leftIcon={<CheckCircle2 className="w-3 h-3" />}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          VS CODE CANVAS WITH LIVE SYNTAX HIGHLIGHTING (#1e1e1e)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative bg-[#1e1e1e]">
        {/* Line Numbers column (#858585) */}
        <div className="w-9 sm:w-11 py-3 bg-[#1e1e1e] border-r border-[#2d2d2d] text-right pr-2 sm:pr-2.5 select-none text-[12px] font-mono text-[#858585] leading-6 shrink-0 z-10">
          {Array.from({ length: Math.max(lineCount, 16) }).map((_, i) => (
            <div
              key={i}
              className={i + 1 === cursorPos.line ? 'text-[#c6c6c6] font-bold' : ''}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Canvas (Layered Editor) */}
        <div className="relative flex-1 min-h-0 h-full overflow-hidden">
          {/* Background Syntax Highlighted Layer */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 p-3 m-0 bg-transparent font-mono text-xs sm:text-[13px] leading-6 pointer-events-none overflow-hidden whitespace-pre select-none"
            style={{ tabSize: 4 }}
          >
            {renderVSCodeSyntax(code)}
          </pre>

          {/* Interactive Transparent Textarea with VS Code Selection */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              onChange(e.target.value)
              updateCursorPosition()
            }}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 p-3 bg-transparent text-transparent caret-[#569cd6] font-mono text-xs sm:text-[13px] leading-6 resize-none focus:outline-none selection:bg-[#264f78]/80 selection:text-transparent overflow-y-auto whitespace-pre z-20"
            style={{ tabSize: 4 }}
            placeholder="# Write your solution here..."
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          VS CODE BOTTOM STATUS BAR (#007acc)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="h-6 px-3 bg-[#007acc] text-white flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
            <span>Ready</span>
          </span>
          <span className="hidden sm:inline text-white/80">•</span>
          <span className="hidden sm:inline text-white/90 font-medium">{langLabel}</span>
        </div>

        <div className="flex items-center gap-2.5 text-white/90">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span className="hidden sm:inline text-white/80">•</span>
          <span className="hidden sm:inline">Spaces: 4</span>
          <span className="hidden sm:inline text-white/80">•</span>
          <span className="hidden sm:inline">UTF-8</span>
        </div>
      </div>
    </div>
  )
})

CodeEditorPlaceholder.displayName = 'CodeEditorPlaceholder'
