import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_COURSES } from '../data/mockCourseData'
import { Card, Button, Badge, MarkdownRenderer } from '@/components/ui'
import { ChevronLeft, CheckCircle2, Circle, Bot, Code2, ArrowRight, BookOpen, Clock } from 'lucide-react'

export const LessonViewPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const [isCompleted, setIsCompleted] = useState(false)

  // Find lesson from mock courses
  let foundLesson = MOCK_COURSES[0].modules[0]?.lessons[0]
  let courseTitle = MOCK_COURSES[0].title
  let courseId = MOCK_COURSES[0].id

  for (const c of MOCK_COURSES) {
    for (const m of c.modules) {
      const l = m.lessons.find((les) => les.id === lessonId || les.slug === lessonId)
      if (l) {
        foundLesson = l
        courseTitle = c.title
        courseId = c.id
        break
      }
    }
  }

  return (
    <PageContainer maxWidth="lg" className="space-y-6">
      {/* Breadcrumb & Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          to={`/learning/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs self-start"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to {courseTitle}</span>
        </Link>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <Link to="/tutor">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 shadow-2xs"
              leftIcon={<Bot className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
            >
              Ask AI Tutor
            </Button>
          </Link>
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setIsCompleted(!isCompleted)}
            className={
              isCompleted
                ? 'h-8 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs'
                : 'h-8 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
            }
            leftIcon={
              isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5" />
              )
            }
          >
            {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
          </Button>
        </div>
      </div>

      {/* Lesson Reader Card */}
      <Card className="p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm" className="font-mono text-[10px] uppercase font-bold">
              Lesson {foundLesson.order}
            </Badge>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" /> {foundLesson.durationMinutes} mins
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {foundLesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {foundLesson.description}
          </p>
        </div>

        {/* Objectives Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Key Objectives:</span>
          </h2>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-1.5 text-slate-700 dark:text-slate-300 pl-1 leading-relaxed">
            <li>Understand internal memory layout of the call stack vs heap frames.</li>
            <li>Learn how recursive stack frames store parameters and return points.</li>
            <li>Prevent stack overflow errors by architecting proper base cases.</li>
          </ul>
        </div>

        {/* Rich Lesson Content via MarkdownRenderer */}
        <div className="py-2">
          <MarkdownRenderer content={foundLesson.contentMarkdown} />
        </div>

        {/* Quick Practice Prompt */}
        <div className="p-4 sm:p-5 rounded-xl border border-brand-200 dark:border-brand-800/80 bg-brand-50/60 dark:bg-brand-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-600 text-white shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Ready to put this concept into practice?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Solve the paired coding exercise with offline automated test cases.
              </p>
            </div>
          </div>
          <Link to="/practice/practice-rec-1" className="self-start sm:self-center shrink-0">
            <Button
              variant="primary"
              size="sm"
              className="font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs text-xs"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Launch Practice
            </Button>
          </Link>
        </div>
      </Card>
    </PageContainer>
  )
}

export default LessonViewPage
