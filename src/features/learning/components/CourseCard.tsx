import React from 'react'
import { Link } from 'react-router-dom'
import { Course } from '@/types'
import { Card, CardTitle, Badge, Button, Progress } from '@/components/ui'
import { BookOpen, Clock, ArrowRight } from 'lucide-react'

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <Card hoverable className="flex flex-col justify-between p-5 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge
            variant={
              course.difficulty === 'beginner'
                ? 'success'
                : course.difficulty === 'intermediate'
                ? 'warning'
                : 'error'
            }
            size="sm"
          >
            {course.difficulty}
          </Badge>
          <Badge variant="brand" size="sm" className="uppercase font-mono text-[10px]">
            {course.language}
          </Badge>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {course.category}
          </span>
          <CardTitle className="text-base text-slate-900 dark:text-slate-100">
            {course.title}
          </CardTitle>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand-500" />
            {course.totalLessons} Lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent-500" />
            ~{course.estimatedHours} Hours
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {course.progressPercentage !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium text-slate-500">
              <span>Completed</span>
              <span className="font-mono">{course.progressPercentage}%</span>
            </div>
            <Progress value={course.progressPercentage} variant="brand" size="sm" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400">Offline Pack Ready</span>
          <Link to={`/learning/courses/${course.id}`}>
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View Syllabus
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
