import React, { useState } from 'react'
import { LeaderboardUser, LeaderboardTimeframe, LeaderboardMetric } from '@/types'
import { Flame } from 'lucide-react'

interface UserRankCardProps {
  currentUser: LeaderboardUser
  timeframe: LeaderboardTimeframe
  metric?: LeaderboardMetric
  rankAboveUser?: LeaderboardUser
}

export const UserRankCard: React.FC<UserRankCardProps> = ({
  currentUser,
  timeframe,
  rankAboveUser,
}) => {
  const [imageError, setImageError] = useState(false)

  const getCurrentPoints = () => {
    if (timeframe === 'daily') return currentUser.dailyPoints
    if (timeframe === 'weekly') return currentUser.weeklyPoints
    if (timeframe === 'monthly') return currentUser.monthlyPoints
    return currentUser.yearlyPoints
  }

  const getPointsGap = () => {
    if (!rankAboveUser) return 0
    if (timeframe === 'daily') return Math.max(0, rankAboveUser.dailyPoints - currentUser.dailyPoints)
    if (timeframe === 'weekly') return Math.max(0, rankAboveUser.weeklyPoints - currentUser.weeklyPoints)
    if (timeframe === 'monthly') return Math.max(0, rankAboveUser.monthlyPoints - currentUser.monthlyPoints)
    return Math.max(0, rankAboveUser.yearlyPoints - currentUser.yearlyPoints)
  }

  const gap = getPointsGap()

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
    <div className="p-4 sm:p-5 rounded-3xl border-2 border-emerald-500/80 dark:border-emerald-600 bg-white dark:bg-[#0E1318] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Your Status with Real Avatar */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            {currentUser.avatarUrl && !imageError ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                onError={() => setImageError(true)}
                className="w-10 h-10 rounded-xl border-2 border-[#005F02] dark:border-emerald-500 object-cover shadow-3xs select-none"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#005F02] text-white border-2 border-[#005F02] flex items-center justify-center text-xs font-black font-mono shadow-3xs select-none">
                {getInitials(currentUser.name)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-md bg-[#005F02] text-white border border-emerald-300 dark:border-emerald-400 text-[9px] font-mono font-black shadow-3xs leading-none">
              #{currentUser.rank}
            </div>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Your Leaderboard Standing
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 font-bold border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                {currentUser.tier} Division
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {gap > 0 ? (
                <>
                  Earn <span className="font-bold text-[#005F02] dark:text-emerald-400 font-mono">+{gap} XP</span> to overtake #{rankAboveUser?.rank} ({rankAboveUser?.name.split(' ')[0]})
                </>
              ) : (
                'You are leading the board! Keep up the daily practice.'
              )}
            </p>
          </div>
        </div>

        {/* Right: Quick Stats with 2px borders */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 shadow-3xs text-center min-w-[80px]">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase font-bold">
              {timeframe} XP
            </span>
            <span className="text-sm font-black font-mono text-[#005F02] dark:text-emerald-400">
              {getCurrentPoints().toLocaleString()}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 shadow-3xs text-center min-w-[80px]">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase font-bold flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> Streak
            </span>
            <span className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">
              {currentUser.streakDays} Days
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 shadow-3xs text-center hidden md:block min-w-[75px]">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase font-bold">
              Solved
            </span>
            <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
              {currentUser.problemsSolved}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
