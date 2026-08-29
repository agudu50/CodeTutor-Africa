import React from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_PROGRESS_DATA } from '../data/mockProgressData'
import { TopicProgressGrid } from '../components/TopicProgressGrid'
import { ActivityFeed } from '../components/ActivityFeed'
import { Card, CardHeader, CardTitle, CardContent, Progress } from '@/components/ui'
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
            Detailed metrics on curriculum coverage, points accumulated, coding consistency, strengths, and targeted focus areas.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 shrink-0 self-start sm:self-center">
          <Shield className="w-3.5 h-3.5" /> 100% Offline Synced
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PRIMARY KPI ROW (5 EQUAL METRIC CARDS)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
        {/* Metric 1: Total Experience (XP Points) */}
        <Link to="/leaderboard" className="block focus:outline-none focus:ring-2 focus:ring-amber-500/40 rounded-2xl">
          <Card className="p-4 sm:p-5 border border-amber-200/90 dark:border-amber-900/60 bg-linear-to-b from-amber-50/50 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Total XP
                </span>
                <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                  <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                2,450
              </div>
            </div>
            <div className="pt-2.5 border-t border-amber-100 dark:border-amber-900/40">
              <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 block truncate">
                Rank #4 • Diamond Tier
              </span>
            </div>
          </Card>
        </Link>

        {/* Metric 2: Arcade & Game Points */}
        <Link to="/games" className="block focus:outline-none focus:ring-2 focus:ring-brand-500/40 rounded-2xl">
          <Card className="p-4 sm:p-5 border border-brand-200/90 dark:border-brand-900/60 bg-linear-to-b from-brand-50/50 via-white to-white dark:from-brand-950/20 dark:via-slate-900 dark:to-slate-900 shadow-xs hover:border-brand-400 dark:hover:border-brand-600 transition-all flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                  Game XP
                </span>
                <div className="p-1 rounded-md bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-300 dark:border-brand-800">
                  <Gamepad2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                1,280
              </div>
            </div>
            <div className="pt-2.5 border-t border-brand-100 dark:border-brand-900/40">
              <span className="text-[11px] font-mono font-bold text-brand-700 dark:text-brand-400 block truncate">
                4 Games Mastered
              </span>
            </div>
          </Card>
        </Link>

        {/* Metric 3: Active Daily Streak */}
        <Link to="/leaderboard" className="block focus:outline-none focus:ring-2 focus:ring-orange-500/40 rounded-2xl">
          <Card className="p-4 sm:p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-orange-400 dark:hover:border-orange-600 transition-all flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Daily Streak
                </span>
                <div className="p-1 rounded-md bg-orange-50 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/80">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white flex items-baseline gap-1">
                <span>{data.streakDays}</span>
                <span className="text-xs font-bold text-slate-400 font-sans">Days</span>
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold block truncate">
                Personal best streak 🔥
              </span>
            </div>
          </Card>
        </Link>

        {/* Metric 4: Problems Solved */}
        <Link to="/practice" className="block focus:outline-none focus:ring-2 focus:ring-emerald-500/40 rounded-2xl">
          <Card className="p-4 sm:p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Solved
                </span>
                <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                {data.problemsSolvedCount}
              </div>
            </div>
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block truncate">
                98 Quizzes Passed
              </span>
            </div>
          </Card>
        </Link>

        {/* Metric 5: Total Completion */}
        <Link to="/learning" className="block focus:outline-none focus:ring-2 focus:ring-brand-500/40 rounded-2xl sm:col-span-2 lg:col-span-1">
          <Card className="p-4 sm:p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-brand-400 dark:hover:border-brand-600 transition-all flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Courses
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                  24/38 Done
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                {data.overallCompletionPercentage}%
              </div>
            </div>
            <div className="space-y-1 pt-2">
              <Progress value={data.overallCompletionPercentage} variant="brand" size="sm" />
            </div>
          </Card>
        </Link>
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
            {data.strengths.map((str: string, idx: number) => (
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
            {data.weakAreas.map((weak: string, idx: number) => (
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
          LEADERBOARD TEASER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-6 rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-amber-950/10 dark:to-transparent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Trophy className="w-6 h-6 fill-white" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Pan-African Leaderboard
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800">
                You are Rank #4
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track daily streaks, weekly sprints, and points accumulated across all African hubs.
            </p>
          </div>
        </div>

        <Link
          to="/leaderboard"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#005F02] text-white text-xs font-bold hover:bg-[#004e02] transition-colors shadow-xs shrink-0 self-start sm:self-center"
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
