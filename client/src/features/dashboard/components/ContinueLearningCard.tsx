import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import {
  Play,
  Code2,
  Clock,
  BookOpen,
  Bot,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Terminal,
  Cpu,
  Layers,
} from 'lucide-react'

interface ContinueLearningProps {
  courseId: string
  courseTitle: string
  moduleTitle: string
  lessonId: string
  lessonTitle: string
  lessonNumber: number
  totalLessons: number
  completedLessons: number
  progressPercent: number
  estimatedRemainingMinutes: number
  language: string
  concepts: string[]
  nextExerciseTitle: string
  nextExerciseId: string
}

export const ContinueLearningCard: React.FC<ContinueLearningProps> = memo(({
  courseId,
  courseTitle,
  moduleTitle,
  lessonId,
  lessonTitle,
  lessonNumber,
  totalLessons,
  completedLessons,
  progressPercent,
  estimatedRemainingMinutes,
  language,
  concepts,
  nextExerciseTitle,
  nextExerciseId,
}) => {
  const getLanguageIcon = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return <Terminal className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
      case 'javascript':
        return <Code2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
      case 'java':
        return <Cpu className="w-3 h-3 text-rose-600 dark:text-rose-400" />
      default:
        return <Layers className="w-3 h-3 text-sky-600 dark:text-sky-400" />
    }
  }

  return (
    <div className="h-full border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
      {/* Top Header Row: Status Pills & Time Estimation */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005F02] dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800 font-mono shadow-3xs">
            <span className="w-2 h-2 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
            Current Lesson
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-3xs">
            {getLanguageIcon(language)}
            {language}
          </span>

          <span className="hidden md:inline-flex items-center px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-300 dark:border-slate-700 shadow-3xs">
            {moduleTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-3xs font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>~{estimatedRemainingMinutes} mins</span>
          </span>

          <span className="text-xs text-[#005F02] dark:text-emerald-400 font-mono font-bold flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800 shadow-3xs hidden sm:inline-flex">
            <ShieldCheck className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
            Offline
          </span>
        </div>
      </div>

      {/* Course & Lesson Title Section */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link
            to={`/learning/courses/${courseId}`}
            className="flex items-center gap-1.5 text-[#005F02] dark:text-emerald-400 font-bold hover:underline font-mono"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>{courseTitle}</span>
          </Link>
          <span className="text-slate-400 dark:text-slate-600 font-black">•</span>
          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
            Lesson {lessonNumber} of {totalLessons}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-snug">
          {lessonTitle}
        </h2>
      </div>

      {/* Compact Focus Skills Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
          Focus:
        </span>
        {concepts.map((concept) => (
          <span
            key={concept}
            className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-3xs"
          >
            {concept}
          </span>
        ))}
      </div>

      {/* Structured Progress Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-mono text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
            <span>{completedLessons} of {totalLessons} Lessons Done</span>
          </span>
          <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-3xs">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-slate-700 p-0.5">
          <div
            className="bg-[#005F02] h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {/* Primary CTA */}
        <Link to={`/learning/lessons/${courseId}/${lessonId}`} className="flex-1 sm:flex-initial">
          <button
            type="button"
            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Continue Lesson</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </button>
        </Link>

        {/* Secondary Practice Drill */}
        <Link to={`/practice/${nextExerciseId}`} className="flex-1 sm:flex-initial min-w-0">
          <button
            type="button"
            className="w-full sm:w-auto h-11 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] hover:border-[#005F02] hover:text-[#005F02] text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 shadow-3xs transition-all cursor-pointer active:scale-95 truncate max-w-sm"
          >
            <Code2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
            <span className="truncate">Practice: {nextExerciseTitle}</span>
          </button>
        </Link>

        {/* Tertiary Ask Tutor */}
        <Link to="/tutor" className="w-full sm:w-auto sm:ml-auto">
          <button
            type="button"
            className="w-full sm:w-auto h-11 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] hover:border-[#005F02] hover:text-[#005F02] text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 shadow-3xs transition-all cursor-pointer active:scale-95"
          >
            <Bot className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
            <span>Ask Tutor</span>
          </button>
        </Link>
      </div>
    </div>
  )
})

ContinueLearningCard.displayName = 'ContinueLearningCard'
