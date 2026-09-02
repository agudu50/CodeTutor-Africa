import React, { memo } from 'react'
import { ActivityItem } from '@/types'
import { CheckCircle2, Bot, BookOpen, Bug, Zap } from 'lucide-react'

const activityIcons = {
  practice_solved: {
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80',
  },
  tutor_chat: {
    icon: Bot,
    badgeClass: 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800/80',
  },
  lesson_completed: {
    icon: BookOpen,
    badgeClass: 'bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/80',
  },
  debug_session: {
    icon: Bug,
    badgeClass: 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/80',
  },
}

export const ActivityFeed: React.FC<{ activities: ActivityItem[] }> = memo(({ activities }) => {
  return (
    <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-3xs">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            Recent Offline Study Activity
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-black border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] px-3 py-1 rounded-xl shadow-3xs">
          {activities.length} Recorded Events
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        {activities.map((act) => {
          const cfg = activityIcons[act.type] || activityIcons.practice_solved
          const Icon = cfg.icon

          return (
            <div
              key={act.id}
              className="flex items-start gap-3.5 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#12161A] transition-colors hover:border-slate-300 dark:hover:border-slate-700 shadow-3xs"
            >
              <div className={`p-2.5 rounded-xl border-2 shrink-0 ${cfg.badgeClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {act.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-bold shrink-0">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                  {act.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

ActivityFeed.displayName = 'ActivityFeed'
