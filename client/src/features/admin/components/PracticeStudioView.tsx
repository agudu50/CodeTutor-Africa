import React, { useState, useEffect, useMemo } from 'react'
import { practiceStoreService } from '@/services/practice/practice-store.service'
import { courseStoreService } from '@/services/learning/course-store.service'
import { PracticeQuestion, Course } from '@/types'
import { PracticeChallengeEditorModal } from './PracticeChallengeEditorModal'
import { Button } from '@/components/ui'
import {
  Code2,
  Plus,
  Search,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  Layers,
  Zap,
  Settings,
  X,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface PracticeStudioViewProps {
  onUpdated?: () => void
}

export const PracticeStudioView: React.FC<PracticeStudioViewProps> = ({ onUpdated }) => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() => practiceStoreService.getAllQuestions())
  const [courses, setCourses] = useState<Course[]>(() => courseStoreService.getAllCourses())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<PracticeQuestion | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const reloadData = () => {
    setQuestions(practiceStoreService.getAllQuestions())
    setCourses(courseStoreService.getAllCourses())
    onUpdated?.()
  }

  useEffect(() => {
    const handler = () => reloadData()
    window.addEventListener('practice_updated', handler)
    window.addEventListener('courses_updated', handler)
    return () => {
      window.removeEventListener('practice_updated', handler)
      window.removeEventListener('courses_updated', handler)
    }
  }, [])

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 3000)
    return () => clearTimeout(t)
  }, [toastMsg])

  const handleOpenCreate = () => {
    setEditingQuestion(null)
    setIsModalOpen(true)
  }

  const handleEdit = (q: PracticeQuestion) => {
    setEditingQuestion(q)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete practice challenge "${title}"?`)) return
    practiceStoreService.deleteQuestion(id)
    reloadData()
    setToastMsg(`Deleted practice challenge "${title}".`)
  }

  const handleResetDefaults = () => {
    if (window.confirm('Reset all practice challenges to official CodeTutor system defaults?')) {
      practiceStoreService.resetToDefaults()
      reloadData()
      setToastMsg('Reset practice challenges to system defaults.')
    }
  }

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.courseTitle && q.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCourse = selectedCourseId === 'all' || q.courseId === selectedCourseId
    const matchesLang = selectedLanguage === 'all' || q.language?.toLowerCase() === selectedLanguage.toLowerCase()
    const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty

    return matchesSearch && matchesCourse && matchesLang && matchesDiff
  })

  // Dynamic language distribution
  const languageDistribution = useMemo(() => {
    const map = new Map<string, number>()
    questions.forEach((q) => {
      const lang = q.language ? q.language.toLowerCase() : 'other'
      map.set(lang, (map.get(lang) || 0) + 1)
    })
    return map
  }, [questions])

  const distinctLanguages = useMemo(() => {
    return Array.from(languageDistribution.keys())
  }, [languageDistribution])

  const beginnerCount = useMemo(() => questions.filter((q) => q.difficulty === 'beginner').length, [questions])
  const intermediateCount = useMemo(() => questions.filter((q) => q.difficulty === 'intermediate').length, [questions])
  const advancedCount = useMemo(() => questions.filter((q) => q.difficulty === 'advanced').length, [questions])
  const linkedCoursesCount = useMemo(() => new Set(questions.filter((q) => q.courseId).map((q) => q.courseId)).size, [questions])

  return (
    <div className="space-y-5 w-full min-w-0 max-w-full">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 animate-in slide-in-from-top-2 fade-in">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-emerald-500 shadow-2xl flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      <PracticeChallengeEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(msg) => {
          reloadData()
          setToastMsg(msg)
        }}
        editingQuestion={editingQuestion}
      />

      {/* Studio Header Banner (Solid Theme) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#005F02] text-white shadow-xs">
              <Code2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Practice Challenge Studio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Author and manage automated coding problems, starter templates, and test cases that power the learner Practice hub across all courses.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="text-xs font-semibold gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            className="text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Challenge</span>
          </Button>
        </div>
      </div>

      {/* Scalable KPI Metrics Bar (Fixed 4-Card Overview) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
            Total Problems
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {questions.length}
            </span>
            <Code2 className="w-4 h-4 text-[#005F02]" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block font-mono">
            Across {distinctLanguages.length} programming tracks
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
            Track Coverage
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">
              {distinctLanguages.length} Active Tracks
            </span>
            <Layers className="w-4 h-4 text-brand-600" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block font-mono truncate">
            {distinctLanguages.map((l) => l.toUpperCase()).join(' • ')}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
              Difficulty Levels
            </span>
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              3 Tiers
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              configured
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {beginnerCount} Beginner
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              {intermediateCount} Intermediate
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              {advancedCount} Advanced
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
            Curriculum Alignment
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {linkedCoursesCount} Courses
            </span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block font-mono">
            100% Offline Executable
          </span>
        </div>
      </div>

      {/* Filter & Search Bar with Track Pills */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xs space-y-3">
        {/* Interactive Language Track Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => setSelectedLanguage('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedLanguage === 'all'
                ? 'bg-[#005F02] text-white border-[#005F02] shadow-2xs font-extrabold'
                : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <span>All Tracks</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              selectedLanguage === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {questions.length}
            </span>
          </button>

          {distinctLanguages.map((lang) => {
            const count = languageDistribution.get(lang) || 0
            const isSelected = selectedLanguage.toLowerCase() === lang.toLowerCase()
            const displayLabel =
              lang === 'javascript' ? 'JavaScript' :
              lang === 'typescript' ? 'TypeScript' :
              lang === 'python' ? 'Python' :
              lang === 'java' ? 'Java' :
              lang === 'html' ? 'HTML' :
              lang === 'css' ? 'CSS' :
              lang === 'git' ? 'Git' :
              lang === 'sql' ? 'SQL' :
              lang.toUpperCase()

            return (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(isSelected ? 'all' : lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-2xs font-extrabold'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{displayLabel}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems by title, description, or tags..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredQuestions.length} of {questions.length} problems
          </span>
        </div>
      </div>

      {/* Challenges Table */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <Code2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No practice challenges found</h3>
          <p className="text-xs text-slate-500">Try changing your search keywords or create a new challenge.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 pl-4 pr-1 w-10 text-center font-bold">#</th>
                  <th className="px-4 py-3">Challenge</th>
                  <th className="px-4 py-3">Associated Course</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Category &amp; Tags</th>
                  <th className="px-4 py-3">Test Cases</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredQuestions.map((q, index) => {
                  const difficultyBadge =
                    q.difficulty === 'beginner'
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : q.difficulty === 'intermediate'
                      ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'

                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="py-3.5 pl-4 pr-1 text-center font-mono text-[11px] text-slate-400 font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <span className="font-bold text-slate-900 dark:text-white block truncate text-xs">
                          {q.title}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {q.description}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 max-w-[140px]">
                        {q.courseTitle ? (
                          <span className="text-[10px] font-medium text-[#005F02] dark:text-emerald-400 flex items-center gap-1 truncate">
                            <BookOpen className="w-3 h-3 shrink-0" />
                            <span className="truncate">{q.courseTitle}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono italic">
                            General
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {q.language}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${difficultyBadge}`}>
                          {q.difficulty}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 max-w-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-semibold block truncate">
                          {q.category}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {q.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono"
                            >
                              #{t}
                            </span>
                          ))}
                          {q.tags.length > 3 && (
                            <span className="text-[9px] text-slate-400 font-mono">
                              +{q.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{q.testCases.length} Cases</span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap">
                        <Link
                          to={`/practice/${q.id}`}
                          target="_blank"
                          title="Preview in Practice Workspace"
                          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-[#005F02] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleEdit(q)}
                          title="Edit Practice Challenge"
                          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(q.id, q.title)}
                          title="Delete Practice Challenge"
                          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
