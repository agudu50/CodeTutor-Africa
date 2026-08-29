import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Button } from '@/components/ui'
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
    <Card className="h-full border border-slate-200/90 dark:border-slate-800/90 bg-linear-to-br from-white via-white to-emerald-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/10 shadow-xs rounded-2xl sm:rounded-3xl overflow-hidden relative">
      <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full space-y-3">
        {/* Top Header Row: Status Pills & Time Estimation */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005F02] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
              Current Lesson
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              {getLanguageIcon(language)}
              {language}
            </span>

            <span className="hidden md:inline-flex text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              • {moduleTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>~{estimatedRemainingMinutes} mins</span>
            </span>

            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 hidden sm:inline-flex">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Offline
            </span>
          </div>
        </div>

        {/* Course & Lesson Title Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Link
              to={`/learning/courses/${courseId}`}
              className="flex items-center gap-1 text-[#005F02] dark:text-emerald-400 font-bold hover:underline"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{courseTitle}</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
              Lesson {lessonNumber} of {totalLessons}
            </span>
          </div>

          <h3 className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {lessonTitle}
          </h3>
        </div>

        {/* Compact Skills Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
            Focus:
          </span>
          {concepts.map((concept) => (
            <span
              key={concept}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-3xs"
            >
              {concept}
            </span>
          ))}
        </div>

        {/* Compact Progress Bar */}
        <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shadow-3xs">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{completedLessons} of {totalLessons} Lessons Done</span>
            </span>
            <span className="font-mono text-[#005F02] dark:text-emerald-400 text-xs font-bold">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#005F02] dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Primary CTA */}
          <Link to={`/learning/lessons/${courseId}/${lessonId}`} className="flex-1 sm:flex-initial">
            <Button
              variant="primary"
              size="sm"
              className="w-full sm:w-auto font-bold px-3.5 h-8 bg-[#005F02] hover:bg-[#004e02] text-white shadow-3xs text-xs justify-center cursor-pointer"
              leftIcon={<Play className="w-3 h-3 fill-current" />}
              rightIcon={<ArrowRight className="w-3 h-3 ml-0.5 opacity-70" />}
            >
              Continue Lesson
            </Button>
          </Link>

          {/* Secondary Practice Drill */}
          <Link to={`/practice/${nextExerciseId}`} className="flex-1 sm:flex-initial">
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto h-8 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 shadow-3xs justify-center truncate cursor-pointer"
              leftIcon={<Code2 className="w-3 h-3 text-[#005F02] dark:text-emerald-400" />}
            >
              Practice: {nextExerciseTitle}
            </Button>
          </Link>

          {/* Tertiary Ask Tutor */}
          <Link to="/tutor" className="w-full sm:w-auto sm:ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 justify-center cursor-pointer shadow-3xs"
              leftIcon={<Bot className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
            >
              Ask Tutor
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
})

ContinueLearningCard.displayName = 'ContinueLearningCard'
