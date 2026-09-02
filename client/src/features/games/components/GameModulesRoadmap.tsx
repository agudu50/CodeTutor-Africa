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
  Play,
  CheckCircle2,
  BookOpen,
  Clock,
  Trophy,
} from 'lucide-react'

interface GameModulesRoadmapProps {
  modules: GameModuleItem[]
  selectedLanguage: GameLanguage
  onLaunchGame: (gameId: GameId, moduleId: string, moduleTitle: string, drillTitle?: string, language?: GameLanguage) => void
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

const GAME_COLOR_MAP: Record<GameId, { bg: string; text: string; border: string }> = {
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

export const GameModulesRoadmap: React.FC<GameModulesRoadmapProps> = ({
  modules,
  selectedLanguage,
  onLaunchGame,
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedModuleId((prev) => (prev === id ? null : id))
  }

  const getProgressColor = (percent: number) => {
    if (percent === 100) {
      return {
        text: 'text-[#005F02] dark:text-emerald-400',
        ring: 'border-2 border-emerald-500 bg-emerald-100 dark:bg-emerald-950/80',
      }
    }
    if (percent >= 40) {
      return {
        text: 'text-amber-900 dark:text-amber-300',
        ring: 'border-2 border-amber-400 bg-amber-100 dark:bg-amber-950/80',
      }
    }
    if (percent > 0) {
      return {
        text: 'text-sky-900 dark:text-sky-300',
        ring: 'border-2 border-sky-400 bg-sky-100 dark:bg-sky-950/80',
      }
    }
    return {
      text: 'text-slate-700 dark:text-slate-300',
      ring: 'border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#161B22]',
    }
  }

  const langLabel =
    selectedLanguage === 'python'
      ? 'Python Programming'
      : selectedLanguage === 'javascript'
      ? 'Modern JavaScript'
      : selectedLanguage === 'java'
      ? 'Java Engineering'
      : selectedLanguage === 'typescript'
      ? 'TypeScript Foundations'
      : selectedLanguage === 'sql'
      ? 'SQL & Databases'
      : 'All Languages'

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#005F02] dark:text-emerald-400" />
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Curriculum Game Modules
          </h2>
        </div>
        <span className="text-xs font-mono font-black px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
          {langLabel} ({modules.length} Modules)
        </span>
      </div>

      {/* Vertical Connected Module Roadmap Container */}
      <div className="relative pl-3 sm:pl-4 py-2">
        {/* Central Vertical Connector Line */}
        <div className="absolute left-[34px] sm:left-[38px] top-6 bottom-6 w-0.5 bg-slate-300 dark:bg-slate-700 -z-0" />

        {/* Modules Stack */}
        <div className="space-y-3.5 relative z-10">
          {modules.map((mod, idx) => {
            const isExpanded = expandedModuleId === mod.id
            const progress = gameStoreService.getModuleProgress(mod.id, mod.defaultProgress)
            const color = getProgressColor(progress)
            const moduleNum = mod.moduleNumber || idx + 1

            return (
              <div key={mod.id} className="relative group">
                {/* Module Item Card */}
                <div
                  onClick={() => toggleExpand(mod.id)}
                  className={`flex flex-col rounded-3xl border-2 transition-all cursor-pointer overflow-hidden shadow-xs ${
                    isExpanded
                      ? 'bg-white dark:bg-[#0E1318] border-[#005F02] dark:border-emerald-500'
                      : 'bg-white dark:bg-[#0E1318] border-slate-300 dark:border-slate-700 hover:border-[#005F02] dark:hover:border-emerald-500'
                  }`}
                >
                  {/* Top Header Row with Circle Badge & Module Title */}
                  <div className="flex items-center justify-between p-4 sm:p-5 gap-3.5">
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      {/* Circular Progress Badge */}
                      <div className="relative shrink-0 flex items-center justify-center">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-xs sm:text-[13px] shadow-3xs transition-transform group-hover:scale-105 ${color.ring} ${color.text}`}
                        >
                          {progress > 0 ? `${progress}%` : `#${moduleNum}`}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-slate-300">
                            Module {moduleNum}
                          </span>
                          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors truncate">
                            {mod.title}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 truncate mt-0.5 font-medium">
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    {/* Right expand toggle indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      {progress === 100 ? (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-black px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] px-2.5 py-1 rounded-xl shadow-3xs hidden sm:inline">
                          {mod.drills.length} Drills
                        </span>
                      )}

                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                        isExpanded
                          ? 'border-[#005F02] bg-[#005F02] text-white rotate-180'
                          : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#161B22] text-slate-500'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Drills Drawer */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] space-y-3.5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                          Interactive Coding Drills for Module {moduleNum}:
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" />
                          +100 to +300 pts
                        </span>
                      </div>

                      {/* Drill Buttons Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {mod.drills.map((drill, dIdx) => {
                          const DrillIcon = GAME_ICON_MAP[drill.gameId] || Zap
                          const gameName = GAME_NAME_MAP[drill.gameId]
                          const colorScheme = GAME_COLOR_MAP[drill.gameId] || GAME_COLOR_MAP.speedrun

                          return (
                            <div
                              key={dIdx}
                              className="p-3.5 rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 hover:border-[#005F02] dark:hover:border-emerald-500 flex items-center justify-between gap-3 shadow-3xs transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`p-2 rounded-xl ${colorScheme.bg} ${colorScheme.text} border-2 ${colorScheme.border} shrink-0`}>
                                  <DrillIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white block truncate">
                                    {drill.title}
                                  </span>
                                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                      {gameName}
                                    </span>
                                    <span>•</span>
                                    <span>{drill.difficulty}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5">
                                      <Clock className="w-2.5 h-2.5" />
                                      {drill.estimatedMins}m
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onLaunchGame(drill.gameId, mod.id, mod.title, drill.title, mod.language || selectedLanguage)
                                }}
                                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-black bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] text-white transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
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
