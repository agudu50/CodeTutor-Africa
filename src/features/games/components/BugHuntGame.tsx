import React, { useState, useEffect, useRef } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { BUG_HUNT_CHALLENGES } from '../data/gameData'
import { BugHuntChallenge, GameLanguage } from '../types/games.types'
import { gameSound } from '../services/gameSound.service'
import { GameLanguageSelector } from './GameLanguageSelector'
import { CircuitBugScanner3D } from './3d/CircuitBugScanner3D'
import { VictoryBurst3D } from './3d/VictoryBurst3D'
import { Button } from '@/components/ui'
import {
  Bug,
  Timer,
  Flame,
  Trophy,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  WifiOff,
} from 'lucide-react'

interface BugHuntGameProps {
  onBack: () => void
  onScoreUpdate: (score: number) => void
  initialLanguage?: GameLanguage
}

export const BugHuntGame: React.FC<BugHuntGameProps> = ({
  onBack,
  onScoreUpdate,
  initialLanguage = 'all',
}) => {
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'

  const [selectedLanguage, setSelectedLanguage] = useState<GameLanguage>(initialLanguage)
  const filteredChallenges = selectedLanguage === 'all'
    ? BUG_HUNT_CHALLENGES
    : BUG_HUNT_CHALLENGES.filter((c) => c.language === selectedLanguage)
  const activeChallenges = filteredChallenges.length > 0 ? filteredChallenges : BUG_HUNT_CHALLENGES

  const [challengeIndex, setChallengeIndex] = useState(0)
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null)
  const [isLineConfirmed, setIsLineConfirmed] = useState(false)
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; message: string } | null>(null)
  const currentChallenge: BugHuntChallenge = activeChallenges[challengeIndex] || activeChallenges[0]
  const [timeLeft, setTimeLeft] = useState(currentChallenge.timeLimitSecs)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(gameSound.isEnabled())

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleLanguageChange = (lang: GameLanguage) => {
    setSelectedLanguage(lang)
    setChallengeIndex(0)
    setSelectedLineIndex(null)
    setIsLineConfirmed(false)
    setFeedback(null)
    setIsPlaying(false)
    setIsGameOver(false)
    setStreak(0)
  }

  const handleToggleSound = () => {
    const next = gameSound.toggleSound()
    setSoundEnabled(next)
  }

  const startGame = () => {
    setIsPlaying(true)
    setIsGameOver(false)
    setSelectedLineIndex(null)
    setIsLineConfirmed(false)
    setFeedback(null)
    setTimeLeft(currentChallenge.timeLimitSecs)
    gameSound.playSuccess()
  }

  useEffect(() => {
    if (isPlaying && !isGameOver && !feedback) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          if (prev <= 5) {
            gameSound.playTick()
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, isGameOver, feedback])

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsGameOver(true)
    setIsPlaying(false)
    gameSound.playGameOver()
  }

  const handleSelectLine = (index: number) => {
    if (isLineConfirmed || feedback) return
    setSelectedLineIndex(index)
    gameSound.playKeyStroke()
  }

  const handleConfirmLine = () => {
    if (selectedLineIndex === null) return
    if (selectedLineIndex === currentChallenge.buggyLineIndex) {
      setIsLineConfirmed(true)
      gameSound.playSuccess()
    } else {
      gameSound.playError()
      setStreak(0)
      setFeedback({
        isSuccess: false,
        message: `Incorrect line! The actual bug was on line ${currentChallenge.buggyLineIndex + 1}.`,
      })
    }
  }

  const handlePickFix = (optionIndex: number) => {
    if (feedback) return
    const option = currentChallenge.correctOptions[optionIndex]

    if (option.isCorrect) {
      const bonus = timeLeft * 5
      const newScore = score + 120 + bonus
      const newStreak = streak + 1
      setScore(newScore)
      setStreak(newStreak)
      onScoreUpdate(newScore)

      if (newStreak >= 3) {
        gameSound.playCombo()
      } else {
        gameSound.playSuccess()
      }

      setFeedback({
        isSuccess: true,
        message: `Bug Squashed! ${currentChallenge.bugExplanation}`,
      })
    } else {
      gameSound.playError()
      setStreak(0)
      setFeedback({
        isSuccess: false,
        message: `Wrong fix. ${currentChallenge.bugExplanation}`,
      })
    }
  }

  const handleNextChallenge = () => {
    setFeedback(null)
    setSelectedLineIndex(null)
    setIsLineConfirmed(false)

    if (challengeIndex + 1 < BUG_HUNT_CHALLENGES.length) {
      setChallengeIndex((prev) => prev + 1)
      const nextChallenge = BUG_HUNT_CHALLENGES[challengeIndex + 1]
      setTimeLeft(nextChallenge.timeLimitSecs)
    } else {
      setIsGameOver(true)
      setIsPlaying(false)
    }
  }

  const restartGame = () => {
    setChallengeIndex(0)
    setScore(0)
    setStreak(0)
    startGame()
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Game Header Bar */}
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
            <span className="p-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Bug className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Bug Hunt Blitz
            </span>
            {isOffline && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <WifiOff className="w-2.5 h-2.5" /> Offline
              </span>
            )}
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono font-bold">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Timer className="w-3.5 h-3.5 text-rose-500" />
            <span>{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{streak}x Streak</span>
          </div>

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

      {/* Language Selector */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <GameLanguageSelector
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleLanguageChange}
        />
      </div>

      {/* Main Game Surface */}
      {!isPlaying && !isGameOver ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Bug className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ready to Hunt Bugs?</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect the code, tap the line with the bug, and select the correct fix before time expires!
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" size="lg" onClick={startGame} className="font-bold px-8 bg-rose-600 hover:bg-rose-700">
              Start Bug Hunt
            </Button>
          </div>
        </div>
      ) : isGameOver ? (
        <div className="p-6 sm:p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 animate-in zoom-in-95">
          <VictoryBurst3D />
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bug Hunt Complete!</h2>
            <p className="text-xs text-slate-500">Your total score is:</p>
            <p className="text-4xl font-extrabold font-mono text-rose-600 dark:text-rose-400 pt-1">{score} pts</p>
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
          {/* 3D Circuit Bug Scanner responding to line selection & squash state */}
          <CircuitBugScanner3D
            totalLines={currentChallenge.lines.length}
            selectedLineIndex={selectedLineIndex}
            buggyLineIndex={currentChallenge.buggyLineIndex}
            isLocked={isLineConfirmed}
            isSquashed={feedback?.isSuccess ?? false}
            hasError={feedback !== null && !feedback.isSuccess}
          />

          {/* Challenge Description */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                {currentChallenge.language} • Bug {challengeIndex + 1} of {BUG_HUNT_CHALLENGES.length}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {!isLineConfirmed ? 'Step 1: Tap the buggy line' : 'Step 2: Pick the correct fix'}
              </span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {currentChallenge.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentChallenge.description}
            </p>
          </div>

          {/* Interactive Code Lines */}
          <div className="p-2 sm:p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm space-y-1">
            {currentChallenge.lines.map((line, idx) => {
              const isSelected = selectedLineIndex === idx
              const isBugLine = isLineConfirmed && idx === currentChallenge.buggyLineIndex

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectLine(idx)}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    isBugLine
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                      : isSelected
                      ? 'bg-brand-500/20 text-white border border-brand-500/50'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span className="text-slate-600 select-none text-[11px] w-6 shrink-0">{idx + 1}</span>
                  <pre className="whitespace-pre flex-1 truncate">{line}</pre>
                  {isSelected && !isLineConfirmed && (
                    <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded bg-brand-600 text-white shrink-0">
                      Selected
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Confirm Line Button (Step 1) */}
          {!isLineConfirmed && !feedback && (
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmLine}
                disabled={selectedLineIndex === null}
                className="font-bold"
              >
                Confirm Buggy Line
              </Button>
            </div>
          )}

          {/* Fix Options (Step 2) */}
          {isLineConfirmed && !feedback && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 animate-in fade-in">
              <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                Choose the correct replacement for Line {selectedLineIndex! + 1}:
              </h4>
              <div className="space-y-2">
                {currentChallenge.correctOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePickFix(i)}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 font-mono text-xs text-slate-900 dark:text-white transition-all cursor-pointer shadow-2xs"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Post-Round Feedback */}
          {feedback && (
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
                  <h4 className="font-bold text-sm">{feedback.isSuccess ? 'Spot On!' : 'Missed Bug'}</h4>
                  <p className="text-xs mt-0.5 leading-relaxed">{feedback.message}</p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button variant="primary" size="sm" onClick={handleNextChallenge} className="font-bold">
                  Next Challenge →
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
