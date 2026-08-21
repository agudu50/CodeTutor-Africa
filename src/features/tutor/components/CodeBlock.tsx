import React, { useState, memo } from 'react'
import { Copy, Check, Code2 } from 'lucide-react'
import { ProgrammingLanguage } from '@/types'
import { renderVSCodeSyntax } from '@/utils/syntaxHighlight'

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

  const isComparison = code.includes('DANGEROUS') || code.includes('SAFE')

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#1e1e1e] overflow-hidden my-3 shadow-lg max-w-full text-slate-200">
      {/* VS Code Block Header Bar (#252526) */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#252526] border-b border-[#181818] text-xs select-none gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
          </div>
          <div className="hidden sm:block h-3 w-px bg-[#333333] shrink-0" />
          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[10px] sm:text-[11px] font-semibold uppercase shrink-0">
            <Code2 className="w-3.5 h-3.5 text-[#569cd6]" />
            <span>{language}</span>
          </div>
          {isComparison && (
            <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-[#333333] text-[#ffd700] border border-slate-700 truncate">
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
          className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 hover:text-slate-200 bg-[#333333]/80 hover:bg-[#3d3d3d] border border-slate-700/80 transition-colors py-1 px-2 rounded-md shrink-0 cursor-pointer"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#4ec9b0]" />
              <span className="text-[#4ec9b0] font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* VS Code Syntax Highlighted Content (#1e1e1e) */}
      <div className="p-3.5 sm:p-4 overflow-x-auto text-xs sm:text-[13px] font-mono leading-6 bg-[#1e1e1e] selection:bg-[#264f78]/80 selection:text-white">
        <pre className="whitespace-pre">
          {renderVSCodeSyntax(code)}
        </pre>
      </div>
    </div>
  )
})

CodeBlock.displayName = 'CodeBlock'
