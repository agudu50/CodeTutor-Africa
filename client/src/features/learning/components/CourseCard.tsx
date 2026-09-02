import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Course } from '@/types'
import { Card, CardTitle } from '@/components/ui'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { BookOpen, ArrowRight, Shield, Users, GraduationCap, Calendar } from 'lucide-react'

export const CourseCard: React.FC<{ course: Course }> = memo(({ course }) => {
  const difficultyBadge =
    course.difficulty === 'beginner'
      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800'
      : course.difficulty === 'intermediate'
      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-800'
      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800'

  const weeksDuration = course.estimatedWeeks || Math.max(4, Math.ceil((course.estimatedHours || 16) / 2.5))

  return (
    <Card
      hoverable
      className="flex flex-col justify-between p-5 space-y-4 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0C1015] shadow-xs hover:shadow-md hover:border-slate-400 dark:hover:border-slate-600 transition-all h-full overflow-hidden"
    >
      <div className="space-y-3.5">
        {/* Cover Image Banner (If present) */}
        {course.thumbnailUrl ? (
          <div className="h-36 w-full rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 relative group bg-slate-950">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-xs text-[10px] font-mono font-black text-white border border-white/20 uppercase tracking-wider">
              {course.language}
            </div>
          </div>
        ) : null}

        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-3 py-1 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider shadow-3xs ${difficultyBadge}`}
          >
            {course.difficulty}
          </span>
          <span className="text-[11px] font-mono font-black text-[#005F02] dark:text-emerald-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Offline
          </span>
        </div>

        {/* Title */}
        <div>
          <CardTitle className="text-base font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
            {course.title}
          </CardTitle>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-normal">
          {course.description}
        </p>

        {/* Structured Stat Pills Row */}
        <div className="flex items-center gap-2 text-xs pt-0.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-mono text-[11px] font-bold border border-amber-200 dark:border-amber-800 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{weeksDuration} Weeks</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] font-bold border border-slate-200 dark:border-slate-700 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
            <span>{course.totalLessons} Lessons</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 font-mono text-[11px] font-bold border border-blue-200 dark:border-blue-800 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{(course.enrolledCount || 420).toLocaleString()} Learners</span>
          </span>
        </div>

        {/* Lead Mentor Card Box */}
        {(() => {
          const mentorName = course.mentorName || course.instructorName
          if (!mentorName) return null
          const mentor = adminAnalyticsService.getAllUsers().find(
            (u) =>
              u.id === course.mentorId ||
              u.name.toLowerCase() === mentorName.toLowerCase() ||
              u.username.toLowerCase() === mentorName.toLowerCase()
          )
          const avatarUrl = mentor?.avatarUrl
          return (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-5 h-5 rounded-full bg-[#005F02] text-white flex items-center justify-center text-[9px] font-bold overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={mentorName} className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-3 h-3" />
                )}
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                {mentorName}
              </span>
              {mentor?.countryCode && (
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                  {mentor.countryCode}
                </span>
              )}
            </div>
          )
        })()}
      </div>

      {/* Footer / Action Section */}
      <div className="space-y-3.5 pt-3.5 border-t-2 border-slate-200 dark:border-slate-800">
        {course.progressPercentage !== undefined && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase">
              <span>Course Progress</span>
              <span className="font-extrabold text-[#005F02] dark:text-emerald-400">{course.progressPercentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div
                className="h-full bg-[#005F02] dark:bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, course.progressPercentage))}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-0.5 gap-2">
          <span className="text-[11px] font-mono text-[#005F02] dark:text-emerald-400 flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Offline Cached</span>
          </span>
          <Link to={`/learning/courses/${course.id}`}>
            <button
              type="button"
              className="px-4 py-2 rounded-xl font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs text-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <span>View Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </Card>
  )
})

CourseCard.displayName = 'CourseCard'
