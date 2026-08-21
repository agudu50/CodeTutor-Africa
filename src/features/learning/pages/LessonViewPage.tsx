import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_COURSES } from '../data/mockCourseData'
import { Card, Button, Badge } from '@/components/ui'
import { ChevronLeft, CheckCircle, Bot, Code2, ArrowRight } from 'lucide-react'

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
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/learning/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Back to {courseTitle}
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/tutor">
            <Button variant="outline" size="sm" leftIcon={<Bot className="w-3.5 h-3.5 text-brand-500" />}>
              Ask AI Tutor About Lesson
            </Button>
          </Link>
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setIsCompleted(!isCompleted)}
            leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
          >
            {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
          </Button>
        </div>
      </div>

      {/* Lesson Reader Card */}
      <Card className="p-6 md:p-8 space-y-6">
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Badge variant="brand" size="sm">Lesson {foundLesson.order}</Badge>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {foundLesson.title}
          </h2>
          <p className="text-xs text-slate-500">{foundLesson.description}</p>
        </div>

        {/* Markdown Content Viewer */}
        <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 text-slate-700 dark:text-slate-300">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              Key Objectives:
            </h4>
            <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <li>Understand the internal memory layout of the call stack vs heap.</li>
              <li>Learn how recursive stack frames store parameters and return points.</li>
              <li>Prevent stack overflow errors by architecting proper base cases.</li>
            </ul>
          </div>

          <div className="whitespace-pre-wrap font-sans">
            {foundLesson.contentMarkdown}
          </div>
        </div>

        {/* Quick Practice Prompt */}
        <div className="p-4 rounded-xl border border-brand-500/20 bg-brand-500/5 dark:bg-brand-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Ready to put this concept into practice?
              </h4>
              <p className="text-[11px] text-slate-500">
                Solve the paired coding exercise with automated test cases.
              </p>
            </div>
          </div>
          <Link to="/practice/practice-rec-1">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Launch Practice
            </Button>
          </Link>
        </div>
      </Card>
    </PageContainer>
  )
}

export default LessonViewPage
