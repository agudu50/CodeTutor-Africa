import React, { useState, useEffect } from 'react'
import {
  SpeedrunSnippet,
  BugHuntChallenge,
  OutputPredictorChallenge,
  CodeShuffleChallenge,
  GameLanguage,
  GameId,
  GameAnimationType,
} from '@/features/games/types/games.types'
import { gameStoreService } from '@/services/games/game-store.service'
import { courseStoreService } from '@/services/learning/course-store.service'
import { Button } from '@/components/ui'
import {
  X,
  Zap,
  Bug,
  HelpCircle,
  Shuffle,
  Plus,
  Code2,
  Sparkles,
  ChevronDown,
} from 'lucide-react'

type ChallengeLanguage = Exclude<GameLanguage, 'all'>

const ANIMATION_OPTIONS: {
  id: GameAnimationType
  title: string
  icon: string
  badge: string
  desc: string
}[] = [
  {
    id: 'default',
    title: 'Game Default',
    icon: '🎯',
    badge: 'Recommended',
    desc: 'Uses the primary signature 3D environment for this game mode.',
  },
  {
    id: 'cyber-racer',
    title: 'Cyber Racer 3D',
    icon: '🏎️',
    badge: 'High Speed',
    desc: 'Neon Cyber vehicle racing on digital grid highway with WPM speedometer.',
  },
  {
    id: 'circuit-scanner',
    title: 'Circuit Bug Scanner 3D',
    icon: '🐛',
    badge: 'Motherboard',
    desc: '3D Motherboard circuit board with real-time laser reticle & spark pulses.',
  },
  {
    id: 'memory-flow',
    title: 'Quantum Memory Flow 3D',
    icon: '💾',
    badge: 'CPU Core',
    desc: '3D CPU core with orbiting data packets traveling down execution channels.',
  },
  {
    id: 'algorithm-blocks',
    title: 'Magnetic Logic Blocks 3D',
    icon: '🔀',
    badge: 'Isometric',
    desc: '3D physical algorithm cubes floating with dynamic energy linkage beams.',
  },
  {
    id: 'warp-speed',
    title: 'Warp Speed Starfield 3D',
    icon: '⚡',
    badge: 'Hyperdrive',
    desc: 'Hyperspace particle tunnel accelerating towards light speed.',
  },
  {
    id: 'hologram-bug',
    title: 'Holographic Bug Crystal 3D',
    icon: '🔮',
    badge: 'Radar Hologram',
    desc: 'Pulsing 3D wireframe hologram with rotating targeting rings.',
  },
]

export type EditableChallengeType =
  | { type: 'speedrun'; data: Partial<SpeedrunSnippet> }
  | { type: 'bughunt'; data: Partial<BugHuntChallenge> }
  | { type: 'predictor'; data: Partial<OutputPredictorChallenge> }
  | { type: 'shuffle'; data: Partial<CodeShuffleChallenge> }

interface GameChallengeEditorModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: GameId
  initialLanguage?: ChallengeLanguage
  initialModuleId?: string
  editingChallenge?: EditableChallengeType | null
  onSaved: (msg: string) => void
}

export const GameChallengeEditorModal: React.FC<GameChallengeEditorModalProps> = ({
  isOpen,
  onClose,
  initialType = 'speedrun',
  initialLanguage = 'python',
  initialModuleId,
  editingChallenge,
  onSaved,
}) => {
  const [gameType, setGameType] = useState<GameId>(initialType)
  const [language, setLanguage] = useState<ChallengeLanguage>(initialLanguage)
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModuleId || '')
  const [courseId, setCourseId] = useState<string>('course-py-101')
  const [lessonTitle, setLessonTitle] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [timeLimitSecs, setTimeLimitSecs] = useState<number>(25)
  const [animationType, setAnimationType] = useState<GameAnimationType>('default')

  // Speedrun fields
  const [speedrunCode, setSpeedrunCode] = useState<string>('def example():\n    return True')

  // Bug Hunt fields
  const [bugLinesText, setBugLinesText] = useState<string>('def add_num(a, b):\n    return a - b')
  const [buggyLineIndex, setBuggyLineIndex] = useState<number>(1)
  const [bugExplanation, setBugExplanation] = useState<string>('Subtracted instead of adding.')
  const [bugOptions, setBugOptions] = useState<{ text: string; isCorrect: boolean }[]>([
    { text: 'return a + b', isCorrect: true },
    { text: 'return a * b', isCorrect: false },
    { text: 'return a / b', isCorrect: false },
  ])

  // Predictor fields
  const [predictorCode, setPredictorCode] = useState<string>('a = 5\nb = 10\nprint(a + b)')
  const [predictorOptions, setPredictorOptions] = useState<string[]>(['15', '510', 'None', 'Error'])
  const [predictorCorrectIndex, setPredictorCorrectIndex] = useState<number>(0)
  const [predictorExplanation, setPredictorExplanation] = useState<string>('Integers 5 and 10 sum to 15.')

  // Shuffle fields
  const [shuffleGoal, setShuffleGoal] = useState<string>('Assemble a function that adds two numbers.')
  const [shuffleExpected, setShuffleExpected] = useState<string>('15')
  const [shuffleExplanation, setShuffleExplanation] = useState<string>('Header -> Calculation -> Return.')
  const [shuffleBlocks, setShuffleBlocks] = useState<{ id: string; content: string; indent: number }[]>([
    { id: 'b1', content: 'def add(a, b):', indent: 0 },
    { id: 'b2', content: 'result = a + b', indent: 1 },
    { id: 'b3', content: 'return result', indent: 1 },
  ])

  const courses = courseStoreService.getAllCourses()

  useEffect(() => {
    if (editingChallenge) {
      setGameType(editingChallenge.type)
      const data = editingChallenge.data
      const lang: ChallengeLanguage = (data.language as ChallengeLanguage) || 'python'
      setLanguage(lang)
      setCourseId(data.courseId || 'course-py-101')
      setLessonTitle(data.lessonTitle || '')
      setTitle(data.title || '')
      setDescription((data as any).description || (data as any).goalDescription || '')
      setAnimationType(data.animationType || 'default')

      if (editingChallenge.type === 'speedrun') {
        const d = data as Partial<SpeedrunSnippet>
        setSpeedrunCode(d.code || '')
        setTimeLimitSecs(d.timeLimitSecs || 25)
      } else if (editingChallenge.type === 'bughunt') {
        const d = data as Partial<BugHuntChallenge>
        setBugLinesText(d.lines?.join('\n') || '')
        setBuggyLineIndex(d.buggyLineIndex || 0)
        setBugExplanation(d.bugExplanation || '')
        setBugOptions(d.correctOptions || [
          { text: 'Option 1', isCorrect: true },
          { text: 'Option 2', isCorrect: false },
        ])
        setTimeLimitSecs(d.timeLimitSecs || 20)
      } else if (editingChallenge.type === 'predictor') {
        const d = data as Partial<OutputPredictorChallenge>
        setPredictorCode(d.code || '')
        setPredictorOptions(d.options || ['A', 'B', 'C', 'D'])
        setPredictorCorrectIndex(d.correctIndex || 0)
        setPredictorExplanation(d.explanation || '')
        setTimeLimitSecs(d.timeLimitSecs || 18)
      } else if (editingChallenge.type === 'shuffle') {
        const d = data as Partial<CodeShuffleChallenge>
        setShuffleGoal(d.goalDescription || '')
        setShuffleExpected(d.expectedOutput || '')
        setShuffleExplanation(d.explanation || '')
        setShuffleBlocks(d.scrambledBlocks || [])
      }
    } else {
      setGameType(initialType)
      setTitle('')
      setDescription('')
      setLessonTitle('')
    }
  }, [editingChallenge, initialType, isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please provide a challenge title.')
      return
    }

    const selectedCourse = courses.find((c) => c.id === courseId)

    if (gameType === 'speedrun') {
      if (editingChallenge?.type === 'speedrun' && editingChallenge.data.id) {
        gameStoreService.updateSpeedrunSnippet(editingChallenge.data.id, {
          title,
          description,
          language,
          courseId,
          courseTitle: selectedCourse?.title,
          lessonTitle,
          code: speedrunCode,
          timeLimitSecs,
          animationType,
        })
        onSaved(`Updated Speedrun snippet "${title}"`)
      } else {
        gameStoreService.createSpeedrunSnippet({
          title,
          description,
          language,
          courseId,
          courseTitle: selectedCourse?.title,
          lessonTitle,
          code: speedrunCode,
          timeLimitSecs,
          animationType,
        })
        onSaved(`Created new Speedrun snippet "${title}"`)
      }
    } else if (gameType === 'bughunt') {
      const lines = bugLinesText.split('\n')
      if (editingChallenge?.type === 'bughunt' && editingChallenge.data.id) {
        gameStoreService.updateBugHuntChallenge(editingChallenge.data.id, {
          title,
          description,
          language,
          courseId,
          courseTitle: selectedCourse?.title,
          lessonTitle,
          lines,
          buggyLineIndex: Math.min(lines.length - 1, Math.max(0, buggyLineIndex)),
          bugExplanation,
          correctOptions: bugOptions,
          timeLimitSecs,
          animationType,
        })
        onSaved(`Updated Bug Hunt challenge "${title}"`)
      } else {
        gameStoreService.createBugHuntChallenge({
          title,
          description,
          language,
          courseId,
          courseTitle: selectedCourse?.title,
          lessonTitle,
          lines,
          buggyLineIndex: Math.min(lines.length - 1, Math.max(0, buggyLineIndex)),
          bugExplanation,
          correctOptions: bugOptions,
          timeLimitSecs,
          animationType,
        })
        onSaved(`Created new Bug Hunt challenge "${title}"`)
      }
    } else if (gameType === 'predictor') {
      if (editingChallenge?.type === 'predictor' && editingChallenge.data.id) {
        gameStoreService.updateOutputPredictorChallenge(editingChallenge.data.id, {
          title,
          language,
          courseId,
          courseTitle: selectedCourse?.title,
          lessonTitle,
          code: predictorCode,
          options: predictorOptions,
          correctIndex: predictorCorrectIndex,
          explanation: predictorExplanation,
          timeLimitSecs,
          animationType,
        })
        onSaved(`Updated Output Predictor challenge "${title}"`)
      } else {
        gameStoreService.createOutputPredictorChallenge({
          title,
          language,
          courseId,
          courseTitle: selectedCourse?.title,
          lessonTitle,
          code: predictorCode,
          options: predictorOptions,
          correctIndex: predictorCorrectIndex,
          explanation: predictorExplanation,
          timeLimitSecs,
          animationType,
        })
        onSaved(`Created new Output Predictor challenge "${title}"`)
      }
    } else if (gameType === 'shuffle') {
      const correctOrder = shuffleBlocks.map((b) => b.id)
      if (editingChallenge?.type === 'shuffle' && editingChallenge.data.id) {
        gameStoreService.updateCodeShuffleChallenge(editingChallenge.data.id, {
          title,
          goalDescription: shuffleGoal || description,
          expectedOutput: shuffleExpected,
          explanation: shuffleExplanation,
          language,
          courseId,
          courseTitle: selectedCourse?.title,
          lessonTitle,
          scrambledBlocks: shuffleBlocks,
          correctOrder,
          animationType,
        })
        onSaved(`Updated Code Shuffle challenge "${title}"`)
      } else {
        gameStoreService.createCodeShuffleChallenge({
          title,
          goalDescription: shuffleGoal || description,
          expectedOutput: shuffleExpected,
          explanation: shuffleExplanation,
          language,
          courseId,
          courseTitle: selectedCourse?.title,
          lessonTitle,
          scrambledBlocks: shuffleBlocks,
          correctOrder,
          animationType,
        })
        onSaved(`Created new Code Shuffle challenge "${title}"`)
      }
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#005F02] text-white shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {editingChallenge ? 'Edit Game Challenge' : 'Create New Game Challenge'}
              </h2>
              <p className="text-xs text-slate-500">
                Configure curriculum drills, snippets, bugs, and quizzes across programming tracks.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Game Type Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
              Game Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setGameType('speedrun')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  gameType === 'speedrun'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Speedrun</span>
              </button>

              <button
                type="button"
                onClick={() => setGameType('bughunt')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  gameType === 'bughunt'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500 ring-2 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Bug className="w-4 h-4 text-rose-500" />
                <span>Bug Hunt</span>
              </button>

              <button
                type="button"
                onClick={() => setGameType('predictor')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  gameType === 'predictor'
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <span>Predictor</span>
              </button>

              <button
                type="button"
                onClick={() => setGameType('shuffle')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  gameType === 'shuffle'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Shuffle className="w-4 h-4 text-emerald-500" />
                <span>Code Shuffle</span>
              </button>
            </div>
          </div>

          {/* Language & Course Alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Programming Language</label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => {
                    const nextLang = e.target.value as ChallengeLanguage
                    setLanguage(nextLang)
                    setSelectedModuleId('')
                  }}
                  className="w-full py-2.5 pl-3.5 pr-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="typescript">TypeScript</option>
                  <option value="sql">SQL & Databases</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Target Curriculum Module</label>
              <div className="relative">
                <select
                  value={selectedModuleId}
                  onChange={(e) => {
                    const modId = e.target.value
                    setSelectedModuleId(modId)
                    if (modId) {
                      const mods = gameStoreService.getModulesForLanguage(language)
                      const matched = mods.find((m) => m.id === modId)
                      if (matched) {
                        setLessonTitle(`Module ${matched.moduleNumber}: ${matched.title}`)
                      }
                    }
                  }}
                  className="w-full py-2.5 pl-3.5 pr-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer truncate"
                >
                  <option value="">-- Standalone / Custom --</option>
                  {gameStoreService.getModulesForLanguage(language).map((m) => (
                    <option key={m.id} value={m.id}>
                      Module {m.moduleNumber}: {m.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Time Limit (Seconds)</label>
              <input
                type="number"
                value={timeLimitSecs}
                onChange={(e) => setTimeLimitSecs(Number(e.target.value))}
                min={5}
                max={120}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          {/* Title & Lesson Module Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Challenge Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Slicing Lists or Event Loop Microtasks"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Lesson / Module Topic Display</label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="e.g. Module 1: Variable Scopes"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Concept Explanation / Instructions</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Provide context explaining the computer science concept behind this challenge."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white resize-none"
            />
          </div>

          {/* 3D Game Animation Selection */}
          <div className="space-y-2 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-emerald-50/70 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>3D Interactive Game Animation Environment</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Customizable
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select any live 3D animation environment to display in the background and interactive viewport for learners.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1.5">
              {ANIMATION_OPTIONS.map((opt) => {
                const isSelected = animationType === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAnimationType(opt.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-[#005F02] dark:border-emerald-500 ring-2 ring-[#005F02]/20 dark:ring-emerald-500/20 shadow-sm scale-[1.02]'
                        : 'bg-white/70 dark:bg-slate-900/70 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-lg">{opt.icon}</span>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                        isSelected
                          ? 'bg-[#005F02] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {opt.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                        {opt.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              GAME-SPECIFIC CONFIGURATION
              ═══════════════════════════════════════════════════════════════ */}
          {gameType === 'speedrun' && (
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Code2 className="w-4 h-4 text-amber-500" />
                <span>Target Code Snippet to Type</span>
              </div>
              <textarea
                value={speedrunCode}
                onChange={(e) => setSpeedrunCode(e.target.value)}
                rows={5}
                spellCheck={false}
                className="w-full p-3 rounded-xl bg-[#1E1E1E] border border-[#2D2D2D] font-mono text-xs text-emerald-300 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          )}

          {gameType === 'bughunt' && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  Code Snippet (One line per row)
                </label>
                <textarea
                  value={bugLinesText}
                  onChange={(e) => setBugLinesText(e.target.value)}
                  rows={4}
                  spellCheck={false}
                  className="w-full p-3 rounded-xl bg-[#1E1E1E] border border-[#2D2D2D] font-mono text-xs text-slate-100 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-200">Buggy Line Number (1-indexed)</label>
                  <input
                    type="number"
                    value={buggyLineIndex + 1}
                    onChange={(e) => setBuggyLineIndex(Math.max(0, Number(e.target.value) - 1))}
                    min={1}
                    max={bugLinesText.split('\n').length}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-200">Bug Explanation</label>
                  <input
                    type="text"
                    value={bugExplanation}
                    onChange={(e) => setBugExplanation(e.target.value)}
                    placeholder="Explanation shown when user squashes or misses the bug"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Fix Options */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  Multiple Choice Fix Options (Select the correct one)
                </label>
                {bugOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="bugCorrectOption"
                      checked={opt.isCorrect}
                      onChange={() => {
                        const updated = bugOptions.map((o, i) => ({ ...o, isCorrect: i === idx }))
                        setBugOptions(updated)
                      }}
                      className="cursor-pointer"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const updated = [...bugOptions]
                        updated[idx].text = e.target.value
                        setBugOptions(updated)
                      }}
                      placeholder={`Fix Option ${idx + 1}`}
                      className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {gameType === 'predictor' && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  Code Snippet to Evaluate
                </label>
                <textarea
                  value={predictorCode}
                  onChange={(e) => setPredictorCode(e.target.value)}
                  rows={4}
                  spellCheck={false}
                  className="w-full p-3 rounded-xl bg-[#1E1E1E] border border-[#2D2D2D] font-mono text-xs text-slate-100 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  Output Options (Select the exact output)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {predictorOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <input
                        type="radio"
                        name="predictorCorrect"
                        checked={predictorCorrectIndex === idx}
                        onChange={() => setPredictorCorrectIndex(idx)}
                        className="cursor-pointer"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...predictorOptions]
                          updated[idx] = e.target.value
                          setPredictorOptions(updated)
                        }}
                        className="flex-1 bg-transparent font-mono text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 dark:text-slate-200">Execution Explanation</label>
                <input
                  type="text"
                  value={predictorExplanation}
                  onChange={(e) => setPredictorExplanation(e.target.value)}
                  placeholder="Why does this output occur in the runtime?"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {gameType === 'shuffle' && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-200">Goal Description</label>
                  <input
                    type="text"
                    value={shuffleGoal}
                    onChange={(e) => setShuffleGoal(e.target.value)}
                    placeholder="e.g. Assemble two-pointer palindrome verifier"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 dark:text-slate-200">Expected Output</label>
                  <input
                    type="text"
                    value={shuffleExpected}
                    onChange={(e) => setShuffleExpected(e.target.value)}
                    placeholder="e.g. [0, 1, 1, 2, 3, 5] or True"
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Blocks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    Code Blocks in Correct Sequential Order
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `b${Date.now()}`
                      setShuffleBlocks([...shuffleBlocks, { id: newId, content: '# new block', indent: 0 }])
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005F02] dark:text-emerald-400 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Block
                  </button>
                </div>

                {shuffleBlocks.map((block, bIdx) => (
                  <div key={block.id || bIdx} className="flex items-center gap-2">
                    <span className="w-5 text-slate-400 font-mono">{bIdx + 1}</span>
                    <input
                      type="number"
                      value={block.indent}
                      onChange={(e) => {
                        const updated = [...shuffleBlocks]
                        updated[bIdx].indent = Number(e.target.value)
                        setShuffleBlocks(updated)
                      }}
                      min={0}
                      max={4}
                      className="w-12 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-center"
                      title="Indentation Level (0, 1, 2, 3, 4)"
                    />
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => {
                        const updated = [...shuffleBlocks]
                        updated[bIdx].content = e.target.value
                        setShuffleBlocks(updated)
                      }}
                      placeholder={`Block ${bIdx + 1} content`}
                      className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShuffleBlocks(shuffleBlocks.filter((_, i) => i !== bIdx))}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                      title="Remove block"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="font-semibold">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs px-5"
          >
            {editingChallenge ? 'Save Changes' : 'Publish Challenge'}
          </Button>
        </div>
      </div>
    </div>
  )
}
