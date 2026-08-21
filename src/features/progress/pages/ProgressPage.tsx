import React from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_PROGRESS_DATA } from '../data/mockProgressData'
import { TopicProgressGrid } from '../components/TopicProgressGrid'
import { ActivityFeed } from '../components/ActivityFeed'
import { Card, CardHeader, CardTitle, CardContent, Progress } from '@/components/ui'
import { BarChart3, CheckCircle2, Flame, Clock, Target, AlertTriangle } from 'lucide-react'

export const ProgressPage: React.FC = () => {
  const data = MOCK_PROGRESS_DATA

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-500" /> Student Learning Progress & Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics on university syllabus coverage, coding consistency, strengths, and targeted focus areas.
        </p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400">Total Completion</span>
          <div className="text-2xl font-bold font-mono text-brand-600 dark:text-brand-400 mt-2">
            {data.overallCompletionPercentage}%
          </div>
          <Progress value={data.overallCompletionPercentage} variant="brand" size="sm" className="mt-2" />
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400">Active Daily Streak</span>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-2 flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-amber-500" /> {data.streakDays} Days
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Consistent practice</p>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400">Problems Solved</span>
          <div className="text-2xl font-bold font-mono text-emerald-500 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" /> {data.problemsSolvedCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">100% test pass rate</p>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400">Offline Study Hours</span>
          <div className="text-2xl font-bold font-mono text-sky-500 mt-2 flex items-center gap-1.5">
            <Clock className="w-5 h-5" /> {data.totalStudyHours}h
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Zero internet required</p>
        </Card>
      </div>

      {/* Mastery Grid */}
      <TopicProgressGrid masteries={data.topicMasteries} />

      {/* Strengths & Weaknesses Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">
                Verified Strengths
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.strengths.map((str, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{str}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weak areas */}
        <Card className="border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-sm text-amber-700 dark:text-amber-300">
                Recommended Focus Areas
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.weakAreas.map((weak, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{weak}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <ActivityFeed activities={data.recentActivities} />
    </PageContainer>
  )
}

export default ProgressPage
