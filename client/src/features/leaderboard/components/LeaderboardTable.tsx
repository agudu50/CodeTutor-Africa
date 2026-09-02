import React, { useState } from 'react'
import { LeaderboardUser, LeaderboardTimeframe, LeaderboardMetric } from '@/types'
import { Flame, ArrowUp, ArrowDown, GraduationCap } from 'lucide-react'

interface LeaderboardTableProps {
  users: LeaderboardUser[]
  timeframe: LeaderboardTimeframe
  metric: LeaderboardMetric
  roleFilter?: 'learner' | 'mentor'
}

const TableAvatar: React.FC<{ user: LeaderboardUser }> = ({ user }) => {
  const [imageError, setImageError] = useState(false)

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

  if (user.avatarUrl && !imageError) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        onError={() => setImageError(true)}
        className={`w-10 h-10 rounded-xl object-cover shrink-0 select-none shadow-3xs border-2 ${
          user.isCurrentUser
            ? 'border-[#005F02] dark:border-emerald-500'
            : 'border-slate-300 dark:border-slate-700'
        }`}
      />
    )
  }

  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black font-mono shrink-0 select-none shadow-3xs border-2 ${
        user.isCurrentUser
          ? 'bg-[#005F02] text-white border-[#005F02]'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
      }`}
    >
      {getInitials(user.name)}
    </div>
  )
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  users,
  timeframe,
  metric,
  roleFilter = 'learner',
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Grandmaster':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-700'
      case 'Diamond':
        return 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-300 border-2 border-cyan-300 dark:border-cyan-700'
      case 'Platinum':
        return 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-300 border-2 border-indigo-300 dark:border-indigo-700'
      case 'Gold':
        return 'bg-yellow-100 dark:bg-yellow-950/80 text-yellow-900 dark:text-yellow-300 border-2 border-yellow-300 dark:border-yellow-700'
      case 'Silver':
        return 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700'
      default:
        return 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border-2 border-amber-200'
    }
  }

  return (
    <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12161A] text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <th className="py-3.5 px-4 text-center w-16">Rank</th>
              <th className="py-3.5 px-4">{roleFilter === 'mentor' ? 'Mentor / Educator' : 'Learner'}</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Tier</th>
              <th className="py-3.5 px-4 text-center">Streak</th>
              <th className="py-3.5 px-4 hidden md:table-cell text-center">Solved</th>
              <th className="py-3.5 px-4 text-right">
                {metric === 'streak' ? 'Streak Days' : metric === 'problems' ? 'Problems Solved' : `${timeframe.toUpperCase()} XP`}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800/80 text-xs">
            {users.map((user) => {
              const isCurrentUser = user.isCurrentUser
              return (
                <tr
                  key={user.id}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {/* Rank & Movement */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span
                        className={`w-7 h-7 rounded-xl font-mono font-black flex items-center justify-center text-xs shadow-3xs border-2 ${
                          user.rank === 1
                            ? 'bg-amber-400 text-amber-950 border-amber-500 font-black'
                            : user.rank === 2
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 font-bold'
                            : user.rank === 3
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold'
                            : isCurrentUser
                            ? 'bg-[#005F02] text-white border-[#005F02] font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        #{user.rank}
                      </span>
                      <div className="mt-0.5">{getRankShift(user)}</div>
                    </div>
                  </td>

                  {/* Learner Info with Photo Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <TableAvatar user={user} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-slate-900 dark:text-white truncate">
                            {user.name}
                          </span>
                          {user.role === 'mentor' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 text-[9px] font-mono font-black border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                              <GraduationCap className="w-2.5 h-2.5" />
                              MENTOR
                            </span>
                          )}
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded-md bg-[#005F02] text-white text-[9px] font-mono font-black border border-[#005F02]">
                              YOU
                            </span>
                          )}
                          <span className="px-1.5 py-0.2 rounded-md border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold">
                            {user.countryCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                          <span>@{user.username}</span>
                          <span>•</span>
                          <span className="capitalize">{user.specialization || user.favoriteLanguage}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <span className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-mono font-black shadow-3xs ${getTierColor(user.tier)}`}>
                      {user.tier}
                    </span>
                  </td>

                  {/* Streak */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {user.streakDays}d
                    </span>
                  </td>

                  {/* Problems Solved */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    {user.problemsSolved}
                  </td>

                  {/* Score */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono font-black text-slate-900 dark:text-white text-xs sm:text-sm">
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
