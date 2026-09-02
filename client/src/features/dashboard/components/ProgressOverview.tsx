import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Code2, Gamepad2, Flame, ArrowRight } from 'lucide-react'

interface ProgressOverviewProps {
  streakDays: number
  totalHours: number
  problemsSolved: number
  coursesCount: number
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = memo(({
  streakDays,
  problemsSolved,
}) => {
  const stats = [
    {
      category: 'LEADERBOARD',
      label: 'Experience (XP)',
      value: '2,450',
      unit: 'XP',
      subtext: 'Pan-African rank',
      tag: 'Rank #4 • Diamond',
      tagBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800',
      icon: Zap,
      iconBg: 'bg-amber-500 text-white',
      href: '/leaderboard',
    },
    {
      category: 'CONSISTENCY',
      label: 'Day Streak',
      value: `${streakDays}`,
      unit: 'Days',
      subtext: 'Personal best streak',
      tag: '+2d this week',
      tagBg: 'bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-800',
      icon: Flame,
      iconBg: 'bg-orange-500 text-white',
      href: '/leaderboard',
    },
    {
      category: 'PRACTICE',
      label: 'Problems Solved',
      value: `${problemsSolved}`,
      unit: 'drills',
      subtext: 'Across 3 languages',
      tag: '88% accuracy',
      tagBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: Code2,
      iconBg: 'bg-[#005F02] text-white',
      href: '/practice',
    },
    {
      category: 'MINIGAMES',
      label: 'Arcade Game XP',
      value: '1,280',
      unit: 'pts',
      subtext: '4 Minigames mastered',
      tag: 'Top 5% speed',
      tagBg: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800',
      icon: Gamepad2,
      iconBg: 'bg-indigo-600 text-white',
      href: '/games',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-stretch w-full">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Link
            key={stat.label}
            to={stat.href}
            className="group block h-full focus:outline-none focus:ring-2 focus:ring-[#005F02]/40 rounded-2xl cursor-pointer"
          >
            <div
              className="p-4 sm:p-5 flex flex-col justify-between h-full bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Top Row: Category Tag + Solid Icon Tile */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-mono font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
                    {stat.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">
                    {stat.label}
                  </h3>
                </div>

                <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
              </div>

              {/* Big Metric Display */}
              <div className="my-3 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {stat.value}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {stat.unit}
                </span>
              </div>

              {/* Footer: Tag Pill + Arrow Indicator */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${stat.tagBg} shadow-3xs truncate`}>
                  {stat.tag}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
})

ProgressOverview.displayName = 'ProgressOverview'
