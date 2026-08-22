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
  Bug,
  BookOpen,
  Gamepad2,
  ChevronRight,
  Cpu,
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
    <div className="flex flex-col h-full min-h-0 rounded-2xl border border-slate-700/90 bg-[#1e1e1e] overflow-hidden shadow-2xl w-full text-slate-200 select-none">
      {/* ═══════════════════════════════════════════════════════════════
          VS CODE WINDOW TITLEBAR (#1F1F1F)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="h-9 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-3 shrink-0">
        {/* Left: Window Traffic Light Dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block shadow-xs" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block shadow-xs" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block shadow-xs" />
        </div>

        {/* Center: Command Search Bar */}
        <div className="flex-1 max-w-sm mx-auto flex items-center justify-center">
          <div className="w-full h-6 px-3 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[11px] text-slate-400 flex items-center justify-center gap-2 truncate shadow-inner">
            <span className="text-slate-500">🔍</span>
            <span className="truncate text-slate-300">workspace — solution.{fileExtension} (CodeTutor IDE)</span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="h-6 px-2 text-[10px] font-mono text-slate-400 hover:text-slate-200 hover:bg-[#333333] rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-3 h-3 text-[#005F02]" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="h-6 px-2 text-[10px] font-mono text-slate-400 hover:text-slate-200 hover:bg-[#333333] rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset code"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Run Tests Button */}
          <Button
            size="sm"
            variant="secondary"
            onClick={onRun}
            isLoading={isRunning}
            className="h-6 text-[11px] font-bold bg-[#2d2d2d] hover:bg-[#3d3d3d] text-slate-100 border-[#444444] shadow-xs px-2 cursor-pointer"
            leftIcon={<Play className="w-2.5 h-2.5 text-[#005F02] fill-[#005F02]" />}
          >
            Run
          </Button>

          {/* Submit Solution Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={onSubmit}
            isLoading={isSubmitting}
            className="h-6 text-[11px] font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs px-2.5 cursor-pointer"
            leftIcon={<CheckCircle2 className="w-2.5 h-2.5" />}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN IDE SPLIT BODY (ACTIVITY BAR + EDITOR CANVAS)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Slim VS Code Activity Bar */}
        <div className="w-10 bg-[#181818] border-r border-[#2D2D2D] flex flex-col items-center justify-between py-2 shrink-0 text-slate-400 select-none">
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="relative p-1.5 text-white border-l-2 border-[#005F02] w-full flex justify-center cursor-pointer" title="Explorer">
              <BookOpen className="w-3.5 h-3.5 text-slate-200" />
            </div>
            <div className="p-1.5 hover:text-white cursor-pointer" title="Search">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <div className="p-1.5 hover:text-white cursor-pointer" title="Run & Debug">
              <Bug className="w-3.5 h-3.5" />
            </div>
            <div className="p-1.5 hover:text-white cursor-pointer" title="Arcade Drills">
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-1.5 text-slate-500 hover:text-slate-300 cursor-pointer">
            <Cpu className="w-3.5 h-3.5 text-[#005F02]" />
          </div>
        </div>

        {/* Right: Editor Area */}
        <div className="flex flex-col flex-1 min-w-0 bg-[#1E1E1E]">
          {/* Top File Tabs Bar */}
          <div className="h-9 px-2 bg-[#181818] border-b border-[#252526] flex items-center justify-between shrink-0">
            <div className="flex items-center h-full">
              <div className="h-full px-3 bg-[#1E1E1E] border-t-2 border-t-[#005F02] text-xs font-mono font-medium text-slate-100 flex items-center gap-2 border-r border-[#252526]">
                <Code2 className={`w-3.5 h-3.5 ${fileIconColor} shrink-0`} />
                <span className="font-semibold truncate">solution.{fileExtension}</span>
                <span className="text-[10px] text-slate-500 hover:text-white ml-1">×</span>
              </div>
            </div>

            {/* Test Results Badge */}
            {testStats && onOpenResults && (
              <button
                type="button"
                onClick={onOpenResults}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all border shadow-xs cursor-pointer ${
                  testStats.isPassedAll
                    ? 'bg-[#005F02]/20 text-[#005F02] border-[#005F02]/40'
                    : 'bg-[#3d1c1c] text-[#ff7b72] border-[#5d2b2b]'
                }`}
                title="View test results"
              >
                <Terminal className="w-2.5 h-2.5 shrink-0" />
                <span>{testStats.passed}/{testStats.total} Passed</span>
              </button>
            )}
          </div>

          {/* Breadcrumb Bar */}
          <div className="h-6 px-3 bg-[#1E1E1E] border-b border-[#252526] flex items-center gap-1.5 text-[11px] text-slate-500 font-mono shrink-0">
            <span>workspace</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span>src</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-300 font-semibold">solution.{fileExtension}</span>
          </div>

          {/* Code Canvas (Gutter + Textarea + Minimap) */}
          <div className="flex-1 min-h-0 flex overflow-hidden relative bg-[#1E1E1E]">
            {/* Line Numbers Gutter */}
            <div className="w-9 sm:w-11 py-3 bg-[#1E1E1E] border-r border-[#2d2d2d] text-right pr-2 sm:pr-2.5 select-none text-[12px] font-mono text-[#858585] leading-6 shrink-0 z-10">
              {Array.from({ length: Math.max(lineCount, 16) }).map((_, i) => (
                <div
                  key={i}
                  className={i + 1 === cursorPos.line ? 'text-[#c6c6c6] font-bold' : ''}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Canvas Layer */}
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

              {/* Interactive Transparent Textarea */}
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
                className="absolute inset-0 p-3 bg-transparent text-transparent caret-[#005F02] font-mono text-xs sm:text-[13px] leading-6 resize-none focus:outline-none selection:bg-[#005F02]/40 selection:text-transparent overflow-y-auto whitespace-pre z-20"
                style={{ tabSize: 4 }}
                placeholder="# Write your solution here..."
              />
            </div>

            {/* Simulated VS Code Minimap */}
            <div className="hidden md:block w-12 bg-[#181818]/60 border-l border-[#252526] p-1 opacity-40 select-none pointer-events-none shrink-0 overflow-hidden">
              <div className="space-y-0.5">
                {code.split('\n').map((_, mIdx) => (
                  <div
                    key={mIdx}
                    className="h-1 rounded bg-slate-500/50"
                    style={{ width: `${Math.max(20, ((mIdx * 37) % 75) + 20)}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          VS CODE BOTTOM STATUS BAR (#005F02 BRAND ACCENT)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="h-6 px-3 bg-[#005F02] text-white flex items-center justify-between text-[10px] font-mono shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
            <span>Ready (Offline)</span>
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
          <span className="bg-white/20 px-1.5 py-0.2 rounded text-white font-bold">0 KB CLOUD</span>
        </div>
      </div>
    </div>
  )
})

CodeEditorPlaceholder.displayName = 'CodeEditorPlaceholder'
