import React, { useState } from 'react'
import { LeaderboardUser, LeaderboardTimeframe, LeaderboardMetric } from '@/types'
import { Flame, Trophy, Medal, Award, Crown, GraduationCap } from 'lucide-react'

interface LeaderboardPodiumProps {
  topUsers: LeaderboardUser[]
  timeframe: LeaderboardTimeframe
  metric: LeaderboardMetric
}

interface PodiumAvatarProps {
  user: LeaderboardUser
  className: string
  fallbackBg: string
}

const PodiumAvatar: React.FC<PodiumAvatarProps> = ({ user, className, fallbackBg }) => {
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
        className={`${className} object-cover select-none shrink-0`}
      />
    )
  }

  return (
    <div className={`${className} ${fallbackBg} flex items-center justify-center font-black font-mono select-none shrink-0`}>
      {getInitials(user.name)}
    </div>
  )
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-5 pb-2">
      {/* 2nd Place (Silver) */}
      {second && (
        <div className="order-2 md:order-1 flex flex-col items-center p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs relative hover:border-slate-400 dark:hover:border-slate-600 transition-all">
          <div className="absolute -top-3.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black font-mono flex items-center gap-1.5 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
            <Medal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
            <span>2nd Place</span>
          </div>

          <div className="relative mt-2">
            <PodiumAvatar
              user={second}
              className="w-16 h-16 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-3xs"
              fallbackBg="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-lg"
            />
            <div className="absolute -bottom-2 -right-1.5 px-1.5 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-[10px] font-mono font-black text-slate-800 dark:text-slate-200 shadow-3xs">
              #2
            </div>
          </div>

          <div className="mt-3.5 text-center space-y-1 w-full">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px]">
                {second.name}
              </h3>
              {second.role === 'mentor' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 text-[9px] font-mono font-black border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  <GraduationCap className="w-2.5 h-2.5" />
                  MENTOR
                </span>
              )}
              <span className="px-1.5 py-0.2 rounded-md border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold">
                {second.countryCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">@{second.username}</p>
          </div>

          <div className="mt-3.5 w-full pt-3 border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {second.streakDays}d streak
            </span>
            <span className="text-xs font-mono font-black text-slate-900 dark:text-white px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
              {getMetricValue(second)}
            </span>
          </div>
        </div>
      )}

      {/* 1st Champion (Gold - Center Elevated) */}
      {first && (
        <div className="order-1 md:order-2 flex flex-col items-center p-6 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-amber-400 dark:border-amber-500 shadow-md relative hover:shadow-lg transition-all md:-translate-y-3">
          <div className="absolute -top-4 px-4 py-1.5 rounded-xl bg-amber-400 text-amber-950 text-xs font-black font-mono flex items-center gap-1.5 border-2 border-amber-500 shadow-3xs">
            <Trophy className="w-4 h-4 text-amber-950" />
            <span>1st Champion</span>
          </div>

          <div className="relative mt-2">
            <PodiumAvatar
              user={first}
              className="w-20 h-20 rounded-2xl border-2 border-amber-400 dark:border-amber-500 shadow-sm"
              fallbackBg="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-2xl"
            />
            <div className="absolute -bottom-2 -right-1 p-1 rounded-xl bg-amber-400 text-amber-950 border-2 border-amber-500 shadow-3xs">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="mt-3.5 text-center space-y-1 w-full">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <h3 className="text-base font-black text-slate-900 dark:text-white truncate max-w-[180px]">
                {first.name}
              </h3>
              {first.role === 'mentor' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 text-[9px] font-mono font-black border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  <GraduationCap className="w-2.5 h-2.5" />
                  MENTOR
                </span>
              )}
              <span className="px-1.5 py-0.2 rounded-md border-2 border-amber-300 dark:border-amber-700 bg-amber-100 dark:bg-amber-950 text-[10px] font-mono text-amber-900 dark:text-amber-300 font-black">
                {first.countryCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">@{first.username}</p>
          </div>

          <div className="mt-3.5 w-full pt-3 border-t-2 border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              {first.streakDays}d streak
            </span>
            <span className="text-sm font-mono font-black text-[#005F02] dark:text-emerald-400 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-700 shadow-3xs">
              {getMetricValue(first)}
            </span>
          </div>
        </div>
      )}

      {/* 3rd Place (Bronze) */}
      {third && (
        <div className="order-3 flex flex-col items-center p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-amber-800/40 dark:border-amber-800/60 shadow-xs relative hover:border-amber-800 dark:hover:border-amber-700 transition-all">
          <div className="absolute -top-3.5 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs font-black font-mono flex items-center gap-1.5 border-2 border-amber-300 dark:border-amber-800 shadow-3xs">
            <Award className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
            <span>3rd Place</span>
          </div>

          <div className="relative mt-2">
            <PodiumAvatar
              user={third}
              className="w-16 h-16 rounded-2xl border-2 border-amber-800/40 dark:border-amber-800/60 shadow-3xs"
              fallbackBg="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-lg"
            />
            <div className="absolute -bottom-2 -right-1.5 px-1.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 border-2 border-amber-300 dark:border-amber-800 text-[10px] font-mono font-black text-amber-900 dark:text-amber-300 shadow-3xs">
              #3
            </div>
          </div>

          <div className="mt-3.5 text-center space-y-1 w-full">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px]">
                {third.name}
              </h3>
              {third.role === 'mentor' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 text-[9px] font-mono font-black border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  <GraduationCap className="w-2.5 h-2.5" />
                  MENTOR
                </span>
              )}
              <span className="px-1.5 py-0.2 rounded-md border-2 border-amber-300 dark:border-amber-800 bg-amber-100 dark:bg-amber-950 text-[10px] font-mono text-amber-900 dark:text-amber-300 font-bold">
                {third.countryCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">@{third.username}</p>
          </div>

          <div className="mt-3.5 w-full pt-3 border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {third.streakDays}d streak
            </span>
            <span className="text-xs font-mono font-black text-slate-900 dark:text-white px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
              {getMetricValue(third)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
