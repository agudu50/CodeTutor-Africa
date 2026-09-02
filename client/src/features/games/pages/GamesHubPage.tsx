import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { GameId, PlayerGameStats, GameLanguage } from '../types/games.types'
import { SyntaxSpeedrunGame } from '../components/SyntaxSpeedrunGame'
import { BugHuntGame } from '../components/BugHuntGame'
import { OutputPredictorGame } from '../components/OutputPredictorGame'
import { CodeShuffleGame } from '../components/CodeShuffleGame'
import { GameModulesRoadmap } from '../components/GameModulesRoadmap'
import { LANGUAGE_TRACKS } from '../data/gameModulesData'
import { GAMES_METADATA } from '../data/gameData'
import { Arcade3DHero } from '../components/3d/Arcade3DHero'
import { gameSound } from '../services/gameSound.service'
import { gameStoreService } from '@/services/games/game-store.service'
import {
  Gamepad2,
  Trophy,
  Flame,
  Bug,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Code2,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  HelpCircle,
  Shuffle,
  ChevronDown,
} from 'lucide-react'

const STATS_STORAGE_KEY = 'codetutor_arcade_stats'

const GAME_ICON_MAP: Record<GameId, React.FC<{ className?: string }>> = {
  speedrun: Zap,
  bughunt: Bug,
  predictor: HelpCircle,
  shuffle: Shuffle,
}

const TRACK_BADGE_STYLE: Record<string, string> = {
  python: 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800',
  javascript: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800',
  java: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800',
  typescript: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-800',
  html: 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-400 border-2 border-orange-300 dark:border-orange-800',
  css: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-400 border-2 border-sky-300 dark:border-sky-800',
  git: 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-400 border-2 border-red-300 dark:border-red-800',
  sql: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-800',
}

export const GamesHubPage: React.FC = () => {
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'

  const [activeGame, setActiveGame] = useState<GameId | null>(null)
  const [activeDrillTitle, setActiveDrillTitle] = useState<string | null>(null)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [activeLanguage, setActiveLanguage] = useState<GameLanguage | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<GameLanguage | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(gameSound.isEnabled())
  const [, setTick] = useState(0)

  useEffect(() => {
    const handler = () => setTick((t) => t + 1)
    window.addEventListener('games_updated', handler)
    return () => window.removeEventListener('games_updated', handler)
  }, [])

  const handleToggleTrack = (trackId: GameLanguage) => {
    setSelectedLanguage((prev) => (prev === trackId ? null : trackId))
  }

  const [stats, setStats] = useState<PlayerGameStats>(() => {
    const saved = localStorage.getItem(STATS_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // fallback
      }
    }
    return {
      gamesPlayed: 0,
      totalScore: 0,
      highScores: { speedrun: 0, bughunt: 0, predictor: 0, shuffle: 0 },
      bestStreak: 0,
      currentStreak: 0,
      soundEnabled: true,
    }
  })

  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats))
  }, [stats])

  const handleToggleSound = () => {
    const next = gameSound.toggleSound()
    setSoundEnabled(next)
  }

  const handleScoreUpdate = (gameId: GameId, points: number) => {
    setStats((prev) => {
      const prevHighScore = prev.highScores[gameId] || 0
      const newHighScore = Math.max(prevHighScore, points)
      return {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        totalScore: prev.totalScore + points,
        highScores: {
          ...prev.highScores,
          [gameId]: newHighScore,
        },
      }
    })
  }

  const handleLaunchModuleGame = (
    gameId: GameId,
    moduleId: string,
    _moduleTitle: string,
    drillTitle?: string,
    language?: GameLanguage
  ) => {
    gameSound.playSuccess()
    setActiveDrillTitle(drillTitle || null)
    setActiveModuleId(moduleId || null)
    setActiveLanguage(language || selectedLanguage || 'python')
    setActiveGame(gameId)
  }

  const handleLaunchGameDirect = (gameId: GameId) => {
    gameSound.playSuccess()
    setActiveDrillTitle(null)
    setActiveModuleId(null)
    setActiveLanguage(selectedLanguage || 'all')
    setActiveGame(gameId)
  }

  const handleBackToHub = () => {
    setActiveGame(null)
    setActiveDrillTitle(null)
    setActiveModuleId(null)
    setActiveLanguage(null)
  }

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {activeGame === 'speedrun' ? (
        <SyntaxSpeedrunGame
          onBack={handleBackToHub}
          onScoreUpdate={(score) => handleScoreUpdate('speedrun', score)}
          initialLanguage={activeLanguage || selectedLanguage || 'python'}
          initialChallengeTitle={activeDrillTitle || undefined}
          initialModuleId={activeModuleId || undefined}
        />
      ) : activeGame === 'bughunt' ? (
        <BugHuntGame
          onBack={handleBackToHub}
          onScoreUpdate={(score) => handleScoreUpdate('bughunt', score)}
          initialLanguage={activeLanguage || selectedLanguage || 'python'}
          initialChallengeTitle={activeDrillTitle || undefined}
          initialModuleId={activeModuleId || undefined}
        />
      ) : activeGame === 'predictor' ? (
        <OutputPredictorGame
          onBack={handleBackToHub}
          onScoreUpdate={(score) => handleScoreUpdate('predictor', score)}
          initialLanguage={activeLanguage || selectedLanguage || 'python'}
          initialChallengeTitle={activeDrillTitle || undefined}
          initialModuleId={activeModuleId || undefined}
        />
      ) : activeGame === 'shuffle' ? (
        <CodeShuffleGame
          onBack={handleBackToHub}
          onScoreUpdate={(score) => handleScoreUpdate('shuffle', score)}
          initialLanguage={activeLanguage || selectedLanguage || 'python'}
          initialChallengeTitle={activeDrillTitle || undefined}
          initialModuleId={activeModuleId || undefined}
        />
      ) : (
        <>
          {/* ═══════════════════════════════════════════════════════════════
              HERO BANNER (3D CODE ARCADE)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="p-6 sm:p-7 md:p-8 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3.5 text-center md:text-left flex-1 max-w-xl">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  3D Code Arcade
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                  {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-500" /> : <Wifi className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />}
                  100% Offline Capable
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Gamified Coding Arcade
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Interactive mini-game coding drills structured under each language course track. Level up your syntax, bug squashing, mental execution, and algorithm logic.
              </p>

              {/* Sound FX Toggle Button */}
              <div className="pt-1 flex items-center justify-center md:justify-start">
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-mono font-bold bg-slate-50 dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#1f252e] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-3xs active:scale-95 transition-all cursor-pointer"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                      <span>Audio FX: ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span>Audio FX: OFF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Compact 3D Scene */}
            <div className="w-full md:w-64 lg:w-72 h-44 sm:h-48 relative rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border-2 border-slate-300 dark:border-slate-700 bg-slate-950 shadow-inner">
              <Arcade3DHero />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              METRICS & STATS BAR
              ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-3xs">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Arcade Points
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {stats.totalScore.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 text-[#005F02] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-3xs">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Drills Played
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {stats.gamesPlayed}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-3xs">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Best Speedrun
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {stats.highScores.speedrun || 0} pts
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 text-[#005F02] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-3xs">
                <Bug className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Bugs Squashed
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {stats.highScores.bughunt || 0} pts
                </span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ARCADE GAME MODES SHOWCASE
              ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-3xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Arcade Game Modes
                  </h2>
                </div>
              </div>
              <span className="text-xs font-mono font-black border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 px-3 py-1 rounded-xl shadow-3xs">
                4 Interactive Modes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {GAMES_METADATA.map((game) => {
                const IconComponent = GAME_ICON_MAP[game.id] || Zap
                const highScore = stats.highScores[game.id] || 0

                return (
                  <div
                    key={game.id}
                    className="group relative rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 overflow-hidden shadow-xs hover:border-[#005F02] dark:hover:border-emerald-500 transition-all flex flex-col justify-between"
                  >
                    {/* Game Header with Icon & Difficulty Badge */}
                    <div className="p-4 bg-slate-50 dark:bg-[#161B22] border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 text-[#005F02] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-3xs">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {game.title}
                          </h3>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {game.category}
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black uppercase bg-white dark:bg-[#0E1318] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                        {game.difficulty}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                      <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                        {game.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t-2 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 font-bold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>~{game.estimatedMins} min</span>
                          {highScore > 0 && (
                            <span className="ml-1 text-[#005F02] dark:text-emerald-400 font-black">
                              • {highScore} pts
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleLaunchGameDirect(game.id)}
                          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-black bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] text-white shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          <span>Play</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LANGUAGE TRACKS — CLICK TO EXPAND / COLLAPSE MODULES
              ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Course Tracks & Game Modules
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Click any language to expand or collapse its structured game modules below.
                </p>
              </div>
            </div>

            {/* Language Track Cards */}
            <div className="space-y-3.5">
              {LANGUAGE_TRACKS.filter((t) => t.id !== 'all').map((track) => {
                const isSelected = selectedLanguage === track.id
                const trackModules = gameStoreService.getModulesForLanguage(track.id)
                const badgeClass = TRACK_BADGE_STYLE[track.id] || 'bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700'

                return (
                  <div key={track.id} className="transition-all duration-200">
                    <button
                      type="button"
                      onClick={() => handleToggleTrack(track.id)}
                      className={`w-full p-4 sm:p-5 border-2 text-left transition-all cursor-pointer rounded-3xl shadow-xs active:scale-[0.99] ${
                        isSelected
                          ? 'bg-emerald-50/70 dark:bg-[#0D1E13] border-[#005F02] dark:border-emerald-500'
                          : 'bg-white dark:bg-[#0E1318] border-slate-300 dark:border-slate-700 hover:border-[#005F02] dark:hover:border-emerald-500'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* Left: Badge + Title + Description */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-3xs font-mono font-black text-xs ${badgeClass}`}>
                            <span>{track.badge}</span>
                          </div>

                          <div className="min-w-0">
                            <h3 className={`text-sm sm:text-base font-black truncate transition-colors ${
                              isSelected
                                ? 'text-[#005F02] dark:text-emerald-400'
                                : 'text-slate-900 dark:text-white'
                            }`}>
                              {track.title}
                            </h3>
                            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 truncate mt-0.5 font-medium">
                              {track.subtitle} — {track.description}
                            </p>
                          </div>
                        </div>

                        {/* Right: Module Count + Expand Indicator */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] px-2.5 py-1 rounded-xl shadow-3xs font-bold">
                            <Gamepad2 className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                            <span>{trackModules.length}</span>
                            <span>Modules</span>
                          </div>
                          <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[#005F02] bg-[#005F02] text-white rotate-180'
                              : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#161B22] text-slate-500'
                          }`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Modules Panel */}
                    {isSelected && (
                      <div className="mt-3 border-2 border-[#005F02] dark:border-emerald-500 rounded-3xl bg-slate-50 dark:bg-[#0E1318] p-5 sm:p-6 shadow-xs animate-in fade-in duration-200">
                        <GameModulesRoadmap
                          modules={trackModules}
                          selectedLanguage={track.id}
                          onLaunchGame={handleLaunchModuleGame}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </PageContainer>
  )
}

export default GamesHubPage

