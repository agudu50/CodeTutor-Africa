import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Button, Badge, Progress } from '@/components/ui'
import {
  Play,
  Code2,
  Clock,
  BookOpen,
  Bot,
  ArrowRight,
  CheckCircle2,
  Sparkles,
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
    <Card className="h-full flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full space-y-5">
        {/* Top Meta Bar */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-2.5 py-1 rounded-md border border-brand-200 dark:border-brand-800/80 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                Continue Learning
              </span>
              <Badge variant="brand" size="sm" className="font-mono uppercase font-bold text-[11px]">
                {language}
              </Badge>
              <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {moduleTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700/80">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> ~{estimatedRemainingMinutes} mins left
              </span>
            </div>
          </div>

          {/* Main Lesson Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
              <Link
                to={`/learning/courses/${courseId}`}
                className="hover:text-brand-600 dark:hover:text-brand-400 hover:underline transition-colors font-medium"
              >
                {courseTitle}
              </Link>
              <span>•</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">
                Lesson {lessonNumber} of {totalLessons}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {lessonTitle}
            </h3>

            {/* Key Concept Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 font-mono">
                Focus:
              </span>
              {concepts.map((concept) => (
                <span
                  key={concept}
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar and Action Buttons */}
        <div className="space-y-4 pt-2">
          {/* Progress Container */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{completedLessons} of {totalLessons} Lessons Completed</span>
              </span>
              <span className="font-mono text-brand-700 dark:text-brand-400 text-sm font-bold">
                {progressPercent}%
              </span>
            </div>
            <Progress value={progressPercent} variant="brand" size="md" />
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link to={`/learning/lessons/${lessonId}`}>
                <Button
                  variant="primary"
                  size="md"
                  className="font-bold px-4 h-10 bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
                  leftIcon={<Play className="w-4 h-4 fill-current" />}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70" />}
                >
                  Continue Lesson
                </Button>
              </Link>

              <Link to={`/practice/${nextExerciseId}`}>
                <Button
                  variant="secondary"
                  size="md"
                  className="h-10 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 shadow-xs"
                  leftIcon={<Code2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                >
                  Practice: {nextExerciseTitle}
                </Button>
              </Link>

              <Link to="/tutor">
                <Button
                  variant="outline"
                  size="md"
                  className="h-10 text-xs text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600"
                  leftIcon={<Bot className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                >
                  Ask Tutor
                </Button>
              </Link>
            </div>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 ml-auto">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> 100% Offline Ready
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ContinueLearningCard.displayName = 'ContinueLearningCard'
