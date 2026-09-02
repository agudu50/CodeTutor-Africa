import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { gameStoreService } from '@/services/games/game-store.service'
import type { GameLanguage, GameId } from '@/features/games/types/games.types'
import type { GameModuleItem, GameDrillItem } from '@/features/games/data/gameModulesData'
import { LANGUAGE_TRACKS } from '@/features/games/data/gameModulesData'
import { GameChallengeEditorModal, type EditableChallengeType } from './GameChallengeEditorModal'
import { GameModuleEditorModal } from './GameModuleEditorModal'
import {
  Zap,
  Bug,
  HelpCircle,
  Shuffle,
  Plus,
  RotateCcw,
  Search,
  CheckCircle2,
  Gamepad2,
  Clock,
  Layers,
  ListFilter,
  ChevronDown,
  Trash2,
  Pencil,
  ArrowRight,
  X,
} from 'lucide-react'

interface GameStudioViewProps {
  onUpdated?: () => void
}

const DRILL_ICON_MAP: Record<GameId, React.FC<{ className?: string }>> = {
  speedrun: Zap,
  bughunt: Bug,
  predictor: HelpCircle,
  shuffle: Shuffle,
}

const DRILL_COLOR_MAP: Record<GameId, { bg: string; text: string; border: string; label: string }> = {
  speedrun: {
    bg: 'bg-amber-100 dark:bg-amber-950/80',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-2 border-amber-300 dark:border-amber-800',
    label: 'Speedrun',
  },
  bughunt: {
    bg: 'bg-rose-100 dark:bg-rose-950/80',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-2 border-rose-300 dark:border-rose-800',
    label: 'Bug Hunt',
  },
  predictor: {
    bg: 'bg-indigo-100 dark:bg-indigo-950/80',
    text: 'text-indigo-700 dark:text-indigo-400',
    border: 'border-2 border-indigo-300 dark:border-indigo-800',
    label: 'Predictor',
  },
  shuffle: {
    bg: 'bg-emerald-100 dark:bg-emerald-950/80',
    text: 'text-[#005F02] dark:text-emerald-400',
    border: 'border-2 border-emerald-300 dark:border-emerald-800',
    label: 'Shuffle',
  },
}

const getDifficultyBadge = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800'
    case 'intermediate':
      return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-800'
    case 'advanced':
      return 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-800'
    default:
      return 'bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700'
  }
}

export const GameStudioView: React.FC<GameStudioViewProps> = ({ onUpdated }) => {
  const [viewMode, setViewMode] = useState<'structured' | 'flat'>('structured')
  const [selectedLanguage, setSelectedLanguage] = useState<GameLanguage>('python')
  const [selectedTab, setSelectedTab] = useState<GameId | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Challenge modal state
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<EditableChallengeType | null>(null)
  const [prefilledModuleId, setPrefilledModuleId] = useState<string | undefined>(undefined)
  const [prefilledLanguage, setPrefilledLanguage] = useState<Exclude<GameLanguage, 'all'>>('python')

  // Module modal state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<GameModuleItem | null>(null)

  // Expanded modules state in structured view
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

  // Data states
  const [modulesMap, setModulesMap] = useState(() => gameStoreService.getAllModules())
  const [speedrun, setSpeedrun] = useState(() => gameStoreService.getSpeedrunSnippets())
  const [bughunt, setBughunt] = useState(() => gameStoreService.getBugHuntChallenges())
  const [predictor, setPredictor] = useState(() => gameStoreService.getOutputPredictorChallenges())
  const [shuffle, setShuffle] = useState(() => gameStoreService.getCodeShuffleChallenges())

  const reloadData = () => {
    setModulesMap(gameStoreService.getAllModules())
    setSpeedrun(gameStoreService.getSpeedrunSnippets())
    setBughunt(gameStoreService.getBugHuntChallenges())
    setPredictor(gameStoreService.getOutputPredictorChallenges())
    setShuffle(gameStoreService.getCodeShuffleChallenges())
    onUpdated?.()
  }

  useEffect(() => {
    const handler = () => reloadData()
    window.addEventListener('games_updated', handler)
    return () => window.removeEventListener('games_updated', handler)
  }, [])

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 3000)
    return () => clearTimeout(t)
  }, [toastMsg])

  const counts = useMemo(() => gameStoreService.getAllChallengesCount(), [modulesMap, speedrun, bughunt, predictor, shuffle])

  // Track drill count breakdown helper
  const getTrackDrillBreakdown = (trackId: string) => {
    const mods = modulesMap[trackId] || []
    let speedrunCount = 0
    let bughuntCount = 0
    let predictorCount = 0
    let shuffleCount = 0
    mods.forEach((m) => {
      ;(m.drills || []).forEach((d) => {
        if (d.gameId === 'speedrun') speedrunCount++
        else if (d.gameId === 'bughunt') bughuntCount++
        else if (d.gameId === 'predictor') predictorCount++
        else if (d.gameId === 'shuffle') shuffleCount++
      })
    })
    return {
      total: speedrunCount + bughuntCount + predictorCount + shuffleCount,
      speedrun: speedrunCount,
      bughunt: bughuntCount,
      predictor: predictorCount,
      shuffle: shuffleCount,
    }
  }

  // ─── ACTIONS ───
  const handleOpenCreateChallenge = (lang?: Exclude<GameLanguage, 'all'>, moduleId?: string) => {
    setEditingChallenge(null)
    setPrefilledLanguage(lang || (selectedLanguage === 'all' ? 'python' : selectedLanguage))
    setPrefilledModuleId(moduleId)
    setIsChallengeModalOpen(true)
  }

  const handleEditChallenge = (type: GameId, item: any) => {
    setEditingChallenge({ type: type as any, data: item })
    setPrefilledLanguage((item.language as Exclude<GameLanguage, 'all'>) || 'python')
    setIsChallengeModalOpen(true)
  }

  const handleDeleteChallenge = (type: GameId, id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete challenge "${title}"?`)) return
    if (type === 'speedrun') gameStoreService.deleteSpeedrunSnippet(id)
    if (type === 'bughunt') gameStoreService.deleteBugHuntChallenge(id)
    if (type === 'predictor') gameStoreService.deleteOutputPredictorChallenge(id)
    if (type === 'shuffle') gameStoreService.deleteCodeShuffleChallenge(id)
    reloadData()
    setToastMsg(`Deleted challenge "${title}".`)
  }

  const handleOpenCreateModule = (lang?: GameLanguage) => {
    setEditingModule(null)
    setSelectedLanguage(lang || selectedLanguage)
    setIsModuleModalOpen(true)
  }

  const handleEditModule = (mod: GameModuleItem) => {
    setEditingModule(mod)
    setIsModuleModalOpen(true)
  }

  const handleDeleteModule = (lang: GameLanguage, moduleId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete Module "${title}"? This cannot be undone.`)) return
    const success = gameStoreService.deleteModule(lang, moduleId)
    if (success) {
      reloadData()
      setToastMsg(`Deleted module "${title}".`)
    }
  }

  const handleEditDrill = (trackId: GameLanguage, mod: GameModuleItem, drill: GameDrillItem) => {
    let foundItem: any = null
    if (drill.gameId === 'speedrun') {
      foundItem = speedrun.find((s) => s.title.toLowerCase() === drill.title.toLowerCase() || s.lessonTitle?.includes(`Module ${mod.moduleNumber}`))
    } else if (drill.gameId === 'bughunt') {
      foundItem = bughunt.find((b) => b.title.toLowerCase() === drill.title.toLowerCase() || b.lessonTitle?.includes(`Module ${mod.moduleNumber}`))
    } else if (drill.gameId === 'predictor') {
      foundItem = predictor.find((p) => p.title.toLowerCase() === drill.title.toLowerCase() || p.lessonTitle?.includes(`Module ${mod.moduleNumber}`))
    } else if (drill.gameId === 'shuffle') {
      foundItem = shuffle.find((c) => c.title.toLowerCase() === drill.title.toLowerCase() || c.lessonTitle?.includes(`Module ${mod.moduleNumber}`))
    }

    if (foundItem) {
      handleEditChallenge(drill.gameId, foundItem)
    } else {
      setEditingChallenge({
        type: drill.gameId,
        data: {
          title: drill.title,
          language: (trackId === 'all' ? 'python' : trackId) as any,
          lessonTitle: `Module ${mod.moduleNumber}: ${mod.title}`,
          timeLimitSecs: (drill.estimatedMins || 2) * 60,
        } as any,
      })
      setPrefilledLanguage((trackId === 'all' ? 'python' : trackId) as Exclude<GameLanguage, 'all'>)
      setPrefilledModuleId(mod.id)
      setIsChallengeModalOpen(true)
    }
  }

  const handleDeleteDrillFromModule = (lang: GameLanguage, moduleId: string, drillIndex: number, drillTitle: string) => {
    if (!window.confirm(`Remove drill "${drillTitle}" from this module?`)) return
    gameStoreService.removeDrillFromModule(lang, moduleId, drillIndex)
    reloadData()
    setToastMsg(`Removed drill "${drillTitle}".`)
  }

  const handleResetDefaults = () => {
    if (window.confirm('Reset all curriculum game modules, drills, and challenges to default platform curriculum?')) {
      gameStoreService.resetToDefaults()
      reloadData()
      setToastMsg('Reset games and curriculum modules to defaults.')
    }
  }

  const handleExpandAll = (trackId?: string) => {
    setExpandedModules((prev) => {
      const next = { ...prev }
      const targetTracks = trackId ? [trackId] : Object.keys(modulesMap)
      targetTracks.forEach((t) => {
        ;(modulesMap[t] || []).forEach((m) => {
          next[m.id] = true
        })
      })
      return next
    })
  }

  const handleCollapseAll = (trackId?: string) => {
    setExpandedModules((prev) => {
      const next = { ...prev }
      const targetTracks = trackId ? [trackId] : Object.keys(modulesMap)
      targetTracks.forEach((t) => {
        ;(modulesMap[t] || []).forEach((m) => {
          next[m.id] = false
        })
      })
      return next
    })
  }

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }))
  }

  // Combine flat items for rendering
  const allFlatItems: { type: GameId; item: any }[] = useMemo(() => {
    const items: { type: GameId; item: any }[] = []
    if (selectedTab === 'all' || selectedTab === 'speedrun') {
      speedrun.forEach((s) => items.push({ type: 'speedrun', item: s }))
    }
    if (selectedTab === 'all' || selectedTab === 'bughunt') {
      bughunt.forEach((b) => items.push({ type: 'bughunt', item: b }))
    }
    if (selectedTab === 'all' || selectedTab === 'predictor') {
      predictor.forEach((p) => items.push({ type: 'predictor', item: p }))
    }
    if (selectedTab === 'all' || selectedTab === 'shuffle') {
      shuffle.forEach((c) => items.push({ type: 'shuffle', item: c }))
    }
    return items
  }, [selectedTab, speedrun, bughunt, predictor, shuffle])

  const filteredFlatItems = useMemo(() => {
    return allFlatItems.filter(({ item }) => {
      if (selectedLanguage !== 'all' && item.language !== selectedLanguage) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = item.title?.toLowerCase().includes(q)
        const descMatch = (item.description || item.goalDescription || item.explanation || '')?.toLowerCase().includes(q)
        const codeMatch = (item.code || (item.lines || []).join(' ') || '')?.toLowerCase().includes(q)
        const lessonMatch = item.lessonTitle?.toLowerCase().includes(q)
        if (!titleMatch && !descMatch && !codeMatch && !lessonMatch) return false
      }
      return true
    })
  }, [allFlatItems, selectedLanguage, searchQuery])

  const languagesToDisplay = useMemo(() => {
    return selectedLanguage === 'all'
      ? LANGUAGE_TRACKS.filter((t) => t.id !== 'all')
      : LANGUAGE_TRACKS.filter((t) => t.id === selectedLanguage)
  }, [selectedLanguage])

  return (
    <div className="space-y-5 w-full min-w-0 max-w-full">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 animate-in slide-in-from-top-3 fade-in">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 text-white border-2 border-emerald-500 shadow-2xl flex items-center gap-2 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          STUDIO HEADER BANNER (Matching PracticeStudioView standard)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 min-w-0">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs shrink-0 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  Interactive Gamified Curriculum
                </span>
                <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                  4 Arcade Engines
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Curriculum Mini-Games & Drills Studio
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5 max-w-2xl leading-relaxed">
                Design, sequence, and fine-tune modular speedruns, bug hunts, output predictors, and code shuffles across all official language curricula.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="h-9 px-3.5 rounded-xl text-xs font-mono font-bold justify-center border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-slate-800 dark:text-slate-200 hover:border-[#005F02] transition-all cursor-pointer shadow-3xs active:scale-95 inline-flex items-center gap-1.5 flex-1 sm:flex-initial"
            title="Reset platform curriculum modules and drills to system defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateModule()}
            className="h-9 px-3.5 rounded-xl text-xs font-mono font-bold border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all cursor-pointer shadow-3xs active:scale-95 inline-flex items-center gap-1.5 flex-1 sm:flex-initial justify-center"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Add Module</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateChallenge()}
            className="h-9 px-4 rounded-xl text-xs font-mono font-black bg-[#005F02] hover:bg-emerald-700 border-2 border-[#005F02] text-white shadow-xs justify-center transition-all cursor-pointer active:scale-95 inline-flex items-center gap-1.5 flex-1 sm:flex-initial"
          >
            <Plus className="w-4 h-4" />
            <span>Add Challenge</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          KPI METRICS GRID (6 High-contrast Cards with 2px borders)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5 font-mono">
        {/* Metric 1: Curriculum Mods */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5 hover:border-[#005F02] dark:hover:border-emerald-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">
              Curriculum Mods
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
            {counts.totalModules}
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            Across 5 tracks
          </span>
        </div>

        {/* Metric 2: Total Drills */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5 hover:border-slate-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block font-mono">
              Total Drills
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-3xs">
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
            {counts.total}
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            4 Interactive modes
          </span>
        </div>

        {/* Metric 3: Speedrun */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5 hover:border-amber-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider block font-mono">
              Speedrun
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 block">
            {counts.speedrun}
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            Typing velocity drills
          </span>
        </div>

        {/* Metric 4: Bug Hunt */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5 hover:border-rose-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-rose-700 dark:text-rose-400 font-bold uppercase tracking-wider block font-mono">
              Bug Hunt
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Bug className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 block">
            {counts.bughunt}
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            Debugging puzzles
          </span>
        </div>

        {/* Metric 5: Predictor */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5 hover:border-indigo-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider block font-mono">
              Predictor
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border-2 border-indigo-300 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-3xs">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 block">
            {counts.predictor}
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            Runtime output analysis
          </span>
        </div>

        {/* Metric 6: Shuffle */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-1.5 hover:border-emerald-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#005F02] dark:text-emerald-400 font-bold uppercase tracking-wider block font-mono">
              Shuffle
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Shuffle className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#005F02] dark:text-emerald-400 block">
            {counts.shuffle}
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            Block rearrangement
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CONTROL BAR: VIEW TOGGLE, SEARCH & LANGUAGE TABS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* View Mode Switcher */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-xs font-mono font-black shadow-3xs w-fit">
            <button
              type="button"
              onClick={() => setViewMode('structured')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer select-none active:scale-95 border-2 ${
                viewMode === 'structured'
                  ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Modules View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('flat')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer select-none active:scale-95 border-2 ${
                viewMode === 'flat'
                  ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 shrink-0" />
              <span>All Challenges</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/20 text-white font-bold ml-0.5">
                {counts.total}
              </span>
            </button>
          </div>

          {/* Global Search Bar */}
          <div className="relative flex-1 max-w-md min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges, drills, lessons or code..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-xs font-mono font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#005F02] shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Language Track Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono border-t-2 border-slate-200 dark:border-slate-800 pt-3">
          {[
            { id: 'all', label: 'All Languages', badge: 'ALL', count: counts.totalModules },
            { id: 'python', label: 'Python', badge: 'PY', count: (modulesMap['python'] || []).length },
            { id: 'javascript', label: 'JavaScript', badge: 'JS', count: (modulesMap['javascript'] || []).length },
            { id: 'java', label: 'Java', badge: 'JV', count: (modulesMap['java'] || []).length },
            { id: 'typescript', label: 'TypeScript', badge: 'TS', count: (modulesMap['typescript'] || []).length },
            { id: 'sql', label: 'SQL & DB', badge: 'DB', count: (modulesMap['sql'] || []).length },
          ].map((lang) => {
            const isActive = selectedLanguage === lang.id
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => setSelectedLanguage(lang.id as GameLanguage)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer whitespace-nowrap shadow-3xs active:scale-95 font-bold ${
                  isActive
                    ? 'bg-[#005F02] text-white border-[#005F02] font-black'
                    : 'bg-white dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                <span className={`px-1.5 py-0.2 rounded font-black text-[9px] ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-[#0E1318] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}>
                  {lang.badge}
                </span>
                <span>{lang.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-white/20 text-white font-black'
                    : 'bg-slate-100 dark:bg-[#0E1318] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}>
                  {lang.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          VIEW 1: STRUCTURED BY CURRICULUM MODULES (TREE / HIERARCHICAL)
          ═══════════════════════════════════════════════════════════════ */}
      {viewMode === 'structured' && (
        <div className="space-y-6">
          {languagesToDisplay.map((track) => {
            const rawModules = (modulesMap[track.id] || []).sort((a, b) => a.moduleNumber - b.moduleNumber)
            
            // Filter modules if search query exists
            const modules = searchQuery.trim()
              ? rawModules.filter((m) => {
                  const q = searchQuery.toLowerCase()
                  const modMatch = m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
                  const drillMatch = (m.drills || []).some((d) => d.title.toLowerCase().includes(q) || d.gameId.toLowerCase().includes(q))
                  return modMatch || drillMatch
                })
              : rawModules

            const trackStats = getTrackDrillBreakdown(track.id)

            return (
              <div
                key={track.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-4"
              >
                {/* Track Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`p-3 rounded-2xl ${track.bgLight} border-2 border-slate-300 dark:border-slate-700 font-mono font-black text-sm shrink-0 shadow-3xs`}>
                      {track.badge}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {track.title}
                        </h2>
                        <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                          {rawModules.length} Modules
                        </span>
                        <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                          {trackStats.total} Total Drills
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">{track.subtitle}</span> — {track.description}
                      </p>

                      {/* Drill Breakdown Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 text-[10px] font-mono font-bold">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                          <Zap className="w-2.5 h-2.5" />
                          {trackStats.speedrun} Speedrun
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                          <Bug className="w-2.5 h-2.5" />
                          {trackStats.bughunt} Bug Hunt
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800">
                          <HelpCircle className="w-2.5 h-2.5" />
                          {trackStats.predictor} Predictor
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          <Shuffle className="w-2.5 h-2.5" />
                          {trackStats.shuffle} Shuffle
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap w-full lg:w-auto pt-2 lg:pt-0 border-t-2 lg:border-t-0 border-slate-100 dark:border-slate-800 justify-between lg:justify-end">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCollapseAll(track.id)}
                        className="px-3 py-1.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#161B22] hover:border-[#005F02] transition-colors cursor-pointer shadow-3xs active:scale-95"
                      >
                        Collapse All
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExpandAll(track.id)}
                        className="px-3 py-1.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#161B22] hover:border-[#005F02] transition-colors cursor-pointer shadow-3xs active:scale-95"
                      >
                        Expand All
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCreateModule(track.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-3xs active:scale-95 inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Add Module</span>
                    </button>
                  </div>
                </div>

                {/* Modules List for this Track */}
                <div className="space-y-3">
                  {modules.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-xs text-slate-500 font-mono space-y-2">
                      <p>
                        {searchQuery.trim()
                          ? `No modules in ${track.title} match "${searchQuery}".`
                          : `No modules configured for ${track.title} yet.`}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenCreateModule(track.id)}
                        className="text-[#005F02] dark:text-emerald-400 font-black underline cursor-pointer"
                      >
                        Click here to create the first module
                      </button>
                    </div>
                  ) : (
                    modules.map((mod) => {
                      const isExpanded = searchQuery.trim() ? true : (expandedModules[mod.id] ?? false)

                      return (
                        <div
                          key={mod.id}
                          className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden bg-white dark:bg-[#161B22] shadow-3xs hover:border-slate-400 dark:hover:border-slate-600 transition-all"
                        >
                          {/* Module Header Card */}
                          <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#161B22]">
                            {/* Left: Module Number & Title */}
                            <div
                              onClick={() => toggleModuleAccordion(mod.id)}
                              className="flex items-start sm:items-center gap-2.5 sm:gap-3 flex-1 min-w-0 w-full cursor-pointer select-none"
                            >
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-mono font-black text-xs flex items-center justify-center shrink-0 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs mt-0.5 sm:mt-0">
                                #{mod.moduleNumber}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                                    {mod.title}
                                  </h3>
                                  <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#0E1318] px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 shrink-0">
                                    {(mod.drills || []).length} Drills
                                  </span>

                                  {/* Mini mode icons included in this module */}
                                  <div className="flex items-center gap-1">
                                    {Array.from(new Set((mod.drills || []).map((d) => d.gameId))).map((gId) => {
                                      const Icon = DRILL_ICON_MAP[gId] || Zap
                                      const col = DRILL_COLOR_MAP[gId] || DRILL_COLOR_MAP.speedrun
                                      return (
                                        <span
                                          key={gId}
                                          className={`p-1 rounded-md ${col.bg} ${col.text} border border-slate-300 dark:border-slate-700`}
                                          title={col.label}
                                        >
                                          <Icon className="w-2.5 h-2.5" />
                                        </span>
                                      )
                                    })}
                                  </div>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                  {mod.description}
                                </p>
                              </div>

                              <div className={`p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </div>

                            {/* Right: Module Actions */}
                            <div className="flex items-center gap-2 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 w-full sm:w-auto justify-between sm:justify-end">
                              <button
                                type="button"
                                onClick={() => handleOpenCreateChallenge(track.id as any, mod.id)}
                                className="h-8 px-3 rounded-xl text-xs font-mono font-bold border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-3xs active:scale-95 inline-flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Drill</span>
                              </button>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleEditModule(mod)}
                                  className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0E1318] hover:border-[#005F02] border-2 border-slate-300 dark:border-slate-700 shadow-3xs active:scale-95 cursor-pointer transition-all"
                                  title="Edit module details"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteModule(track.id, mod.id, mod.title)}
                                  className="p-2 rounded-xl text-rose-600 dark:text-rose-400 bg-white dark:bg-[#0E1318] hover:bg-rose-50 dark:hover:bg-rose-950/60 border-2 border-slate-300 dark:border-slate-700 hover:border-rose-400 shadow-3xs active:scale-95 cursor-pointer transition-all"
                                  title="Delete module"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Drills List */}
                          {isExpanded && (
                            <div className="p-3.5 sm:p-4 border-t-2 border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0E1318]/60 space-y-2">
                              {(mod.drills || []).length === 0 ? (
                                <div className="text-center py-4 text-xs font-mono text-slate-500">
                                  No mini-game drills inside this module yet.{' '}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenCreateChallenge(track.id as any, mod.id)}
                                    className="text-[#005F02] dark:text-emerald-400 font-bold underline cursor-pointer"
                                  >
                                    Add the first drill
                                  </button>
                                </div>
                              ) : (
                                (mod.drills || []).map((drill, dIdx) => {
                                  const IconComponent = DRILL_ICON_MAP[drill.gameId] || Zap
                                  const color = DRILL_COLOR_MAP[drill.gameId] || DRILL_COLOR_MAP.speedrun
                                  const diffBadge = getDifficultyBadge(drill.difficulty)

                                  return (
                                    <div
                                      key={dIdx}
                                      className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-3xs transition-all"
                                    >
                                      {/* Left: Drill mode icon & Title */}
                                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                                        <div className={`p-2 rounded-xl ${color.bg} ${color.text} ${color.border} shrink-0 shadow-3xs mt-0.5 sm:mt-0`}>
                                          <IconComponent className="w-4 h-4" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <h4 className="font-extrabold text-slate-900 dark:text-white leading-snug">
                                            {drill.title}
                                          </h4>
                                          <div className="flex items-center gap-2 text-[10px] font-mono mt-1 flex-wrap">
                                            <span className="font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                                              {drill.gameId}
                                            </span>
                                            <span className={`font-bold px-2 py-0.5 rounded-md ${diffBadge}`}>
                                              {drill.difficulty}
                                            </span>
                                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-bold">
                                              <Clock className="w-3 h-3 text-slate-400" />
                                              ~{drill.estimatedMins} min
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Right: Drill actions */}
                                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto justify-end">
                                        {/* Play / Test Live Link */}
                                        <Link
                                          to={`/games?game=${drill.gameId}&lang=${track.id}&drill=${encodeURIComponent(drill.title)}&module=${mod.id}`}
                                          target="_blank"
                                          title="Play & Test Drill in Games Hub"
                                          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0E1318] hover:border-[#005F02] border-2 border-slate-300 dark:border-slate-700 shadow-3xs active:scale-95 transition-all inline-flex items-center gap-1 text-xs font-mono font-bold"
                                        >
                                          <ArrowRight className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                                          <span className="hidden md:inline">Play</span>
                                        </Link>

                                        <button
                                          type="button"
                                          onClick={() => handleEditDrill(track.id, mod, drill)}
                                          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0E1318] hover:border-[#005F02] border-2 border-slate-300 dark:border-slate-700 shadow-3xs active:scale-95 cursor-pointer transition-all"
                                          title="Edit drill challenge content"
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDrillFromModule(track.id, mod.id, dIdx, drill.title)}
                                          className="p-2 rounded-xl text-rose-600 dark:text-rose-400 bg-white dark:bg-[#0E1318] hover:bg-rose-50 dark:hover:bg-rose-950/60 border-2 border-slate-300 dark:border-slate-700 hover:border-rose-400 shadow-3xs active:scale-95 cursor-pointer transition-all"
                                          title="Remove drill from module"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  )
                                })
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          VIEW 2: FLAT LIST OF ALL GAME CHALLENGES & SNIPPETS
          ═══════════════════════════════════════════════════════════════ */}
      {viewMode === 'flat' && (
        <div className="space-y-4">
          {/* Game Mode Pill Tabs Bar */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-mono font-bold">
            {[
              { id: 'all', label: `All Modes`, count: counts.total, icon: Gamepad2 },
              { id: 'speedrun', label: `Speedrun`, count: counts.speedrun, icon: Zap },
              { id: 'bughunt', label: `Bug Hunt`, count: counts.bughunt, icon: Bug },
              { id: 'predictor', label: `Predictor`, count: counts.predictor, icon: HelpCircle },
              { id: 'shuffle', label: `Shuffle`, count: counts.shuffle, icon: Shuffle },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = selectedTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-[#005F02] text-white border-[#005F02] font-black shadow-xs'
                      : 'bg-white dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white font-black' : 'bg-slate-100 dark:bg-[#0E1318] text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredFlatItems.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 text-xs text-slate-500 font-mono">
                No game challenges match your search and filter criteria.
              </div>
            ) : (
              filteredFlatItems.map(({ type, item }, idx) => {
                const color = DRILL_COLOR_MAP[type] || DRILL_COLOR_MAP.speedrun
                const Icon = DRILL_ICON_MAP[type] || Zap

                return (
                  <div
                    key={item.id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-3xs hover:border-[#005F02] dark:hover:border-emerald-500 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-lg ${color.bg} ${color.text} ${color.border}`}>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{type}</span>
                        </span>

                        <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                          {item.language}
                        </span>

                        {item.lessonTitle && (
                          <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                            {item.lessonTitle}
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {item.description || item.goalDescription || item.explanation || 'No description provided'}
                      </p>

                      {/* Code Snippet preview line if available */}
                      {(item.code || item.lines) && (
                        <div className="mt-1.5 p-2 rounded-lg bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
                          <span className="text-slate-400 mr-2">$</span>
                          {typeof item.code === 'string'
                            ? item.code.replace(/\n/g, ' ').slice(0, 100)
                            : (item.lines || []).join(' ').slice(0, 100)}
                          ...
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      {item.timeLimitSecs && (
                        <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.timeLimitSecs}s</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        {/* Play Live */}
                        <Link
                          to={`/games?game=${type}&lang=${item.language}&drill=${encodeURIComponent(item.title)}`}
                          target="_blank"
                          title="Play challenge in Games Hub"
                          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-[#161B22] hover:border-[#005F02] border-2 border-slate-300 dark:border-slate-700 shadow-3xs active:scale-95 transition-all inline-flex items-center gap-1 text-xs font-mono font-bold"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                          <span className="hidden lg:inline">Play</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleEditChallenge(type, item)}
                          className="p-2 rounded-xl text-white bg-[#005F02] hover:bg-emerald-700 border-2 border-[#005F02] shadow-3xs active:scale-95 cursor-pointer transition-all"
                          title="Edit challenge"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteChallenge(type, item.id, item.title)}
                          className="p-2 rounded-xl text-rose-600 dark:text-rose-400 bg-white dark:bg-[#161B22] hover:bg-rose-50 dark:hover:bg-rose-950/60 border-2 border-slate-300 dark:border-slate-700 hover:border-rose-400 shadow-3xs active:scale-95 cursor-pointer transition-all"
                          title="Delete challenge"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Challenge Editor Modal */}
      <GameChallengeEditorModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        initialType={selectedTab === 'all' ? 'speedrun' : selectedTab}
        initialLanguage={prefilledLanguage}
        initialModuleId={prefilledModuleId}
        editingChallenge={editingChallenge}
        onSaved={(msg) => {
          reloadData()
          setToastMsg(msg)
        }}
      />

      {/* Module Editor Modal */}
      <GameModuleEditorModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        initialLanguage={selectedLanguage}
        editingModule={editingModule}
        onSaved={(msg) => {
          reloadData()
          setToastMsg(msg)
        }}
      />
    </div>
  )
}
