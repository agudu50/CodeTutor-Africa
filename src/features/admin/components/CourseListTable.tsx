import React, { memo } from 'react'
import { Course } from '@/types'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  ArrowRight,
  Clock,
  Database,
  Code2,
  Settings,
  X,
} from 'lucide-react'

interface CourseListTableProps {
  courses: Course[]
  onEditCourse: (course: Course) => void
  onDeleteCourse: (courseId: string) => void
}

export const CourseListTable: React.FC<CourseListTableProps> = memo(({
  courses,
  onEditCourse,
  onDeleteCourse,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3 px-4">Course Title & Slug</th>
              <th className="py-3 px-4">Language</th>
              <th className="py-3 px-4">Difficulty</th>
              <th className="py-3 px-4">Modules / Lessons</th>
              <th className="py-3 px-4">Estimated Time</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-60" />
                  <p className="font-semibold">No courses created yet.</p>
                  <p className="text-xs text-slate-400">Click &quot;Add New Course&quot; to publish your first track.</p>
                </td>
              </tr>
            ) : (
              courses.map((course) => {
                const diffBadge =
                  course.difficulty === 'beginner'
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : course.difficulty === 'intermediate'
                    ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'

                const langBadge =
                  course.language === 'python'
                    ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800'
                    : course.language === 'javascript'
                    ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    : 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'

                return (
                  <tr
                    key={course.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Title & Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                          {course.thumbnailUrl ? (
                            <img
                              src={course.thumbnailUrl}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400 opacity-60" />
                          )}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5 truncate">
                            <span className="truncate">{course.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                            /{course.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Language */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${langBadge}`}>
                        <Code2 className="w-3 h-3" />
                        <span>{course.language}</span>
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${diffBadge}`}>
                        {course.difficulty}
                      </span>
                    </td>

                    {/* Modules / Lessons */}
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Database className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.modules?.length || 0} Modules</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-bold">{course.totalLessons} Lessons</span>
                      </div>
                    </td>

                    {/* Estimated Hours */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.estimatedHours} hrs</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/learning/courses/${course.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Preview student course page"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => onEditCourse(course)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors cursor-pointer"
                          title="Edit course"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
                              onDeleteCourse(course.id)
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Delete course"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
})

CourseListTable.displayName = 'CourseListTable'
