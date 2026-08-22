import React, { memo, useState } from 'react'
import { AlertCircle, Check, Copy, Code2 } from 'lucide-react'
import { renderVSCodeSyntax } from '@/utils/syntaxHighlight'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = memo(({ content, className = '' }) => {
  const segments = parseMarkdownSegments(content)

  return (
    <div className={`space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed ${className}`}>
      {segments.map((segment, idx) => {
        if (segment.type === 'code') {
          const isError =
            segment.language === 'text' &&
            (segment.code.includes('Error:') || segment.code.includes('RecursionError') || segment.code.includes('Traceback'))

          if (isError) {
            return (
              <div
                key={idx}
                className="my-3 rounded-2xl border border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/40 p-3.5 space-y-1.5 font-mono shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Runtime Error</span>
                </div>
                <pre className="text-xs sm:text-[13px] text-rose-800 dark:text-rose-300 whitespace-pre-wrap leading-normal font-semibold">
                  {segment.code}
                </pre>
              </div>
            )
          }

          return (
            <VSCodeSnippetBlock
              key={idx}
              code={segment.code}
              language={segment.language}
            />
          )
        }

        return <FormattedParagraph key={idx} text={segment.text} />
      })}
    </div>
  )
})

MarkdownRenderer.displayName = 'MarkdownRenderer'

/* ═══════════════════════════════════════════════════════════════
   VS CODE SNIPPET BLOCK (AUTHENTIC IDE FRAME & SYNTAX)
   ═══════════════════════════════════════════════════════════════ */
const VSCodeSnippetBlock: React.FC<{ code: string; language: string }> = memo(({ code, language }) => {
  const [copied, setCopied] = useState(false)
  const lines = code.trimEnd().split('\n')
  const ext = language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'java' ? 'java' : 'txt'
  const filename = `example.${ext}`

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3 rounded-2xl border border-slate-700/80 bg-[#1E1E1E] shadow-xl overflow-hidden font-mono text-xs text-left select-none">
      {/* VS Code Window Header & Tab */}
      <div className="h-8 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-2 shrink-0">
        {/* Left: Window Traffic Dots & File Tab */}
        <div className="flex items-center gap-2.5 h-full">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block shadow-xs" />
          </div>

          <div className="h-full flex items-center gap-1.5 px-2.5 bg-[#1E1E1E] border-t-2 border-t-[#005F02] text-[11px] text-slate-100 font-medium border-r border-[#2D2D2D]">
            <Code2 className="w-3 h-3 text-[#005F02]" />
            <span>{filename}</span>
          </div>
        </div>

        {/* Right: Language Pill & Copy Button */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="h-5 px-1.5 rounded bg-[#2D2D2D] hover:bg-[#3D3D3D] text-[10px] text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-2.5 h-2.5 text-[#005F02]" /> : <Copy className="w-2.5 h-2.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Gutter & Monaco Syntax */}
      <div className="flex min-h-0 bg-[#1E1E1E] overflow-x-auto p-2">
        {/* Line Numbers Gutter */}
        <div className="w-8 py-1 pr-2 text-right text-[11px] text-[#858585] select-none shrink-0 border-r border-[#2D2D2D] leading-5 font-mono">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Canvas */}
        <div className="pl-3 py-1 flex-1 font-mono text-[12px] sm:text-[13px] leading-5 text-[#D4D4D4] whitespace-pre">
          {renderVSCodeSyntax(code.trimEnd())}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-5 px-3 bg-[#005F02] text-white flex items-center justify-between text-[9px] font-mono font-medium shrink-0">
        <span>Ln {lines.length}, Col 1</span>
        <div className="flex items-center gap-2">
          <span>UTF-8</span>
          <span className="uppercase font-bold">{language}</span>
          <span>✓ Local CPU</span>
        </div>
      </div>
    </div>
  )
})

VSCodeSnippetBlock.displayName = 'VSCodeSnippetBlock'

interface CodeSegment {
  type: 'code'
  language: string
  code: string
}

interface TextSegment {
  type: 'text'
  text: string
}

type Segment = CodeSegment | TextSegment

function parseMarkdownSegments(rawText: string): Segment[] {
  const segments: Segment[] = []
  if (!rawText) return segments

  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      const textChunk = rawText.slice(lastIndex, match.index).trim()
      if (textChunk) {
        segments.push({ type: 'text', text: textChunk })
      }
    }

    segments.push({
      type: 'code',
      language: match[1] || 'text',
      code: match[2].trimEnd(),
    })

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < rawText.length) {
    const textChunk = rawText.slice(lastIndex).trim()
    if (textChunk) {
      segments.push({ type: 'text', text: textChunk })
    }
  }

  return segments
}

const FormattedParagraph: React.FC<{ text: string }> = memo(({ text }) => {
  const paragraphs = text.split('\n\n')

  return (
    <>
      {paragraphs.map((p, pIdx) => {
        const trimmed = p.trim()
        if (!trimmed) return null

        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={pIdx} className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-2 pb-1 border-b border-slate-200 dark:border-slate-800">
              {renderInlineStyles(trimmed.slice(2))}
            </h1>
          )
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={pIdx} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-3 pb-1">
              {renderInlineStyles(trimmed.slice(3))}
            </h2>
          )
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={pIdx} className="text-base font-bold text-slate-800 dark:text-slate-200 pt-2 pb-0.5">
              {renderInlineStyles(trimmed.slice(4))}
            </h3>
          )
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n')
          return (
            <ul key={pIdx} className="list-disc list-inside space-y-1.5 pl-2 text-slate-700 dark:text-slate-300">
              {items.map((it, iIdx) => (
                <li key={iIdx}>{renderInlineStyles(it.replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={pIdx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {renderInlineStyles(trimmed)}
          </p>
        )
      })}
    </>
  )
})

FormattedParagraph.displayName = 'FormattedParagraph'

function renderInlineStyles(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px] sm:text-xs text-[#005F02] border border-slate-200 dark:border-slate-700 font-bold"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}
