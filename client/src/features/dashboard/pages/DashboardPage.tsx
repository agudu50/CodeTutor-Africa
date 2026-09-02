import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Avatar } from '@/components/ui'
import { MOCK_DASHBOARD_DATA } from '../data/mockDashboardData'
import { MOCK_COURSES } from '@/features/learning/data/mockCourseData'
import { useUserProfile } from '@/app/providers/UserProfileProvider'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { activeLearningService, ActiveLessonState } from '@/services/learning/active-learning.service'
import { getStoredTutorSessions, TutorSessionPreview } from '@/features/tutor/services/tutor-storage.service'
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
  Zap,
} from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const data = MOCK_DASHBOARD_DATA
  const { profile } = useUserProfile()
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'
  const firstName = profile.fullName ? profile.fullName.trim().split(' ')[0] : 'Learner'

  // Dynamic active lesson state (persisted across sessions)
  const [activeLesson, setActiveLesson] = useState<ActiveLessonState>(() =>
    activeLearningService.getActiveLesson()
  )

  // Dynamic recent AI tutor sessions state (real-time chat updates)
  const [tutorSessions, setTutorSessions] = useState<TutorSessionPreview[]>(() =>
    getStoredTutorSessions()
  )

  useEffect(() => {
    const handleActiveLessonUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<ActiveLessonState>
      if (customEvent.detail) {
        setActiveLesson(customEvent.detail)
      } else {
        setActiveLesson(activeLearningService.getActiveLesson())
      }
    }

    const handleTutorSessionsUpdated = () => {
      setTutorSessions(getStoredTutorSessions())
    }

    window.addEventListener('active_lesson_updated', handleActiveLessonUpdated)
    window.addEventListener('tutor_sessions_updated', handleTutorSessionsUpdated)
    window.addEventListener('storage', handleActiveLessonUpdated)
    window.addEventListener('storage', handleTutorSessionsUpdated)
    return () => {
      window.removeEventListener('active_lesson_updated', handleActiveLessonUpdated)
      window.removeEventListener('tutor_sessions_updated', handleTutorSessionsUpdated)
      window.removeEventListener('storage', handleActiveLessonUpdated)
      window.removeEventListener('storage', handleTutorSessionsUpdated)
    }
  }, [])

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
      <div className="relative overflow-hidden rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] p-5 sm:p-7 shadow-md dark:shadow-2xl">
        {/* Technical Blueprint Grid Pattern */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.065] dark:opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dashboard-blueprint-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dashboard-blueprint-grid)" />
        </svg>

        {/* Blueprint Corner Crosshairs (+) */}
        <span className="absolute top-3 left-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>
        <span className="absolute top-3 right-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>
        <span className="absolute bottom-3 left-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>
        <span className="absolute bottom-3 right-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 sm:gap-6">
          {/* Top/Left Section: Avatar + Dynamic Greeting + Identity + Pill Badges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0 flex-1">
            <div className="flex items-center gap-3.5 sm:block shrink-0 w-full sm:w-auto">
              {/* Streak-wrapped Avatar Container */}
              <div className="relative shrink-0 group">
                {/* Solid Streak Ring Border */}
                <div className="p-1 rounded-full bg-amber-400 dark:bg-amber-500 border-2 border-amber-500 dark:border-amber-400 shadow-md">
                  <Avatar
                    src={profile.avatarUrl || undefined}
                    fallbackName={profile.fullName || 'User'}
                    size="lg"
                    className="bg-[#005F02] text-white font-bold w-12 h-12 sm:w-16 sm:h-16 text-base sm:text-xl border-2 border-white dark:border-[#0C1015]"
                  />
                </div>

                {/* Flame Streak Pill Badge Anchored directly to Avatar */}
                <Link
                  to="/progress"
                  className="absolute -bottom-2 inset-x-0 mx-auto w-fit flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-mono font-black text-[11px] shadow-sm border-2 border-white dark:border-[#0C1015] hover:scale-105 active:scale-95 transition-transform z-10"
                  title={`${data.user.streakDays}-Day Active Learning Streak`}
                >
                  <Flame className="w-3 h-3 fill-white text-white shrink-0 animate-bounce" />
                  <span>{data.user.streakDays}d</span>
                </Link>

                {/* Online / Offline status badge on top-right of Avatar */}
                <span
                  className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white dark:border-[#0C1015] flex items-center justify-center z-10 ${
                    isOffline ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  title={isOffline ? 'Offline Mode Active' : 'Online Sync Active'}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              {/* Mobile-only compact name beside avatar */}
              <div className="sm:hidden min-w-0 flex-1 pl-1">
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white truncate">
                  Welcome, <span className="text-[#005F02] dark:text-emerald-400">{firstName}</span>
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {profile.bio || 'Independent Learner'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 min-w-0 flex-1 w-full">
              {/* Dynamic Time of Day & Clock Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold shadow-3xs">
                  <GreetingIcon className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
                  <span>{greeting}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-[#0E1318] text-slate-800 dark:text-slate-200 font-mono text-xs font-bold border border-slate-300 dark:border-slate-700 shadow-3xs">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{formattedTime}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold border border-slate-300 dark:border-slate-700 shadow-3xs">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{formattedDate}</span>
                </span>

                <Link
                  to="/leaderboard"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-mono font-black text-xs border border-amber-300 dark:border-amber-700 hover:border-amber-500 shadow-3xs transition-all"
                  title="View Pan-African Leaderboard"
                >
                  <Zap className="w-3.5 h-3.5 fill-amber-600 text-amber-600 shrink-0" />
                  <span>2,450 XP</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-300 dark:bg-amber-900 text-amber-950 dark:text-amber-100 font-black">
                    #4
                  </span>
                </Link>
              </div>

              {/* Desktop/Tablet Heading */}
              <div className="hidden sm:block">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Welcome back,{' '}
                  <span className="text-[#005F02] dark:text-emerald-400 font-black">
                    {firstName}
                  </span>
                </h1>

                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate max-w-2xl pt-0.5">
                  {profile.bio || 'Independent Learner & Aspiring Systems Software Engineer'}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom/Right Section: Today's Study Progress Card + Action Buttons */}
          <div className="flex flex-col sm:flex-row xl:flex-col items-stretch sm:items-center xl:items-end gap-3 shrink-0 w-full xl:w-auto pt-1 xl:pt-0">
            {/* Daily Goal Card */}
            <div className="w-full sm:w-72 xl:w-64 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[#005F02] dark:text-emerald-400 shadow-3xs">
                    <Target className="w-4 h-4 shrink-0" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
                      Today's Goal
                    </span>
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono leading-tight">
                      {studiedTodayMins}m <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ {targetMins}m</span>
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 font-mono font-black text-xs border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  {progressPercent}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-300 dark:border-slate-700 p-0.5">
                  <div
                    className="bg-[#005F02] h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
                  <span>{Math.max(0, targetMins - studiedTodayMins)}m remaining</span>
                  <span className="text-[#005F02] dark:text-emerald-400 font-bold">✓ On Track</span>
                </div>
              </div>
            </div>

            {/* Header Action Shortcuts */}
            <div className="grid grid-cols-2 gap-2.5 shrink-0 w-full sm:w-auto">
              <Link to="/tutor" className="w-full">
                <button
                  type="button"
                  className="w-full h-11 px-4 text-xs font-bold text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] hover:border-[#005F02] hover:text-[#005F02] rounded-xl flex items-center justify-center gap-2 shadow-3xs transition-all cursor-pointer active:scale-95"
                >
                  <Bot className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                  <span>Ask AI Tutor</span>
                </button>
              </Link>

              <Link to="/learning" className="w-full">
                <button
                  type="button"
                  className="w-full h-11 px-4 text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Courses</span>
                </button>
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
          <ContinueLearningCard {...activeLesson} />
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <RecentTutorCard sessions={tutorSessions} />
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
