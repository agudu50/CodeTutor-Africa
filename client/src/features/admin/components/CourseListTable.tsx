import React, { memo, useState } from 'react'
import { Course } from '@/types'
import { Link } from 'react-router-dom'
import { ConfirmDeleteModal } from '@/components/feedback/ConfirmDeleteModal'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { CourseModuleLockModal } from './CourseModuleLockModal'
import {
  BookOpen,
  ArrowRight,
  Clock,
  Database,
  Code2,
  Pencil,
  Users,
  Trash2,
  GraduationCap,
  ShieldCheck,
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
  const [courseForLockManager, setCourseForLockManager] = useState<Course | null>(null)
  if (courses.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
        <BookOpen className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
        <p className="font-black text-sm text-slate-900 dark:text-white">No courses published yet.</p>
        <p className="text-xs text-slate-400">Click &quot;Add New Course&quot; to publish your first learning track.</p>
      </div>
    )
  }

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return 'bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 font-black'
      case 'intermediate':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-800 font-black'
      default:
        return 'bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-800 font-black'
    }
  }

  const getLanguageBadge = (lang: string) => {
    switch (lang?.toLowerCase()) {
      case 'python':
        return 'bg-sky-100 dark:bg-sky-950 text-sky-950 dark:text-sky-300 border-2 border-sky-300 dark:border-sky-800 font-black'
      case 'javascript':
      case 'js':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-800 font-black'
      case 'typescript':
      case 'ts':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-950 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-800 font-black'
      case 'html':
      case 'html5':
        return 'bg-orange-100 dark:bg-orange-950 text-orange-950 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-800 font-black'
      case 'css':
      case 'css3':
        return 'bg-cyan-100 dark:bg-cyan-950 text-cyan-950 dark:text-cyan-300 border-2 border-cyan-300 dark:border-cyan-800 font-black'
      case 'git':
      case 'github':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-950 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-800 font-black'
      case 'java':
        return 'bg-red-100 dark:bg-red-950 text-red-950 dark:text-red-300 border-2 border-red-300 dark:border-red-800 font-black'
      case 'sql':
      case 'database':
        return 'bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 font-black'
      case 'cpp':
      case 'c++':
      case 'c':
        return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-300 border-2 border-indigo-300 dark:border-indigo-800 font-black'
      case 'rust':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border-2 border-amber-400 font-black'
      case 'go':
      case 'golang':
        return 'bg-teal-100 dark:bg-teal-950 text-teal-950 dark:text-teal-300 border-2 border-teal-300 font-black'
      case 'php':
        return 'bg-violet-100 dark:bg-violet-950 text-violet-950 dark:text-violet-300 border-2 border-violet-300 font-black'
      case 'csharp':
      case 'c#':
        return 'bg-green-100 dark:bg-green-950 text-green-950 dark:text-green-300 border-2 border-green-300 font-black'
      default:
        return 'bg-purple-100 dark:bg-purple-950 text-purple-950 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-800 font-black'
    }
  }

  return (
    <div className="space-y-4">
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE VIEW: TOUCH-FRIENDLY CARD FEED (block md:hidden)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-3.5 md:hidden">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="p-4 sm:p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs space-y-3.5"
          >
            {/* Header: Thumbnail + Title + Badges */}
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#161B22] flex items-center justify-center shadow-3xs">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-6 h-6 text-[#005F02] dark:text-emerald-400 opacity-80" />
                  )}
                </div>
                <span className="absolute -top-1.5 -left-1.5 px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-[#005F02] font-mono text-[9px] font-black shadow-3xs">
                  #{String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] uppercase font-mono shadow-3xs ${getLanguageBadge(course.language)}`}>
                    <Code2 className="w-2.5 h-2.5" />
                    <span>{course.language}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] uppercase font-mono shadow-3xs ${getDifficultyBadge(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </div>

                <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                  {course.title}
                </h4>

                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-slate-400 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
                  /{course.slug}
                </span>
              </div>
            </div>

            {/* Mid Section: Enrolled Students & Lead Mentor Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {(course.enrolledCount || 420).toLocaleString()}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-sans text-[11px] font-medium">learners</span>
                </div>

                {(() => {
                  const mentorName = course.mentorName || course.instructorName
                  if (!mentorName) return null
                  const mentor = adminAnalyticsService.getAllUsers().find(
                    (u) =>
                      u.id === course.mentorId ||
                      u.name.toLowerCase() === mentorName.toLowerCase() ||
                      u.username.toLowerCase() === mentorName.toLowerCase()
                  )
                  return (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 font-mono text-[10px] font-black border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                      <div className="w-4 h-4 rounded-full bg-[#005F02] text-white flex items-center justify-center text-[8px] font-bold overflow-hidden shrink-0 border border-emerald-300 dark:border-emerald-700">
                        {mentor?.avatarUrl ? (
                          <img src={mentor.avatarUrl} alt={mentor.name} className="w-full h-full object-cover" />
                        ) : (
                          <GraduationCap className="w-2.5 h-2.5" />
                        )}
                      </div>
                      <span className="truncate max-w-[120px]">{mentorName}</span>
                      {mentor?.countryCode && (
                        <span className="text-[9px] text-[#005F02] dark:text-emerald-400 font-black">({mentor.countryCode})</span>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* Modules, Lessons, and Duration 3-Card Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t-2 border-slate-200/70 dark:border-slate-800 text-center font-mono">
                <button
                  type="button"
                  onClick={() => setCourseForLockManager(course)}
                  className="p-2 rounded-xl bg-white dark:bg-[#0E1318] border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-3xs space-y-0.5 cursor-pointer text-left transition-colors"
                  title="Click to manage module locks"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block tracking-wider">
                      Modules
                    </span>
                    {(course.isUnlockedByAdmin || course.modules?.every(m => m.isUnlockedByAdmin)) && (
                      <ShieldCheck className="w-3 h-3 text-[#005F02] dark:text-emerald-400" />
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    {course.modules?.length || 18}
                  </span>
                </button>

                <div className="p-2 rounded-xl bg-white dark:bg-[#0E1318] border-2 border-slate-200 dark:border-slate-800 shadow-3xs space-y-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block tracking-wider">
                    Lessons
                  </span>
                  <span className="text-xs font-black text-[#005F02] dark:text-emerald-400">
                    {course.totalLessons}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-[#0E1318] border-2 border-slate-200 dark:border-slate-800 shadow-3xs space-y-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block tracking-wider">
                    Duration
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {course.estimatedHours} hrs
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t-2 border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onEditCourse(course)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#005F02] hover:bg-emerald-700 text-white font-mono text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-3xs border-2 border-[#005F02] active:scale-95"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Course</span>
              </button>

              <button
                type="button"
                onClick={() => setCourseForLockManager(course)}
                className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-950 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-700 font-mono text-xs font-bold flex items-center justify-center gap-1 shadow-3xs transition-all active:scale-95 cursor-pointer"
                title="Manage module unlock overrides"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                <span>Locks</span>
              </button>

              <Link
                to={`/learning/courses/${course.id}`}
                className="py-2 px-3.5 rounded-xl bg-white dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 text-xs font-mono font-bold flex items-center justify-center gap-1 shadow-3xs transition-all active:scale-95"
                title="Preview course page"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Preview</span>
              </Link>

              <button
                type="button"
                onClick={() => setCourseToDelete(course)}
                className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border-2 border-slate-300 dark:border-slate-700 hover:border-rose-400 transition-colors cursor-pointer shadow-3xs active:scale-95"
                title="Delete course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP VIEW: FULL DATA TABLE (hidden md:block)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#12161A] text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                <th className="py-4 pl-4 pr-1 w-12 text-center font-black">#</th>
                <th className="py-4 px-4 font-black min-w-[240px]">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                    <span>Course Title &amp; Slug</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-black min-w-[130px]">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Language</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-black min-w-[180px]">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Enrolled Students</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-black min-w-[110px]">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Difficulty</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-black min-w-[180px]">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Modules / Lessons</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-black min-w-[130px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Estimated Time</span>
                  </div>
                </th>
                <th className="py-4 pr-4 pl-2 font-black text-right min-w-[120px]">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
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
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#161B22] shrink-0 flex items-center justify-center shadow-3xs">
                        {course.thumbnailUrl ? (
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="w-5 h-5 text-[#005F02] dark:text-emerald-400 opacity-80" />
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                          {course.title}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-slate-400 font-mono text-[10px] font-medium border border-slate-200 dark:border-slate-700">
                            /{course.slug}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Language */}
                  <td className="py-4 px-4 font-mono">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] uppercase font-mono shadow-3xs ${getLanguageBadge(course.language)}`}>
                      <Code2 className="w-3 h-3" />
                      <span>{course.language}</span>
                    </span>
                  </td>

                  {/* Enrolled Students */}
                  <td className="py-4 px-4 font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-900 dark:text-white font-black">
                        <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{(course.enrolledCount || 420).toLocaleString()}</span>
                        <span className="text-slate-400 font-normal font-sans text-[11px]">learners</span>
                      </div>
                      {(() => {
                        const mentorName = course.mentorName || course.instructorName
                        if (!mentorName) return null
                        const mentor = adminAnalyticsService.getAllUsers().find(
                          (u) =>
                            u.id === course.mentorId ||
                            u.name.toLowerCase() === mentorName.toLowerCase() ||
                            u.username.toLowerCase() === mentorName.toLowerCase()
                        )
                        return (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 font-mono text-[10px] font-black shadow-3xs">
                            <div className="w-4 h-4 rounded-full bg-[#005F02] text-white flex items-center justify-center text-[8px] font-bold overflow-hidden shrink-0 border border-emerald-300 dark:border-emerald-700">
                              {mentor?.avatarUrl ? (
                                <img src={mentor.avatarUrl} alt={mentor.name} className="w-full h-full object-cover" />
                              ) : (
                                <GraduationCap className="w-2.5 h-2.5" />
                              )}
                            </div>
                            <span className="truncate max-w-[130px]">{mentorName}</span>
                            {mentor?.countryCode && (
                              <span className="text-[9px] text-[#005F02] dark:text-emerald-400 font-black">({mentor.countryCode})</span>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="py-4 px-4 font-mono">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] uppercase font-mono shadow-3xs ${getDifficultyBadge(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                  </td>

                  {/* Modules / Lessons with Quick Lock Status Pill */}
                  <td className="py-4 px-4 font-mono">
                    <button
                      type="button"
                      onClick={() => setCourseForLockManager(course)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-xs shadow-3xs cursor-pointer transition-colors text-left"
                      title="Click to manage module locks and learner access"
                    >
                      <Database className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                      <span>{course.modules?.length || 0} Mod</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold">{course.totalLessons} Les</span>
                      {(course.isUnlockedByAdmin || course.modules?.every(m => m.isUnlockedByAdmin)) && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">|</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-[#005F02] dark:text-emerald-400 font-black">
                            <ShieldCheck className="w-3 h-3" /> Unlocked
                          </span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Estimated Hours */}
                  <td className="py-4 px-4 font-mono">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs shadow-3xs">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-bold">{course.estimatedHours} hrs</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pr-4 pl-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCourseForLockManager(course)}
                        className="p-2 rounded-xl text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900/80 border-2 border-amber-300 dark:border-amber-700 transition-all shadow-3xs cursor-pointer active:scale-95"
                        title="Manage module locks for learners"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                      </button>

                      <Link
                        to={`/learning/courses/${course.id}`}
                        className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-[#161B22] hover:border-[#005F02] border-2 border-slate-300 dark:border-slate-700 transition-all shadow-3xs active:scale-95"
                        title="Preview student course page"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onEditCourse(course)}
                        className="p-2 rounded-xl text-white bg-[#005F02] hover:bg-emerald-700 border-2 border-[#005F02] transition-all shadow-3xs cursor-pointer active:scale-95"
                        title="Edit course"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setCourseToDelete(course)}
                        className="p-2 rounded-xl text-rose-600 dark:text-rose-400 bg-white dark:bg-[#161B22] hover:bg-rose-50 dark:hover:bg-rose-950/60 border-2 border-slate-300 dark:border-slate-700 hover:border-rose-400 transition-all cursor-pointer shadow-3xs active:scale-95"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Module Lock Manager Modal */}
      <CourseModuleLockModal
        isOpen={Boolean(courseForLockManager)}
        onClose={() => setCourseForLockManager(null)}
        course={courseForLockManager}
      />

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
