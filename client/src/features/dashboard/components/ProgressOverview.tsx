import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui'
import { Trophy, Code2, Clock, Flame, ArrowRight } from 'lucide-react'

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
      value: `${streakDays}`,
      unit: 'Days',
      subtext: 'Personal best streak',
      tag: '+2d this week',
      tagColor: 'bg-amber-100/80 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80',
      icon: Flame,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/80',
      hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-600',
      glowBg: 'group-hover:bg-amber-500/5',
      href: '/progress',
    },
    {
      label: 'Problems Solved',
      value: `${problemsSolved}`,
      unit: 'drills',
      subtext: 'Across 3 languages',
      tag: '88% accuracy',
      tagColor: 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80',
      icon: Code2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80',
      hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-600',
      glowBg: 'group-hover:bg-emerald-500/5',
      href: '/practice',
    },
    {
      label: 'Study Time',
      value: `${totalHours}`,
      unit: 'hrs',
      subtext: '100% Offline learning',
      tag: 'Goal: 20h',
      tagColor: 'bg-sky-100/80 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/80',
      icon: Clock,
      iconColor: 'text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200/80 dark:border-sky-800/80',
      hoverBorder: 'hover:border-sky-400 dark:hover:border-sky-600',
      glowBg: 'group-hover:bg-sky-500/5',
      href: '/progress',
    },
    {
      label: 'Enrolled Courses',
      value: `${coursesCount}`,
      unit: 'tracks',
      subtext: 'Core coding curricula',
      tag: '1 completed',
      tagColor: 'bg-brand-100/80 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border-brand-200/80 dark:border-brand-800/80',
      icon: Trophy,
      iconColor: 'text-brand-600 dark:text-brand-400',
      iconBg: 'bg-brand-50 dark:bg-brand-950/60 border-brand-200/80 dark:border-brand-800/80',
      hoverBorder: 'hover:border-brand-400 dark:hover:border-brand-600',
      glowBg: 'group-hover:bg-brand-500/5',
      href: '/learning',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 items-stretch w-full">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Link
            key={stat.label}
            to={stat.href}
            className="group block h-full focus:outline-none focus:ring-2 focus:ring-brand-500/40 rounded-2xl"
          >
            <Card
              className={`p-3.5 sm:p-5 flex flex-col justify-between h-full bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800/90 ${stat.hoverBorder} ${stat.glowBg} transition-all duration-200 shadow-xs hover:shadow-md rounded-2xl relative overflow-hidden`}
            >
              {/* Header: Label + Icon */}
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">
                  {stat.label}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <div className={`p-1.5 sm:p-2 rounded-xl border ${stat.iconBg} ${stat.iconColor} group-hover:scale-105 transition-transform shrink-0 shadow-3xs`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all hidden sm:block" />
                </div>
              </div>

              {/* Metric Value + Unit + Micro Trend Tag */}
              <div className="mt-2.5 sm:mt-3.5 space-y-1 sm:space-y-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {stat.unit}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${stat.tagColor}`}>
                    {stat.tag}
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate hidden xs:inline">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
})

ProgressOverview.displayName = 'ProgressOverview'
