import React, { memo } from 'react'
import { ChatMessage } from '@/types'
import { Avatar } from '@/components/ui'
import { useUserProfile } from '@/app/providers/UserProfileProvider'
import { MarkdownContent } from './MarkdownContent'
import { CodeBlock } from './CodeBlock'
import { Bot, Zap, Cpu, ArrowRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ChatMessageItemProps {
  message: ChatMessage
  onSelectFollowup?: (followup: string) => void
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = memo(({
  message,
  onSelectFollowup,
}) => {
  const { profile } = useUserProfile()
  const isAssistant = message.role === 'assistant'

  return (
    <div
      className={cn(
        'w-full rounded-2xl p-4 sm:p-5 transition-colors shadow-2xs space-y-3.5 box-border overflow-hidden',
        isAssistant
          ? 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90'
          : 'bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800/90'
      )}
    >
      {/* Top Header Row (Avatar + Sender + Status + Telemetry) */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar Icon */}
          <div className="shrink-0">
            {isAssistant ? (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#005F02] text-white flex items-center justify-center border border-emerald-600 shadow-3xs">
                <Bot className="w-4 h-4 text-white" />
              </div>
            ) : (
              <Avatar
                src={profile.avatarUrl || undefined}
                fallbackName={profile.fullName || 'You'}
                size="sm"
                className="bg-[#005F02] text-white font-bold shadow-3xs w-7 h-7 sm:w-8 sm:h-8"
              />
            )}
          </div>

          {/* Name & Local Badge */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {isAssistant ? 'CodeTutor AI (Offline)' : profile.fullName || 'Kofi Mensah'}
            </span>
            {isAssistant && (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/70 shrink-0">
                <Zap className="w-2.5 h-2.5 text-emerald-500" /> Local Inference
              </span>
            )}
          </div>
        </div>

        {/* Inference Telemetry */}
        {isAssistant && message.inferenceTimeMs && (
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 font-medium">
            <Cpu className="w-3 h-3 text-slate-400" />
            <span>{message.inferenceTimeMs}ms • 0 KB Data</span>
          </span>
        )}
      </div>

      {/* Message Body */}
      <div className="space-y-3.5 w-full text-slate-800 dark:text-slate-200">
        <MarkdownContent content={message.content} />

        {/* Dedicated standalone code blocks if any outside content */}
        {message.codeBlocks && message.codeBlocks.length > 0 && (
          <div className="space-y-3 pt-1 w-full">
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
          <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Suggested Explorations:
            </span>
            <div className="flex flex-col gap-1.5 w-full">
              {message.suggestedFollowups.map((followup, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowup?.(followup)}
                  className="w-full text-xs text-left px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-slate-50/70 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-[#005F02] dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-3xs font-medium cursor-pointer flex items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Bot className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{followup}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 hidden xs:block" />
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
