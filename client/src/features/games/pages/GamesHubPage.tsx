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
import { CourseGameSelector } from '../components/CourseGameSelector'
import { courseGameAdapter, EnrolledCourseOption } from '../services/courseGameAdapter.service'
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
  HardDrive,
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
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<GameLanguage>('all')
  const [courses, setCourses] = useState<EnrolledCourseOption[]>(() => courseGameAdapter.getUserCourses())
  const [soundEnabled, setSoundEnabled] = useState(gameSound.isEnabled())

  useEffect(() => {
    const handleCoursesUpdated = () => {
      setCourses(courseGameAdapter.getUserCourses())
    }
    window.addEventListener('courses_updated', handleCoursesUpdated)
    return () => window.removeEventListener('courses_updated', handleCoursesUpdated)
  }, [])
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
          initialCourseId={selectedCourseId}
        />
      ) : activeGame === 'bughunt' ? (
        <BugHuntGame
          onBack={() => setActiveGame(null)}
          onScoreUpdate={(score) => handleScoreUpdate('bughunt', score)}
          initialLanguage={selectedLanguage}
          initialCourseId={selectedCourseId}
        />
      ) : activeGame === 'predictor' ? (
        <OutputPredictorGame
          onBack={() => setActiveGame(null)}
          onScoreUpdate={(score) => handleScoreUpdate('predictor', score)}
          initialLanguage={selectedLanguage}
          initialCourseId={selectedCourseId}
        />
      ) : activeGame === 'shuffle' ? (
        <CodeShuffleGame
          onBack={() => setActiveGame(null)}
          onScoreUpdate={(score) => handleScoreUpdate('shuffle', score)}
          initialLanguage={selectedLanguage}
          initialCourseId={selectedCourseId}
        />
      ) : (
        <>
          {/* ═══════════════════════════════════════════════════════════════
              HERO ARCADE HEADER — IMMERSIVE 3D GAME WORLD BANNER
              ═══════════════════════════════════════════════════════════════ */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 dark:border-slate-700 shadow-2xl min-h-[260px] sm:min-h-[300px]"
            style={{ background: 'linear-gradient(135deg,#000510 0%,#0a0f2e 60%,#12002a 100%)' }}
          >
            {/* Full-bleed 3D Three.js canvas as background */}
            <div className="absolute inset-0 pointer-events-none">
              <Arcade3DHero />
            </div>

            {/* Dark vignette gradient overlay so text stays readable */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to right, rgba(0,5,16,0.82) 0%, rgba(0,5,16,0.3) 55%, rgba(0,5,16,0) 100%)' }}
            />

            {/* Content overlay */}
            <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-7 min-h-[260px] sm:min-h-[300px]">
              {/* Top row: title + badges */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg bg-brand-600">
                      <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                        Coding Arcade
                      </h1>
                      <p className="text-[11px] font-mono text-emerald-400 font-bold tracking-widest uppercase mt-0.5">
                        3D Interactive Mini-Games
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                    Sharpen your typing speed, spot bugs, and master algorithmic logic with immersive 3D coding games.
                  </p>

                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Gamepad2 className="w-3 h-3" /> 3D Three.js
                    </span>
                    {isOffline ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <WifiOff className="w-3 h-3" /> Offline Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        <Wifi className="w-3 h-3" /> 100% Local
                      </span>
                    )}
                  </div>
                </div>

                {/* Sound control */}
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer shadow-xs backdrop-blur-sm"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sound: ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sound: MUTED</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom row: stats row (mini) */}
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 font-bold">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{stats.totalScore.toLocaleString()} pts</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-bold">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>{stats.gamesPlayed} played</span>
                </div>
                {stats.highScores.speedrun > 0 && (
                  <>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-sky-400 font-bold">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Best: {stats.highScores.speedrun} pts</span>
                    </div>
                  </>
                )}
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
                <Bug className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-medium text-[11px] uppercase">Bug Squashed</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                {stats.highScores.bughunt || 0} pts
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              COURSE CURRICULUM SELECTOR (Games based on enrolled courses)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <CourseGameSelector
              courses={courses}
              selectedCourseId={selectedCourseId}
              onSelectCourse={(cId) => {
                setSelectedCourseId(cId)
                if (cId !== 'all') {
                  const targetCourse = courses.find((c) => c.id === cId)
                  if (targetCourse?.language) {
                    setSelectedLanguage(targetCourse.language as GameLanguage)
                  }
                }
              }}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LANGUAGE SELECTION & FILTER TOOLBAR
              ═══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Practice Language
              </span>
              <p className="text-[11px] text-slate-500">
                Filter challenges by programming language or practice in mixed curriculum mode.
              </p>
            </div>

            <GameLanguageSelector
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
            />
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

          {/* ═══════════════════════════════════════════════════════════════
              100% OFFLINE GUARANTEE & DEVICE STORAGE CALLOUT
              ═══════════════════════════════════════════════════════════════ */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <HardDrive className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  100% Offline-Ready Gaming
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Zero Data Cost
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All 4 coding games, WebGL 3D animations, synth sound effects, and scoring logic are bundled directly in your browser. You can play, practice, and compete anytime without an internet connection.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Local Web Audio Synthesizer</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Real-Time WebGL 3D Visualizer</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Local High Score Persistence</span>
              </div>
            </div>
          </div>
        </>
      )}
    </PageContainer>
  )
}

export default GamesHubPage
