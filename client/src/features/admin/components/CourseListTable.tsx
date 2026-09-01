import React, { memo, useState } from 'react'
import { Course } from '@/types'
import { Link } from 'react-router-dom'
import { ConfirmDeleteModal } from '@/components/feedback/ConfirmDeleteModal'
import {
  BookOpen,
  ArrowRight,
  Clock,
  Database,
  Code2,
  Pencil,
  Users,
  X,
  GraduationCap,
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
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
        <BookOpen className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
        <p className="font-bold text-sm text-slate-900 dark:text-white">No courses published yet.</p>
        <p className="text-xs text-slate-400">Click &quot;Add New Course&quot; to publish your first learning track.</p>
      </div>
    )
  }

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
      case 'intermediate':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
      default:
        return 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
    }
  }

  const getLanguageBadge = (lang: string) => {
    switch (lang) {
      case 'python':
        return 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800'
      case 'javascript':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
      default:
        return 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    }
  }

  return (
    <div className="space-y-3">
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE VIEW: TOUCH-FRIENDLY CARD FEED (block md:hidden)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3"
          >
            {/* Header: Thumbnail + Title */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400 opacity-60" />
                )}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border font-mono ${getLanguageBadge(course.language)}`}>
                    <Code2 className="w-2.5 h-2.5" />
                    <span>{course.language}</span>
                  </span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase border font-mono ${getDifficultyBadge(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-1">
                  {course.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  <span>/{course.slug}</span>
                  {(course.mentorName || course.instructorName) && (
                    <>
                      <span>•</span>
                      <span className="text-[#005F02] dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <GraduationCap className="w-3 h-3 inline" />
                        {course.mentorName || course.instructorName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics Sub-bar */}
            <div className="grid grid-cols-3 gap-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs font-mono text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-900 dark:text-white">{(course.enrolledCount || 420).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>{course.totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{course.estimatedHours}h</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onEditCourse(course)}
                className="flex-1 py-2 px-3 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-brand-100 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Course</span>
              </button>

              <Link
                to={`/learning/courses/${course.id}`}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-1"
                title="Preview"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Preview</span>
              </Link>

              <button
                type="button"
                onClick={() => setCourseToDelete(course)}
                className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                title="Delete"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP VIEW: FULL DATA TABLE (hidden md:block)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Course Title & Slug</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Enrolled Students</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Modules / Lessons</th>
                <th className="py-3 px-4">Estimated Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans">
              {courses.map((course) => (
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
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getLanguageBadge(course.language)}`}>
                      <Code2 className="w-3 h-3" />
                      <span>{course.language}</span>
                    </span>
                  </td>

                  {/* Enrolled Students */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-900 dark:text-white font-bold">
                        <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{(course.enrolledCount || 420).toLocaleString()} learners</span>
                      </div>
                      {(course.mentorName || course.instructorName) && (
                        <div className="flex items-center gap-1 text-[10px] text-[#005F02] dark:text-emerald-400 font-semibold">
                          <GraduationCap className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[150px]">{course.mentorName || course.instructorName}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="py-3.5 px-4 font-mono">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getDifficultyBadge(course.difficulty)}`}>
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
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setCourseToDelete(course)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        title="Delete course"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(courseToDelete)}
        onClose={() => setCourseToDelete(null)}
        onConfirm={() => {
          if (courseToDelete) {
            onDeleteCourse(courseToDelete.id)
            setCourseToDelete(null)
          }
        }}
        title="Delete Course"
        itemName={courseToDelete?.title}
      />
    </div>
  )
})

CourseListTable.displayName = 'CourseListTable'
