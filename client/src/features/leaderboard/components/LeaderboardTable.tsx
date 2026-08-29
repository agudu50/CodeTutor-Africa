import React from 'react'
import { LeaderboardUser, LeaderboardTimeframe, LeaderboardMetric } from '@/types'
import { Flame, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react'

interface LeaderboardTableProps {
  users: LeaderboardUser[]
  timeframe: LeaderboardTimeframe
  metric: LeaderboardMetric
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  users,
  timeframe,
  metric,
}) => {
  const getMetricLabel = (user: LeaderboardUser) => {
    if (metric === 'streak') return `${user.streakDays} Days`
    if (metric === 'problems') return `${user.problemsSolved} Solved`
    if (timeframe === 'daily') return `${user.dailyPoints.toLocaleString()} XP`
    if (timeframe === 'weekly') return `${user.weeklyPoints.toLocaleString()} XP`
    if (timeframe === 'monthly') return `${user.monthlyPoints.toLocaleString()} XP`
    return `${user.yearlyPoints.toLocaleString()} XP`
  }

  const getRankShift = (user: LeaderboardUser) => {
    const diff = user.previousRank - user.rank
    if (diff > 0) {
      return (
        <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
          <ArrowUp className="w-3 h-3" />+{diff}
        </span>
      )
    }
    if (diff < 0) {
      return (
        <span className="inline-flex items-center text-[10px] font-bold text-rose-500 font-mono">
          <ArrowDown className="w-3 h-3" />{diff}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center text-[10px] font-bold text-slate-400 font-mono">
        —
      </span>
    )
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Grandmaster':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
      case 'Diamond':
        return 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700'
      case 'Platinum':
        return 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
      case 'Gold':
        return 'bg-yellow-100 dark:bg-yellow-950/80 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
      case 'Silver':
        return 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
      default:
        return 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200'
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <th className="py-3 px-4 text-center w-16">Rank</th>
              <th className="py-3 px-4">Learner</th>
              <th className="py-3 px-4 hidden sm:table-cell">Tier</th>
              <th className="py-3 px-4 text-center">Streak</th>
              <th className="py-3 px-4 hidden md:table-cell text-center">Solved</th>
              <th className="py-3 px-4 text-right">
                {metric === 'streak' ? 'Streak Days' : metric === 'problems' ? 'Problems Solved' : `${timeframe.toUpperCase()} XP`}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {users.map((user) => {
              const isCurrentUser = user.isCurrentUser
              return (
                <tr
                  key={user.id}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 font-bold border-l-4 border-l-[#005F02] dark:border-l-emerald-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {/* Rank & Movement */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span
                        className={`w-7 h-7 rounded-xl font-mono font-black flex items-center justify-center text-xs shadow-3xs ${
                          user.rank === 1
                            ? 'bg-amber-400 text-amber-950 font-extrabold ring-2 ring-amber-300'
                            : user.rank === 2
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-extrabold'
                            : user.rank === 3
                            ? 'bg-amber-700 text-white font-extrabold'
                            : isCurrentUser
                            ? 'bg-[#005F02] text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        #{user.rank}
                      </span>
                      <div className="mt-0.5">{getRankShift(user)}</div>
                    </div>
                  </td>

                  {/* Learner Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black font-mono shrink-0 shadow-3xs ${
                          isCurrentUser
                            ? 'bg-[#005F02] text-white ring-2 ring-[#005F02]/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-white truncate">
                            {user.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-mono font-bold">
                              YOU
                            </span>
                          )}
                          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                            {user.countryCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">
                          @{user.username} • {user.favoriteLanguage}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getTierColor(
                        user.tier
                      )}`}
                    >
                      {user.tier}
                    </span>
                  </td>

                  {/* Streak */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{user.streakDays}d</span>
                    </div>
                  </td>

                  {/* Solved Challenges */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-center font-mono font-semibold text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{user.problemsSolved}</span>
                    </div>
                  </td>

                  {/* Metric Score */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-mono font-black text-sm ${
                        isCurrentUser
                          ? 'text-[#005F02] dark:text-emerald-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {getMetricLabel(user)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
