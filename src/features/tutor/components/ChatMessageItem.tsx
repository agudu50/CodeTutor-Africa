import React, { memo } from 'react'
import { ChatMessage } from '@/types'
import { Avatar } from '@/components/ui'
import { MarkdownContent } from './MarkdownContent'
import { CodeBlock } from './CodeBlock'
import { Bot, Sparkles, Cpu } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ChatMessageItemProps {
  message: ChatMessage
  onSelectFollowup?: (followup: string) => void
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = memo(({
  message,
  onSelectFollowup,
}) => {
  const isAssistant = message.role === 'assistant'

  return (
    <div
      className={cn(
        'flex gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl transition-colors',
        isAssistant
          ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs'
          : 'bg-slate-50 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800/60'
      )}
    >
      {/* Avatar icon */}
      <div className="shrink-0 pt-0.5">
        {isAssistant ? (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center border border-brand-500 shadow-xs">
            <Bot className="w-4 h-4 text-white" />
          </div>
        ) : (
          <Avatar fallbackName="You" size="sm" className="bg-slate-700 text-white font-bold" />
        )}
      </div>

      {/* Message content & code blocks */}
      <div className="flex-1 space-y-3 min-w-0">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {isAssistant ? 'CodeTutor AI (Offline)' : 'You'}
            </span>
            {isAssistant && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/70">
                <Sparkles className="w-2.5 h-2.5 text-emerald-500" /> Local Inference
              </span>
            )}
          </div>

          {isAssistant && message.inferenceTimeMs && (
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-slate-400" />
              {message.inferenceTimeMs}ms • 0 KB Data
            </span>
          )}
        </div>

        {/* Formatted Markdown Content */}
        <MarkdownContent content={message.content} />

        {/* Dedicated standalone code blocks if any outside content */}
        {message.codeBlocks && message.codeBlocks.length > 0 && (
          <div className="space-y-3 pt-1">
            {message.codeBlocks.map((block, idx) => (
              <CodeBlock
                key={idx}
                code={block.code}
                language={block.language}
              />
            ))}
          </div>
        )}

        {/* Suggested followups */}
        {isAssistant && message.suggestedFollowups && message.suggestedFollowups.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Suggested Explorations:
            </span>
            <div className="flex flex-wrap gap-2">
              {message.suggestedFollowups.map((followup, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowup?.(followup)}
                  className="text-xs text-left px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-2xs font-medium"
                >
                  💡 {followup}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

ChatMessageItem.displayName = 'ChatMessageItem'
