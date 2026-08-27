import React from 'react'
import { EnrolledCourseOption } from '../services/courseGameAdapter.service'
import { GraduationCap, Zap, BookOpen, ChevronDown } from 'lucide-react'

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
  // Deduplicate courses by id
  const uniqueCourses = courses.filter(
    (course, index, self) => index === self.findIndex((c) => c.id === course.id)
  )

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header & Dynamic Dropdown Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 shadow-3xs">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
              Target Course Curriculum
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Games customize dynamically based on your selected course lessons.
            </p>
          </div>
        </div>

        {/* Dynamic Compact Dropdown Selector */}
        <div className="w-full sm:w-72 shrink-0">
          <div className="relative">
            <select
              value={selectedCourseId}
              onChange={(e) => onSelectCourse(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-3xs cursor-pointer"
            >
              <option value="all">⚡ All Courses (Full Mixed Curriculum)</option>
              {uniqueCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.language.toUpperCase()} • {c.progressPercentage}% done)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Quick Chips Bar (Takes 1 single line) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
        {/* All Courses Chip */}
        <button
          type="button"
          onClick={() => onSelectCourse('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-3xs ${
            selectedCourseId === 'all'
              ? 'bg-[#005F02] text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-3 h-3" />
          <span>All Courses</span>
        </button>

        {/* Enrolled Courses Chips */}
        {uniqueCourses.map((course) => {
          const isSelected = selectedCourseId === course.id
          return (
            <button
              key={course.id}
              type="button"
              onClick={() => onSelectCourse(course.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-3xs ${
                isSelected
                  ? 'bg-[#005F02] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span className="truncate max-w-[180px]">{course.title.split('&')[0].trim()}</span>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {course.language}
              </span>
              {course.progressPercentage > 0 && (
                <span className={`text-[10px] font-mono ${isSelected ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {course.progressPercentage}%
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
