import React from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_PROGRESS_DATA } from '../data/mockProgressData'
import { TopicProgressGrid } from '../components/TopicProgressGrid'
import { ActivityFeed } from '../components/ActivityFeed'
import { Card, CardHeader, CardTitle, CardContent, Progress } from '@/components/ui'
import { BarChart3, CheckCircle2, Flame, Clock, Target, AlertTriangle, Shield, Check } from 'lucide-react'

export const ProgressPage: React.FC = () => {
  const data = MOCK_PROGRESS_DATA

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Learning Progress & Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Detailed metrics on curriculum coverage, coding consistency, strengths, and targeted focus areas.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 shrink-0 self-start sm:self-center">
          <Shield className="w-3.5 h-3.5" /> 100% Offline Synced
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PRIMARY KPI ROW (4 EQUAL HEIGHT METRIC CARDS)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* Metric 1: Total Completion */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Completion
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                24/38 Done
              </span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {data.overallCompletionPercentage}%
            </div>
          </div>
          <div className="space-y-1 pt-3">
            <Progress value={data.overallCompletionPercentage} variant="brand" size="sm" />
            <span className="text-[11px] text-slate-400 font-medium block">All tracks combined</span>
          </div>
        </Card>

        {/* Metric 2: Active Daily Streak */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Daily Streak
              </span>
              <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white flex items-baseline gap-1.5">
              <span>{data.streakDays}</span>
              <span className="text-sm font-bold text-slate-400 font-sans">Days</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Personal best streak
            </span>
          </div>
        </Card>

        {/* Metric 3: Problems Solved */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Problems Solved
              </span>
              <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {data.problemsSolvedCount}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> 100% test pass rate
            </span>
          </div>
        </Card>

        {/* Metric 4: Offline Study Hours */}
        <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Study Hours
              </span>
              <div className="p-1 rounded-md bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/80">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white flex items-baseline gap-1.5">
              <span>{data.totalStudyHours}</span>
              <span className="text-sm font-bold text-slate-400 font-sans">hrs</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-sky-500" /> Zero internet required
            </span>
          </div>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MASTERY GRID
          ═══════════════════════════════════════════════════════════════ */}
      <TopicProgressGrid masteries={data.topicMasteries} />

      {/* ═══════════════════════════════════════════════════════════════
          STRENGTHS & RECOMMENDED FOCUS AREAS (EQUAL HEIGHT 2-COL)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Strengths Card */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
          <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                  <Target className="w-4 h-4" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Verified Strengths
                </CardTitle>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                Mastered
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-around">
            {data.strengths.map((str, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {str}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Focus Areas Card */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
          <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Recommended Focus Areas
                </CardTitle>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
                Action Items
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-around">
            {data.weakAreas.map((weak, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold mt-0.5">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {weak}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ACTIVITY TIMELINE
          ═══════════════════════════════════════════════════════════════ */}
      <ActivityFeed activities={data.recentActivities} />
    </PageContainer>
  )
}

export default ProgressPage
