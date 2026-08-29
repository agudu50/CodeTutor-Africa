import React from 'react'
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

  return (
    <div className="p-4 sm:p-5 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-transparent shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Your Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#005F02] text-white flex items-center justify-center text-lg font-black font-mono shadow-md shrink-0">
            #{currentUser.rank}
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Your Leaderboard Standing
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-[#005F02] dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700">
                {currentUser.tier} Division
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
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

        {/* Right: Quick Stats */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-3xs text-center">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
              {timeframe} XP
            </span>
            <span className="text-sm font-black font-mono text-[#005F02] dark:text-emerald-400">
              {getCurrentPoints().toLocaleString()}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-3xs text-center">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> Streak
            </span>
            <span className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">
              {currentUser.streakDays} Days
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-3xs text-center hidden md:block">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
              Solved
            </span>
            <span className="text-sm font-black font-mono text-slate-800 dark:text-white">
              {currentUser.problemsSolved}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
