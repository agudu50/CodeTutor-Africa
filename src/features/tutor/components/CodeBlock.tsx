import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { ProgrammingLanguage } from '@/types'

interface CodeBlockProps {
  code: string
  language?: ProgrammingLanguage | string
  caption?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text', caption }) => {
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

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-950 overflow-hidden my-3 shadow-md">
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 font-semibold uppercase text-[11px]">
            {language}
          </span>
          {caption && <span className="text-slate-500">• {caption}</span>}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors py-0.5 px-2 rounded-md hover:bg-slate-800"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200 selection:bg-brand-500/40">
        <pre className="whitespace-pre">{code}</pre>
      </div>
    </div>
  )
}
