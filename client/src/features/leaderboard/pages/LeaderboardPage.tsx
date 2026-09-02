import React, { useState, useMemo } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_LEADERBOARD_USERS, WEST_AFRICAN_COUNTRIES } from '../data/mockLeaderboardData'
import { LeaderboardPodium } from '../components/LeaderboardPodium'
import { LeaderboardTable } from '../components/LeaderboardTable'
import { UserRankCard } from '../components/UserRankCard'
import { LeaderboardTimeframe, LeaderboardMetric, LeaderboardUser, LeaderboardRoleFilter } from '@/types'
import {
  Trophy,
  Flame,
  Zap,
  Target,
  Search,
  Shield,
  Clock,
  Globe,
  GraduationCap,
  Users,
  UserCheck,
} from 'lucide-react'

export const LeaderboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('weekly')
  const [metric, setMetric] = useState<LeaderboardMetric>('points')
  const [roleFilter, setRoleFilter] = useState<LeaderboardRoleFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [countryFilter, setCountryFilter] = useState('ALL')

  // Calculate and sort rankings dynamically based on selected timeframe, metric & role filter
  const sortedUsers = useMemo(() => {
    let raw = [...MOCK_LEADERBOARD_USERS]

    if (roleFilter !== 'all') {
      raw = raw.filter((u) => u.role === roleFilter)
    }

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
  }, [timeframe, metric, roleFilter])

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

  const timeframeTabs: { id: LeaderboardTimeframe; label: string }[] = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
  ]

  const metricTabs: { id: LeaderboardMetric; label: string; icon: React.ReactNode }[] = [
    { id: 'points', label: 'XP Points', icon: <Zap className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'streak', label: 'Streaks', icon: <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> },
    { id: 'problems', label: 'Solved', icon: <Target className="w-3.5 h-3.5 text-emerald-500" /> },
  ]

  const roleTabs: { id: LeaderboardRoleFilter; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Ranks', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'learner', label: 'Learners', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { id: 'mentor', label: 'Mentors', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  ]

  return (
    <PageContainer maxWidth="2xl" className="space-y-5">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 shadow-3xs">
              <Trophy className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Pan-African Leaderboard
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Compete, climb tiers, and celebrate continuous coding consistency with learners and mentors across Africa.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono font-black text-[#005F02] dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
            <Shield className="w-3.5 h-3.5" /> 100% Offline Synced
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-3xs">
            <Clock className="w-3 h-3 text-emerald-500" /> Live
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CONTROLS TOOLBAR: COMPACT TIMEFRAME + ROLE TABS + METRIC PILLS + SEARCH
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 p-3 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs">
        {/* Left Controls: Timeframe & Role Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Segmented Control */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 shrink-0">
            {timeframeTabs.map((tab) => {
              const isActive = timeframe === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTimeframe(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black font-mono transition-all cursor-pointer border-2 shadow-3xs active:scale-95 ${
                    isActive
                      ? 'bg-[#005F02] text-white border-[#005F02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Role Filter Segmented Control (All / Learners / Mentors) */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 shrink-0">
            {roleTabs.map((tab) => {
              const isActive = roleFilter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRoleFilter(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black font-mono transition-all cursor-pointer border-2 shadow-3xs active:scale-95 ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right side: Metric Selector & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Metric Selector Pills */}
          <div className="flex items-center gap-1.5">
            {metricTabs.map((m) => {
              const isSelected = metric === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMetric(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border-2 shadow-3xs active:scale-95 ${
                    isSelected
                      ? 'bg-[#005F02] text-white border-[#005F02]'
                      : 'bg-slate-50 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              )
            })}
          </div>

          {/* Search & Country Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Enhanced Country Dropdown */}
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-xs font-mono font-black rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#005F02] cursor-pointer shadow-3xs hover:border-slate-400 transition-colors"
              >
                {WEST_AFRICAN_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code === 'ALL' ? 'All Africa' : `${c.name} (${c.code})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Learner/Mentor Search Input */}
            <div className="relative w-full sm:w-44">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member..."
                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#005F02]"
              />
            </div>
          </div>
        </div>
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
