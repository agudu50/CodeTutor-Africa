import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { aiCourseGeneratorService } from '@/services/learning/ai-course-generator.service'
import { ProgrammingLanguage, DifficultyLevel } from '@/types/common'
import {
  Sparkles,
  X,
  ArrowRight,
  Bot,
} from 'lucide-react'

interface AiCourseGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
}

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

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [progressStep, setProgressStep] = useState(0)

  const promptSuggestions = [
    { label: 'Rust Memory & Concurrency', prompt: 'Rust Systems Programming, Memory Safety, and Concurrent Thread Pools', lang: 'rust' as ProgrammingLanguage },
    { label: 'Golang Distributed Backend', prompt: 'Golang Microservices, Goroutines, Channels, and Distributed Key-Value Store', lang: 'go' as ProgrammingLanguage },
    { label: 'C++ Systems & STL Algorithms', prompt: 'Modern C++20 Memory Management, Smart Pointers, and STL Algorithm Optimization', lang: 'cpp' as ProgrammingLanguage },
    { label: 'Full-Stack JavaScript & Async', prompt: 'Modern JavaScript Event Loop, Async Microtasks, Web Streams, and Local SQLite', lang: 'javascript' as ProgrammingLanguage },
    { label: 'TypeScript Enterprise Architecture', prompt: 'Advanced TypeScript Generics, Utility Types, Decorators, and Clean Architecture', lang: 'typescript' as ProgrammingLanguage },
    { label: 'Java Enterprise OOP & JVM', prompt: 'Java OOP Patterns, JVM Bytecode Optimization, and Clean Enterprise Architecture', lang: 'java' as ProgrammingLanguage },
    { label: 'Python Full-Stack & Machine Learning', prompt: 'Python Algorithmic Problem Solving, Decorators, Generators, and NumPy Foundations', lang: 'python' as ProgrammingLanguage },
    { label: 'SQL Indexing & Query Optimization', prompt: 'High-Performance SQL Queries, B-Tree Indexes, Query Execution Plans, and Schema Normalization', lang: 'sql' as ProgrammingLanguage },
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!isGenerating ? onClose : undefined}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5 my-8"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#005F02]/10 border border-[#005F02]/30 flex items-center justify-center text-[#005F02]">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#005F02]/15 text-[#005F02] border border-[#005F02]/30">
                100% OFFLINE LLAMA ARCHITECT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Prompt AI Course Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Describe any programming topic or tech stack. The AI will synthesize lessons, videos, exercises, and arcade games locally.
            </p>
          </div>

          {!isGenerating && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
                0 KB Network • Compiled locally on your CPU
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
                  placeholder="e.g. Master Golang Microservices & Concurrency from Scratch, including Goroutines, Channels, and Local Distributed Systems"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#005F02] focus:ring-2 focus:ring-[#005F02]/20 transition-all resize-none"
                />
              </div>

              {/* Quick Suggestions Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#005F02]" />
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
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#005F02]/10 hover:text-[#005F02] hover:border-[#005F02]/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors font-medium cursor-pointer"
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Language Select */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#005F02]"
                  >
                    <option value="python">Python 3.12</option>
                    <option value="javascript">JavaScript (ES2024)</option>
                    <option value="typescript">TypeScript 5.x</option>
                    <option value="java">Java 21 OOP</option>
                    <option value="cpp">C++ 20 (Systems & STL)</option>
                    <option value="go">Golang (Go Concurrency)</option>
                    <option value="rust">Rust (Memory Safety)</option>
                    <option value="csharp">C# (.NET 8)</option>
                    <option value="php">PHP 8.3 & Modern Web</option>
                    <option value="sql">SQL & Relational Databases</option>
                    <option value="html">HTML5, CSS3 & Responsive Web</option>
                  </select>
                </div>

                {/* Difficulty Select */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#005F02]"
                  >
                    <option value="beginner">Beginner (Foundations & Syntax)</option>
                    <option value="intermediate">Intermediate (Hands-On Architecture)</option>
                    <option value="advanced">Advanced (High-Performance & Systems)</option>
                  </select>
                </div>

                {/* Modules Depth */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Curriculum Depth
                  </label>
                  <select
                    value={moduleCount}
                    onChange={(e) => setModuleCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#005F02]"
                  >
                    <option value={1}>1 Module (~3 Lessons • Crash Course)</option>
                    <option value={2}>2 Modules (~6 Lessons • Focused Sprint)</option>
                    <option value={3}>3 Modules (~9 Lessons • Standard Track)</option>
                    <option value={4}>4 Modules (~12 Lessons • Deep Specialization)</option>
                    <option value={5}>5 Modules (~15 Lessons • Complete Masterclass)</option>
                  </select>
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
