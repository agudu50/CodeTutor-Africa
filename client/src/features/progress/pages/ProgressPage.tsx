import React from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_PROGRESS_DATA } from '../data/mockProgressData'
import { LearningAnalyticsCharts } from '../components/LearningAnalyticsCharts'
import { TopicProgressGrid } from '../components/TopicProgressGrid'
import { ActivityFeed } from '../components/ActivityFeed'
import {
  BarChart3,
  CheckCircle2,
  Flame,
  Target,
  AlertTriangle,
  Shield,
  Check,
  Trophy,
  ChevronRight,
  Zap,
  Gamepad2,
} from 'lucide-react'

export const ProgressPage: React.FC = () => {
  const data = MOCK_PROGRESS_DATA

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-7 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Learning Progress & Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Detailed metrics on curriculum coverage, points accumulated, coding consistency, strengths, and targeted focus areas.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-black text-[#005F02] dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs shrink-0 self-start sm:self-center">
          <Shield className="w-3.5 h-3.5" /> 100% Offline Synced
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PRIMARY KPI ROW (5 EQUAL METRIC CARDS)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
        {/* Metric 1: Total Experience (XP Points) */}
        <Link to="/leaderboard" className="block focus:outline-none rounded-3xl">
          <div className="p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs hover:border-[#005F02] dark:hover:border-emerald-500 transition-all flex flex-col justify-between h-full active:scale-[0.99]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total XP
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-3xs">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                2,450
              </div>
            </div>
            <div className="pt-3 mt-2 border-t-2 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-black text-amber-800 dark:text-amber-400 block truncate">
                Rank #4 • Diamond Tier
              </span>
            </div>
          </div>
        </Link>

        {/* Metric 2: Arcade & Game Points */}
        <Link to="/games" className="block focus:outline-none rounded-3xl">
          <div className="p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs hover:border-[#005F02] dark:hover:border-emerald-500 transition-all flex flex-col justify-between h-full active:scale-[0.99]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Game XP
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
                  <Gamepad2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                1,280
              </div>
            </div>
            <div className="pt-3 mt-2 border-t-2 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-black text-[#005F02] dark:text-emerald-400 block truncate">
                4 Games Mastered
              </span>
            </div>
          </div>
        </Link>

        {/* Metric 3: Active Daily Streak */}
        <Link to="/leaderboard" className="block focus:outline-none rounded-3xl">
          <div className="p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs hover:border-orange-500 transition-all flex flex-col justify-between h-full active:scale-[0.99]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Daily Streak
                </span>
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-400 border-2 border-orange-300 dark:border-orange-800 flex items-center justify-center shrink-0 shadow-3xs">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white flex items-baseline gap-1">
                <span>{data.streakDays}</span>
                <span className="text-xs font-black text-slate-500">Days</span>
              </div>
            </div>
            <div className="pt-3 mt-2 border-t-2 border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <span className="text-xs font-mono font-black text-orange-700 dark:text-orange-400 truncate">
                Personal best streak
              </span>
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-current shrink-0" />
            </div>
          </div>
        </Link>

        {/* Metric 4: Problems Solved */}
        <Link to="/practice" className="block focus:outline-none rounded-3xl">
          <div className="p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs hover:border-[#005F02] dark:hover:border-emerald-500 transition-all flex flex-col justify-between h-full active:scale-[0.99]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Solved
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                {data.problemsSolvedCount}
              </div>
            </div>
            <div className="pt-3 mt-2 border-t-2 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-black text-[#005F02] dark:text-emerald-400 block truncate">
                98 Quizzes Passed
              </span>
            </div>
          </div>
        </Link>

        {/* Metric 5: Total Completion */}
        <Link to="/learning" className="block focus:outline-none rounded-3xl sm:col-span-2 lg:col-span-1">
          <div className="p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs hover:border-[#005F02] dark:hover:border-emerald-500 transition-all flex flex-col justify-between h-full active:scale-[0.99]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Courses
                </span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  24/38 Done
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                {data.overallCompletionPercentage}%
              </div>
            </div>
            <div className="pt-3 mt-2 border-t-2 border-slate-200 dark:border-slate-800">
              <div className="h-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#005F02] transition-all duration-500"
                  style={{ width: `${data.overallCompletionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          INTERACTIVE GRAPHS & ANALYTICS SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <LearningAnalyticsCharts />

      {/* ═══════════════════════════════════════════════════════════════
          MASTERY GRID
          ═══════════════════════════════════════════════════════════════ */}
      <TopicProgressGrid masteries={data.topicMasteries} />

      {/* ═══════════════════════════════════════════════════════════════
          STRENGTHS & RECOMMENDED FOCUS AREAS (2-COL)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Strengths Card */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs flex flex-col justify-between h-full overflow-hidden">
          <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Verified Strengths
              </h3>
            </div>
            <span className="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
              Mastered
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-around">
            {data.strengths.map((str: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/60 dark:bg-[#12161A] border-2 border-slate-200 dark:border-slate-800 shadow-3xs"
              >
                <div className="w-6 h-6 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 mt-0.5 shadow-3xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {str}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Focus Areas Card */}
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs flex flex-col justify-between h-full overflow-hidden">
          <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-3xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Recommended Focus Areas
              </h3>
            </div>
            <span className="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 shadow-3xs">
              Action Items
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-around">
            {data.weakAreas.map((weak: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/60 dark:bg-[#12161A] border-2 border-slate-200 dark:border-slate-800 shadow-3xs"
              >
                <div className="w-6 h-6 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 font-mono text-xs font-black mt-0.5 shadow-3xs">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {weak}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          LEADERBOARD TEASER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-6 sm:p-7 rounded-3xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 border-2 border-amber-600 text-white flex items-center justify-center shadow-3xs shrink-0">
            <Trophy className="w-6 h-6 fill-white" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Pan-African Leaderboard
              </h3>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-black border-2 border-amber-400 dark:border-amber-700 shadow-3xs">
                You are Rank #4
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Track daily streaks, weekly sprints, and points accumulated across all African hubs.
            </p>
          </div>
        </div>

        <Link
          to="/leaderboard"
          className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white text-xs font-black border-2 border-[#005F02] shadow-xs active:scale-95 transition-all shrink-0 self-start sm:self-center"
        >
          <span>View Full Leaderboard</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ACTIVITY TIMELINE
          ═══════════════════════════════════════════════════════════════ */}
      <ActivityFeed activities={data.recentActivities} />
    </PageContainer>
  )
}

export default ProgressPage
