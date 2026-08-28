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
  Terminal,
  Code2,
  Cpu,
  FileCode2,
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
    return courses.map((c) => {
      const langConfig: Record<string, { label: string; desc: string; icon: React.ReactNode }> = {
        python: {
          label: 'Python Programming',
          desc: 'Core Algorithms & Data Structures',
          icon: <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        },
        javascript: {
          label: 'JavaScript Web Engine',
          desc: 'DOM, Async & Web Fundamentals',
          icon: <Code2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
        },
        java: {
          label: 'Java Software Architecture',
          desc: 'OOP, Classes & Design Patterns',
          icon: <Cpu className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
        },
        typescript: {
          label: 'TypeScript Foundations',
          desc: 'Static Typing & Modern Interfaces',
          icon: <FileCode2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
        },
      }

      const cfg = langConfig[c.language] || {
        label: c.title,
        desc: `${c.modules?.length || 18} Modules`,
        icon: <Code2 className="w-4 h-4 text-slate-500 shrink-0" />,
      }

      return {
        value: c.id,
        label: cfg.label,
        description: `${c.modules?.length || 18} Modules • ${cfg.desc}`,
        icon: cfg.icon,
      }
    })
  }, [courses])

  const languageBadges: { lang: ProgrammingLanguage; icon: React.ReactNode; name: string }[] = [
    {
      lang: 'python',
      icon: <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
      name: 'Python',
    },
    {
      lang: 'javascript',
      icon: <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />,
      name: 'JavaScript',
    },
    {
      lang: 'java',
      icon: <Cpu className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />,
      name: 'Java',
    },
    {
      lang: 'typescript',
      icon: <FileCode2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />,
      name: 'TypeScript',
    },
  ]

  const handleSelectLanguage = (lang: ProgrammingLanguage) => {
    const found = courses.find((c) => c.language === lang)
    if (found) {
      setSelectedCourseId(found.id)
      setActiveQuizLesson(null)
    }
  }

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
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

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-[#005F02] bg-[#005F02]/10 border border-[#005F02]/30">
            <Shield className="w-3.5 h-3.5" /> 100% Offline
          </span>
          <div className="w-full sm:w-80">
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
          LANGUAGE SWITCHER TABS / PILLS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-slate-500 pl-2 pr-1">
          Select Track:
        </span>
        {languageBadges.map(({ lang, icon, name }) => {
          const isSelected = activeCourse?.language === lang
          const courseForLang = courses.find((c) => c.language === lang)
          if (!courseForLang) return null
          return (
            <button
              key={lang}
              type="button"
              onClick={() => handleSelectLanguage(lang)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500'
              }`}
            >
              <span className="shrink-0">{icon}</span>
              <span>{name}</span>
              {isSelected && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/20 rounded font-normal">
                  {quizModules.length} Modules
                </span>
              )}
            </button>
          )
        })}
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
