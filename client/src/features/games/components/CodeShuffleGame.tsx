import React, { useState, useEffect } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { CodeShuffleChallenge, GameLanguage } from '../types/games.types'
import { gameSound } from '../services/gameSound.service'
import { courseGameAdapter } from '../services/courseGameAdapter.service'
import { GameLanguageSelector } from './GameLanguageSelector'
import { AlgorithmBlocks3D } from './3d/AlgorithmBlocks3D'
import { VictoryBurst3D } from './3d/VictoryBurst3D'
import { Button } from '@/components/ui'
import {
  Shuffle,
  Trophy,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Volume2,
  VolumeX,
  WifiOff,
  BookOpen,
  ArrowLeft,
} from 'lucide-react'

interface CodeShuffleGameProps {
  onBack: () => void
  onScoreUpdate: (score: number) => void
  initialLanguage?: GameLanguage
  initialCourseId?: string
  initialChallengeTitle?: string
  initialModuleId?: string
}

export const CodeShuffleGame: React.FC<CodeShuffleGameProps> = ({
  onBack,
  onScoreUpdate,
  initialLanguage = 'all',
  initialCourseId = 'all',
  initialChallengeTitle,
  initialModuleId,
}) => {
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'

  const [selectedLanguage, setSelectedLanguage] = useState<GameLanguage>(initialLanguage)
  const courseChallenges = courseGameAdapter.getCodeShuffleChallenges(initialCourseId)
  const filteredChallenges = selectedLanguage === 'all'
    ? courseChallenges
    : courseChallenges.filter((c) => c.language === selectedLanguage)
  const activeChallenges = filteredChallenges.length > 0 ? filteredChallenges : courseChallenges

  const getStartingIndex = () => {
    if (!initialChallengeTitle && !initialModuleId) return 0
    const idx = activeChallenges.findIndex(
      (c) =>
        (initialChallengeTitle && c.title.toLowerCase() === initialChallengeTitle.toLowerCase()) ||
        (initialChallengeTitle && c.lessonTitle?.toLowerCase().includes(initialChallengeTitle.toLowerCase())) ||
        (initialModuleId && c.lessonTitle?.toLowerCase().includes(initialModuleId.toLowerCase()))
    )
    return idx >= 0 ? idx : 0
  }

  const [challengeIndex, setChallengeIndex] = useState(getStartingIndex)
  const currentChallenge: CodeShuffleChallenge = activeChallenges[challengeIndex] || activeChallenges[0]

  const [blocks, setBlocks] = useState(currentChallenge.scrambledBlocks)
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; message: string } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(gameSound.isEnabled())

  const handleLanguageChange = (lang: GameLanguage) => {
    setSelectedLanguage(lang)
    setChallengeIndex(0)
    const nextChallenges = lang === 'all' ? courseChallenges : courseChallenges.filter((c) => c.language === lang)
    const firstChallenge = nextChallenges[0] || courseChallenges[0]
    setBlocks(firstChallenge.scrambledBlocks)
    setFeedback(null)
    setIsPlaying(false)
    setIsGameOver(false)
  }

  const handleToggleSound = () => {
    const next = gameSound.toggleSound()
    setSoundEnabled(next)
  }

  const startGame = () => {
    setIsPlaying(true)
    setIsGameOver(false)
    setFeedback(null)
    setBlocks(currentChallenge.scrambledBlocks)
    gameSound.playSuccess()
  }

  // Auto-start if launched from a specific drill
  useEffect(() => {
    if (initialChallengeTitle) {
      startGame()
    }
  }, [initialChallengeTitle])

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length || feedback) return
    const newBlocks = [...blocks]
    const [moved] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, moved)
    setBlocks(newBlocks)
    gameSound.playKeyStroke()
  }

  const handleCheckOrder = () => {
    const currentOrder = blocks.map((b) => b.id)
    const isCorrect = currentOrder.every((id, idx) => id === currentChallenge.correctOrder[idx])

    if (isCorrect) {
      const newScore = score + 150
      setScore(newScore)
      onScoreUpdate(newScore)
      gameSound.playCombo()
      setFeedback({
        isSuccess: true,
        message: `Algorithm Reconstructed! ${currentChallenge.explanation}`,
      })
    } else {
      gameSound.playError()
      setFeedback({
        isSuccess: false,
        message: 'Order is not quite right yet. Rearrange the blocks and test again!',
      })
    }
  }

  const handleNext = () => {
    setFeedback(null)
    if (initialChallengeTitle || challengeIndex + 1 >= activeChallenges.length) {
      setIsGameOver(true)
      setIsPlaying(false)
    } else {
      const nextIndex = challengeIndex + 1
      setChallengeIndex(nextIndex)
      setBlocks(activeChallenges[nextIndex].scrambledBlocks)
    }
  }

  const restartGame = () => {
    setChallengeIndex(0)
    setScore(0)
    startGame()
  }

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* Game Header Bar (Fully Responsive on Mobile, Tablet & Desktop) */}
      <div className="relative p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-2.5 sm:space-y-3">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          {/* Back Button & Module Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 cursor-pointer transition-all shadow-xs shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Games</span>
            </button>

            <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

            <div className="hidden sm:flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 truncate max-w-[200px] lg:max-w-xs">
                {currentChallenge?.lessonTitle || 'Module 1: Your First Lines of Code'}
              </span>
              <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                Shuffle
              </span>
              {isOffline && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-xs shrink-0">
                  <WifiOff className="w-2.5 h-2.5" /> Offline
                </span>
              )}
            </div>
          </div>

          {/* Live Metrics HUD */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-mono font-bold ml-auto shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 shadow-xs">
              <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-black">{score}<span className="text-[10px] sm:text-xs font-bold ml-0.5">pts</span></span>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 cursor-pointer shadow-xs transition-colors"
              title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Drill Title Banner */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs shrink-0">
              <Shuffle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex sm:hidden items-center gap-1.5 flex-wrap mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                  {currentChallenge?.lessonTitle || 'Module 1'}
                </span>
                <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Shuffle
                </span>
                {isOffline && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <WifiOff className="w-2.5 h-2.5" /> Offline
                  </span>
                )}
              </div>
              <h1 className="font-black text-sm sm:text-lg text-slate-900 dark:text-white tracking-tight leading-snug break-words">
                {currentChallenge?.title || 'Code Shuffle'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector (Visible only before round starts in global mode) */}
      {!isPlaying && !isGameOver && !initialChallengeTitle && (
        <div className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <GameLanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
          />
        </div>
      )}

      {!isPlaying && !isGameOver ? (
        <div className="relative overflow-hidden p-6 sm:p-10 text-center rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden shadow-inner ring-1 ring-slate-800">
            <AlgorithmBlocks3D
              blockOrder={['1', '2', '3', '4']}
              isSuccess={null}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-lg backdrop-blur-sm mb-2">
                <Shuffle className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Code Sequence Shuffle</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed mt-1">
                Reorder the scrambled algorithm blocks into the proper execution sequence.
              </p>
            </div>
          </div>
          <div className="pt-1">
            <Button variant="primary" size="lg" onClick={startGame} className="font-bold px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg scale-105 transition-transform">
              Start Puzzle
            </Button>
          </div>
        </div>
      ) : isGameOver ? (
        <div className="relative overflow-hidden p-6 sm:p-10 text-center rounded-3xl bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/10 dark:bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

          <VictoryBurst3D />

          {/* Header & Badges */}
          <div className="relative z-10 space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-extrabold uppercase tracking-wider shadow-xs">
              <Shuffle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Shuffle Complete</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentChallenge?.title || 'Puzzle Reconstructed!'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {score > 0
                ? 'Algorithmic logic mastery! You successfully ordered and verified program lines.'
                : 'Session ended. Review block execution order and try again!'}
            </p>
          </div>

          {/* Points Highlight Banner (Enhanced for High-Contrast Light & Dark Mode) */}
          <div className="relative z-10 max-w-sm mx-auto">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-100/60 to-white dark:from-emerald-950/60 dark:via-emerald-900/30 dark:to-slate-950 border-2 border-emerald-300 dark:border-emerald-700/60 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Points Scored</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight">
                +{score} <span className="text-xs font-bold text-emerald-800/80 dark:text-emerald-400/80">PTS</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-3">
            <Button
              variant="outline"
              size="md"
              onClick={onBack}
              className="font-bold text-xs px-5 rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ← Back to Roadmap
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={restartGame}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="font-bold text-xs px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              Play Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 3D Physical Algorithm Blocks reflecting block ordering & verification */}
          <AlgorithmBlocks3D
            blockOrder={blocks.map((b) => b.id)}
            isSuccess={feedback ? feedback.isSuccess : null}
          />

          {/* Goal Header */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {currentChallenge.language} • Puzzle {challengeIndex + 1} of {activeChallenges.length}
                </span>
                {currentChallenge.courseTitle && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <BookOpen className="w-3 h-3 text-emerald-500" />
                    <span>{currentChallenge.courseTitle}</span>
                    {currentChallenge.lessonTitle && <span className="text-slate-400">• {currentChallenge.lessonTitle}</span>}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-medium">Target: {currentChallenge.expectedOutput}</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {currentChallenge.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentChallenge.goalDescription}
            </p>
          </div>

          {/* Reorderable Blocks */}
          <div className="space-y-2">
            {blocks.map((block, idx) => (
              <div
                key={block.id}
                className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 shadow-2xs"
                style={{ paddingLeft: `${block.indent * 1.2 + 0.75}rem` }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-600 text-xs w-4 select-none">{idx + 1}</span>
                  <pre className="whitespace-pre truncate">{block.content}</pre>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, idx - 1)}
                    disabled={idx === 0 || feedback !== null}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 cursor-pointer"
                    title="Move block up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, idx + 1)}
                    disabled={idx === blocks.length - 1 || feedback !== null}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 cursor-pointer"
                    title="Move block down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Check Button */}
          {!feedback ? (
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={handleCheckOrder} className="font-bold bg-emerald-600 hover:bg-emerald-700">
                Run & Verify Sequence
              </Button>
            </div>
          ) : (
            <div
              className={`p-4 rounded-2xl border space-y-3 animate-in zoom-in-95 ${
                feedback.isSuccess
                  ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-500/10 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div className="flex items-start gap-2">
                {feedback.isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">{feedback.isSuccess ? 'Success!' : 'Incorrect Order'}</h4>
                  <p className="text-xs mt-0.5 leading-relaxed">{feedback.message}</p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                {feedback.isSuccess ? (
                  <Button variant="primary" size="sm" onClick={handleNext} className="font-bold">
                    Next Puzzle →
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setFeedback(null)}>
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
