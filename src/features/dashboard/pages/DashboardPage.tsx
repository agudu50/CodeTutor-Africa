import React from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui'
import { MOCK_DASHBOARD_DATA } from '../data/mockDashboardData'
import { MOCK_COURSES } from '@/features/learning/data/mockCourseData'
import { useUserProfile } from '@/app/providers/UserProfileProvider'
import { ContinueLearningCard } from '../components/ContinueLearningCard'
import { ProgressOverview } from '../components/ProgressOverview'
import { WeakAreasCard } from '../components/WeakAreasCard'
import { RecentTutorCard } from '../components/RecentTutorCard'
import { QuickActions } from '../components/QuickActions'
import { Target, BookOpen, Bot } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const data = MOCK_DASHBOARD_DATA
  const { profile } = useUserProfile()

  return (
    <PageContainer maxWidth="2xl" className="space-y-4 sm:space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          WELCOME HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Welcome back, {profile.fullName} 👋
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              100% Offline AI
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate">{profile.location}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
              <Target className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
              Daily target: {profile.dailyTargetMins} mins
            </span>
          </div>
        </div>

        {/* Header Action Shortcuts */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
          <Link to="/tutor" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-9 text-xs font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 justify-center"
              leftIcon={<Bot className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
            >
              Ask AI Tutor
            </Button>
          </Link>
          <Link to="/learning" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              className="w-full h-9 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs justify-center"
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
            >
              Browse Courses
            </Button>
          </Link>
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
