import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { GAMES_METADATA } from '../data/gameData'
import { GameId, PlayerGameStats, GameLanguage } from '../types/games.types'
import { SyntaxSpeedrunGame } from '../components/SyntaxSpeedrunGame'
import { BugHuntGame } from '../components/BugHuntGame'
import { OutputPredictorGame } from '../components/OutputPredictorGame'
import { CodeShuffleGame } from '../components/CodeShuffleGame'
import { GameLanguageSelector } from '../components/GameLanguageSelector'
import { Arcade3DHero } from '../components/3d/Arcade3DHero'
import { gameSound } from '../services/gameSound.service'
import {
  Gamepad2,
  Zap,
  Bug,
  HelpCircle,
  Shuffle,
  Trophy,
  Flame,
  Clock,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  CheckCircle2,
  Code2,
} from 'lucide-react'

const ICON_MAP = {
  Zap,
  Bug,
  HelpCircle,
  Shuffle,
}

const STATS_STORAGE_KEY = 'codetutor_arcade_stats'

export const GamesHubPage: React.FC = () => {
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'

  const [activeGame, setActiveGame] = useState<GameId | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<GameLanguage>('python')
  const [soundEnabled, setSoundEnabled] = useState(gameSound.isEnabled())

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

  const handleSelectGame = (id: GameId) => {
    gameSound.playSuccess()
    setActiveGame(id)
  }

  return (
    <PageContainer maxWidth="2xl" className="space-y-4 sm:space-y-6">
      {activeGame === 'speedrun' ? (
        <SyntaxSpeedrunGame
          onBack={() => setActiveGame(null)}
          onScoreUpdate={(score) => handleScoreUpdate('speedrun', score)}
          initialLanguage={selectedLanguage}
        />
      ) : activeGame === 'bughunt' ? (
        <BugHuntGame
          onBack={() => setActiveGame(null)}
          onScoreUpdate={(score) => handleScoreUpdate('bughunt', score)}
          initialLanguage={selectedLanguage}
        />
      ) : activeGame === 'predictor' ? (
        <OutputPredictorGame
          onBack={() => setActiveGame(null)}
          onScoreUpdate={(score) => handleScoreUpdate('predictor', score)}
          initialLanguage={selectedLanguage}
        />
      ) : activeGame === 'shuffle' ? (
        <CodeShuffleGame
          onBack={() => setActiveGame(null)}
          onScoreUpdate={(score) => handleScoreUpdate('shuffle', score)}
          initialLanguage={selectedLanguage}
        />
      ) : (
        <>
          {/* ═══════════════════════════════════════════════════════════════
              HERO BANNER (STANDALONE 3D CODE ARCADE)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-5 sm:p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
              <div className="space-y-3 text-center md:text-left max-w-xl">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    <Gamepad2 className="w-3 h-3 text-brand-400" />
                    3D Code Arcade
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {isOffline ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
                    100% Offline
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Gamified Coding Arcade
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Fast-paced interactive mini-games to build syntax speed, spot bugs, and sharpen algorithm logic.
                </p>
              </div>

              {/* 3D Scene / Visual Widget */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 relative rounded-2xl overflow-hidden bg-slate-950/60 border border-slate-800 shadow-inner flex items-center justify-center">
                  <Arcade3DHero />
                </div>

                {/* Sound FX Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
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
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              METRICS & STATS BAR
              ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium text-[11px] uppercase font-mono">Arcade Points</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                {stats.totalScore.toLocaleString()}
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Gamepad2 className="w-3.5 h-3.5 text-brand-500" />
                <span className="font-medium text-[11px] uppercase font-mono">Games Played</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                {stats.gamesPlayed}
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span className="font-medium text-[11px] uppercase font-mono">Best Speedrun</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                {stats.highScores.speedrun || 0} pts
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Bug className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-medium text-[11px] uppercase font-mono">Bugs Squashed</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                {stats.highScores.bughunt || 0} pts
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LANGUAGE FILTER TOOLBAR
              ═══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 shadow-3xs">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Target Programming Language
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select the programming language you want to practice across all mini-games.
                </p>
              </div>
            </div>

            <GameLanguageSelector
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ARCADE 3D CARDS GRID (4 Standalone Arcade Games)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4.5 sm:gap-5 items-stretch">
            {GAMES_METADATA.map((game) => {
              const Icon = ICON_MAP[game.iconName as keyof typeof ICON_MAP] || Gamepad2
              const highScore = stats.highScores[game.id] || 0

              const difficultyBadge =
                game.difficulty === 'Beginner'
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80'
                  : game.difficulty === 'Intermediate'
                  ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80'
                  : 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/80'

              return (
                <div
                  key={game.id}
                  onClick={() => handleSelectGame(game.id)}
                  className="group relative flex flex-col sm:flex-row rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500/70 hover:shadow-lg transition-all cursor-pointer shadow-xs overflow-hidden"
                >
                  {/* Left Illustration Thumbnail */}
                  {game.image && (
                    <div className="relative sm:w-44 md:w-52 h-44 sm:h-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-2.5 left-2.5 sm:hidden">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border backdrop-blur-md ${difficultyBadge}`}>
                          {game.difficulty}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Right Content Area */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3 min-w-0">
                    <div className="space-y-2">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`hidden sm:inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${difficultyBadge}`}>
                            {game.difficulty}
                          </span>
                          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {game.category}
                          </span>
                          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                            {selectedLanguage.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-emerald-500" />
                          <span>~{game.estimatedMins}m</span>
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${game.color.bg} ${game.color.text} border ${game.color.border} shrink-0`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                            {game.title}
                          </h3>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {game.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span>Best: <strong className="text-slate-900 dark:text-white font-bold">{highScore} pts</strong></span>
                      </div>

                      <span className="font-bold text-xs sm:text-sm text-[#005F02] dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Play Now →
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              100% OFFLINE REASSURANCE BANNER (COMPACT STRIP)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                100% Offline-Ready Gaming
              </span>
              <span className="hidden md:inline text-slate-400 dark:text-slate-600">•</span>
              <span className="hidden md:inline text-slate-500 dark:text-slate-400 text-[11px]">
                Audio, scoring, and 3D visualizers run locally with zero internet data cost.
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 self-start sm:self-auto shadow-3xs">
              Zero Data Cost
            </span>
          </div>
        </>
      )}
    </PageContainer>
  )
}

export default GamesHubPage
