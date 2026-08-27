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
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        {/* Ambient Radial Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#005F02]/10 dark:bg-[#005F02]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F02]/15 text-[#005F02] border border-[#005F02]/30 text-[10px] font-mono font-black">
                <Zap className="w-3.5 h-3.5" />
                <span>OFFLINE LLAMA COURSE ARCHITECT</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                Available to all learners
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Prompt AI to Build Your <span className="text-[#005F02]">Custom Curriculum</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Don't see the specific topic you need? Prompt our offline AI mentor to synthesize complete multi-module courses with deep lesson notes, video masterclasses, 3D arcade games, and compiler exercises.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#005F02]" />
                <span>Markdown Notes</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-rose-500" />
                <span>Offline Videos</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Compiler Drills</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>3D Arcade Battles</span>
              </span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-[#005F02] hover:bg-[#004e02] active:scale-[0.99] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#005F02]/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
            >
              <Zap className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span>Prompt AI to Generate Course</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-[10px] font-mono text-center text-slate-400">
              0 KB Cloud Network Required
            </span>
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
                { value: 'java', label: 'Java 21' },
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
