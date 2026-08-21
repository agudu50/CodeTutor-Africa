import React, { memo } from 'react'
import { CodeBlock } from './CodeBlock'
import { AlertCircle } from 'lucide-react'

interface MarkdownContentProps {
  content: string
}

export const MarkdownContent: React.FC<MarkdownContentProps> = memo(({ content }) => {
  // Split content by fenced code blocks (```lang ... ```)
  const segments = parseMarkdownSegments(content)

  return (
    <div className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
      {segments.map((segment, idx) => {
        if (segment.type === 'code') {
          // Check if this is an error traceback or text error
          const isError =
            segment.language === 'text' &&
            (segment.code.includes('Error:') || segment.code.includes('RecursionError') || segment.code.includes('Traceback'))

          if (isError) {
            return (
              <div
                key={idx}
                className="my-3 rounded-xl border border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/40 p-3.5 space-y-1.5 font-mono shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Python Runtime Error</span>
                </div>
                <pre className="text-xs sm:text-[13px] text-rose-800 dark:text-rose-300 whitespace-pre-wrap leading-normal font-semibold">
                  {segment.code}
                </pre>
              </div>
            )
          }

          return (
            <CodeBlock
              key={idx}
              code={segment.code}
              language={segment.language}
            />
          )
        }

        // Render text segment with formatting
        return <FormattedParagraph key={idx} text={segment.text} />
      })}
    </div>
  )
})

MarkdownContent.displayName = 'MarkdownContent'

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
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      const text = rawText.slice(lastIndex, match.index)
      if (text.trim()) {
        segments.push({ type: 'text', text })
      }
    }

    const language = match[1] || 'text'
    const code = match[2].trimEnd()
    segments.push({ type: 'code', language, code })

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < rawText.length) {
    const text = rawText.slice(lastIndex)
    if (text.trim()) {
      segments.push({ type: 'text', text })
    }
  }

  return segments
}

const FormattedParagraph: React.FC<{ text: string }> = memo(({ text }) => {
  const paragraphs = text.split('\n\n').filter((p) => p.trim())

  return (
    <div className="space-y-3">
      {paragraphs.map((p, pIdx) => {
        // Check for blockquote (> ...)
        if (p.trim().startsWith('>')) {
          const quoteText = p.replace(/^>\s*/gm, '').trim()
          return (
            <blockquote
              key={pIdx}
              className="my-2 border-l-4 border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 px-4 py-2.5 rounded-r-xl text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium"
            >
              {renderFormattedInline(quoteText)}
            </blockquote>
          )
        }

        // Check for list items
        if (p.trim().startsWith('1.') || p.trim().startsWith('- ') || p.trim().startsWith('* ')) {
          const lines = p.split('\n').filter((l) => l.trim())
          const isOrdered = /^\d+\./.test(lines[0].trim())

          return (
            <div key={pIdx} className="space-y-1.5 my-2 pl-2">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^(\d+\.|\*|-)\s*/, '').trim()
                return (
                  <div key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm">
                    {isOrdered ? (
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-brand-600 dark:text-brand-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {lIdx + 1}
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-2" />
                    )}
                    <span className="leading-relaxed flex-1">
                      {renderFormattedInline(cleanLine)}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        }

        return (
          <p key={pIdx} className="leading-relaxed">
            {renderFormattedInline(p)}
          </p>
        )
      })}
    </div>
  )
})

FormattedParagraph.displayName = 'FormattedParagraph'

function renderFormattedInline(text: string): React.ReactNode[] {
  // Regex to split by inline code (`code`), bold (**text** or __text__), and italic (*text* or _text_)
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|__[^\_]+__|\*[^*]+\*)/g)

  return tokens.map((token, idx) => {
    // Inline code
    if (token.startsWith('`') && token.endsWith('`')) {
      const code = token.slice(1, -1)
      return (
        <code
          key={idx}
          className="font-mono text-[11px] sm:text-xs font-semibold px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-brand-700 dark:text-brand-400 border border-slate-200 dark:border-slate-700 select-all"
        >
          {code}
        </code>
      )
    }

    // Bold (**text** or __text__)
    if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('__') && token.endsWith('__'))) {
      const boldText = token.slice(2, -2)
      return (
        <strong key={idx} className="font-bold text-slate-900 dark:text-white">
          {boldText}
        </strong>
      )
    }

    // Italic (*text*)
    if (token.startsWith('*') && token.endsWith('*')) {
      const italicText = token.slice(1, -1)
      return (
        <em key={idx} className="italic text-slate-700 dark:text-slate-300">
          {italicText}
        </em>
      )
    }

    return token
  })
}
