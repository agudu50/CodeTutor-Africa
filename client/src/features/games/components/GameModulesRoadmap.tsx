import React, { useState } from 'react'
import { GameModuleItem } from '../data/gameModulesData'
import { GameId, GameLanguage } from '../types/games.types'
import { gameStoreService } from '@/services/games/game-store.service'
import {
  Zap,
  Bug,
  HelpCircle,
  Shuffle,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react'

interface GameModulesRoadmapProps {
  modules: GameModuleItem[]
  selectedLanguage: GameLanguage
  onLaunchGame: (gameId: GameId, moduleId: string, moduleTitle: string) => void
}

const GAME_ICON_MAP: Record<GameId, React.FC<{ className?: string }>> = {
  speedrun: Zap,
  bughunt: Bug,
  predictor: HelpCircle,
  shuffle: Shuffle,
}

const GAME_NAME_MAP: Record<GameId, string> = {
  speedrun: 'Syntax Speedrun',
  bughunt: 'Bug Hunt Blitz',
  predictor: 'Output Predictor',
  shuffle: 'Code Shuffle',
}

export const GameModulesRoadmap: React.FC<GameModulesRoadmapProps> = ({
  modules,
  selectedLanguage,
  onLaunchGame,
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(modules[0]?.id || null)

  const toggleExpand = (id: string) => {
    setExpandedModuleId((prev) => (prev === id ? null : id))
  }

  const getProgressColor = (percent: number) => {
    if (percent >= 65) {
      return {
        text: 'text-emerald-400',
        ring: 'border-emerald-500 bg-emerald-950/40',
        stroke: '#10B981',
      }
    }
    if (percent >= 40) {
      return {
        text: 'text-amber-400',
        ring: 'border-amber-500 bg-amber-950/40',
        stroke: '#F59E0B',
      }
    }
    if (percent > 0) {
      return {
        text: 'text-sky-400',
        ring: 'border-sky-500 bg-sky-950/40',
        stroke: '#38BDF8',
      }
    }
    return {
      text: 'text-slate-500 dark:text-slate-500',
      ring: 'border-slate-700 bg-slate-900/60',
      stroke: '#475569',
    }
  }

  const langLabel =
    selectedLanguage === 'python'
      ? 'Python Programming'
      : selectedLanguage === 'javascript'
      ? 'JavaScript & Async'
      : selectedLanguage === 'java'
      ? 'Java OOP'
      : selectedLanguage === 'typescript'
      ? 'TypeScript'
      : selectedLanguage === 'sql'
      ? 'SQL Database'
      : 'All Languages'

  return (
    <div className="w-full space-y-4">
      {/* Header matching screenshot */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-500" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Modules in this course
          </h2>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          {langLabel} ({modules.length} Modules)
        </span>
      </div>

      {/* Vertical Connected Module Roadmap Container */}
      <div className="relative pl-3 sm:pl-4 py-2">
        {/* Central Vertical Connector Line running behind all circular badges */}
        <div className="absolute left-[34px] sm:left-[38px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

        {/* Modules Stack */}
        <div className="space-y-3 relative z-10">
          {modules.map((mod, idx) => {
            const isExpanded = expandedModuleId === mod.id
            const progress = gameStoreService.getModuleProgress(mod.id, mod.defaultProgress)
            const color = getProgressColor(progress)

            return (
              <div key={mod.id} className="relative group">
                {/* Module Item Card */}
                <div
                  onClick={() => toggleExpand(mod.id)}
                  className={`flex flex-col rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                    isExpanded
                      ? 'bg-white dark:bg-[#12161A] border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white dark:bg-[#12161A] border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  {/* Top Header Row with Circle Badge & Module Title */}
                  <div className="flex items-center justify-between p-3.5 sm:p-4 gap-3">
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      {/* Circular Progress Badge */}
                      <div className="relative shrink-0 flex items-center justify-center">
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs sm:text-[13px] shadow-sm transition-transform group-hover:scale-105 ${color.ring} ${color.text}`}
                        >
                          {progress}%
                        </div>
                      </div>

                      {/* Title */}
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                          {mod.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    {/* Right expand toggle indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      {progress === 100 ? (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                          {mod.drills.length} Drills
                        </span>
                      )}

                      <button
                        type="button"
                        className="p-1 rounded-lg text-slate-400 group-hover:text-slate-200 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Drills Drawer */}
                  {isExpanded && (
                    <div className="px-3.5 sm:px-5 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          Interactive Coding Drills for this Module:
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Earn +100 to +300 pts
                        </span>
                      </div>

                      {/* Drill Buttons Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {mod.drills.map((drill, dIdx) => {
                          const DrillIcon = GAME_ICON_MAP[drill.gameId] || Zap
                          const gameName = GAME_NAME_MAP[drill.gameId]

                          return (
                            <div
                              key={dIdx}
                              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs hover:border-emerald-500/60 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
                                  <DrillIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                                    {drill.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono block truncate">
                                    {gameName} • {drill.difficulty}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onLaunchGame(drill.gameId, mod.id, mod.title)
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white transition-all cursor-pointer shrink-0 shadow-xs"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Play</span>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
