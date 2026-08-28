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
} from 'lucide-react'

const STATS_STORAGE_KEY = 'codetutor_arcade_stats'

const GAME_ICON_MAP: Record<GameId, React.FC<{ className?: string }>> = {
  speedrun: Zap,
  bughunt: Bug,
  predictor: HelpCircle,
  shuffle: Shuffle,
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
              HERO BANNER (COMPACT STANDALONE 3D CODE ARCADE)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
              <div className="space-y-3 text-center md:text-left flex-1 max-w-xl">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30 shadow-xs">
                    <Gamepad2 className="w-3.5 h-3.5 text-brand-400" />
                    3D Code Arcade
                  </span>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs">
                    {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                    100% Offline Capable
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                  Gamified Coding Arcade
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Interactive mini-game coding drills structured under each language course track. Level up your syntax, bug squashing, mental execution, and algorithm logic.
                </p>

                {/* Sound FX Toggle Button */}
                <div className="pt-1 flex items-center justify-center md:justify-start">
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700/80 transition-colors shadow-3xs cursor-pointer"
                  >
                    {soundEnabled ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Audio FX: ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                        <span>Audio FX: OFF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Compact 3D Scene */}
              <div className="w-full md:w-64 lg:w-72 h-40 sm:h-44 md:h-48 relative rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
                <Arcade3DHero />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              METRICS & STATS BAR
              ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-[11px] uppercase font-mono">Arcade Points</span>
              </div>
              <p className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {stats.totalScore.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Gamepad2 className="w-4 h-4 text-brand-500" />
                <span className="font-semibold text-[11px] uppercase font-mono">Drills Played</span>
              </div>
              <p className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {stats.gamesPlayed}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Flame className="w-4 h-4 text-rose-500" />
                <span className="font-semibold text-[11px] uppercase font-mono">Best Speedrun</span>
              </div>
              <p className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {stats.highScores.speedrun || 0} pts
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Bug className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-[11px] uppercase font-mono">Bugs Squashed</span>
              </div>
              <p className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {stats.highScores.bughunt || 0} pts
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ARCADE GAME MODES SHOWCASE (WITH IMAGES)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Arcade Game Modes
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                4 Interactive Modes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {GAMES_METADATA.map((game) => {
                const IconComponent = GAME_ICON_MAP[game.id] || Zap
                const highScore = stats.highScores[game.id] || 0

                return (
                  <div
                    key={game.id}
                    className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                  >
                    {/* Game Artwork Image Thumbnail */}
                    <div className="relative h-32 w-full overflow-hidden bg-slate-950">
                      {game.image ? (
                        <img
                          src={game.image}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                          <IconComponent className="w-10 h-10 text-slate-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      {/* Difficulty & Time Badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                          {game.difficulty}
                        </span>
                      </div>

                      {/* Floating Game Icon & Title Over Artwork */}
                      <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${game.color.bg} text-white shrink-0 shadow-xs`}>
                          <IconComponent className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-extrabold text-white truncate leading-tight">
                            {game.title}
                          </h3>
                          <p className="text-[10px] text-slate-300 font-mono truncate">
                            {game.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>

                      <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>~{game.estimatedMins} min</span>
                          {highScore > 0 && (
                            <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              • {highScore} pts
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleLaunchGameDirect(game.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Play</span>
                          <ArrowRight className="w-3 h-3" />
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
          <div className="space-y-0">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 shadow-3xs">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Course Tracks & Game Modules
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click any language to expand or collapse its structured game modules below.
                  </p>
                </div>
              </div>
            </div>

            {/* Language Track Cards — each one is toggleable */}
            <div className="space-y-3">
              {LANGUAGE_TRACKS.filter((t) => t.id !== 'all').map((track) => {
                const isSelected = selectedLanguage === track.id
                const trackModules = gameStoreService.getModulesForLanguage(track.id)

                return (
                  <div key={track.id} className="transition-all duration-200">
                    {/* Clickable Language Card Header (Toggles Open/Close) */}
                    <button
                      type="button"
                      onClick={() => handleToggleTrack(track.id)}
                      className={`w-full p-4 sm:p-5 border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-50/80 via-white to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md rounded-t-2xl rounded-b-none'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs rounded-2xl'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* Left: Badge + Title + Description */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`p-2.5 rounded-xl ${track.bgLight} border shrink-0 shadow-3xs ${
                            isSelected ? 'border-emerald-300 dark:border-emerald-700' : 'border-transparent'
                          }`}>
                            <span className="text-xs font-mono font-black">{track.badge}</span>
                          </div>

                          <div className="min-w-0">
                            <h3 className={`text-sm sm:text-base font-extrabold tracking-tight truncate transition-colors ${
                              isSelected
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-slate-900 dark:text-white'
                            }`}>
                              {track.title}
                            </h3>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {track.subtitle} — {track.description}
                            </p>
                          </div>
                        </div>

                        {/* Right: Module Count + Expand Indicator */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                            <Gamepad2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="font-bold">{trackModules.length}</span>
                            <span>Modules</span>
                          </div>
                          <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 transition-transform duration-200 ${isSelected ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Active indicator bar */}
                      {isSelected && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                      )}
                    </button>

                    {/* Expanded Modules Panel — appears directly under the language card */}
                    {isSelected && (
                      <div className="border border-t-0 border-emerald-500/40 dark:border-emerald-500/30 rounded-b-2xl bg-slate-50/80 dark:bg-slate-950/60 p-4 sm:p-5 shadow-inner animate-in fade-in duration-200">
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

