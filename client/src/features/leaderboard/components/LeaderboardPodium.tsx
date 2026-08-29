import React from 'react'
import { LeaderboardUser, LeaderboardTimeframe, LeaderboardMetric } from '@/types'
import { Flame, Trophy } from 'lucide-react'

interface LeaderboardPodiumProps {
  topUsers: LeaderboardUser[]
  timeframe: LeaderboardTimeframe
  metric: LeaderboardMetric
}

export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({
  topUsers,
  timeframe,
  metric,
}) => {
  const first = topUsers[0]
  const second = topUsers[1]
  const third = topUsers[2]

  const getMetricValue = (user: LeaderboardUser) => {
    if (metric === 'streak') {
      return `${user.streakDays} Days`
    }
    if (metric === 'problems') {
      return `${user.problemsSolved} Solved`
    }
    if (timeframe === 'daily') return `${user.dailyPoints.toLocaleString()} XP`
    if (timeframe === 'weekly') return `${user.weeklyPoints.toLocaleString()} XP`
    if (timeframe === 'monthly') return `${user.monthlyPoints.toLocaleString()} XP`
    return `${user.yearlyPoints.toLocaleString()} XP`
  }

  const getInitials = (name: string) => {
    return name
      .replace(/^(You\s*\()/i, '')
      .replace(/\)$/, '')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4 pb-2">
      {/* 🥈 #2 Silver (Second Place) */}
      {second && (
        <div className="order-2 md:order-1 flex flex-col items-center p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative hover:border-slate-400 dark:hover:border-slate-600 transition-all">
          <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black font-mono flex items-center gap-1 border border-slate-300 dark:border-slate-700 shadow-xs">
            <span>🥈</span> 2nd Place
          </div>

          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-lg font-black text-slate-800 dark:text-slate-100 shadow-inner mt-2">
            {getInitials(second.name)}
          </div>

          <div className="mt-3 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px]">
                {second.name}
              </h3>
              <span className="text-xs font-mono text-slate-400 font-bold">({second.countryCode})</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">@{second.username}</p>
          </div>

          <div className="mt-3 w-full pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {second.streakDays}d streak
            </span>
            <span className="text-xs font-mono font-black text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              {getMetricValue(second)}
            </span>
          </div>
        </div>
      )}

      {/* 👑 #1 Gold (Champion - First Place, Center Elevated) */}
      {first && (
        <div className="order-1 md:order-2 flex flex-col items-center p-6 rounded-3xl bg-linear-to-b from-amber-500/10 via-white to-white dark:from-amber-500/15 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-400/80 dark:border-amber-500/60 shadow-lg relative hover:shadow-xl transition-all md:-translate-y-3">
          <div className="absolute -top-4 px-4 py-1 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-white text-xs font-black font-mono flex items-center gap-1.5 shadow-md">
            <Trophy className="w-3.5 h-3.5 fill-white" /> 1st Champion
          </div>

          <div className="relative mt-2">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-amber-50 dark:bg-slate-900 flex items-center justify-center text-2xl font-black text-amber-600 dark:text-amber-400">
                {getInitials(first.name)}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-1 p-1 rounded-full bg-amber-500 text-white shadow-xs">
              <Trophy className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>

          <div className="mt-3.5 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="text-base font-black text-slate-900 dark:text-white truncate max-w-[180px]">
                {first.name}
              </h3>
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                ({first.countryCode})
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">@{first.username}</p>
          </div>

          <div className="mt-3.5 w-full pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              {first.streakDays}d streak
            </span>
            <span className="text-sm font-mono font-black text-[#005F02] dark:text-emerald-400 px-2.5 py-0.5 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700">
              {getMetricValue(first)}
            </span>
          </div>
        </div>
      )}

      {/* 🥉 #3 Bronze (Third Place) */}
      {third && (
        <div className="order-3 flex flex-col items-center p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative hover:border-amber-700/40 dark:hover:border-amber-700/60 transition-all">
          <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black font-mono flex items-center gap-1 border border-amber-300 dark:border-amber-800 shadow-xs">
            <span>🥉</span> 3rd Place
          </div>

          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-100 to-amber-200 dark:from-amber-950 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center text-lg font-black text-amber-800 dark:text-amber-300 shadow-inner mt-2">
            {getInitials(third.name)}
          </div>

          <div className="mt-3 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px]">
                {third.name}
              </h3>
              <span className="text-xs font-mono text-slate-400 font-bold">({third.countryCode})</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">@{third.username}</p>
          </div>

          <div className="mt-3 w-full pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {third.streakDays}d streak
            </span>
            <span className="text-xs font-mono font-black text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              {getMetricValue(third)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
