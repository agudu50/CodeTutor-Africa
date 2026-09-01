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
        return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold'
      case 'intermediate':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold'
      default:
        return 'bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800 font-bold'
    }
  }

  const getLanguageBadge = (lang: string) => {
    switch (lang?.toLowerCase()) {
      case 'python':
        return 'bg-sky-50 dark:bg-sky-950/70 text-sky-900 dark:text-sky-300 border-sky-300 dark:border-sky-800 font-bold'
      case 'javascript':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold'
      case 'typescript':
        return 'bg-blue-50 dark:bg-blue-950/70 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-bold'
      case 'java':
        return 'bg-orange-50 dark:bg-orange-950/70 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800 font-bold'
      default:
        return 'bg-purple-50 dark:bg-purple-950/70 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-800 font-bold'
    }
  }

  return (
    <div className="space-y-3">
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE VIEW: TOUCH-FRIENDLY CARD FEED (block md:hidden)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3"
          >
            {/* Header: Thumbnail + Title */}
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center shadow-3xs">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400 opacity-80" />
                  )}
                </div>
                <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.2 rounded-md bg-slate-900 text-white dark:bg-brand-600 font-mono text-[9px] font-bold shadow-3xs">
                  #{String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase border font-mono ${getLanguageBadge(course.language)}`}>
                    <Code2 className="w-2.5 h-2.5" />
                    <span>{course.language}</span>
                  </span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] uppercase border font-mono ${getDifficultyBadge(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-1">
                  {course.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">/{course.slug}</span>
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
            <div className="grid grid-cols-3 gap-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs font-mono text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="font-bold text-slate-900 dark:text-white">{(course.enrolledCount || 420).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                <span>{course.totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{course.estimatedHours}h</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onEditCourse(course)}
                className="flex-1 py-2 px-3 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-brand-100 cursor-pointer shadow-3xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Course</span>
              </button>

              <Link
                to={`/learning/courses/${course.id}`}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 shadow-3xs"
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
      <div className="hidden md:block rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/90 text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <th className="py-4 pl-4 pr-1 w-12 text-center font-bold">#</th>
                <th className="py-4 px-4 font-bold min-w-[240px]">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span>Course Title &amp; Slug</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold min-w-[130px]">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Language</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold min-w-[180px]">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Enrolled Students</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold min-w-[110px]">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Difficulty</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold min-w-[180px]">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Modules / Lessons</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold min-w-[130px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Estimated Time</span>
                  </div>
                </th>
                <th className="py-4 pr-4 pl-2 font-bold text-right min-w-[120px]">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans">
              {courses.map((course, index) => (
                <tr
                  key={course.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Index */}
                  <td className="py-4 pl-4 pr-1 text-center font-mono text-[11px] text-slate-400 font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </td>

                  {/* Title & Thumbnail */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center shadow-3xs">
                        {course.thumbnailUrl ? (
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400 opacity-80" />
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                          {course.title}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-medium border border-slate-200/60 dark:border-slate-700/60">
                            /{course.slug}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Language */}
                  <td className="py-4 px-4 font-mono">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] uppercase border shadow-3xs ${getLanguageBadge(course.language)}`}>
                      <Code2 className="w-3 h-3" />
                      <span>{course.language}</span>
                    </span>
                  </td>

                  {/* Enrolled Students */}
                  <td className="py-4 px-4 font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-900 dark:text-white font-extrabold">
                        <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{(course.enrolledCount || 420).toLocaleString()}</span>
                        <span className="text-slate-400 font-normal font-sans text-[11px]">learners</span>
                      </div>
                      {(course.mentorName || course.instructorName) && (
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#005F02]/10 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-300 border border-[#005F02]/20 dark:border-emerald-800 font-mono text-[10px] font-bold">
                          <GraduationCap className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[140px]">{course.mentorName || course.instructorName}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="py-4 px-4 font-mono">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] uppercase border shadow-3xs ${getDifficultyBadge(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                  </td>

                  {/* Modules / Lessons */}
                  <td className="py-4 px-4 font-mono">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-xs shadow-3xs">
                      <Database className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                      <span>{course.modules?.length || 0} Modules</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold">{course.totalLessons} Lessons</span>
                    </div>
                  </td>

                  {/* Estimated Hours */}
                  <td className="py-4 px-4 font-mono">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-xs shadow-3xs">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-bold">{course.estimatedHours} hrs</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pr-4 pl-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/learning/courses/${course.id}`}
                        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-brand-200 transition-all shadow-3xs"
                        title="Preview student course page"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onEditCourse(course)}
                        className="p-2 rounded-xl text-brand-700 dark:text-brand-300 bg-brand-50/90 hover:bg-brand-100 dark:bg-brand-950/70 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800 transition-all shadow-3xs cursor-pointer"
                        title="Edit course"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setCourseToDelete(course)}
                        className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition-all cursor-pointer"
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
