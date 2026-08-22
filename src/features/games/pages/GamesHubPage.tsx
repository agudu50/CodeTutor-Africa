import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { GAMES_METADATA } from '../data/gameData'
import { GameId, PlayerGameStats } from '../types/games.types'
import { SyntaxSpeedrunGame } from '../components/SyntaxSpeedrunGame'
import { BugHuntGame } from '../components/BugHuntGame'
import { OutputPredictorGame } from '../components/OutputPredictorGame'
import { CodeShuffleGame } from '../components/CodeShuffleGame'
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
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'

const ICON_MAP = {
  Zap,
  Bug,
  HelpCircle,
  Shuffle,
}

const STATS_STORAGE_KEY = 'codetutor_arcade_stats'

export const GamesHubPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null)
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
        />
      ) : activeGame === 'bughunt' ? (
        <BugHuntGame
          onBack={() => setActiveGame(null)}
          onScoreUpdate={(score) => handleScoreUpdate('bughunt', score)}
        />
      ) : activeGame === 'predictor' ? (
        <OutputPredictorGame
          onBack={() => setActiveGame(null)}
          onScoreUpdate={(score) => handleScoreUpdate('predictor', score)}
        />
      ) : activeGame === 'shuffle' ? (
        <CodeShuffleGame
          onBack={() => setActiveGame(null)}
          onScoreUpdate={(score) => handleScoreUpdate('shuffle', score)}
        />
      ) : (
        <>
          {/* ═══════════════════════════════════════════════════════════════
              HERO ARCADE HEADER WITH 3D THREE.JS CANVAS
              ═══════════════════════════════════════════════════════════════ */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            {/* Background 3D Three.js Interactive Mesh & Particles */}
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-70 pointer-events-none">
              <Arcade3DHero />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 sm:p-6">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm ring-2 ring-brand-500/20">
                  <Gamepad2 className="w-6 h-6" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                      Coding Arcade & Mini-Games
                    </h1>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 shrink-0">
                      3D Interactive
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
                    Sharpen your typing speed, spot bugs, and master algorithmic logic with quick 2-minute coding games and 3D visual animations.
                  </p>
                </div>
              </div>

              {/* Sound & Mode Controls */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-2xs backdrop-blur-xs"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                      <span>Sound: ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sound: MUTED</span>
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
                <span className="font-medium text-[11px] uppercase">Arcade Points</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                {stats.totalScore.toLocaleString()}
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Gamepad2 className="w-3.5 h-3.5 text-brand-500" />
                <span className="font-medium text-[11px] uppercase">Games Played</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                {stats.gamesPlayed}
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span className="font-medium text-[11px] uppercase">Best Speedrun</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                {stats.highScores.speedrun || 0} pts
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-medium text-[11px] uppercase">Bug Squashed</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                {stats.highScores.bughunt || 0} pts
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              GAMES GRID
              ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {GAMES_METADATA.map((game) => {
              const Icon = ICON_MAP[game.iconName as keyof typeof ICON_MAP] || Gamepad2
              const highScore = stats.highScores[game.id] || 0

              return (
                <div
                  key={game.id}
                  onClick={() => handleSelectGame(game.id)}
                  className="group relative flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/70 hover:shadow-lg transition-all cursor-pointer space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`p-2.5 rounded-2xl ${game.color.bg} ${game.color.text} border ${game.color.border}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {game.difficulty}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>~{game.estimatedMins}m</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {game.subtitle}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1 text-slate-500 font-mono">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Best: <strong className="text-slate-900 dark:text-white font-bold">{highScore} pts</strong></span>
                    </div>

                    <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Play Now →
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </PageContainer>
  )
}

export default GamesHubPage
