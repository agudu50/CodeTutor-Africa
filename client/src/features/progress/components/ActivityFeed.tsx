import React, { memo } from 'react'
import { ActivityItem } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
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
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Zap className="w-4 h-4" />
            </div>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Recent Offline Study Activity
            </CardTitle>
          </div>
          <span className="text-[11px] font-mono text-slate-400 font-semibold">
            {activities.length} Recorded Events
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3">
        {activities.map((act) => {
          const cfg = activityIcons[act.type] || activityIcons.practice_solved
          const Icon = cfg.icon

          return (
            <div
              key={act.id}
              className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-900 shadow-2xs"
            >
              <div className={`p-2 rounded-xl border shrink-0 ${cfg.badgeClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {act.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
})

ActivityFeed.displayName = 'ActivityFeed'
