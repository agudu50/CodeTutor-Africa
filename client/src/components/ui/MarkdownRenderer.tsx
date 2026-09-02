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
    <div className={`space-y-4 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed ${className}`}>
      {segments.map((segment, idx) => {
        if (segment.type === 'code') {
          const isError =
            segment.language === 'text' &&
            (segment.code.includes('Error:') || segment.code.includes('RecursionError') || segment.code.includes('Traceback'))

          if (isError) {
            return (
              <div
                key={idx}
                className="my-3 rounded-2xl border-2 border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/40 p-4 space-y-2 font-mono shadow-2xs"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Runtime Error</span>
                </div>
                <pre className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 whitespace-pre-wrap leading-normal font-semibold">
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

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 rounded-2xl border-2 border-slate-700 bg-[#1E1E1E] shadow-xl overflow-hidden text-slate-200 font-mono text-xs flex flex-col select-none">
      {/* Tab Header Bar */}
      <div className="h-9 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block shadow-xs" />
          </div>
          <div className="h-6 px-3 bg-[#1E1E1E] border-t-2 border-t-[#005F02] text-[11px] text-slate-100 flex items-center gap-1.5 border-r border-[#252526] font-medium ml-2 rounded-t">
            <Code2 className="w-3 h-3 text-[#005F02]" />
            <span className="truncate">snippet.{language === 'python' ? 'py' : language === 'html' ? 'html' : 'js'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold px-1.5 py-0.5 rounded bg-[#2A2A2A] border border-[#3A3A3A]">
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="h-6 px-2.5 rounded bg-[#2A2A2A] hover:bg-[#3A3A3A] text-slate-300 hover:text-white text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-[#3A3A3A]"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Gutter & Monaco Syntax */}
      <div className="flex min-h-0 bg-[#1E1E1E] overflow-x-auto p-2.5">
        {/* Line Numbers Gutter */}
        <div className="w-8 py-1 pr-2 text-right text-[11px] text-[#858585] select-none shrink-0 border-r border-[#2D2D2D] leading-5 font-mono">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Canvas */}
        <div className="pl-3 py-1 flex-1 font-mono text-[13px] leading-5 text-[#D4D4D4] whitespace-pre">
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

        // Horizontal Rules
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          return <hr key={pIdx} className="my-6 border-t-2 border-slate-200 dark:border-slate-800" />
        }

        // Headers (Handles cases where lists or text immediately follow on next line)
        if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
          const lines = trimmed.split('\n')
          const headerLine = lines[0]
          const remainingText = lines.slice(1).join('\n').trim()

          const headerLevel = headerLine.startsWith('### ') ? 3 : headerLine.startsWith('## ') ? 2 : 1
          const headerText = headerLine.replace(/^#{1,3}\s+/, '')

          return (
            <div key={pIdx} className="space-y-3 pt-2">
              {headerLevel === 1 && (
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white pt-3 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
                  {renderInlineStyles(headerText)}
                </h1>
              )}
              {headerLevel === 2 && (
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white pt-4 pb-1">
                  {renderInlineStyles(headerText)}
                </h2>
              )}
              {headerLevel === 3 && (
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-2 pb-0.5">
                  {renderInlineStyles(headerText)}
                </h3>
              )}
              {remainingText && <FormattedParagraph text={remainingText} />}
            </div>
          )
        }

        // Markdown Tables
        if (trimmed.includes('|') && trimmed.split('\n').some((l) => l.trim().startsWith('|'))) {
          const tableLines = trimmed
            .split('\n')
            .map((l) => l.trim())
            .filter((l) => l.startsWith('|') && l.endsWith('|'))

          if (tableLines.length >= 2) {
            const headerCells = tableLines[0].slice(1, -1).split('|').map((c) => c.trim())
            const bodyLines = tableLines.slice(1).filter((l) => !/^\|[\s\-:|]+\|$/.test(l))

            return (
              <div key={pIdx} className="my-4 overflow-x-auto rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-700">
                      {headerCells.map((h, hIdx) => (
                        <th key={hIdx} className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                          {renderInlineStyles(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#0C1015]">
                    {bodyLines.map((row, rIdx) => {
                      const cells = row.slice(1, -1).split('|').map((c) => c.trim())
                      return (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                          {cells.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                              {renderInlineStyles(cell)}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          }
        }

        // Blockquotes
        if (trimmed.startsWith('>')) {
          const quoteContent = trimmed
            .split('\n')
            .map((l) => l.replace(/^>\s?/, ''))
            .join('\n')
            .trim()

          return (
            <div
              key={pIdx}
              className="my-3.5 p-4 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/40 border-l-4 border-l-[#005F02] text-slate-800 dark:text-slate-200 space-y-1 text-sm leading-relaxed shadow-xs"
            >
              {renderInlineStyles(quoteContent)}
            </div>
          )
        }

        // Ordered Lists (Rendered as structured step cards for maximum readability)
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()))
          return (
            <div key={pIdx} className="space-y-2.5 my-3">
              {items.map((it, iIdx) => {
                const itemNumber = it.match(/^(\d+)\.\s/)?.[1] || `${iIdx + 1}`
                const itemContent = it.replace(/^\d+\.\s+/, '')
                return (
                  <div
                    key={iIdx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-2xs flex items-start gap-3.5 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-black text-xs flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700 mt-0.5 shadow-3xs">
                      {itemNumber}
                    </span>
                    <div className="flex-1 min-w-0 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                      {renderInlineStyles(itemContent)}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }

        // Unordered Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n')
          return (
            <ul key={pIdx} className="list-disc list-inside space-y-2 pl-2 text-slate-700 dark:text-slate-300 my-2 text-sm sm:text-base">
              {items.map((it, iIdx) => (
                <li key={iIdx} className="leading-relaxed">{renderInlineStyles(it.replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={pIdx} className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            {renderInlineStyles(trimmed)}
          </p>
        )
      })}
    </>
  )
})

FormattedParagraph.displayName = 'FormattedParagraph'

function renderInlineStyles(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 font-mono text-[12px] sm:text-sm text-[#005F02] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-extrabold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic text-slate-700 dark:text-slate-300 font-medium">
          {part.slice(1, -1)}
        </em>
      )
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="text-[#005F02] dark:text-emerald-400 underline font-semibold hover:text-[#004e02]"
        >
          {linkMatch[1]}
        </a>
      )
    }
    return part
  })
}
