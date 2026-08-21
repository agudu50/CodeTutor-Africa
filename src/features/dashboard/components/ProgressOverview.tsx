import React, { memo } from 'react'
import { Card } from '@/components/ui'
import { Trophy, Code2, Clock, Flame } from 'lucide-react'

interface ProgressOverviewProps {
  streakDays: number
  totalHours: number
  problemsSolved: number
  coursesCount: number
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = memo(({
  streakDays,
  totalHours,
  problemsSolved,
  coursesCount,
}) => {
  const stats = [
    {
      label: 'Day Streak',
      value: `${streakDays} Days`,
      subtext: 'Personal best',
      icon: Flame,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80',
    },
    {
      label: 'Problems Solved',
      value: problemsSolved.toString(),
      subtext: 'Across 3 languages',
      icon: Code2,
      iconColor: 'text-brand-600 dark:text-brand-400',
      iconBg: 'bg-brand-50 dark:bg-brand-950/60 border-brand-200 dark:border-brand-800/80',
    },
    {
      label: 'Study Time',
      value: `${totalHours} hrs`,
      subtext: 'Offline learning',
      icon: Clock,
      iconColor: 'text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800/80',
    },
    {
      label: 'Enrolled Courses',
      value: coursesCount.toString(),
      subtext: 'Core coding tracks',
      icon: Trophy,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.label}
            className="p-4 sm:p-5 flex flex-col justify-between h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl border ${stat.iconBg} ${stat.iconColor} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {stat.value}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {stat.subtext}
              </p>
            </div>
          </Card>
        )
      })}
    </div>
  )
})

ProgressOverview.displayName = 'ProgressOverview'
