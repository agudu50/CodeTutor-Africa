import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { Bot, MessageSquare, ArrowRight, Plus } from 'lucide-react'

interface TutorSessionPreview {
  id: string
  title: string
  language: string
  lastUpdated: string
  messageCount: number
}

export const RecentTutorCard: React.FC<{ sessions: TutorSessionPreview[] }> = memo(({ sessions }) => {
  return (
    <Card className="h-full flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/80 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Recent AI Tutor Sessions
              </CardTitle>
            </div>
            <Link
              to="/tutor"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Session</span>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-2.5 pt-4">
          {sessions.map((session) => (
            <Link
              key={session.id}
              to={`/tutor/session/${session.id}`}
              className="block p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-700 bg-slate-50/70 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-150 group shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                  {session.title}
                </span>
                <Badge variant="brand" size="sm" className="font-mono text-[10px] uppercase font-bold shrink-0">
                  {session.language}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>{session.messageCount} messages</span>
                </span>
                <span>{session.lastUpdated}</span>
              </div>
            </Link>
          ))}
        </CardContent>
      </div>

      <div className="p-4 pt-0">
        <Link
          to="/tutor"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
        >
          <span>Open Full Tutor Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  )
})

RecentTutorCard.displayName = 'RecentTutorCard'
