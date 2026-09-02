import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Dropdown } from '@/components/ui'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-7 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Interactive Code Practice
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-normal">
            Strengthen your problem-solving skills with offline automated test suites and instant AI hints.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-[#005F02] dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 shrink-0 self-start sm:self-center shadow-3xs">
          <ShieldCheck className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
          <span>100% Offline Test Engine</span>
        </span>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="space-y-3">
        {/* Search, Course Selector & Language Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search problems by module, title, topic, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#005F02] dark:focus:border-emerald-500 shadow-3xs transition-all font-medium"
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
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono font-black text-slate-500 dark:text-slate-400 uppercase shrink-0 mr-1">
            Difficulty:
          </span>
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              type="button"
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-3xs active:scale-95 ${
                selectedDifficulty === diff.id
                  ? 'bg-[#005F02] text-white border-2 border-[#005F02] shadow-xs'
                  : 'bg-white dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700 hover:border-[#005F02] dark:hover:border-emerald-500'
              }`}
            >
              {diff.label}
            </button>
          ))}
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold ml-auto hidden sm:inline">
            Showing {filteredQuestions.length} challenges
          </span>
        </div>
      </div>

      {/* Problems Grid (Equal Height Cards) */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] space-y-3">
          <Code2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No practice problems found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query, course selection, or language filter to discover available drills.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('')
              setSelectedCourseId('all')
              setSelectedLang('all')
              setSelectedDifficulty('all')
            }}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161B22] hover:border-[#005F02] hover:text-[#005F02] text-slate-800 dark:text-slate-200 shadow-3xs cursor-pointer active:scale-95 transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {filteredQuestions.map((question, index) => {
            const difficultyBadge =
              question.difficulty === 'beginner'
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                : question.difficulty === 'intermediate'
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800'

            return (
              <div
                key={question.id}
                className="flex flex-col justify-between p-5 space-y-3.5 border-2 border-slate-300 dark:border-slate-700 hover:border-[#005F02] dark:hover:border-emerald-500 bg-white dark:bg-[#0E1318] shadow-xs rounded-3xl h-full transition-all group"
              >
                <div className="space-y-2.5">
                  {/* Badges: Number Index & Difficulty & Language & Course */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white dark:bg-emerald-800 font-mono text-[10px] font-black shadow-3xs">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-lg shadow-3xs ${difficultyBadge}`}>
                        {question.difficulty}
                      </span>
                      <span className="font-mono text-[10px] uppercase font-black px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-3xs">
                        {question.language}
                      </span>
                    </div>

                    {question.courseTitle && (
                      <span
                        title={`Aligned with course: ${question.courseTitle}`}
                        className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shrink-0 flex items-center gap-1 shadow-3xs max-w-[130px] truncate"
                      >
                        <BookOpen className="w-3 h-3 text-[#005F02] dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{question.courseTitle}</span>
                      </span>
                    )}
                  </div>

                  {/* Module Tag */}
                  {question.moduleTitle && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#161B22] px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-3xs">
                      <BookOpen className="w-3 h-3 text-[#005F02] dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{question.moduleTitle}</span>
                    </div>
                  )}

                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {question.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 font-normal" title={question.description}>
                    {question.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold border border-slate-300 dark:border-slate-700 shadow-3xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
                    <span>{question.testCases.length} {question.testCases.length === 1 ? 'Test Case' : 'Test Cases'}</span>
                  </span>
                  <Link to={`/practice/${question.id}`}>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs text-xs justify-center cursor-pointer px-3.5 h-8 rounded-xl active:scale-95 transition-all"
                    >
                      <span>Solve Problem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}

export default PracticeListPage
