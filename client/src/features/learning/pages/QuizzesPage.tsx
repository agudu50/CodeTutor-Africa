import React, { useState, useMemo } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { courseStoreService } from '@/services/learning/course-store.service'
import { LessonQuizSection } from '../components/LessonQuizSection'
import { Button, Dropdown } from '@/components/ui'
import {
  HelpCircle,
  CheckCircle2,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { ProgrammingLanguage, Lesson } from '@/types'

export const QuizzesPage: React.FC = () => {
  const courses = useMemo(() => courseStoreService.getAllCourses(), [])
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '')
  const [activeQuizLesson, setActiveQuizLesson] = useState<{
    lesson: Lesson
    moduleTitle: string
    courseTitle: string
    language: ProgrammingLanguage
  } | null>(null)

  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || courses[0]
  }, [courses, selectedCourseId])

  // Extract all lessons with quizzes for the active course
  const quizModules = useMemo(() => {
    if (!activeCourse) return []
    return (activeCourse.modules || [])
      .map((mod) => {
        const lessonsWithQuizzes = (mod.lessons || []).filter(
          (l) => l.quizQuestions && l.quizQuestions.length > 0
        )
        return {
          module: mod,
          lessonsWithQuizzes,
          totalQuestions: lessonsWithQuizzes.reduce(
            (acc, l) => acc + (l.quizQuestions?.length || 0),
            0
          ),
        }
      })
      .filter((m) => m.lessonsWithQuizzes.length > 0)
  }, [activeCourse])

  const totalCourseQuizzes = useMemo(() => {
    return quizModules.reduce((acc, m) => acc + m.totalQuestions, 0)
  }, [quizModules])

  const courseOptions = useMemo(() => {
    return courses.map((c) => ({
      value: c.id,
      label: `${c.title} (${c.language.toUpperCase()})`,
    }))
  }, [courses])

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Knowledge Quizzes & Assessments
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Test your conceptual understanding and algorithmic mastery across Python, JavaScript, and Java with instant offline evaluations.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-[#005F02] bg-[#005F02]/10 border border-[#005F02]/30">
            <Shield className="w-3.5 h-3.5" /> 100% Offline
          </span>
          <div className="w-full sm:w-60">
            <Dropdown
              options={courseOptions}
              value={activeCourse?.id || ''}
              onChange={(val) => {
                setSelectedCourseId(val)
                setActiveQuizLesson(null)
              }}
              className="text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ACTIVE QUIZ VIEW OR QUIZ BROWSER
          ═══════════════════════════════════════════════════════════════ */}
      {activeQuizLesson ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono font-bold uppercase text-[#005F02] dark:text-emerald-400">
                {activeQuizLesson.courseTitle} • {activeQuizLesson.moduleTitle}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {activeQuizLesson.lesson.title} — Quiz
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveQuizLesson(null)}
              className="text-xs font-bold"
            >
              Back to All Quizzes
            </Button>
          </div>

          <LessonQuizSection
            questions={activeQuizLesson.lesson.quizQuestions || []}
            language={activeQuizLesson.language}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-3xs">
              <span className="text-[11px] font-mono text-slate-400 block">Total Quizzes</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {totalCourseQuizzes} Questions
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-3xs">
              <span className="text-[11px] font-mono text-slate-400 block">Modules Covered</span>
              <span className="text-lg font-black text-[#005F02] dark:text-emerald-400">
                {quizModules.length} Modules
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-3xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-mono text-slate-400 block">Course Language</span>
              <span className="text-lg font-black uppercase text-slate-900 dark:text-white font-mono">
                {activeCourse?.language || 'Python'}
              </span>
            </div>
          </div>

          {/* Module Quizzes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizModules.map(({ module: mod, lessonsWithQuizzes, totalQuestions }) => (
              <div
                key={mod.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10.5px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                      Module {mod.order || 1}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      {totalQuestions} questions
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {mod.description || 'Master key concepts with verified interactive knowledge checks.'}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {lessonsWithQuizzes.map((lesson) => (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() =>
                        setActiveQuizLesson({
                          lesson,
                          moduleTitle: mod.title,
                          courseTitle: activeCourse?.title || '',
                          language: activeCourse?.language || 'python',
                        })
                      }
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-[#005F02] dark:hover:text-emerald-400 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 shrink-0">
                        <span>{lesson.quizQuestions?.length} Qs</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  )
}

export default QuizzesPage
