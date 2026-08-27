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
          className="relative z-10 w-full max-w-2xl text-left rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-4 border-t-[#005F02] shadow-2xl p-6 sm:p-8 space-y-5 my-8"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#005F02]/10 border border-[#005F02]/30 flex items-center justify-center text-[#005F02]">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#005F02]/15 text-[#005F02] border border-[#005F02]/30">
                  100% OFFLINE LLM ARCHITECT
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Prompt AI Course Generator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Describe any modern technology, framework, or concept. Synthesizes a structured curriculum locally on your CPU.
              </p>
            </div>

          {!isGenerating && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
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
              className="py-12 px-4 text-center space-y-6"
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
              <div className="w-full max-w-sm mx-auto bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#005F02] h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${((progressStep + 1) / generationSteps.length) * 100}%`,
                  }}
                />
              </div>

              <span className="inline-block text-[11px] font-mono text-slate-400">
                0 KB Network • 100% Offline Generation
              </span>
            </motion.div>
          ) : (
            /* Main Generator Form */
            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Prompt Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  What do you want to master?
                </label>
                <textarea
                  rows={3}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Master Modern Rust Concurrency, Async Tokio Runtime, Memory Safety & Thread Pools from Scratch"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#005F02] focus:ring-2 focus:ring-[#005F02]/20 transition-all resize-none shadow-sm"
                />
              </div>

              {/* Quick Suggestions Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#005F02]" />
                  <span>Popular Topic Ideas:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {promptSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrompt(sug.prompt)
                        setLanguage(sug.lang)
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-[#005F02]/10 hover:text-[#005F02] hover:border-[#005F02]/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-all font-medium cursor-pointer"
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clean, Downward-Opening Dropdowns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 w-full">
                {/* 1. Target Language Dropdown (Opens Downward with Scrolling) */}
                <div className="space-y-1 relative min-w-0 w-full" ref={langRef}>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    Target Language
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setLangDropdownOpen(!langDropdownOpen)
                      setDiffDropdownOpen(false)
                      setDepthDropdownOpen(false)
                    }}
                    className={`w-full h-10 px-3 flex items-center justify-between rounded-xl border bg-slate-50 dark:bg-slate-950 text-left transition-all cursor-pointer shadow-sm ${
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
                        className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full max-h-[142px] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 space-y-0.5"
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
                                  ? 'bg-[#005F02]/10 text-[#005F02] dark:text-[#52c256]'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span className="text-xs font-semibold">{langItem.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#005F02] shrink-0" />}
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Difficulty Level Dropdown (Opens Downward with 3 Visible Items) */}
                <div className="space-y-1 relative min-w-0 w-full" ref={diffRef}>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    Difficulty Level
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setDiffDropdownOpen(!diffDropdownOpen)
                      setLangDropdownOpen(false)
                      setDepthDropdownOpen(false)
                    }}
                    className={`w-full h-10 px-3 flex items-center justify-between rounded-xl border bg-slate-50 dark:bg-slate-950 text-left transition-all cursor-pointer shadow-sm ${
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

                  {/* Downward Popover (3 items visible with scrolling) */}
                  <AnimatePresence>
                    {diffDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full max-h-[142px] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 space-y-0.5"
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
                                  ? 'bg-[#005F02]/10 text-[#005F02] dark:text-[#52c256]'
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
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#005F02] shrink-0" />}
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Curriculum Depth Dropdown (Opens Downward with 3 Visible Items) */}
                <div className="space-y-1 relative min-w-0 w-full" ref={depthRef}>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    Curriculum Depth
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setDepthDropdownOpen(!depthDropdownOpen)
                      setLangDropdownOpen(false)
                      setDiffDropdownOpen(false)
                    }}
                    className={`w-full h-10 px-3 flex items-center justify-between rounded-xl border bg-slate-50 dark:bg-slate-950 text-left transition-all cursor-pointer shadow-sm ${
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

                  {/* Downward Popover (3 items visible with scrolling) */}
                  <AnimatePresence>
                    {depthDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full max-h-[142px] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 space-y-0.5"
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
                                  ? 'bg-[#005F02]/10 text-[#005F02] dark:text-[#52c256]'
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
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#005F02] shrink-0" />}
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* What will be generated checklist */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                  Included in your AI-Generated Course:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="accent-[#005F02] rounded"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Lesson Notes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeVideos}
                      onChange={(e) => setIncludeVideos(e.target.checked)}
                      className="accent-[#005F02] rounded"
                    />
                    <span>Video Lessons</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeExercises}
                      onChange={(e) => setIncludeExercises(e.target.checked)}
                      className="accent-[#005F02] rounded"
                    />
                    <span>Coding Drills</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeGames}
                      onChange={(e) => setIncludeGames(e.target.checked)}
                      className="accent-[#005F02] rounded"
                    />
                    <span>3D Arcade Games</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs shadow-md shadow-[#005F02]/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
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
