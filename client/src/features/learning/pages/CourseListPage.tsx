import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { courseStoreService } from '@/services/learning/course-store.service'
import { Course } from '@/types'
import { CourseCard } from '../components/CourseCard'
import { AiCourseGeneratorModal } from '../components/AiCourseGeneratorModal'
import { Input, Dropdown } from '@/components/ui'
import {
  Search,
  BookOpen,
  Zap,
  Bot,
  ArrowRight,
  Code2,
  Gamepad2,
  Play,
  Cpu,
  Sparkles,
} from 'lucide-react'

export const CourseListPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(courseStoreService.getAllCourses())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLang, setSelectedLang] = useState('all')
  const [filterTab, setFilterTab] = useState<'all' | 'official' | 'ai'>('all')
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)

  useEffect(() => {
    const handleUpdate = () => setCourses(courseStoreService.getAllCourses())
    window.addEventListener('courses_updated', handleUpdate)
    return () => window.removeEventListener('courses_updated', handleUpdate)
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLang = selectedLang === 'all' || course.language === selectedLang
    const matchesTab =
      filterTab === 'all'
        ? true
        : filterTab === 'ai'
        ? Boolean(course.isAiGenerated)
        : !course.isAiGenerated

    return matchesSearch && matchesLang && matchesTab
  })

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          AI COURSE GENERATOR PROMPT HERO BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] p-6 sm:p-9 shadow-md dark:shadow-2xl">
        {/* Technical Blueprint Grid Pattern (Visible in Light & Dark Mode) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.065] dark:opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="architect-hero-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#architect-hero-grid)" />
        </svg>

        {/* Blueprint Corner Crosshairs (+) */}
        <span className="absolute top-3 left-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>
        <span className="absolute top-3 right-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>
        <span className="absolute bottom-3 left-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>
        <span className="absolute bottom-3 right-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>

        {/* Floating Model Badge */}
        <div className="absolute top-5 right-5 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 shadow-3xs select-none">
          <Cpu className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
          <span>LLAMA 3.2 3B</span>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-black shadow-3xs">
                <Cpu className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                <span>OFFLINE LLAMA COURSE ARCHITECT</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E1318] border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shadow-3xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>Available to all learners</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Prompt AI to Build Your <span className="text-[#005F02] dark:text-emerald-400">Custom Curriculum</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Don't see the specific topic you need? Prompt our offline AI mentor to synthesize complete multi-module courses with deep lesson notes, video masterclasses, 3D arcade games, and compiler exercises.
            </p>

            {/* Discrete Feature Chips */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E1318] border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-3xs hover:border-slate-400 transition-colors">
                <BookOpen className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                <span>Markdown Notes</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E1318] border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-3xs hover:border-slate-400 transition-colors">
                <Play className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Offline Videos</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E1318] border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-3xs hover:border-slate-400 transition-colors">
                <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Compiler Drills</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E1318] border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-3xs hover:border-slate-400 transition-colors">
                <Gamepad2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>3D Arcade Battles</span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="px-6 py-4 rounded-2xl bg-[#005F02] hover:bg-[#004e02] active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span>Prompt AI to Generate Course</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 shadow-3xs">
              <Zap className="w-3 h-3 text-[#005F02] dark:text-emerald-400" />
              <span>0 KB Cloud Network Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FILTER & SOURCE TABS TOOLBAR
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Source Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 w-fit">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Tracks ({courses.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('official')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'official'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Official Tracks ({courses.filter((c) => !c.isAiGenerated).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('ai')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'ai'
                ? 'bg-[#005F02] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#005F02]'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>AI Generated ({courses.filter((c) => c.isAiGenerated).length})</span>
          </button>
        </div>

        {/* Search & Language Dropdown */}
        <div className="flex flex-col sm:flex-row gap-2.5 flex-1 sm:max-w-md">
          <div className="flex-1">
            <Input
              placeholder="Search courses by topic, language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="bg-white dark:bg-slate-900 text-xs"
            />
          </div>
          <div className="w-full sm:w-44">
            <Dropdown
              options={[
                { value: 'all', label: 'All Languages' },
                { value: 'javascript', label: 'JavaScript' },
                { value: 'python', label: 'Python' },
                { value: 'java', label: 'Java' },
                { value: 'typescript', label: 'TypeScript' },
              ]}
              value={selectedLang}
              onChange={setSelectedLang}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          COURSES GRID
          ═══════════════════════════════════════════════════════════════ */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#005F02]/10 border border-[#005F02]/30 flex items-center justify-center text-[#005F02] mx-auto">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No courses found matching your filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can prompt the offline AI to generate this course instantly with full materials, games, and quizzes.
          </p>
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#005F02] text-white font-bold text-xs inline-flex items-center gap-2 hover:bg-[#004e02] transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Generate this Course with AI</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* AI Course Generator Modal */}
      <AiCourseGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </PageContainer>
  )
}

export default CourseListPage
