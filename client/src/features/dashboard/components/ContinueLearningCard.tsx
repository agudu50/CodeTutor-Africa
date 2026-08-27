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
  Zap,
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
  return (
    <Card className="h-full flex flex-col justify-between border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs rounded-2xl sm:rounded-3xl overflow-hidden relative group">
      {/* Subtle decorative top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#005F02] via-emerald-500 to-teal-400 opacity-80" />

      <CardContent className="p-4 sm:p-6 lg:p-7 flex flex-col justify-between h-full space-y-4 sm:space-y-5">
        {/* Top Header: Progress Status + Language + Estimated Time */}
        <div className="space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-tight text-[#005F02] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                Continue Learning
              </span>

              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                {language}
              </span>
            </div>

            <div className="flex items-center shrink-0">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-3xs">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>~{estimatedRemainingMinutes} mins left</span>
              </span>
            </div>
          </div>

          {/* Module & Course Context Breadcrumb */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Link
                to={`/learning/courses/${courseId}`}
                className="flex items-center gap-1.5 text-[#005F02] dark:text-emerald-400 font-bold hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>{courseTitle}</span>
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-bold">
                Lesson {lessonNumber} of {totalLessons}
              </span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] dark:bg-emerald-400 shrink-0" />
              <span>{moduleTitle}</span>
            </div>
          </div>

          {/* Main Lesson Title */}
          <div>
            <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
              {lessonTitle}
            </h3>
          </div>

          {/* Key Concept Chips */}
          <div className="space-y-1.5 pt-0.5">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Core Focus Concepts:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {concepts.map((concept) => (
                <span
                  key={concept}
                  className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-3xs hover:border-emerald-400 transition-colors"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar and Action Buttons Toolbar */}
        <div className="space-y-3 sm:space-y-4 pt-2">
          {/* Progress Container */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 sm:space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{completedLessons} of {totalLessons} Lessons Completed</span>
              </span>
              <span className="font-mono text-[#005F02] dark:text-emerald-400 text-xs sm:text-sm font-bold">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#005F02] via-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2">
              <Link to={`/learning/lessons/${courseId}/${lessonId}`} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto font-bold px-4 h-10 sm:h-9 bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs text-xs justify-center cursor-pointer"
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70" />}
                >
                  Continue Lesson
                </Button>
              </Link>

              <Link to={`/practice/${nextExerciseId}`} className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto h-10 sm:h-9 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 shadow-3xs justify-center truncate cursor-pointer"
                  leftIcon={<Code2 className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />}
                >
                  Practice: {nextExerciseTitle}
                </Button>
              </Link>

              <Link to="/tutor" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto h-10 sm:h-9 text-xs font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 justify-center cursor-pointer shadow-3xs"
                  leftIcon={<Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                >
                  Ask Tutor
                </Button>
              </Link>
            </div>

            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 self-center sm:self-auto sm:ml-auto">
              <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>100% Offline Ready</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ContinueLearningCard.displayName = 'ContinueLearningCard'
