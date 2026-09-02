import React, { useState, useEffect, useMemo } from 'react'
import { practiceStoreService } from '@/services/practice/practice-store.service'
import { courseStoreService } from '@/services/learning/course-store.service'
import { PracticeQuestion, Course } from '@/types'
import { PracticeChallengeEditorModal } from './PracticeChallengeEditorModal'

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
  Pencil,
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

      {/* ═══════════════════════════════════════════════════════════════
          PRACTICE STUDIO HEADER BANNER (2px borders)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 min-w-0">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs shrink-0 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  Code Evaluation Engine
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Practice Challenge Studio
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5 max-w-2xl leading-relaxed">
                Author and manage automated coding problems, starter templates, and test cases that power the learner Practice hub across all courses.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="h-9 px-3.5 rounded-xl text-xs font-mono font-bold justify-center border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-slate-800 dark:text-slate-200 hover:border-[#005F02] transition-all cursor-pointer shadow-3xs active:scale-95 inline-flex items-center gap-1.5 flex-1 sm:flex-initial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="h-9 px-4 rounded-xl text-xs font-mono font-black bg-[#005F02] hover:bg-emerald-700 border-2 border-[#005F02] text-white shadow-xs justify-center transition-all cursor-pointer active:scale-95 inline-flex items-center gap-1.5 flex-1 sm:flex-initial"
          >
            <Plus className="w-4 h-4" />
            <span>Create Challenge</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SCALABLE KPI METRICS BAR (4 Cards with 2px borders)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5 hover:border-[#005F02] dark:hover:border-emerald-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">
              Total Problems
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Code2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
            {questions.length}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            Across {distinctLanguages.length} programming tracks
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5 hover:border-blue-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">
              Track Coverage
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-400 block">
            {distinctLanguages.length} Active Tracks
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            {distinctLanguages.map((l) => l.toUpperCase()).join(' • ')}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5 hover:border-amber-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">
              Difficulty Levels
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 block">
              3 Tiers
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              configured
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black font-mono bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {beginnerCount} Beginner
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black font-mono bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-800 shadow-3xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              {intermediateCount} Intermediate
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black font-mono bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-800 shadow-3xs">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              {advancedCount} Advanced
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5 hover:border-purple-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">
              Curriculum Alignment
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-800 flex items-center justify-center shrink-0 shadow-3xs">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-400 block">
            {linkedCoursesCount} Courses
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            100% Offline Executable
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FILTER & SEARCH TOOLBAR WITH TRACK PILLS (2px borders)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-3.5">
        {/* Interactive Language Track Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => setSelectedLanguage('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-black border-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shadow-3xs active:scale-95 ${
              selectedLanguage === 'all'
                ? 'bg-[#005F02] text-white border-[#005F02]'
                : 'bg-white dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
            }`}
          >
            <span>All Tracks</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
              selectedLanguage === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
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
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-black border-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shadow-3xs active:scale-95 ${
                  isSelected
                    ? 'bg-[#005F02] text-white border-[#005F02]'
                    : 'bg-white dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
                }`}
              >
                <span>{displayLabel}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t-2 border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems by title, description, or tags..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-xs font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#005F02] shadow-3xs"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-3xs hover:border-[#005F02] focus:outline-none focus:border-[#005F02] appearance-none cursor-pointer"
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
                className="pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-3xs hover:border-[#005F02] focus:outline-none focus:border-[#005F02] appearance-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold shrink-0">
            Showing {filteredQuestions.length} of {questions.length} problems
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CHALLENGES DATA TABLE (2px borders)
          ═══════════════════════════════════════════════════════════════ */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs space-y-2">
          <Code2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">No practice challenges found</h3>
          <p className="text-xs text-slate-500">Try changing your search keywords or create a new challenge.</p>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-[#12161A] border-b-2 border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase font-black text-slate-800 dark:text-slate-200">
                <tr>
                  <th className="py-4 pl-4 pr-1 w-10 text-center font-black">#</th>
                  <th className="px-4 py-4 min-w-[280px]">Challenge</th>
                  <th className="px-4 py-4 min-w-[180px]">Associated Course</th>
                  <th className="px-4 py-4 min-w-[110px]">Language</th>
                  <th className="px-4 py-4 min-w-[110px]">Difficulty</th>
                  <th className="px-4 py-4 min-w-[160px]">Category &amp; Tags</th>
                  <th className="px-4 py-4 min-w-[160px]">Test Cases</th>
                  <th className="px-4 py-4 text-right min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                {filteredQuestions.map((q, index) => {
                  const difficultyBadge =
                    q.difficulty === 'beginner'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 font-black shadow-3xs'
                      : q.difficulty === 'intermediate'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-800 font-black shadow-3xs'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-950 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-800 font-black shadow-3xs'

                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-4 pl-4 pr-1 text-center font-mono text-[11px] text-slate-400 font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-4 min-w-[280px] max-w-md">
                        <span className="font-extrabold text-slate-900 dark:text-white block text-xs sm:text-sm leading-snug">
                          {q.title}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2" title={q.description}>
                          {q.description}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        {q.courseTitle ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 font-mono text-[10px] font-black shadow-3xs">
                            <BookOpen className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[150px]">{q.courseTitle}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono italic">
                            General Curriculum
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 font-mono">
                        <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                          {q.language}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-mono">
                        <span className={`text-[10px] uppercase px-2.5 py-1 rounded-lg ${difficultyBadge}`}>
                          {q.difficulty}
                        </span>
                      </td>

                      <td className="px-4 py-4 max-w-xs">
                        <span className="text-slate-800 dark:text-slate-200 font-extrabold text-xs block truncate">
                          {q.category}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {q.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-slate-400 font-mono border border-slate-200 dark:border-slate-700 font-medium"
                            >
                              #{t}
                            </span>
                          ))}
                          {q.tags.length > 3 && (
                            <span className="text-[9px] text-slate-400 font-mono font-bold">
                              +{q.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-black bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 w-fit shadow-3xs">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{q.testCases.length} {q.testCases.length === 1 ? 'Test Case' : 'Test Cases'}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                            {q.testCases.some((t) => t.isHidden)
                              ? `${q.testCases.filter((t) => !t.isHidden).length} Public • ${q.testCases.filter((t) => t.isHidden).length} Hidden`
                              : '100% Automated Coverage'
                            }
                          </span>
                        </div>
                      </td>

                      <td className="py-4 pr-4 pl-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/practice/${q.id}`}
                            target="_blank"
                            title="Preview in Practice Workspace"
                            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-[#161B22] hover:border-[#005F02] border-2 border-slate-300 dark:border-slate-700 shadow-3xs active:scale-95 transition-all"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleEdit(q)}
                            title="Edit Practice Challenge"
                            className="p-2 rounded-xl text-white bg-[#005F02] hover:bg-emerald-700 border-2 border-[#005F02] shadow-3xs active:scale-95 cursor-pointer transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(q.id, q.title)}
                            title="Delete Practice Challenge"
                            className="p-2 rounded-xl text-rose-600 dark:text-rose-400 bg-white dark:bg-[#161B22] hover:bg-rose-50 dark:hover:bg-rose-950/60 border-2 border-slate-300 dark:border-slate-700 hover:border-rose-400 shadow-3xs active:scale-95 cursor-pointer transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
