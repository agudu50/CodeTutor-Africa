import React from 'react'
import { EnrolledCourseOption } from '../services/courseGameAdapter.service'
import { GraduationCap, Sparkles, BookOpen } from 'lucide-react'

interface CourseGameSelectorProps {
  courses: EnrolledCourseOption[]
  selectedCourseId: string
  onSelectCourse: (courseId: string) => void
  className?: string
}

export const CourseGameSelector: React.FC<CourseGameSelectorProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
  className = '',
}) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Target Course Curriculum
            </h3>
            <p className="text-[11px] text-slate-500">
              Games and exercises are customized based on your enrolled lessons.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
          Course Synced
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* All Courses Option */}
        <button
          type="button"
          onClick={() => onSelectCourse('all')}
          className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs ${
            selectedCourseId === 'all'
              ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 ring-2 ring-brand-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
              All Courses
            </span>
            <span className="text-[10px] text-slate-500 block">
              Full Mixed Curriculum
            </span>
          </div>
        </button>

        {/* Individual Enrolled Courses */}
        {courses.map((course) => {
          const isSelected = selectedCourseId === course.id

          return (
            <button
              key={course.id}
              type="button"
              onClick={() => onSelectCourse(course.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 ring-2 ring-brand-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {course.title.split('&')[0].trim()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                  <span className="uppercase text-[9px] font-bold px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {course.language}
                  </span>
                  <span>{course.progressPercentage}% done</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
