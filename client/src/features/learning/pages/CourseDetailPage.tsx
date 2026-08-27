import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { courseStoreService } from '@/services/learning/course-store.service'
import { Button } from '@/components/ui'
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)

  const courses = courseStoreService.getAllCourses()
  const course = courses.find((c) => c.id === courseId || c.slug === courseId) || courses[0]

  if (!course) {
    return (
      <PageContainer maxWidth="xl" className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Not Found</h2>
        <Link to="/learning">
          <Button variant="primary">Return to Courses</Button>
        </Link>
      </PageContainer>
    )
  }

  const toggleExpand = (id: string) => {
    setExpandedModuleId((prev) => (prev === id ? null : id))
  }

  const getProgressColor = (percent: number) => {
    if (percent === 100) {
      return {
        text: 'text-emerald-700 dark:text-emerald-400',
        ring: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      }
    }
    if (percent >= 40) {
      return {
        text: 'text-amber-700 dark:text-amber-400',
        ring: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40',
      }
    }
    if (percent > 0) {
      return {
        text: 'text-sky-700 dark:text-sky-400',
        ring: 'border-sky-500 bg-sky-50 dark:bg-sky-950/40',
      }
    }
    return {
      text: 'text-slate-600 dark:text-slate-400',
      ring: 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80',
    }
  }

  // Find first uncompleted lesson for the primary CTA button
  const firstUncompletedLesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => !l.isCompleted) || course.modules[0]?.lessons[0]

  const firstLessonUrl = firstUncompletedLesson
    ? `/learning/lessons/${firstUncompletedLesson.id}`
    : `/learning/lessons/${course.modules[0]?.lessons[0]?.id || ''}`

  return (
    <PageContainer maxWidth="xl" className="space-y-6">
      {/* Back to courses navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/learning"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          COURSE HERO CARD (Crisp light & dark mode)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#12161A] shadow-xs sm:shadow-sm p-6 sm:p-7 space-y-5 text-slate-900 dark:text-white">
        {/* Title Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {course.title}
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {course.modules.length} modules
          </p>
        </div>

        {/* Course Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl font-normal">
          {course.description}
        </p>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {course.difficulty}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            {course.language}
          </span>
          {course.category && (
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              {course.category}
            </span>
          )}
        </div>

        {/* Review / Continue Action Button */}
        <div className="pt-1">
          <Link to={firstLessonUrl} className="inline-block">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-all duration-150 active:scale-95"
            >
              <span>Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODULES IN THIS COURSE (Connected 18-module timeline roadmap)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Modules in this course
            </h2>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {course.modules.length} Modules Total
          </span>
        </div>

        {/* Connected Vertical Modules Path */}
        <div className="relative pl-3 sm:pl-4 py-2">
          {/* Central Vertical Connector Line running through center of circular badges */}
          <div className="absolute left-[34px] sm:left-[38px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

          {/* Modules List */}
          <div className="space-y-3 relative z-10">
            {course.modules.map((mod) => {
              const isExpanded = expandedModuleId === mod.id
              const progress = mod.progressPercentage ?? 0
              const color = getProgressColor(progress)

              return (
                <div key={mod.id} className="relative group">
                  <div
                    onClick={() => toggleExpand(mod.id)}
                    className={`flex flex-col rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      isExpanded
                        ? 'bg-white dark:bg-[#12161A] border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-white dark:bg-[#12161A] border-slate-200 dark:border-slate-800/90 hover:border-emerald-500/40 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    {/* Module Item Header Row */}
                    <div className="flex items-center justify-between p-3.5 sm:p-4 gap-3">
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                        {/* Circular Progress Badge */}
                        <div className="relative shrink-0 flex items-center justify-center">
                          <div
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs sm:text-[13px] shadow-2xs transition-transform group-hover:scale-105 ${color.ring} ${color.text}`}
                          >
                            {progress}%
                          </div>
                        </div>

                        {/* Title */}
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {mod.title}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {mod.description}
                          </p>
                        </div>
                      </div>

                      {/* Right expand indicator */}
                      <div className="flex items-center gap-2 shrink-0">
                        {progress === 100 ? (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                            {mod.lessons.length} Lessons
                          </span>
                        )}

                        <button
                          type="button"
                          className="p-1 rounded-lg text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Lessons Drawer */}
                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-950/60 space-y-2.5 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            Lessons in this module:
                          </span>
                        </div>

                        <div className="space-y-2">
                          {mod.lessons.map((lesson, lIdx) => (
                            <div
                              key={lesson.id}
                              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs hover:border-emerald-500/60 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-bold shrink-0">
                                  {lIdx + 1}
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                                    {lesson.title}
                                  </span>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-amber-500" />
                                      {lesson.durationMinutes}m
                                    </span>
                                    {lesson.isCompleted && (
                                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                                        <CheckCircle2 className="w-3 h-3" /> Completed
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>

                              <Link
                                to={`/learning/lessons/${lesson.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="shrink-0"
                              >
                                <Button
                                  variant={lesson.isCompleted ? 'secondary' : 'primary'}
                                  size="sm"
                                  className={
                                    lesson.isCompleted
                                      ? 'h-7 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                                      : 'h-7 text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs'
                                  }
                                  leftIcon={<Play className="w-3 h-3" />}
                                >
                                  {lesson.isCompleted ? 'Review' : 'Start'}
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default CourseDetailPage
