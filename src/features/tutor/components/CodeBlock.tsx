import React, { useState, memo } from 'react'
import { Copy, Check, Terminal } from 'lucide-react'
import { ProgrammingLanguage } from '@/types'

interface CodeBlockProps {
  code: string
  language?: ProgrammingLanguage | string
  caption?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = memo(({ code, language = 'text', caption }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  // Check if code contains comparison markers (e.g. DANGEROUS / SAFE)
  const isComparison = code.includes('DANGEROUS') || code.includes('SAFE')

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden my-3 shadow-xs max-w-full">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs select-none gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="hidden sm:block h-3 w-px bg-slate-800 shrink-0" />
          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[10px] sm:text-[11px] font-semibold uppercase shrink-0">
            <Terminal className="w-3 h-3 text-brand-400" />
            <span>{language}</span>
          </div>
          {isComparison && (
            <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 truncate">
              Comparison
            </span>
          )}
          {caption && (
            <span className="text-slate-400 text-[11px] hidden md:inline font-mono truncate">
              • {caption}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 transition-colors py-1 px-2 rounded-md shrink-0 cursor-pointer"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-100 selection:bg-brand-600/40">
        <pre className="whitespace-pre">
          {renderHighlightedCode(code)}
        </pre>
      </div>
    </div>
  )
})

CodeBlock.displayName = 'CodeBlock'

function renderHighlightedCode(code: string): React.ReactNode {
  const lines = code.split('\n')

  return lines.map((line, idx) => {
    const isDangerous = line.includes('❌') || line.includes('DANGEROUS')
    const isSafe = line.includes('✅') || line.includes('SAFE')

    let lineClass = 'text-slate-200'
    if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
      if (isDangerous) {
        lineClass = 'text-rose-400 font-bold bg-rose-950/40 px-1 py-0.5 rounded'
      } else if (isSafe) {
        lineClass = 'text-emerald-400 font-bold bg-emerald-950/40 px-1 py-0.5 rounded'
      } else {
        lineClass = 'text-slate-400 italic'
      }
    }

    return (
      <div key={idx} className={`${lineClass} leading-relaxed`}>
        {line || '\n'}
      </div>
    )
  })
}
