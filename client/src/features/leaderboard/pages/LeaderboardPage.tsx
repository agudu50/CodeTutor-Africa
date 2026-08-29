import React, { useState, useMemo } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_LEADERBOARD_USERS } from '../data/mockLeaderboardData'
import { LeaderboardPodium } from '../components/LeaderboardPodium'
import { LeaderboardTable } from '../components/LeaderboardTable'
import { UserRankCard } from '../components/UserRankCard'
import { LeaderboardTimeframe, LeaderboardMetric, LeaderboardUser } from '@/types'
import {
  Trophy,
  Flame,
  Zap,
  Target,
  Search,
  Shield,
  Clock,
} from 'lucide-react'

export const LeaderboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('weekly')
  const [metric, setMetric] = useState<LeaderboardMetric>('points')
  const [searchQuery, setSearchQuery] = useState('')
  const [countryFilter, setCountryFilter] = useState('ALL')

  // Calculate and sort rankings dynamically based on selected timeframe & metric
  const sortedUsers = useMemo(() => {
    const raw = [...MOCK_LEADERBOARD_USERS]

    const getScore = (u: LeaderboardUser) => {
      if (metric === 'streak') return u.streakDays
      if (metric === 'problems') return u.problemsSolved
      if (timeframe === 'daily') return u.dailyPoints
      if (timeframe === 'weekly') return u.weeklyPoints
      if (timeframe === 'monthly') return u.monthlyPoints
      return u.yearlyPoints
    }

    raw.sort((a, b) => getScore(b) - getScore(a))

    // Re-assign ranks
    return raw.map((u, idx) => ({
      ...u,
      rank: idx + 1,
    }))
  }, [timeframe, metric])

  // Filter by search and country
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.countryName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCountry = countryFilter === 'ALL' || u.countryCode === countryFilter
      return matchesSearch && matchesCountry
    })
  }, [sortedUsers, searchQuery, countryFilter])

  const currentUser = useMemo(() => {
    return sortedUsers.find((u) => u.isCurrentUser) || sortedUsers[0]
  }, [sortedUsers])

  const rankAboveUser = useMemo(() => {
    if (!currentUser || currentUser.rank <= 1) return undefined
    return sortedUsers.find((u) => u.rank === currentUser.rank - 1)
  }, [sortedUsers, currentUser])

  const topThree = useMemo(() => {
    return sortedUsers.slice(0, 3)
  }, [sortedUsers])

  const uniqueCountries = useMemo(() => {
    const set = new Set<string>()
    sortedUsers.forEach((u) => set.add(u.countryCode))
    return Array.from(set)
  }, [sortedUsers])

  const timeframeTabs: { id: LeaderboardTimeframe; label: string; subtitle: string }[] = [
    { id: 'daily', label: 'Daily', subtitle: 'Today\'s Sprint' },
    { id: 'weekly', label: 'Weekly', subtitle: 'Current Week' },
    { id: 'monthly', label: 'Monthly', subtitle: 'August Masters' },
    { id: 'yearly', label: 'Yearly', subtitle: 'Hall of Fame' },
  ]

  const metricTabs: { id: LeaderboardMetric; label: string; icon: React.ReactNode }[] = [
    { id: 'points', label: 'XP Points', icon: <Zap className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'streak', label: 'Active Streaks', icon: <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> },
    { id: 'problems', label: 'Challenges Solved', icon: <Target className="w-3.5 h-3.5 text-emerald-500" /> },
  ]

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
              <Trophy className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Pan-African Leaderboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Compete, climb tiers, and celebrate continuous coding consistency with learners across Africa.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-[#005F02] bg-[#005F02]/10 border border-[#005F02]/30">
            <Shield className="w-3.5 h-3.5" /> 100% Offline Synced
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Clock className="w-3 h-3" /> Live Rankings
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TIMEFRAME SELECTOR (DAILY, WEEKLY, MONTHLY, YEARLY)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {timeframeTabs.map((tab) => {
          const isActive = timeframe === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeframe(tab.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#005F02] text-white border-[#005F02] shadow-sm font-bold'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/60'
              }`}
            >
              <span className="text-xs sm:text-sm font-extrabold">{tab.label}</span>
              <span
                className={`text-[10px] font-mono mt-0.5 ${
                  isActive ? 'text-white/80' : 'text-slate-400'
                }`}
              >
                {tab.subtitle}
              </span>
            </button>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CURRENT USER RANKING HIGHLIGHT CARD
          ═══════════════════════════════════════════════════════════════ */}
      {currentUser && (
        <UserRankCard
          currentUser={currentUser}
          timeframe={timeframe}
          metric={metric}
          rankAboveUser={rankAboveUser}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TOP 3 PODIUM
          ═══════════════════════════════════════════════════════════════ */}
      {topThree.length >= 3 && (
        <LeaderboardPodium
          topUsers={topThree}
          timeframe={timeframe}
          metric={metric}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          CONTROLS & SEARCH BAR
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Metric Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase font-bold text-slate-400 px-1 hidden md:inline">
            Rank By:
          </span>
          {metricTabs.map((m) => {
            const isSelected = metric === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetric(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            )
          })}
        </div>

        {/* Search & Country Filter */}
        <div className="flex items-center gap-2">
          {/* Country Dropdown */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Hubs (Africa)</option>
            {uniqueCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search learner..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FULL LEADERBOARD RANKINGS TABLE
          ═══════════════════════════════════════════════════════════════ */}
      <LeaderboardTable
        users={filteredUsers}
        timeframe={timeframe}
        metric={metric}
      />
    </PageContainer>
  )
}

export default LeaderboardPage
