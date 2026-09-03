import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { courseStoreService } from '@/services/learning/course-store.service'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { Button } from '@/components/ui'
import { CourseSupportModal } from '../components/CourseSupportModal'
import { CourseInboxModal } from '../components/CourseInboxModal'
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ArrowRight,
  Users,
  GraduationCap,
  Globe,
  MessageSquare,
  Inbox,
  Lock,
  Calendar,
} from 'lucide-react'

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [inboxModalOpen, setInboxModalOpen] = useState(false)
  const [, setVersion] = useState(0)

  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1)
    window.addEventListener('courses_updated', handleUpdate)
    window.addEventListener('module_lock_toggled', handleUpdate)
    window.addEventListener('course_all_modules_unlocked', handleUpdate)
    return () => {
      window.removeEventListener('courses_updated', handleUpdate)
      window.removeEventListener('module_lock_toggled', handleUpdate)
      window.removeEventListener('course_all_modules_unlocked', handleUpdate)
    }
  }, [])

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
        text: 'text-emerald-800 dark:text-emerald-300',
        ring: 'border-2 border-emerald-600 dark:border-emerald-500 bg-emerald-100 dark:bg-emerald-950',
      }
    }
    if (percent >= 40) {
      return {
        text: 'text-amber-800 dark:text-amber-300',
        ring: 'border-2 border-amber-600 dark:border-amber-500 bg-amber-100 dark:bg-amber-950',
      }
    }
    if (percent > 0) {
      return {
        text: 'text-blue-800 dark:text-blue-300',
        ring: 'border-2 border-blue-600 dark:border-blue-500 bg-blue-100 dark:bg-blue-950',
      }
    }
    return {
      text: 'text-slate-700 dark:text-slate-300',
      ring: 'border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800',
    }
  }

  // Find first uncompleted lesson for the primary CTA button
  const isModuleLocked = (moduleIdx: number) => {
    const mod = course.modules[moduleIdx]
    if (!mod) return false
    // If admin or mentor specifically unlocked this module or all modules
    if (mod.isUnlockedByAdmin || course.isUnlockedByAdmin) return false
    if (moduleIdx === 0) return false
    const prevMod = course.modules[moduleIdx - 1]
    if (!prevMod) return false
    const isPrevComplete =
      (prevMod.progressPercentage ?? 0) === 100 ||
      (prevMod.lessons.length > 0 && prevMod.lessons.every((l) => l.isCompleted))
    return !isPrevComplete
  }

  const isLessonLocked = (moduleIdx: number, lessonIdx: number) => {
    if (isModuleLocked(moduleIdx)) return true
    const mod = course.modules[moduleIdx]
    if (mod?.isUnlockedByAdmin || course.isUnlockedByAdmin) return false
    if (lessonIdx === 0) return false
    const prevLesson = mod?.lessons[lessonIdx - 1]
    return !prevLesson?.isCompleted
  }

  const firstUncompletedLesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => !l.isCompleted) || course.modules[0]?.lessons[0]

  const firstLessonUrl = firstUncompletedLesson
    ? `/learning/lessons/${firstUncompletedLesson.id}`
    : `/learning/lessons/${course.modules[0]?.lessons[0]?.id || ''}`

  return (
    <>
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

      <div className="relative overflow-hidden rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] shadow-sm dark:shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 dark:text-white">
        {/* Subtle Geometric Background Circuit Grid (Sharper in light mode) */}
        <div className="absolute inset-0 opacity-[0.065] dark:opacity-[0.05] text-slate-800 dark:text-slate-200 pointer-events-none select-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="course-hero-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="28" cy="28" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#course-hero-grid)" />
          </svg>
        </div>

        {/* Blueprint Technical Corner Marks */}
        <span className="absolute top-2.5 left-3 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-600 select-none pointer-events-none">+</span>
        <span className="absolute top-2.5 right-3 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-600 select-none pointer-events-none">+</span>
        <span className="absolute bottom-2.5 left-3 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-600 select-none pointer-events-none">+</span>
        <span className="absolute bottom-2.5 right-3 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-600 select-none pointer-events-none">+</span>

        {/* Floating Language Watermark Badge in Top-Right Corner */}
        <div className="absolute -top-4 -right-4 w-28 h-28 rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 shadow-xs flex items-center justify-center pointer-events-none select-none rotate-12">
          <span className="font-mono font-black text-3xl text-slate-400 dark:text-slate-600 tracking-tighter uppercase">
            {course.language === 'javascript' ? 'JS' : course.language === 'python' ? 'PY' : course.language.slice(0, 3).toUpperCase()}
          </span>
        </div>

        {/* Title Header */}
        <div className="relative z-10 space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {course.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold border-2 border-slate-300 dark:border-slate-700 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{course.modules.length} modules</span>
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold border-2 border-amber-300 dark:border-amber-800 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{course.estimatedWeeks || Math.max(4, Math.ceil((course.estimatedHours || 16) / 2.5))} Weeks Duration</span>
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 font-mono text-xs font-bold border-2 border-blue-300 dark:border-blue-800 shadow-2xs">
              <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{(course.enrolledCount || 420).toLocaleString()} learners enrolled</span>
            </span>
          </div>
        </div>

        {/* Course Description */}
        <p className="relative z-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl font-normal">
          {course.description}
        </p>

        {/* Badges Row */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 shadow-2xs">
            {course.difficulty}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-2xs">
            {course.language}
          </span>
          {course.category && (
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-2xs">
              {course.category}
            </span>
          )}
        </div>

        {/* Review / Continue Action Button */}
        <div className="relative z-10 pt-2 border-t-2 border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3 flex-wrap">
          <Link to={firstLessonUrl} className="inline-block">
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs cursor-pointer transition-all duration-150 active:scale-95"
            >
              <span>Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <button
            type="button"
            onClick={() => setSupportModalOpen(true)}
            className="px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-brand-500 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-all duration-150 active:scale-95 shadow-2xs"
          >
            <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Report Issue</span>
          </button>
          <button
            type="button"
            onClick={() => setInboxModalOpen(true)}
            className="px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-brand-500 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-all duration-150 active:scale-95 shadow-2xs"
          >
            <Inbox className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>My Reports</span>
          </button>
        </div>

        {/* Lead Mentor Profile Card */}
        {(() => {
          const mentorName = course.mentorName || course.instructorName || 'Lead Mentor'
          const mentor = adminAnalyticsService.getAllUsers().find(
            (u) =>
              u.id === course.mentorId ||
              u.name.toLowerCase() === mentorName.toLowerCase() ||
              u.username.toLowerCase() === mentorName.toLowerCase()
          )
          const avatarUrl = mentor?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
          const countryCode = mentor?.countryCode || 'GH'
          const countryName = mentor?.countryName || 'Ghana'

          return (
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                  Course Author &amp; Lead Educator
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono text-[10px] font-bold">
                  <GraduationCap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  VERIFIED INSTRUCTOR
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold flex items-center justify-center text-base shrink-0 shadow-3xs overflow-hidden border border-slate-200 dark:border-slate-700">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={mentorName} className="w-full h-full object-cover" />
                  ) : (
                    mentorName.charAt(0)
                  )}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {mentorName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-brand-500" />
                      {countryName} ({countryCode})
                    </span>
                    <span>•</span>
                    <span className="uppercase text-brand-600 dark:text-brand-400 font-bold">
                      {course.language} Specialist
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODULES IN THIS COURSE (Connected 18-module timeline roadmap)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-5 pt-4">
        {/* Section Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0C1015] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#005F02] dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Modules in this course
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Step-by-step curriculum with interactive hands-on code challenges
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-2xs">
              {course.modules.length} Modules Total
            </span>
          </div>
        </div>

        {/* Connected Vertical Modules Path */}
        <div className="relative pl-3 sm:pl-4 py-2">
          {/* Central Vertical Connector Line running through center of badges */}
          <div className="absolute left-[35px] sm:left-[39px] top-8 bottom-8 w-1 bg-slate-300 dark:bg-slate-700 -z-0" />

          {/* Modules List */}
          <div className="space-y-3.5 relative z-10">
            {course.modules.map((mod, idx) => {
              const isExpanded = expandedModuleId === mod.id
              const progress = mod.progressPercentage ?? 0
              const color = getProgressColor(progress)
              const locked = isModuleLocked(idx)
              const assignedWeek = mod.weekNumber || Math.min(course.estimatedWeeks || 8, Math.floor(idx / 2) + 1)

              return (
                <div key={mod.id} className="relative group">
                  <div
                    onClick={() => toggleExpand(mod.id)}
                    className={`flex flex-col rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                      locked
                        ? 'bg-slate-50/80 dark:bg-[#0A0D11] border-slate-300 dark:border-slate-800 opacity-90'
                        : isExpanded
                        ? 'bg-white dark:bg-[#0E1318] border-[#005F02] dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                        : 'bg-white dark:bg-[#0E1318] border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    {/* Module Item Header Row */}
                    <div className="flex items-center justify-between p-4 sm:p-5 gap-3.5">
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                        {/* Circular Progress Badge or Lock Icon */}
                        <div className="relative shrink-0 flex items-center justify-center">
                          {locked ? (
                            <div className="w-12 h-12 rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-2xs">
                              <Lock className="w-5 h-5" />
                            </div>
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-xs sm:text-[13px] shadow-2xs transition-transform group-hover:scale-105 ${color.ring} ${color.text}`}
                            >
                              {progress}%
                            </div>
                          )}
                        </div>

                        {/* Title & Index */}
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              Module {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                            </span>
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                              Week {assignedWeek}
                            </span>
                            {locked && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                                <Lock className="w-2.5 h-2.5" /> Locked (Finish Module {idx})
                              </span>
                            )}
                            {!locked && progress === 100 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                                <CheckCircle2 className="w-3 h-3" /> Done
                              </span>
                            )}
                          </div>
                          <h3 className={`text-sm sm:text-base font-extrabold tracking-tight leading-snug transition-colors ${
                            locked
                              ? 'text-slate-600 dark:text-slate-400'
                              : 'text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400'
                          }`}>
                            {mod.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>
                      </div>

                      {/* Right expand indicator */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>{mod.lessons.length} {mod.lessons.length === 1 ? 'Lesson' : 'Lessons'}</span>
                        </span>

                        <button
                          type="button"
                          className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                            isExpanded
                              ? 'border-[#005F02] bg-emerald-50 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400'
                              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Lessons Drawer */}
                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-5 pt-3 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 space-y-3 animate-in fade-in duration-150">
                        {locked && (
                          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              <strong>Module Locked:</strong> Complete 100% of all lessons in <strong>Module {idx}</strong> to unlock this week&apos;s curriculum.
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-mono">
                            <BookOpen className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                            Lessons in this module ({mod.lessons.length}):
                          </span>
                        </div>

                        <div className="space-y-2">
                          {mod.lessons.map((lesson, lIdx) => {
                            const lessonLocked = isLessonLocked(idx, lIdx)

                            return (
                              <div
                                key={lesson.id}
                                className={`p-3.5 rounded-xl border-2 flex items-center justify-between gap-3 shadow-2xs transition-colors group/item ${
                                  lessonLocked
                                    ? 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                                    lessonLocked
                                      ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                                  }`}>
                                    {lessonLocked ? <Lock className="w-3 h-3" /> : lIdx + 1}
                                  </div>
                                  <div className="min-w-0">
                                    <span className={`text-xs sm:text-sm font-bold block truncate ${
                                      lessonLocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                                    }`}>
                                      {lesson.title}
                                    </span>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2.5 mt-0.5">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-amber-500" />
                                        {lesson.durationMinutes}m
                                      </span>
                                      {lesson.isCompleted && (
                                        <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                                          <CheckCircle2 className="w-3 h-3" /> Completed
                                        </span>
                                      )}
                                      {lessonLocked && (
                                        <span className="text-slate-400 font-bold flex items-center gap-0.5">
                                          <Lock className="w-2.5 h-2.5" /> Locked
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {lessonLocked ? (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled
                                    className="h-8 px-3 text-xs font-bold opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700 shrink-0"
                                    leftIcon={<Lock className="w-3 h-3" />}
                                  >
                                    Locked
                                  </Button>
                                ) : (
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
                                          ? 'h-8 px-3 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
                                          : 'h-8 px-3.5 text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs'
                                      }
                                      leftIcon={<Play className="w-3 h-3" />}
                                    >
                                      {lesson.isCompleted ? 'Review' : 'Start'}
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            )
                          })}
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

    <CourseSupportModal
      isOpen={supportModalOpen}
      onClose={() => setSupportModalOpen(false)}
      course={course}
    />
    <CourseInboxModal
      isOpen={inboxModalOpen}
      onClose={() => setInboxModalOpen(false)}
      courseId={course.id}
      courseTitle={course.title}
    />
    </>
  )
}

export default CourseDetailPage
