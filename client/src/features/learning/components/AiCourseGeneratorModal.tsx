import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { aiCourseGeneratorService } from '@/services/learning/ai-course-generator.service'
import { ProgrammingLanguage, DifficultyLevel } from '@/types/common'
import {
  Zap,
  X,
  ArrowRight,
  Bot,
  ChevronDown,
  Check,
  BookOpen,
  Play,
  Code2,
  Gamepad2,
} from 'lucide-react'

interface AiCourseGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
}

interface LanguageOption {
  value: ProgrammingLanguage
  label: string
}

const MODERN_LANGUAGES: LanguageOption[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
]

interface DifficultyOption {
  value: DifficultyLevel
  label: string
  spec: string
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { value: 'beginner', label: 'Beginner', spec: 'Foundations & Syntax' },
  { value: 'intermediate', label: 'Intermediate', spec: 'Hands-On Architecture' },
  { value: 'advanced', label: 'Advanced', spec: 'High-Performance Systems' },
]

interface ModuleDepthOption {
  value: number
  label: string
  spec: string
}

const MODULE_DEPTH_OPTIONS: ModuleDepthOption[] = [
  { value: 1, label: '1 Module', spec: '~3 Lessons • Crash Course' },
  { value: 2, label: '2 Modules', spec: '~6 Lessons • Targeted Sprint' },
  { value: 3, label: '3 Modules', spec: '~9 Lessons • Standard Track' },
  { value: 4, label: '4 Modules', spec: '~12 Lessons • Specialization' },
  { value: 5, label: '5 Modules', spec: '~15 Lessons • Masterclass' },
]

export const AiCourseGeneratorModal: React.FC<AiCourseGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate')
  const [moduleCount, setModuleCount] = useState<number>(3)
  const [includeVideos, setIncludeVideos] = useState(true)
  const [includeGames, setIncludeGames] = useState(true)
  const [includeExercises, setIncludeExercises] = useState(true)

  // Custom Dropdown Open States (Opening Downward)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [diffDropdownOpen, setDiffDropdownOpen] = useState(false)
  const [depthDropdownOpen, setDepthDropdownOpen] = useState(false)

  const langRef = useRef<HTMLDivElement>(null)
  const diffRef = useRef<HTMLDivElement>(null)
  const depthRef = useRef<HTMLDivElement>(null)

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [progressStep, setProgressStep] = useState(0)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false)
      }
      if (diffRef.current && !diffRef.current.contains(event.target as Node)) {
        setDiffDropdownOpen(false)
      }
      if (depthRef.current && !depthRef.current.contains(event.target as Node)) {
        setDepthDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const promptSuggestions = [
    { label: 'JavaScript Async & APIs', prompt: 'Modern JavaScript Event Loop, Async/Await, Web APIs, and State Management', lang: 'javascript' as ProgrammingLanguage },
    { label: 'TypeScript Enterprise Architecture', prompt: 'Advanced TypeScript Generics, Utility Types, Interfaces, and Clean Architecture', lang: 'typescript' as ProgrammingLanguage },
    { label: 'Python Problem Solving & Data', prompt: 'Python Algorithmic Problem Solving, Functions, Comprehensions, and Data Structures', lang: 'python' as ProgrammingLanguage },
    { label: 'Java OOP & Scalable Design', prompt: 'Java OOP Patterns, Polymorphism, Abstract Contracts, and Collections', lang: 'java' as ProgrammingLanguage },
  ]

  const generationSteps = [
    'Analyzing prompt requirements & pedagogical goals...',
    'Architecting multi-module curriculum structure...',
    'Synthesizing deep lesson guides, markdown notes & code snippets...',
    'Curating offline video masterclasses & visual diagrams...',
    'Constructing compiler coding exercises & automated test cases...',
    'Crafting 3D arcade bug hunt levels & syntax speedrun drills...',
    'Finalizing course & saving to local SQLite cache...',
  ]

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsGenerating(true)
    setProgressStep(0)

    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < generationSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 450)

    try {
      const newCourse = await aiCourseGeneratorService.generateCourse({
        prompt: prompt.trim(),
        language,
        difficulty,
        moduleCount,
        includeVideos,
        includeGames,
        includeExercises,
      })

      clearInterval(interval)
      setTimeout(() => {
        setIsGenerating(false)
        onClose()
        navigate(`/learning/courses/${newCourse.id}`)
      }, 500)
    } catch (err) {
      clearInterval(interval)
      setIsGenerating(false)
      console.error('Failed to generate course', err)
    }
  }

  const selectedLangObj = MODERN_LANGUAGES.find((l) => l.value === language) || MODERN_LANGUAGES[0]
  const selectedDiffObj = DIFFICULTY_OPTIONS.find((d) => d.value === difficulty) || DIFFICULTY_OPTIONS[1]
  const selectedDepthObj = MODULE_DEPTH_OPTIONS.find((m) => m.value === moduleCount) || MODULE_DEPTH_OPTIONS[2]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isGenerating ? onClose : undefined}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-2xl text-left rounded-3xl bg-[#FAFAFA] dark:bg-[#0C1015] border-2 border-slate-300 dark:border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5 my-8 overflow-hidden"
        >
          {/* Technical Blueprint Grid Pattern */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.055] dark:opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="modal-blueprint-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#modal-blueprint-grid)" />
          </svg>

          {/* Blueprint Corner Crosshairs (+) */}
          <span className="absolute top-3 left-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-slate-400 dark:text-slate-600 font-mono text-xs select-none pointer-events-none">+</span>

          {/* Modal Header */}
          <div className="relative z-10 flex items-start justify-between gap-4 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[#005F02] dark:text-emerald-400 shadow-3xs">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-black px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  100% OFFLINE LLM ARCHITECT
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Prompt AI Course Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Describe any modern technology, framework, or concept. Synthesizes a structured curriculum locally on your CPU.
              </p>
            </div>

            {!isGenerating && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer shadow-3xs"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Generation Progress Overlay */}
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 py-12 px-4 text-center space-y-6"
              >
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
                  <div className="absolute inset-0 rounded-full border-4 border-[#005F02] border-t-transparent animate-spin" />
                  <Zap className="w-8 h-8 text-[#005F02] animate-pulse" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Synthesizing Custom Curriculum...
                  </h3>
                  <p className="text-xs font-mono text-[#005F02] font-semibold min-h-[20px]">
                    {generationSteps[progressStep]}
                  </p>
                </div>

                {/* Step Progress Bar */}
                <div className="w-full max-w-sm mx-auto bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
                  <div
                    className="bg-[#005F02] h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${((progressStep + 1) / generationSteps.length) * 100}%`,
                    }}
                  />
                </div>

                <span className="inline-block text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  0 KB Network • 100% Offline Generation
                </span>
              </motion.div>
            ) : (
              /* Main Generator Form */
              <form onSubmit={handleGenerate} className="relative z-10 space-y-5">
                {/* Prompt Textarea */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    What do you want to master?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Master Modern Rust Concurrency, Async Tokio Runtime, Memory Safety & Thread Pools from Scratch"
                    className="w-full rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] px-4 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#005F02] transition-all resize-none shadow-2xs leading-relaxed font-sans"
                  />
                </div>

                {/* Quick Suggestions Chips */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-mono">
                    <Zap className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                    <span>Popular Topic Ideas:</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {promptSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPrompt(sug.prompt)
                          setLanguage(sug.lang)
                        }}
                        className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E1318] hover:border-[#005F02] hover:text-[#005F02] text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-800 transition-all font-semibold cursor-pointer shadow-3xs active:scale-95"
                      >
                        {sug.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clean, Downward-Opening Dropdowns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1 w-full">
                  {/* 1. Target Language Dropdown (Opens Downward with Scrolling) */}
                  <div className="space-y-1.5 relative min-w-0 w-full" ref={langRef}>
                    <label className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate">
                      Target Language
                    </label>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setLangDropdownOpen(!langDropdownOpen)
                        setDiffDropdownOpen(false)
                        setDepthDropdownOpen(false)
                      }}
                      className={`w-full h-11 px-3.5 flex items-center justify-between rounded-xl border-2 bg-white dark:bg-[#0E1318] text-left transition-all cursor-pointer shadow-2xs ${
                        langDropdownOpen
                          ? 'border-[#005F02] ring-2 ring-[#005F02]/20'
                          : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {selectedLangObj.label}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${langDropdownOpen ? 'rotate-180 text-[#005F02]' : ''}`} />
                    </button>

                    {/* Downward-Opening Scrollable Popover */}
                    <AnimatePresence>
                      {langDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.12 }}
                          className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full max-h-[160px] overflow-y-auto rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-2xl p-1.5 space-y-1"
                        >
                          {MODERN_LANGUAGES.map((langItem) => {
                            const isSelected = langItem.value === language
                            return (
                              <button
                                key={langItem.value}
                                type="button"
                                onClick={() => {
                                  setLanguage(langItem.value)
                                  setLangDropdownOpen(false)
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                                }`}
                              >
                                <span className="text-xs">{langItem.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />}
                              </button>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 2. Difficulty Level Dropdown */}
                  <div className="space-y-1.5 relative min-w-0 w-full" ref={diffRef}>
                    <label className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate">
                      Difficulty Level
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setDiffDropdownOpen(!diffDropdownOpen)
                        setLangDropdownOpen(false)
                        setDepthDropdownOpen(false)
                      }}
                      className={`w-full h-11 px-3.5 flex items-center justify-between rounded-xl border-2 bg-white dark:bg-[#0E1318] text-left transition-all cursor-pointer shadow-2xs ${
                        diffDropdownOpen
                          ? 'border-[#005F02] ring-2 ring-[#005F02]/20'
                          : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {selectedDiffObj.label}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${diffDropdownOpen ? 'rotate-180 text-[#005F02]' : ''}`} />
                    </button>

                    {/* Downward Popover */}
                    <AnimatePresence>
                      {diffDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.12 }}
                          className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full max-h-[160px] overflow-y-auto rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-2xl p-1.5 space-y-1"
                        >
                          {DIFFICULTY_OPTIONS.map((diffItem) => {
                            const isSelected = diffItem.value === difficulty
                            return (
                              <button
                                key={diffItem.value}
                                type="button"
                                onClick={() => {
                                  setDifficulty(diffItem.value)
                                  setDiffDropdownOpen(false)
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="text-xs font-semibold">
                                    {diffItem.label}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {diffItem.spec}
                                  </div>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />}
                              </button>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. Curriculum Depth Dropdown */}
                  <div className="space-y-1.5 relative min-w-0 w-full" ref={depthRef}>
                    <label className="block text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate">
                      Curriculum Depth
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setDepthDropdownOpen(!depthDropdownOpen)
                        setLangDropdownOpen(false)
                        setDiffDropdownOpen(false)
                      }}
                      className={`w-full h-11 px-3.5 flex items-center justify-between rounded-xl border-2 bg-white dark:bg-[#0E1318] text-left transition-all cursor-pointer shadow-2xs ${
                        depthDropdownOpen
                          ? 'border-[#005F02] ring-2 ring-[#005F02]/20'
                          : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {selectedDepthObj.label}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${depthDropdownOpen ? 'rotate-180 text-[#005F02]' : ''}`} />
                    </button>

                    {/* Downward Popover */}
                    <AnimatePresence>
                      {depthDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.12 }}
                          className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full max-h-[160px] overflow-y-auto rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-2xl p-1.5 space-y-1"
                        >
                          {MODULE_DEPTH_OPTIONS.map((depthItem) => {
                            const isSelected = depthItem.value === moduleCount
                            return (
                              <button
                                key={depthItem.value}
                                type="button"
                                onClick={() => {
                                  setModuleCount(depthItem.value)
                                  setDepthDropdownOpen(false)
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="text-xs font-semibold">
                                    {depthItem.label}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {depthItem.spec}
                                  </div>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />}
                              </button>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* What will be generated checklist */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 space-y-3 shadow-2xs">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Included in your AI-Generated Course:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Lesson Notes (Always Included) */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/50 text-[#005F02] dark:text-emerald-400 text-xs font-bold font-mono shadow-3xs">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span className="truncate">Lesson Notes</span>
                    </div>

                    {/* Video Lessons */}
                    <button
                      type="button"
                      onClick={() => setIncludeVideos(!includeVideos)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold font-mono transition-colors cursor-pointer shadow-3xs ${
                        includeVideos
                          ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                          : 'border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-900 text-slate-500'
                      }`}
                    >
                      <Play className="w-4 h-4 shrink-0" />
                      <span className="truncate">Video Lessons</span>
                    </button>

                    {/* Coding Drills */}
                    <button
                      type="button"
                      onClick={() => setIncludeExercises(!includeExercises)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold font-mono transition-colors cursor-pointer shadow-3xs ${
                        includeExercises
                          ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                          : 'border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-900 text-slate-500'
                      }`}
                    >
                      <Code2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">Coding Drills</span>
                    </button>

                    {/* 3D Arcade Games */}
                    <button
                      type="button"
                      onClick={() => setIncludeGames(!includeGames)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold font-mono transition-colors cursor-pointer shadow-3xs ${
                        includeGames
                          ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400'
                          : 'border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-900 text-slate-500'
                      }`}
                    >
                      <Gamepad2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">3D Arcade Games</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer shadow-3xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className="px-6 py-3 rounded-xl bg-[#005F02] hover:bg-[#004e02] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Synthesize Full Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
    </div>
  </div>
)
}

export default AiCourseGeneratorModal
