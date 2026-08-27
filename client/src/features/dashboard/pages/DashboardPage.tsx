import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button, Avatar } from '@/components/ui'
import { MOCK_DASHBOARD_DATA } from '../data/mockDashboardData'
import { MOCK_COURSES } from '@/features/learning/data/mockCourseData'
import { useUserProfile } from '@/app/providers/UserProfileProvider'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { ContinueLearningCard } from '../components/ContinueLearningCard'
import { ProgressOverview } from '../components/ProgressOverview'
import { WeakAreasCard } from '../components/WeakAreasCard'
import { RecentTutorCard } from '../components/RecentTutorCard'
import { QuickActions } from '../components/QuickActions'
import {
  Target,
  BookOpen,
  Bot,
  Clock,
  Flame,
  Sun,
  Moon,
} from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const data = MOCK_DASHBOARD_DATA
  const { profile } = useUserProfile()
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'
  const firstName = profile.fullName ? profile.fullName.trim().split(' ')[0] : 'Learner'

  // Real-time Clock & Greeting state
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Derive dynamic time-of-day greeting and icon
  const hour = currentTime.getHours()
  let greeting = 'Good day'
  let GreetingIcon = Sun

  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning'
    GreetingIcon = Sun
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon'
    GreetingIcon = Sun
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good evening'
    GreetingIcon = Moon
  } else {
    greeting = 'Good night'
    GreetingIcon = Moon
  }

  // Format date and time
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Calculate daily goal progress (Mock: 32 mins out of target)
  const targetMins = profile.dailyTargetMins || 45
  const studiedTodayMins = 32
  const progressPercent = Math.min(100, Math.round((studiedTodayMins / targetMins) * 100))

  return (
    <PageContainer maxWidth="2xl" className="space-y-4 sm:space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          ENHANCED WELCOME HEADER HERO BANNER (Responsive Mobile & Desktop)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-br from-white via-slate-50/70 to-emerald-50/40 dark:from-slate-900 dark:via-slate-900/95 dark:to-emerald-950/20 p-4 sm:p-6 lg:p-7 shadow-xs">
        {/* Ambient background blur glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 sm:gap-6">
          {/* Top/Left Section: Avatar + Dynamic Greeting + Identity + Pill Badges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
            <div className="flex items-center gap-3.5 sm:block shrink-0 w-full sm:w-auto">
              <div className="relative shrink-0">
                <Avatar
                  src={profile.avatarUrl || undefined}
                  fallbackName={profile.fullName || 'User'}
                  size="lg"
                  className="bg-[#005F02] text-white font-bold shadow-md ring-2 sm:ring-3 ring-[#005F02]/25 dark:ring-emerald-500/20 w-12 h-12 sm:w-16 sm:h-16 text-base sm:text-xl"
                />
                {/* Online / Offline status badge on avatar */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                    isOffline ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  title={isOffline ? 'Offline Mode Active' : 'Online Sync Active'}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              {/* Mobile-only compact name beside avatar */}
              <div className="sm:hidden min-w-0 flex-1">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                  Welcome, <span className="text-[#005F02] dark:text-emerald-400 font-black">{firstName}</span>
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {profile.bio || 'Independent Learner'}
                </p>
              </div>
            </div>

            <div className="space-y-2 min-w-0 flex-1 w-full">
              {/* Dynamic Time of Day & Clock Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                  <GreetingIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{greeting}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-mono text-[11px] border border-slate-200/70 dark:border-slate-700/70">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{formattedTime}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-mono text-[11px] border border-slate-200/70 dark:border-slate-700/70">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{formattedDate}</span>
                </span>
              </div>

              {/* Desktop/Tablet Heading */}
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Welcome back,{' '}
                  <span className="text-[#005F02] dark:text-emerald-400 font-black">
                    {firstName}
                  </span>
                </h1>

                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 truncate max-w-2xl pt-0.5">
                  {profile.bio || 'Independent Learner & Aspiring Systems Software Engineer'}
                </p>
              </div>

              {/* Status Badges Row (Optimized for Mobile Wrapping) */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                {/* Streak Badge */}
                <Link
                  to="/progress"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-800/80 text-xs font-bold text-amber-700 dark:text-amber-400 font-mono shadow-3xs hover:border-amber-400 transition-colors"
                  title="Active Learning Streak"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                  <span>{data.user.streakDays}d Streak</span>
                </Link>

                {/* Offline AI Tutor Status Pill */}
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-3xs"
                  title="Your AI Tutor works 100% offline without internet"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>AI Tutor Ready (Offline)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom/Right Section: Today's Study Progress Card + Action Buttons */}
          <div className="flex flex-col sm:flex-row xl:flex-col items-stretch sm:items-center xl:items-end gap-2.5 sm:gap-3 shrink-0 w-full xl:w-auto pt-1 xl:pt-0">
            {/* Daily Goal Mini Progress Bar */}
            <div className="w-full sm:w-60 xl:w-56 p-2.5 sm:p-3 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Today's Goal</span>
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                  {studiedTodayMins}m / {targetMins}m ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#005F02] via-brand-600 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Header Action Shortcuts */}
            <div className="grid grid-cols-2 gap-2 shrink-0 w-full sm:w-auto">
              <Link to="/tutor" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-10 sm:h-9 text-xs font-bold text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/40 justify-center shadow-3xs"
                  leftIcon={<Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                >
                  Ask AI Tutor
                </Button>
              </Link>

              <Link to="/learning" className="w-full">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full h-10 sm:h-9 text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs justify-center"
                  leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                >
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ROW 1: PRIMARY METRICS OVERVIEW (4 Equal-Height Cards)
          ═══════════════════════════════════════════════════════════════ */}
      <ProgressOverview
        streakDays={data.user.streakDays}
        totalHours={data.user.totalHours}
        problemsSolved={data.user.problemsSolved}
        coursesCount={MOCK_COURSES.length}
      />

      {/* ═══════════════════════════════════════════════════════════════
          ROW 2: HERO LEARNING MODULE & RECENT AI SESSIONS (Equal-Height)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <ContinueLearningCard {...data.continueLearning} />
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <RecentTutorCard sessions={data.recentTutorSessions} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ROW 3: QUICK WORKSPACES & FOCUS AREAS (Equal-Height)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <QuickActions />
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <WeakAreasCard weakAreas={data.weakAreas} />
        </div>
      </div>
    </PageContainer>
  )
}

export default DashboardPage
