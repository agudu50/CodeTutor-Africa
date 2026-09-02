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
  UserCheck,
} from 'lucide-react'

export const LeaderboardPage: React.FC = () => {
  const [roleFilter, setRoleFilter] = useState<LeaderboardRoleFilter>('learner')
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('weekly')
  const [metric, setMetric] = useState<LeaderboardMetric>('points')
  const [searchQuery, setSearchQuery] = useState('')
  const [countryFilter, setCountryFilter] = useState('ALL')

  // Calculate and sort rankings dynamically based on selected board (Learners or Mentors)
  const sortedUsers = useMemo(() => {
    // Strictly isolate by role - never mix learners and mentors
    const raw = MOCK_LEADERBOARD_USERS.filter((u) => (u.role || 'learner') === roleFilter)

    const getScore = (u: LeaderboardUser) => {
      if (metric === 'streak') return u.streakDays
      if (metric === 'problems') return u.problemsSolved
      if (timeframe === 'daily') return u.dailyPoints
      if (timeframe === 'weekly') return u.weeklyPoints
      if (timeframe === 'monthly') return u.monthlyPoints
      return u.yearlyPoints
    }

    raw.sort((a, b) => getScore(b) - getScore(a))

    // Re-assign ranks within this specific board
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
    return sortedUsers.find((u) => u.isCurrentUser)
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

  const roleTabs: { id: LeaderboardRoleFilter; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: 'learner',
      label: 'Learners Leaderboard',
      count: MOCK_LEADERBOARD_USERS.filter((u) => (u.role || 'learner') === 'learner').length,
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      id: 'mentor',
      label: 'Mentors Leaderboard',
      count: MOCK_LEADERBOARD_USERS.filter((u) => u.role === 'mentor').length,
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ]

  const isMentorBoard = roleFilter === 'mentor'

  return (
    <PageContainer maxWidth="2xl" className="space-y-5">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER (ADAPTS TO ACTIVE BOARD)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border-2 shadow-3xs ${
              isMentorBoard
                ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800'
                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800'
            }`}>
              {isMentorBoard ? <GraduationCap className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {isMentorBoard ? 'Pan-African Mentors Leaderboard' : 'Pan-African Learners Leaderboard'}
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {isMentorBoard
              ? 'Recognizing verified track leads, regional educators, and curriculum fellows across Africa.'
              : 'Compete, climb tiers, and celebrate continuous coding consistency with student coders across Africa.'}
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
          PRIMARY BOARD SELECTOR: LEARNERS VS MENTORS (STRICTLY SEPARATED)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {roleTabs.map((tab) => {
          const isSelected = roleFilter === tab.id
          const isLearner = tab.id === 'learner'

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all cursor-pointer text-left shadow-xs active:scale-98 flex items-center justify-between gap-3 ${
                isSelected
                  ? isLearner
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-[#005F02] dark:border-emerald-500 text-slate-900 dark:text-white ring-2 ring-[#005F02]/20 dark:ring-emerald-500/20'
                    : 'bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-slate-900 dark:text-white ring-2 ring-indigo-600/20 dark:ring-indigo-500/20'
                  : 'bg-slate-100/70 dark:bg-[#12161A] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-3xs transition-colors ${
                  isSelected
                    ? isLearner
                      ? 'bg-[#005F02] text-white border-[#005F02]'
                      : 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-200/80 dark:bg-[#1A2027] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                }`}>
                  {tab.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black tracking-tight">{tab.label}</h3>
                    {isSelected && (
                      <span className={`w-2 h-2 rounded-full ${isLearner ? 'bg-[#005F02] dark:bg-emerald-400 animate-pulse' : 'bg-indigo-600 dark:bg-indigo-400 animate-pulse'}`} />
                    )}
                  </div>
                  <p className={`text-xs font-mono mt-0.5 ${
                    isSelected ? 'text-slate-700 dark:text-slate-300 font-bold' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {isLearner ? 'Student Rankings Cohort' : 'Educators & Track Leads Cohort'}
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black border-2 shadow-3xs shrink-0 ${
                isSelected
                  ? isLearner
                    ? 'bg-[#005F02] text-white border-[#005F02]'
                    : 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-200/80 dark:bg-[#1A2027] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}>
                {tab.count} Active
              </span>
            </button>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CONTROLS TOOLBAR: TIMEFRAME + METRICS + SEARCH + COUNTRY
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 p-3 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs">
        {/* Timeframe Segmented Control */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 shrink-0 self-start lg:self-auto">
          {timeframeTabs.map((tab) => {
            const isActive = timeframe === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeframe(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black font-mono transition-all cursor-pointer border-2 shadow-3xs active:scale-95 ${
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

            {/* Search Input */}
            <div className="relative w-full sm:w-44">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isMentorBoard ? 'Search mentor...' : 'Search learner...'}
                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#005F02]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CURRENT USER RANKING HIGHLIGHT CARD (FOR LEARNERS BOARD)
          ═══════════════════════════════════════════════════════════════ */}
      {currentUser && !isMentorBoard && (
        <UserRankCard
          currentUser={currentUser}
          timeframe={timeframe}
          metric={metric}
          rankAboveUser={rankAboveUser}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TOP 3 PODIUM (STRICTLY FOR THE ACTIVE BOARD)
          ═══════════════════════════════════════════════════════════════ */}
      {topThree.length >= 3 && (
        <LeaderboardPodium
          topUsers={topThree}
          timeframe={timeframe}
          metric={metric}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          FULL LEADERBOARD RANKINGS TABLE (STRICTLY FOR ACTIVE BOARD)
          ═══════════════════════════════════════════════════════════════ */}
      <LeaderboardTable
        users={filteredUsers}
        timeframe={timeframe}
        metric={metric}
        roleFilter={roleFilter}
      />
    </PageContainer>
  )
}

export default LeaderboardPage
