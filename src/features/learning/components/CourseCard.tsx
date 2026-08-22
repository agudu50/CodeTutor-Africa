import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Course } from '@/types'
import { Card, CardTitle, Badge, Button, Progress } from '@/components/ui'
import { BookOpen, Clock, ArrowRight, Shield } from 'lucide-react'

export const CourseCard: React.FC<{ course: Course }> = memo(({ course }) => {
  const difficultyBadge =
    course.difficulty === 'beginner'
      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80'
      : course.difficulty === 'intermediate'
      ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80'
      : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80'

  return (
    <Card hoverable className="flex flex-col justify-between p-4 sm:p-5 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs h-full overflow-hidden">
      <div className="space-y-3">
        {/* Cover Image Banner (If present) */}
        {course.thumbnailUrl ? (
          <div className="h-36 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative group bg-slate-950">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded backdrop-blur-xs border ${difficultyBadge}`}>
                {course.difficulty}
              </span>
              <Badge variant="brand" size="sm" className="uppercase font-mono text-[10px] font-bold shadow-xs">
                {course.language}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${difficultyBadge}`}>
              {course.difficulty}
            </span>
            <Badge variant="brand" size="sm" className="uppercase font-mono text-[10px] font-bold">
              {course.language}
            </Badge>
          </div>
        )}

        <div>
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            {course.category}
          </span>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white leading-snug">
            {course.title}
          </CardTitle>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 font-medium font-mono">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            {course.totalLessons} Lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            ~{course.estimatedHours} Hours
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        {course.progressPercentage !== undefined && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <span>Course Progress</span>
              <span className="font-mono text-brand-600 dark:text-brand-400">{course.progressPercentage}%</span>
            </div>
            <Progress value={course.progressPercentage} variant="brand" size="sm" />
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <Shield className="w-3 h-3" /> Offline Cached
          </span>
          <Link to={`/learning/courses/${course.id}`}>
            <Button
              variant="primary"
              size="sm"
              className="font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs text-xs"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Syllabus
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
})

CourseCard.displayName = 'CourseCard'
