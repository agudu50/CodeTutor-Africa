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
        'w-full rounded-3xl p-4 sm:p-5 transition-colors shadow-xs space-y-3.5 box-border overflow-hidden border-2',
        isAssistant
          ? 'bg-white dark:bg-[#0E1318] border-slate-300 dark:border-slate-700'
          : 'bg-slate-50 dark:bg-[#161B22] border-slate-200 dark:border-slate-800'
      )}
    >
      {/* Top Header Row (Avatar + Sender + Status + Telemetry) */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar Icon */}
          <div className="shrink-0">
            {isAssistant ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                <Bot className="w-4 h-4" />
              </div>
            ) : (
              <Avatar
                src={profile.avatarUrl || undefined}
                fallbackName={profile.fullName || 'You'}
                size="sm"
                className="bg-[#005F02] text-white font-bold shadow-3xs w-8 h-8 text-xs"
              />
            )}
          </div>

          {/* Name & Local Badge */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
              {isAssistant ? 'CodeTutor AI (Offline)' : profile.fullName || 'Kofi Mensah'}
            </span>
            {isAssistant && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shrink-0 shadow-3xs">
                <Zap className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" /> Local Inference
              </span>
            )}
          </div>
        </div>

        {/* Inference Telemetry */}
        {isAssistant && message.inferenceTimeMs && (
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 font-bold">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
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
          <div className="w-full pt-3 border-t-2 border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Suggested Explorations:
            </span>
            <div className="flex flex-col gap-2 w-full">
              {message.suggestedFollowups.map((followup, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectFollowup?.(followup)}
                  className="w-full text-xs text-left px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] hover:border-[#005F02] dark:hover:border-emerald-500 hover:text-[#005F02] dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-[#1C232B] text-slate-800 dark:text-slate-200 font-bold transition-all shadow-3xs cursor-pointer flex items-center justify-between gap-2 group active:scale-95"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Bot className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
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
