import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_COURSES } from '../data/mockCourseData'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Progress } from '@/components/ui'
import { ChevronLeft, Play, CheckCircle2, Circle, Clock, BookOpen, Sparkles } from 'lucide-react'

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const course = MOCK_COURSES.find((c) => c.id === courseId || c.slug === courseId) || MOCK_COURSES[0]

  return (
    <PageContainer maxWidth="xl" className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/learning"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Courses
        </Link>
      </div>

      {/* Course Banner */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand" size="sm" className="uppercase font-mono">
            {course.language}
          </Badge>
          <Badge variant="neutral" size="sm">
            {course.difficulty}
          </Badge>
          <Badge variant="accent" size="sm">
            {course.category}
          </Badge>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {course.title}
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-500" />
            {course.totalLessons} Total Lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-accent-500" />
            {course.estimatedHours} Estimated Hours
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Sparkles className="w-4 h-4" />
            Offline Cached
          </span>
        </div>

        {course.progressPercentage !== undefined && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Your Course Completion</span>
              <span className="font-mono">{course.progressPercentage}%</span>
            </div>
            <Progress value={course.progressPercentage} variant="brand" size="md" />
          </div>
        )}
      </Card>

      {/* Syllabus Modules */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Curriculum Syllabus
        </h3>

        {course.modules.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-2xl text-slate-400 text-xs">
            Curriculum modules for this track are being synchronized from offline local storage.
          </div>
        ) : (
          course.modules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-950/60 pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-sm">{module.title}</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">{module.description}</p>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800/80">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {lesson.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {lesson.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.durationMinutes}m
                      </span>
                      <Link to={`/learning/lessons/${lesson.id}`}>
                        <Button
                          variant={lesson.isCompleted ? 'secondary' : 'primary'}
                          size="sm"
                          leftIcon={<Play className="w-3.5 h-3.5" />}
                        >
                          {lesson.isCompleted ? 'Review' : 'Start'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PageContainer>
  )
}

export default CourseDetailPage
