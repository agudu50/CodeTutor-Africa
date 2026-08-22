import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { courseStoreService } from '@/services/learning/course-store.service'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Progress } from '@/components/ui'
import { ChevronLeft, Play, CheckCircle2, Circle, Clock, BookOpen, Shield, Sparkles, Code2 } from 'lucide-react'

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const courses = courseStoreService.getAllCourses()
  const course = courses.find((c) => c.id === courseId || c.slug === courseId) || courses[0]

  const difficultyVariant =
    course.difficulty === 'beginner'
      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80'
      : course.difficulty === 'intermediate'
      ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80'
      : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80'

  return (
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

        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80">
          <Shield className="w-3.5 h-3.5" /> 100% Offline Ready
        </span>
      </div>

      {/* Course Hero Banner */}
      <Card className="p-6 sm:p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 shadow-xs">
        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand" size="sm" className="uppercase font-mono font-bold text-[10px]">
            {course.language}
          </Badge>
          <span className={`inline-flex items-center text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${difficultyVariant}`}>
            {course.difficulty}
          </span>
          <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {course.category}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {course.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Telemetry Row */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 font-medium">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <strong className="text-slate-800 dark:text-slate-200">{course.totalLessons}</strong> Total Lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            <strong className="text-slate-800 dark:text-slate-200">{course.estimatedHours}</strong> Estimated Hours
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <Sparkles className="w-4 h-4" />
            Offline Cached
          </span>
        </div>

        {/* Completion Progress Bar */}
        {course.progressPercentage !== undefined && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Your Course Completion</span>
              <span className="font-mono text-brand-600 dark:text-brand-400">{course.progressPercentage}%</span>
            </div>
            <Progress value={course.progressPercentage} variant="brand" size="md" />
          </div>
        )}
      </Card>

      {/* Curriculum Syllabus */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Curriculum Syllabus
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 font-semibold">
            {course.modules.length} Modules Available
          </span>
        </div>

        {course.modules.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-2xl border-slate-200 dark:border-slate-800 text-slate-400 text-xs bg-white dark:bg-slate-900">
            Curriculum modules for this track are being synchronized from offline local storage.
          </div>
        ) : (
          <div className="space-y-4">
            {course.modules.map((module, mIdx) => (
              <Card key={module.id} className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 font-mono text-[11px] font-bold flex items-center justify-center">
                          {mIdx + 1}
                        </span>
                        <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {module.title}
                        </CardTitle>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed pl-7">
                        {module.description}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 self-start sm:self-center font-semibold bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                      {module.lessons.length} Lessons
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        {lesson.isCompleted ? (
                          <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 shrink-0 mt-0.5 sm:mt-0">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        ) : (
                          <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5 sm:mt-0">
                            <Circle className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {lesson.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0 shrink-0">
                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" /> {lesson.durationMinutes}m
                        </span>
                        <Link to={`/learning/lessons/${lesson.id}`}>
                          <Button
                            variant={lesson.isCompleted ? 'secondary' : 'primary'}
                            size="sm"
                            className={
                              lesson.isCompleted
                                ? 'h-8 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border-slate-200 dark:border-slate-700'
                                : 'h-8 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                            }
                            leftIcon={<Play className="w-3 h-3" />}
                          >
                            {lesson.isCompleted ? 'Review' : 'Start'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}

export default CourseDetailPage
