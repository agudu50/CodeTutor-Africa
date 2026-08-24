import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { aiCourseGeneratorService } from '@/services/learning/ai-course-generator.service'
import { ProgrammingLanguage, DifficultyLevel } from '@/types/common'
import {
  Sparkles,
  X,
  ArrowRight,
  Bot,
  ChevronDown,
  Check,
  Search,
  BookOpen,
  BarChart3,
  Code2,
} from 'lucide-react'

interface AiCourseGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
}

interface LanguageOption {
  value: ProgrammingLanguage
  label: string
  version: string
  category: string
  tag: string
  tagColor: string
  description: string
}

const MODERN_LANGUAGES: LanguageOption[] = [
  {
    value: 'python',
    label: 'Python',
    version: 'v3.12+',
    category: 'AI & Data',
    tag: 'PY',
    tagColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    description: 'Modern AI, Machine Learning, FastAPIs & Automation',
  },
  {
    value: 'typescript',
    label: 'TypeScript',
    version: 'v5.4+',
    category: 'Web & Fullstack',
    tag: 'TS',
    tagColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25',
    description: 'Type-Safe Full-Stack, Next.js, Node.js & Clean Architecture',
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    version: 'ES2024',
    category: 'Web & Fullstack',
    tag: 'JS',
    tagColor: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/25',
    description: 'Modern Web, Event Loop, Web Streams & DOM Manipulation',
  },
  {
    value: 'rust',
    label: 'Rust',
    version: '2024 Edition',
    category: 'Systems & Performance',
    tag: 'RS',
    tagColor: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/25',
    description: 'Memory Safety, Zero-Cost Abstractions & High-Speed Systems',
  },
  {
    value: 'go',
    label: 'Golang',
    version: 'v1.22+',
    category: 'Systems & Performance',
    tag: 'GO',
    tagColor: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25',
    description: 'Cloud Microservices, Goroutines, Channels & High Concurrency',
  },
  {
    value: 'cpp',
    label: 'C++ 20/23',
    version: 'Modern C++23',
    category: 'Systems & Performance',
    tag: 'C++',
    tagColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25',
    description: 'Low-Latency Engine Design, Smart Pointers & STL Optimizations',
  },
  {
    value: 'java',
    label: 'Java',
    version: 'Java 21 LTS',
    category: 'Enterprise & JVM',
    tag: 'JAVA',
    tagColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
    description: 'Virtual Threads, Modern OOP, Spring Boot & Enterprise JVM',
  },
  {
    value: 'csharp',
    label: 'C# / .NET',
    version: '.NET 8 LTS',
    category: 'Enterprise & JVM',
    tag: 'C#',
    tagColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25',
    description: 'Modern ASP.NET Core, Cloud Microservices & High-Scale Web',
  },
  {
    value: 'php',
    label: 'PHP',
    version: 'v8.3 Modern',
    category: 'Web & Fullstack',
    tag: 'PHP',
    tagColor: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25',
    description: 'Modern PHP 8.3 Types, Laravel Architecture & Fast Web APIs',
  },
  {
    value: 'sql',
    label: 'SQL & Relational',
    version: 'SQL:2023',
    category: 'Database',
    tag: 'SQL',
    tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    description: 'PostgreSQL Schemas, B-Tree Index Tuning & Query Optimization',
  },
  {
    value: 'html',
    label: 'HTML5 & Modern CSS3',
    version: 'Modern Standard',
    category: 'Web & Fullstack',
    tag: 'HTML',
    tagColor: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/25',
    description: 'Semantic Web, Responsive Flexbox/Grid, Animations & UI',
  },
]

interface DifficultyOption {
  value: DifficultyLevel
  label: string
  badge: string
  levelTag: string
  description: string
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    badge: 'Foundations & Syntax',
    levelTag: 'LVL 1',
    description: 'Core concepts, visual models & zero-assumption guides',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    badge: 'Hands-On Architecture',
    levelTag: 'LVL 2',
    description: 'Real-world problem solving, modular design & best practices',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    badge: 'High-Performance Systems',
    levelTag: 'LVL 3',
    description: 'Low-latency optimizations, concurrency & enterprise design',
  },
]

interface ModuleDepthOption {
  value: number
  label: string
  subtitle: string
  lessons: string
  duration: string
  stepTag: string
}

const MODULE_DEPTH_OPTIONS: ModuleDepthOption[] = [
  {
    value: 1,
    label: '1 Module',
    subtitle: 'Crash Course',
    lessons: '~3 Lessons',
    duration: '1-2 hrs',
    stepTag: '01',
  },
  {
    value: 2,
    label: '2 Modules',
    subtitle: 'Targeted Sprint',
    lessons: '~6 Lessons',
    duration: '3-4 hrs',
    stepTag: '02',
  },
  {
    value: 3,
    label: '3 Modules',
    subtitle: 'Standard Track',
    lessons: '~9 Lessons',
    duration: '6-8 hrs',
    stepTag: '03',
  },
  {
    value: 4,
    label: '4 Modules',
    subtitle: 'Deep Specialization',
    lessons: '~12 Lessons',
    duration: '10-14 hrs',
    stepTag: '04',
  },
  {
    value: 5,
    label: '5 Modules',
    subtitle: 'Masterclass & Capstone',
    lessons: '~15 Lessons',
    duration: '16-20 hrs',
    stepTag: '05',
  },
]

export const AiCourseGeneratorModal: React.FC<AiCourseGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState<ProgrammingLanguage>('python')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate')
  const [moduleCount, setModuleCount] = useState<number>(3)
  const [includeVideos, setIncludeVideos] = useState(true)
  const [includeGames, setIncludeGames] = useState(true)
  const [includeExercises, setIncludeExercises] = useState(true)

  // Custom Dropdown Open States
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [diffDropdownOpen, setDiffDropdownOpen] = useState(false)
  const [depthDropdownOpen, setDepthDropdownOpen] = useState(false)
  const [langSearch, setLangSearch] = useState('')

  // Dropdown Refs for Click Outside
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
    { label: 'Rust Memory & Concurrency', prompt: 'Rust Systems Programming, Memory Safety, and Concurrent Thread Pools', lang: 'rust' as ProgrammingLanguage },
    { label: 'Golang Distributed Backend', prompt: 'Golang Microservices, Goroutines, Channels, and Distributed Key-Value Store', lang: 'go' as ProgrammingLanguage },
    { label: 'C++ Systems & STL Algorithms', prompt: 'Modern C++20 Memory Management, Smart Pointers, and STL Algorithm Optimization', lang: 'cpp' as ProgrammingLanguage },
    { label: 'Full-Stack JavaScript & Async', prompt: 'Modern JavaScript Event Loop, Async Microtasks, Web Streams, and Local SQLite', lang: 'javascript' as ProgrammingLanguage },
    { label: 'TypeScript Enterprise Architecture', prompt: 'Advanced TypeScript Generics, Utility Types, Decorators, and Clean Architecture', lang: 'typescript' as ProgrammingLanguage },
    { label: 'Java Enterprise OOP & JVM', prompt: 'Java OOP Patterns, JVM Bytecode Optimization, and Clean Enterprise Architecture', lang: 'java' as ProgrammingLanguage },
    { label: 'Python Full-Stack & ML', prompt: 'Python Algorithmic Problem Solving, Decorators, Generators, and NumPy Foundations', lang: 'python' as ProgrammingLanguage },
    { label: 'SQL Indexing & Optimization', prompt: 'High-Performance SQL Queries, B-Tree Indexes, Query Execution Plans, and Schema Normalization', lang: 'sql' as ProgrammingLanguage },
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

  const filteredLanguages = MODERN_LANGUAGES.filter(
    (l) =>
      l.label.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.version.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.category.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.description.toLowerCase().includes(langSearch.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5 my-6"
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
                <Sparkles className="w-8 h-8 text-[#005F02] animate-pulse" />
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
                  <Sparkles className="w-3.5 h-3.5 text-[#005F02]" />
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

              {/* Enhanced Custom Dropdowns Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {/* 1. Enhanced Target Language Dropdown */}
                <div className="space-y-1 relative" ref={langRef}>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-[#005F02]" />
                    <span>Target Language</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setLangDropdownOpen(!langDropdownOpen)
                      setDiffDropdownOpen(false)
                      setDepthDropdownOpen(false)
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-left transition-all cursor-pointer shadow-sm ${
                      langDropdownOpen
                        ? 'border-[#005F02] ring-2 ring-[#005F02]/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${selectedLangObj.tagColor}`}>
                        {selectedLangObj.tag}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {selectedLangObj.label}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {selectedLangObj.version}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180 text-[#005F02]' : ''}`} />
                  </button>

                  {/* Language Popover Menu */}
                  <AnimatePresence>
                    {langDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1 z-30 max-h-64 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 space-y-1"
                      >
                        {/* Search Input Inside Dropdown */}
                        <div className="relative mb-1.5 px-1">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            value={langSearch}
                            onChange={(e) => setLangSearch(e.target.value)}
                            placeholder="Filter language..."
                            className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none border-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div className="space-y-0.5">
                          {filteredLanguages.map((langItem) => {
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
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${langItem.tagColor}`}>
                                    {langItem.tag}
                                  </span>
                                  <div>
                                    <div className="text-xs font-bold flex items-center gap-1.5">
                                      <span>{langItem.label}</span>
                                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                        {langItem.version}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                                      {langItem.description}
                                    </div>
                                  </div>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#005F02] shrink-0" />}
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Enhanced Difficulty Level Dropdown */}
                <div className="space-y-1 relative" ref={diffRef}>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5 text-[#005F02]" />
                    <span>Difficulty Level</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setDiffDropdownOpen(!diffDropdownOpen)
                      setLangDropdownOpen(false)
                      setDepthDropdownOpen(false)
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-left transition-all cursor-pointer shadow-sm ${
                      diffDropdownOpen
                        ? 'border-[#005F02] ring-2 ring-[#005F02]/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                        {selectedDiffObj.levelTag}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {selectedDiffObj.label}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {selectedDiffObj.badge}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${diffDropdownOpen ? 'rotate-180 text-[#005F02]' : ''}`} />
                  </button>

                  {/* Difficulty Popover Menu */}
                  <AnimatePresence>
                    {diffDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1 z-30 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 space-y-1"
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
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                                  {diffItem.levelTag}
                                </span>
                                <div>
                                  <div className="text-xs font-bold flex items-center gap-1.5">
                                    <span>{diffItem.label}</span>
                                    <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                      {diffItem.badge}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                                    {diffItem.description}
                                  </div>
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

                {/* 3. Enhanced Curriculum Depth Dropdown */}
                <div className="space-y-1 relative" ref={depthRef}>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#005F02]" />
                    <span>Curriculum Depth</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setDepthDropdownOpen(!depthDropdownOpen)
                      setLangDropdownOpen(false)
                      setDiffDropdownOpen(false)
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-left transition-all cursor-pointer shadow-sm ${
                      depthDropdownOpen
                        ? 'border-[#005F02] ring-2 ring-[#005F02]/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                        {selectedDepthObj.stepTag}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {selectedDepthObj.label}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {selectedDepthObj.lessons} • {selectedDepthObj.subtitle}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${depthDropdownOpen ? 'rotate-180 text-[#005F02]' : ''}`} />
                  </button>

                  {/* Depth Popover Menu */}
                  <AnimatePresence>
                    {depthDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1 z-30 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 space-y-1"
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
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                                  {depthItem.stepTag}
                                </span>
                                <div>
                                  <div className="text-xs font-bold flex items-center gap-1.5">
                                    <span>{depthItem.label}</span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                      {depthItem.lessons}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {depthItem.subtitle} ({depthItem.duration})
                                  </div>
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
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Full Course</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default AiCourseGeneratorModal
