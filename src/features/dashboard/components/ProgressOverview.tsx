import React from 'react'
import { Card } from '@/components/ui'
import { Trophy, Code2, Clock, Flame } from 'lucide-react'

interface ProgressOverviewProps {
  streakDays: number
  totalHours: number
  problemsSolved: number
  coursesCount: number
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
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
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Problems Solved',
      value: problemsSolved.toString(),
      subtext: 'Across 3 languages',
      icon: Code2,
      color: 'text-brand-500 bg-brand-500/10 border-brand-500/20',
    },
    {
      label: 'Study Time',
      value: `${totalHours} hrs`,
      subtext: 'Offline learning',
      icon: Clock,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    },
    {
      label: 'Enrolled Courses',
      value: coursesCount.toString(),
      subtext: 'University CS series',
      icon: Trophy,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl border ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
                {stat.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{stat.subtext}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
