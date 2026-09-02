import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Bot, MessageSquare, ArrowRight, Plus, Clock, ChevronRight } from 'lucide-react'

interface TutorSessionPreview {
  id: string
  title: string
  language: string
  lastUpdated: string
  messageCount: number
}

export const RecentTutorCard: React.FC<{ sessions: TutorSessionPreview[] }> = memo(({ sessions }) => {
  // Show top 2 most recent sessions to align height with ContinueLearningCard
  const displaySessions = sessions.slice(0, 2)

  return (
    <div className="h-full flex flex-col justify-between border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs rounded-3xl p-5 sm:p-6 space-y-4">
      <div className="space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[#005F02] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-3xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
                Recent AI Tutor Sessions
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                Socratic dialogues & code reviews
              </p>
            </div>
          </div>

          <Link
            to="/tutor"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white text-xs font-mono font-bold transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
            title="Start a new AI tutoring dialogue"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </Link>
        </div>

        {/* Sessions List */}
        <div className="space-y-2.5">
          {displaySessions.map((session) => (
            <Link
              key={session.id}
              to={`/tutor/session/${session.id}`}
              className="block p-3 sm:p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-[#005F02] dark:hover:border-emerald-500 bg-slate-50 dark:bg-[#161B22] hover:bg-white dark:hover:bg-[#1C232B] transition-all duration-150 group shadow-3xs cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {session.title}
                </span>
                <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg bg-white dark:bg-[#0E1318] text-slate-800 dark:text-slate-200 shrink-0 border border-slate-300 dark:border-slate-700 shadow-3xs">
                  {session.language}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 font-semibold">
                  <MessageSquare className="w-3 h-3 text-[#005F02] dark:text-emerald-400" />
                  <span>{session.messageCount} msgs</span>
                </span>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>{session.lastUpdated}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-2">
        <Link
          to="/tutor"
          className="w-full h-11 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] hover:border-[#005F02] hover:text-[#005F02] text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 shadow-3xs transition-all cursor-pointer active:scale-95"
        >
          <Bot className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
          <span>Open Full Tutor Workspace</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>
    </div>
  )
})

RecentTutorCard.displayName = 'RecentTutorCard'
