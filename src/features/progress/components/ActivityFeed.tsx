import React from 'react'
import { ActivityItem } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { CheckCircle2, Bot, BookOpen, Bug } from 'lucide-react'

const activityIcons = {
  practice_solved: { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
  tutor_chat: { icon: Bot, color: 'text-brand-500 bg-brand-500/10' },
  lesson_completed: { icon: BookOpen, color: 'text-sky-500 bg-sky-500/10' },
  debug_session: { icon: Bug, color: 'text-red-500 bg-red-500/10' },
}

export const ActivityFeed: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Offline Study Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {activities.map((act) => {
          const cfg = activityIcons[act.type] || activityIcons.practice_solved
          const Icon = cfg.icon

          return (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
            >
              <div className={`p-2 rounded-xl shrink-0 ${cfg.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {act.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  {act.description}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
