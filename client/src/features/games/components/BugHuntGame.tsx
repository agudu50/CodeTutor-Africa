import React, { useState, useEffect, useRef } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { BugHuntChallenge, GameLanguage } from '../types/games.types'
import { gameSound } from '../services/gameSound.service'
import { courseGameAdapter } from '../services/courseGameAdapter.service'
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
  BookOpen,
  ArrowLeft,
} from 'lucide-react'

interface BugHuntGameProps {
  onBack: () => void
  onScoreUpdate: (score: number) => void
  initialLanguage?: GameLanguage
  initialCourseId?: string
  initialChallengeTitle?: string
  initialModuleId?: string
}

export const BugHuntGame: React.FC<BugHuntGameProps> = ({
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
  const courseChallenges = courseGameAdapter.getBugHuntChallenges(initialCourseId)
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

  // Auto-start if launched from a specific drill
  useEffect(() => {
    if (initialChallengeTitle) {
      startGame()
    }
  }, [initialChallengeTitle])

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

    if (challengeIndex + 1 < activeChallenges.length) {
      setChallengeIndex((prev: number) => prev + 1)
      const nextChallenge = activeChallenges[challengeIndex + 1]
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
    <div className="w-full space-y-4 sm:space-y-5">
      {/* Game Header Bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-sm">
        {/* Left: Navigation & Drill Context */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 cursor-pointer transition-all shadow-xs shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Games</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Drill Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-xs shrink-0">
              <Bug className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {currentChallenge?.lessonTitle || 'Interactive Drill'}
                </span>
                <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                  Bug Hunt
                </span>
              </div>
              <h1 className="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate tracking-tight">
                {currentChallenge?.title || 'Bug Hunt Blitz'}
              </h1>
            </div>

            {isOffline && (
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-xs shrink-0">
                <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Offline
              </span>
            )}
          </div>
        </div>

        {/* Right: Live Metrics HUD */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono font-bold shrink-0">
          {/* Prominent Live Timer */}
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border shadow-xs transition-all ${
            timeLeft <= 5 && isPlaying
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse ring-2 ring-rose-500/40'
              : 'bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-700/80'
          }`}>
            <Timer className={`w-4 h-4 ${timeLeft <= 5 && isPlaying ? 'text-white' : 'text-rose-600 dark:text-rose-400'}`} />
            <span className="text-sm font-black tracking-tight">{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>{streak}x Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-black">{score} pts</span>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 cursor-pointer shadow-xs transition-colors"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
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
        <div className="relative overflow-hidden p-6 sm:p-10 text-center rounded-3xl bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-rose-500/10 dark:bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />

          <VictoryBurst3D />

          {/* Header & Badges */}
          <div className="relative z-10 space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-extrabold uppercase tracking-wider shadow-xs">
              <Bug className="w-3.5 h-3.5 text-rose-500" />
              <span>Bug Hunt Complete</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentChallenge?.title || 'Bug Squashed!'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {score > 0
                ? 'Debugging reflexes tested! You spotted syntax bugs and corrected broken logic.'
                : 'Session ended. Review common error patterns and try again!'}
            </p>
          </div>

          {/* Points & Streak Highlight Banner (Enhanced for High-Contrast Light & Dark Mode) */}
          <div className="relative z-10 max-w-lg mx-auto grid grid-cols-2 gap-3 sm:gap-4">
            {/* Points Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-rose-50 via-rose-100/60 to-white dark:from-rose-950/60 dark:via-rose-900/30 dark:to-slate-950 border-2 border-rose-300 dark:border-rose-700/60 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-rose-900 dark:text-rose-300 mb-1">
                <Trophy className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Points Scored</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-700 dark:text-rose-300 tracking-tight">
                +{score} <span className="text-xs font-bold text-rose-800/80 dark:text-rose-400/80">PTS</span>
              </div>
            </div>

            {/* Bug Streak Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/60 to-white dark:from-amber-950/60 dark:via-amber-900/30 dark:to-slate-950 border-2 border-amber-300 dark:border-amber-700/60 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-current" />
                <span>Bug Streak</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-300 tracking-tight">
                {streak}x
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
              className="font-bold text-xs px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-lg transition-all"
            >
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
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                  {currentChallenge.language} • Bug {challengeIndex + 1} of {activeChallenges.length}
                </span>
                {currentChallenge.courseTitle && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <BookOpen className="w-3 h-3 text-rose-500" />
                    <span>{currentChallenge.courseTitle}</span>
                    {currentChallenge.lessonTitle && <span className="text-slate-400">• {currentChallenge.lessonTitle}</span>}
                  </span>
                )}
              </div>
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
