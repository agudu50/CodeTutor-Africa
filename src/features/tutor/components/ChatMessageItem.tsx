import React from 'react'
import { ChatMessage } from '@/types'
import { Avatar } from '@/components/ui'
import { CodeBlock } from './CodeBlock'
import { Bot, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ChatMessageItemProps {
  message: ChatMessage
  onSelectFollowup?: (followup: string) => void
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSelectFollowup,
}) => {
  const isAssistant = message.role === 'assistant'

  return (
    <div
      className={cn(
        'flex gap-3.5 py-4 px-3 sm:px-4 rounded-2xl transition-colors',
        isAssistant
          ? 'bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80'
          : 'bg-transparent'
      )}
    >
      {/* Avatar icon */}
      <div className="shrink-0 pt-0.5">
        {isAssistant ? (
          <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center border border-brand-500">
            <Bot className="w-4 h-4 text-accent-300" />
          </div>
        ) : (
          <Avatar fallbackName="Student" size="sm" />
        )}
      </div>

      {/* Message content & code blocks */}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {isAssistant ? 'CodeTutor AI (Offline)' : 'You'}
          </span>
          {isAssistant && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Local Inference
            </span>
          )}
        </div>

        {/* Text body */}
        <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Code blocks */}
        {message.codeBlocks && message.codeBlocks.length > 0 && (
          <div className="space-y-2 pt-1">
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
          <div className="pt-3 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Suggested Explorations:
            </span>
            <div className="flex flex-wrap gap-2">
              {message.suggestedFollowups.map((followup, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowup?.(followup)}
                  className="text-xs text-left px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shadow-xs"
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
}
