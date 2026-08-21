import React from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_DASHBOARD_DATA } from '../data/mockDashboardData'
import { MOCK_COURSES } from '@/features/learning/data/mockCourseData'
import { ContinueLearningCard } from '../components/ContinueLearningCard'
import { ProgressOverview } from '../components/ProgressOverview'
import { WeakAreasCard } from '../components/WeakAreasCard'
import { RecentTutorCard } from '../components/RecentTutorCard'
import { QuickActions } from '../components/QuickActions'

export const DashboardPage: React.FC = () => {
  const data = MOCK_DASHBOARD_DATA

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {data.user.name} 👋
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {data.user.university} • Daily study target: 45 mins
          </p>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <ProgressOverview
        streakDays={data.user.streakDays}
        totalHours={data.user.totalHours}
        problemsSolved={data.user.problemsSolved}
        coursesCount={MOCK_COURSES.length}
      />

      {/* Main Focus: Continue Learning + Quick Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ContinueLearningCard {...data.continueLearning} />
          <QuickActions />
        </div>

        <div className="space-y-6">
          <WeakAreasCard weakAreas={data.weakAreas} />
          <RecentTutorCard sessions={data.recentTutorSessions} />
        </div>
      </div>
    </PageContainer>
  )
}

export default DashboardPage
