import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Bot, MessageSquare, ArrowRight, Plus, Clock, ChevronRight } from 'lucide-react'

interface TutorSessionPreview {
  id: string
  title: string
  language: string
  lastUpdated: string
  messageCount: number
}

export const RecentTutorCard: React.FC<{ sessions: TutorSessionPreview[] }> = memo(({ sessions }) => {
  // Show top 2 most recent sessions to perfectly align height with ContinueLearningCard
  const displaySessions = sessions.slice(0, 2)

  return (
    <Card className="h-full flex flex-col justify-between border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs rounded-2xl sm:rounded-3xl overflow-hidden">
      <div>
        <CardHeader className="p-3.5 sm:p-4 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 shadow-3xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  Recent AI Tutor Sessions
                </CardTitle>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  Socratic dialogues & code reviews
                </p>
              </div>
            </div>

            <Link
              to="/tutor"
              className="text-[11px] font-bold text-[#005F02] dark:text-emerald-400 hover:text-white hover:bg-[#005F02] dark:hover:bg-emerald-600 flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 transition-all shrink-0 shadow-3xs"
              title="Start a new AI tutoring dialogue"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-3.5 space-y-2">
          {displaySessions.map((session) => (
            <Link
              key={session.id}
              to={`/tutor/session/${session.id}`}
              className="block p-2.5 sm:p-3 rounded-xl border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-400 dark:hover:border-emerald-600 bg-slate-50/70 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-150 group shadow-3xs"
            >
              <div className="flex items-start justify-between gap-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {session.title}
                </span>
                <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 border border-slate-300/60 dark:border-slate-700/60">
                  {session.language}
                </span>
              </div>

              <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-2.5 h-2.5 text-slate-400" />
                  <span>{session.messageCount} msgs</span>
                </span>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{session.lastUpdated}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all hidden sm:block text-emerald-500" />
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </div>

      <div className="p-3 sm:p-3.5 pt-0">
        <Link
          to="/tutor"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 bg-slate-50/80 dark:bg-slate-950/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#005F02] dark:hover:text-emerald-400 transition-all shadow-3xs"
        >
          <Bot className="w-3 h-3 text-[#005F02] dark:text-emerald-400" />
          <span>Open Full Tutor Workspace</span>
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>
    </Card>
  )
})

RecentTutorCard.displayName = 'RecentTutorCard'
