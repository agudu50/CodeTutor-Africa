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
    <div className={`p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-3.5 ${className}`}>
      {/* Header & Dynamic Dropdown Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shrink-0 shadow-3xs">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-mono font-black text-slate-900 dark:text-white leading-tight">
              Target Course Curriculum
            </h3>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              Games customize dynamically based on your selected course lessons.
            </p>
          </div>
        </div>

        {/* Dynamic Compact Dropdown Selector */}
        <div className="w-full sm:w-80 shrink-0">
          <div className="relative">
            <select
              value={selectedCourseId}
              onChange={(e) => onSelectCourse(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl text-xs font-mono font-bold bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:border-[#005F02] focus:outline-none focus:ring-2 focus:ring-[#005F02]/20 shadow-3xs cursor-pointer"
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

      {/* Horizontal Scrollable Quick Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {/* All Courses Chip */}
        <button
          type="button"
          onClick={() => onSelectCourse('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-black transition-all shrink-0 cursor-pointer shadow-3xs border-2 active:scale-95 ${
            selectedCourseId === 'all'
              ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
              : 'bg-white dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-black transition-all shrink-0 cursor-pointer shadow-3xs border-2 active:scale-95 ${
                isSelected
                  ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
                  : 'bg-white dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span className="truncate max-w-[180px]">{course.title.split('&')[0].trim()}</span>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md border ${
                  isSelected
                    ? 'bg-white/20 border-white/40 text-white'
                    : 'bg-slate-100 dark:bg-[#0E1318] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
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
