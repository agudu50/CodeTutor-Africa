import React, { useState } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { CODE_SHUFFLE_CHALLENGES } from '../data/gameData'
import { CodeShuffleChallenge } from '../types/games.types'
import { gameSound } from '../services/gameSound.service'
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
} from 'lucide-react'

interface CodeShuffleGameProps {
  onBack: () => void
  onScoreUpdate: (score: number) => void
}

export const CodeShuffleGame: React.FC<CodeShuffleGameProps> = ({ onBack, onScoreUpdate }) => {
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'
  const [challengeIndex, setChallengeIndex] = useState(0)
  const currentChallenge: CodeShuffleChallenge = CODE_SHUFFLE_CHALLENGES[challengeIndex] || CODE_SHUFFLE_CHALLENGES[0]

  const [blocks, setBlocks] = useState(currentChallenge.scrambledBlocks)
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; message: string } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(gameSound.isEnabled())

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
    if (challengeIndex + 1 < CODE_SHUFFLE_CHALLENGES.length) {
      const nextIndex = challengeIndex + 1
      setChallengeIndex(nextIndex)
      setBlocks(CODE_SHUFFLE_CHALLENGES[nextIndex].scrambledBlocks)
    } else {
      setIsGameOver(true)
      setIsPlaying(false)
    }
  }

  const restartGame = () => {
    setChallengeIndex(0)
    setScore(0)
    startGame()
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            ← Back to Games
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Shuffle className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Code Shuffle
            </span>
            {isOffline && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <WifiOff className="w-2.5 h-2.5" /> Offline
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/60">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score} pts</span>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 cursor-pointer"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isPlaying && !isGameOver ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Shuffle className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Code Sequence Shuffle</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reorder the scrambled algorithm blocks into the proper execution sequence.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" size="lg" onClick={startGame} className="font-bold px-8 bg-emerald-600 hover:bg-emerald-700">
              Start Puzzle
            </Button>
          </div>
        </div>
      ) : isGameOver ? (
        <div className="p-6 sm:p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 animate-in zoom-in-95">
          <VictoryBurst3D />
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Puzzles Solved!</h2>
            <p className="text-xs text-slate-500">Your total score:</p>
            <p className="text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 pt-1">{score} pts</p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={onBack}>
              Exit to Hub
            </Button>
            <Button variant="primary" size="sm" onClick={restartGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
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
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {currentChallenge.language} • Puzzle {challengeIndex + 1} of {CODE_SHUFFLE_CHALLENGES.length}
              </span>
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
