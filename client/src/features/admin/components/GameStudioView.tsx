import React, { useState, useEffect } from 'react'
import { gameStoreService } from '@/services/games/game-store.service'
import type { GameLanguage, GameId } from '@/features/games/types/games.types'
import type { GameModuleItem, GameDrillItem } from '@/features/games/data/gameModulesData'
import { LANGUAGE_TRACKS } from '@/features/games/data/gameModulesData'
import { GameChallengeEditorModal, type EditableChallengeType } from './GameChallengeEditorModal'
import { GameModuleEditorModal } from './GameModuleEditorModal'
import { Button } from '@/components/ui'
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
  Edit,
  Pencil,
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

const DRILL_COLOR_MAP: Record<GameId, { bg: string; text: string; border: string }> = {
  speedrun: {
    bg: 'bg-amber-50 dark:bg-amber-950/70',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/80',
  },
  bughunt: {
    bg: 'bg-rose-50 dark:bg-rose-950/70',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/80',
  },
  predictor: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/70',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800/80',
  },
  shuffle: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/70',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/80',
  },
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

  const counts = gameStoreService.getAllChallengesCount()

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
  const allFlatItems: { type: GameId; item: any }[] = []
  if (selectedTab === 'all' || selectedTab === 'speedrun') {
    speedrun.forEach((s) => allFlatItems.push({ type: 'speedrun', item: s }))
  }
  if (selectedTab === 'all' || selectedTab === 'bughunt') {
    bughunt.forEach((b) => allFlatItems.push({ type: 'bughunt', item: b }))
  }
  if (selectedTab === 'all' || selectedTab === 'predictor') {
    predictor.forEach((p) => allFlatItems.push({ type: 'predictor', item: p }))
  }
  if (selectedTab === 'all' || selectedTab === 'shuffle') {
    shuffle.forEach((c) => allFlatItems.push({ type: 'shuffle', item: c }))
  }

  const filteredFlatItems = allFlatItems.filter(({ item }) => {
    if (selectedLanguage !== 'all' && item.language !== selectedLanguage) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = item.title?.toLowerCase().includes(q)
      const descMatch = (item.description || item.goalDescription || '')?.toLowerCase().includes(q)
      const codeMatch = (item.code || (item.lines || []).join(' ') || '')?.toLowerCase().includes(q)
      if (!titleMatch && !descMatch && !codeMatch) return false
    }
    return true
  })

  const languagesToDisplay =
    selectedLanguage === 'all'
      ? LANGUAGE_TRACKS.filter((t) => t.id !== 'all')
      : LANGUAGE_TRACKS.filter((t) => t.id === selectedLanguage)

  return (
    <div className="space-y-4 w-full min-w-0 max-w-full">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 animate-in slide-in-from-top-3 fade-in">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-emerald-500 shadow-2xl flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 sm:gap-3 text-xs font-mono">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] text-[#005F02] dark:text-emerald-400 font-sans font-bold uppercase">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>Curriculum Mods</span>
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white block">{counts.totalModules}</span>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400 font-sans font-bold uppercase">
            <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
            <span>Total Drills</span>
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white block">{counts.total}</span>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 font-sans font-bold uppercase">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Speedrun</span>
          </div>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400 block">{counts.speedrun}</span>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-300 dark:border-rose-700 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] text-rose-600 dark:text-rose-400 font-sans font-bold uppercase">
            <Bug className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Bug Hunt</span>
          </div>
          <span className="text-xl font-black text-rose-600 dark:text-rose-400 block">{counts.bughunt}</span>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-700 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-sans font-bold uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Predictor</span>
          </div>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 block">{counts.predictor}</span>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-700 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[10px] text-[#005F02] dark:text-emerald-400 font-sans font-bold uppercase">
            <Shuffle className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
            <span>Shuffle</span>
          </div>
          <span className="text-xl font-black text-[#005F02] dark:text-emerald-400 block">{counts.shuffle}</span>
        </div>
      </div>

      {/* Control Bar: View Toggle, Language Tabs, Actions */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* View Mode Switcher */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-3xs">
            <button
              type="button"
              onClick={() => setViewMode('structured')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg transition-all cursor-pointer select-none ${
                viewMode === 'structured'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Modules View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('flat')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg transition-all cursor-pointer select-none ${
                viewMode === 'flat'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">All Challenges</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="h-8.5 text-xs font-semibold px-2.5 sm:px-3 shrink-0 cursor-pointer"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              title="Reset default challenges and modules"
            >
              <span className="hidden sm:inline">Reset Defaults</span>
              <span className="sm:hidden">Reset</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenCreateModule()}
              className="h-8.5 text-xs font-bold border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex-1 sm:flex-none justify-center shrink-0 cursor-pointer"
              leftIcon={<Plus className="w-3.5 h-3.5 text-emerald-500" />}
            >
              Add Module
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenCreateChallenge()}
              className="h-8.5 text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs px-3.5 flex-1 sm:flex-none justify-center shrink-0 whitespace-nowrap cursor-pointer"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Challenge
            </Button>
          </div>
        </div>

        {/* Language Track Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold border-t border-slate-100 dark:border-slate-800/80 pt-3">
          {[
            { id: 'all', label: 'All Languages', badge: 'ALL' },
            { id: 'python', label: 'Python', badge: 'PY' },
            { id: 'javascript', label: 'JavaScript', badge: 'JS' },
            { id: 'java', label: 'Java', badge: 'JV' },
            { id: 'typescript', label: 'TypeScript', badge: 'TS' },
            { id: 'sql', label: 'SQL & DB', badge: 'DB' },
          ].map((lang) => {
            const isActive = selectedLanguage === lang.id
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => setSelectedLanguage(lang.id as GameLanguage)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap shadow-3xs ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-500 font-extrabold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{lang.label}</span>
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
            const modules = (modulesMap[track.id] || []).sort((a, b) => a.moduleNumber - b.moduleNumber)

            return (
              <div
                key={track.id}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-4"
              >
                {/* Track Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${track.bgLight} border border-slate-200 dark:border-slate-800 font-mono font-black text-xs shrink-0 shadow-3xs mt-0.5 sm:mt-0`}>
                      {track.badge}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {track.title}
                        </h2>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {modules.length} Modules
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{track.subtitle}</span> — {track.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 justify-between sm:justify-end">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCollapseAll(track.id)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer shadow-3xs"
                      >
                        Collapse All
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExpandAll(track.id)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer shadow-3xs"
                      >
                        Expand All
                      </button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenCreateModule(track.id)}
                      className="h-8 text-xs font-bold"
                      leftIcon={<Plus className="w-3.5 h-3.5 text-emerald-500" />}
                    >
                      Add Module
                    </Button>
                  </div>
                </div>

                {/* Modules List for this Track */}
                <div className="space-y-3">
                  {modules.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                      No modules configured for {track.title} yet. Click "Add Module" above to create one!
                    </div>
                  ) : (
                    modules.map((mod) => {
                      const isExpanded = expandedModules[mod.id] ?? false // default collapsed for a clean overview

                      return (
                        <div
                          key={mod.id}
                          className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-950/40 shadow-3xs"
                        >
                          {/* Module Header Card */}
                          <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/90">
                            {/* Left: Module Number & Title */}
                            <div
                              onClick={() => toggleModuleAccordion(mod.id)}
                              className="flex items-start sm:items-center gap-2.5 sm:gap-3 flex-1 min-w-0 w-full cursor-pointer select-none"
                            >
                              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#005F02] dark:text-emerald-400 font-mono font-black text-xs flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-3xs mt-0.5 sm:mt-0">
                                #{mod.moduleNumber}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                                    {mod.title}
                                  </h3>
                                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                                    {(mod.drills || []).length} Drills
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                  {mod.description}
                                </p>
                              </div>

                              <div className={`p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </div>

                            {/* Right: Module Actions */}
                            <div className="flex items-center gap-2 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto justify-between sm:justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenCreateChallenge(track.id as any, mod.id)}
                                className="h-7 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
                                leftIcon={<Plus className="w-3 h-3" />}
                              >
                                Add Drill
                              </Button>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEditModule(mod)}
                                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-3xs transition-colors"
                                  title="Edit module details"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteModule(track.id, mod.id, mod.title)}
                                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer shadow-3xs transition-colors"
                                  title="Delete module"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Drills List */}
                          {isExpanded && (
                            <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                              {(mod.drills || []).length === 0 ? (
                                <div className="text-center py-4 text-[11px] text-slate-400">
                                  No mini-game drills inside this module yet.{' '}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenCreateChallenge(track.id as any, mod.id)}
                                    className="text-emerald-600 dark:text-emerald-400 font-bold underline cursor-pointer"
                                  >
                                    Add the first drill
                                  </button>
                                </div>
                              ) : (
                                (mod.drills || []).map((drill, dIdx) => {
                                  const IconComponent = DRILL_ICON_MAP[drill.gameId] || Zap
                                  const color = DRILL_COLOR_MAP[drill.gameId] || DRILL_COLOR_MAP.speedrun

                                  return (
                                    <div
                                      key={dIdx}
                                      className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-3xs"
                                    >
                                      {/* Left: Drill mode icon & Title */}
                                      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                                        <div className={`p-1.5 rounded-lg ${color.bg} ${color.text} border ${color.border} shrink-0 mt-0.5 sm:mt-0`}>
                                          <IconComponent className="w-3.5 h-3.5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <h4 className="font-bold text-slate-900 dark:text-white leading-snug">
                                            {drill.title}
                                          </h4>
                                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5 flex-wrap">
                                            <span className="font-bold uppercase text-slate-600 dark:text-slate-300">{drill.gameId}</span>
                                            <span>•</span>
                                            <span>{drill.difficulty}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5">
                                              <Clock className="w-2.5 h-2.5" />
                                              ~{drill.estimatedMins}m
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Right: Drill actions */}
                                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80 w-full sm:w-auto justify-end">
                                        <button
                                          type="button"
                                          onClick={() => handleEditDrill(track.id, mod, drill)}
                                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition-colors shadow-3xs"
                                          title="Edit drill challenge content"
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDrillFromModule(track.id, mod.id, dIdx, drill.title)}
                                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer transition-colors shadow-3xs"
                                          title="Remove drill"
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
        <div className="space-y-3">
          {/* Filter Bar */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges by title, code, explanations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Game Mode Pill Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
              {[
                { id: 'all', label: `All (${counts.total})`, icon: Gamepad2 },
                { id: 'speedrun', label: `Speedrun (${counts.speedrun})`, icon: Zap },
                { id: 'bughunt', label: `Bug Hunt (${counts.bughunt})`, icon: Bug },
                { id: 'predictor', label: `Predictor (${counts.predictor})`, icon: HelpCircle },
                { id: 'shuffle', label: `Shuffle (${counts.shuffle})`, icon: Shuffle },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = selectedTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                      isActive
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent font-bold'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredFlatItems.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                No game challenges match your search and filter criteria.
              </div>
            ) : (
              filteredFlatItems.map(({ type, item }, idx) => {
                const isSpeedrun = type === 'speedrun'
                const isBughunt = type === 'bughunt'
                const isPredictor = type === 'predictor'

                const badgeColor = isSpeedrun
                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                  : isBughunt
                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                  : isPredictor
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'

                const iconMap = {
                  speedrun: Zap,
                  bughunt: Bug,
                  predictor: HelpCircle,
                  shuffle: Shuffle,
                }
                const Icon = iconMap[type]

                return (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-3xs hover:border-emerald-500/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${badgeColor}`}>
                          <Icon className="w-3 h-3" />
                          <span>{type}</span>
                        </span>

                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {item.language}
                        </span>

                        {item.lessonTitle && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                            • {item.lessonTitle}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h3>

                      <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">
                        {item.description || item.goalDescription || item.explanation || 'No description'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      {item.timeLimitSecs && (
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.timeLimitSecs}s</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditChallenge(type, item)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition-colors"
                          title="Edit challenge"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteChallenge(type, item.id, item.title)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
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
