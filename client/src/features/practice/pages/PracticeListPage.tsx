import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, Button, Input, Dropdown } from '@/components/ui'
import { practiceStoreService } from '@/services/practice/practice-store.service'
import { courseStoreService } from '@/services/learning/course-store.service'
import { PracticeQuestion, Course } from '@/types'
import { ArrowRight, Search, Code2, ShieldCheck, CheckCircle2, BookOpen } from 'lucide-react'

export const PracticeListPage: React.FC = () => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() => practiceStoreService.getAllQuestions())
  const [courses, setCourses] = useState<Course[]>(() => courseStoreService.getAllCourses())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all')
  const [selectedLang, setSelectedLang] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  useEffect(() => {
    const handlePracticeUpdate = () => setQuestions(practiceStoreService.getAllQuestions())
    const handleCoursesUpdate = () => setCourses(courseStoreService.getAllCourses())

    window.addEventListener('practice_updated', handlePracticeUpdate)
    window.addEventListener('courses_updated', handleCoursesUpdate)

    return () => {
      window.removeEventListener('practice_updated', handlePracticeUpdate)
      window.removeEventListener('courses_updated', handleCoursesUpdate)
    }
  }, [])

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.courseTitle && q.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.moduleTitle && q.moduleTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCourse = selectedCourseId === 'all' || q.courseId === selectedCourseId
    const matchesLang = selectedLang === 'all' || q.language === selectedLang
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty

    return matchesSearch && matchesCourse && matchesLang && matchesDifficulty
  })

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ]

  const courseOptions = [
    { value: 'all', label: 'All Courses & Tracks' },
    ...courses.map((c) => ({
      value: c.id,
      label: c.title,
    })),
  ]

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 shadow-3xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Interactive Code Practice
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            Strengthen your problem-solving skills with offline automated test suites and instant AI hints.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-[#005F02] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 self-start sm:self-center shadow-3xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>100% Offline Test Engine</span>
        </span>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="space-y-3">
        {/* Search, Course Selector & Language Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <Input
              placeholder="Search problems by module, title, topic, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="bg-white dark:bg-slate-900 rounded-xl"
            />
          </div>
          <div className="sm:col-span-3">
            <Dropdown
              options={courseOptions}
              value={selectedCourseId}
              onChange={setSelectedCourseId}
            />
          </div>
          <div className="sm:col-span-3">
            <Dropdown
              options={[
                { value: 'all', label: 'All Languages & Tracks' },
                { value: 'python', label: 'Python' },
                { value: 'javascript', label: 'JavaScript' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'html', label: 'HTML / HTML5' },
                { value: 'css', label: 'CSS / CSS3' },
                { value: 'git', label: 'Git & GitHub' },
                { value: 'java', label: 'Java' },
                { value: 'sql', label: 'SQL & Databases' },
                { value: 'cpp', label: 'C++' },
                { value: 'go', label: 'Go' },
                { value: 'rust', label: 'Rust' },
              ]}
              value={selectedLang}
              onChange={setSelectedLang}
            />
          </div>
        </div>

        {/* Difficulty Pill Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1 font-mono">
            Difficulty:
          </span>
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              type="button"
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-3xs ${
                selectedDifficulty === diff.id
                  ? 'bg-[#005F02] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {diff.label}
            </button>
          ))}
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono ml-auto hidden sm:inline">
            Showing {filteredQuestions.length} challenges
          </span>
        </div>
      </div>

      {/* Problems Grid (Equal Height Cards) */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <Code2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No practice problems found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query, course selection, or language filter to discover available drills.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setSelectedCourseId('all')
              setSelectedLang('all')
              setSelectedDifficulty('all')
            }}
            className="text-xs font-semibold"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {filteredQuestions.map((question, index) => {
            const difficultyBadge =
              question.difficulty === 'beginner'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80'
                : question.difficulty === 'intermediate'
                ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80'
                : 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/80'

            return (
              <Card
                key={question.id}
                hoverable
                className="flex flex-col justify-between p-4 sm:p-5 space-y-3.5 border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs rounded-2xl h-full group"
              >
                <div className="space-y-2.5">
                  {/* Badges: Number Index & Difficulty & Language & Course */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-900 text-white dark:bg-brand-600 font-mono text-[9px] font-bold shadow-3xs">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${difficultyBadge}`}>
                        {question.difficulty}
                      </span>
                      <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {question.language}
                      </span>
                    </div>

                    {question.courseTitle && (
                      <span
                        title={`Aligned with course: ${question.courseTitle}`}
                        className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 flex items-center gap-1"
                      >
                        <BookOpen className="w-2.5 h-2.5 shrink-0" />
                        <span>{question.courseTitle}</span>
                      </span>
                    )}
                  </div>

                  {/* Module Tag */}
                  {question.moduleTitle && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700/60">
                      <BookOpen className="w-3 h-3 text-brand-600 dark:text-brand-400 shrink-0" />
                      <span className="truncate">{question.moduleTitle}</span>
                    </div>
                  )}

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {question.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {question.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-mono border border-slate-200/80 dark:border-slate-700/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 shadow-3xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{question.testCases.length} {question.testCases.length === 1 ? 'Test Case' : 'Test Cases'}</span>
                  </span>
                  <Link to={`/practice/${question.id}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs text-xs justify-center cursor-pointer px-3 h-8"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1 opacity-80" />}
                    >
                      Solve Problem
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}

export default PracticeListPage
