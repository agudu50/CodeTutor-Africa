import React, { useState, useEffect, useRef } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { OutputPredictorChallenge, GameLanguage } from '../types/games.types'
import { gameSound } from '../services/gameSound.service'
import { courseGameAdapter } from '../services/courseGameAdapter.service'
import { GameLanguageSelector } from './GameLanguageSelector'
import { GameAnimation3DRenderer } from './3d/GameAnimation3DRenderer'
import { MemoryStackFlow3D } from './3d/MemoryStackFlow3D'
import { VictoryBurst3D } from './3d/VictoryBurst3D'
import { Button } from '@/components/ui'
import {
  HelpCircle,
  Timer,
  Flame,
  Trophy,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  WifiOff,
  ArrowLeft,
} from 'lucide-react'

interface OutputPredictorGameProps {
  onBack: () => void
  onScoreUpdate: (score: number) => void
  initialLanguage?: GameLanguage
  initialCourseId?: string
  initialChallengeTitle?: string
  initialModuleId?: string
}

export const OutputPredictorGame: React.FC<OutputPredictorGameProps> = ({
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
  const courseChallenges = courseGameAdapter.getOutputPredictorChallenges(initialCourseId)
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
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; message: string } | null>(null)
  const currentChallenge: OutputPredictorChallenge = activeChallenges[challengeIndex] || activeChallenges[0]
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
    setSelectedOption(null)
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
    setSelectedOption(null)
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

  const handlePickOption = (index: number) => {
    if (feedback) return
    setSelectedOption(index)
    const isCorrect = index === currentChallenge.correctIndex

    if (isCorrect) {
      const bonus = timeLeft * 5
      const newScore = score + 100 + bonus
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
        message: currentChallenge.explanation,
      })
    } else {
      gameSound.playError()
      setStreak(0)
      setFeedback({
        isSuccess: false,
        message: currentChallenge.explanation,
      })
    }
  }

  const handleNext = () => {
    setFeedback(null)
    setSelectedOption(null)

    if (initialChallengeTitle || challengeIndex + 1 >= activeChallenges.length) {
      setIsGameOver(true)
      setIsPlaying(false)
    } else {
      setChallengeIndex((prev: number) => prev + 1)
      const nextChallenge = activeChallenges[challengeIndex + 1]
      setTimeLeft(nextChallenge.timeLimitSecs)
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
      {/* Game Header Bar (Sticky HUD: Time, Streak & Score always visible) */}
      <div className="sticky top-2 z-30 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-md space-y-2.5 sm:space-y-3">
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
              <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 shrink-0">
                Predictor
              </span>
              {isOffline && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-xs shrink-0">
                  <WifiOff className="w-2.5 h-2.5" /> Offline
                </span>
              )}
            </div>
          </div>

          {/* Live Metrics HUD */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-mono font-bold ml-auto shrink-0">
            {/* Prominent Live Timer */}
            <div className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border shadow-xs transition-all ${
              timeLeft <= 5 && isPlaying
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse ring-2 ring-rose-500/40'
                : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/80'
            }`}>
              <Timer className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${timeLeft <= 5 && isPlaying ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
              <span className="text-xs sm:text-sm font-black tracking-tight">{timeLeft}s</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>{streak}x<span className="hidden sm:inline"> Streak</span></span>
            </div>

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
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex sm:hidden items-center gap-1.5 flex-wrap mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                  {currentChallenge?.lessonTitle || 'Module 1'}
                </span>
                <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                  Predictor
                </span>
                {isOffline && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <WifiOff className="w-2.5 h-2.5" /> Offline
                  </span>
                )}
              </div>
              <h1 className="font-black text-sm sm:text-lg text-slate-900 dark:text-white tracking-tight leading-snug break-words">
                {currentChallenge?.title || 'Output Predictor'}
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

      {/* Main Game State */}
      {!isPlaying && !isGameOver ? (
        <div className="relative overflow-hidden p-6 sm:p-10 text-center rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden shadow-inner ring-1 ring-slate-800">
            <MemoryStackFlow3D
              selectedOptionIndex={null}
              correctIndex={0}
              isAnswered={false}
              isCorrect={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40 shadow-lg backdrop-blur-sm mb-2">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Predict the Output!</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed mt-1">
                Read each tricky snippet and choose what will be printed to the console before time runs out.
              </p>
            </div>
          </div>
          <div className="pt-1">
            <Button variant="primary" size="lg" onClick={startGame} className="font-bold px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg scale-105 transition-transform">
              Start Challenge
            </Button>
          </div>
        </div>
      ) : isGameOver ? (
        <div className="relative overflow-hidden p-6 sm:p-10 text-center rounded-3xl bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-500/10 dark:bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

          <VictoryBurst3D />

          {/* Header & Badges */}
          <div className="relative z-10 space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-extrabold uppercase tracking-wider shadow-xs">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>Predictor Complete</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentChallenge?.title || 'Quiz Complete!'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {score > 0
                ? 'Mental execution tested! You accurately traced program output logic.'
                : 'Session ended. Review control flow sequencing and try again!'}
            </p>
          </div>

          {/* Points & Streak Highlight Banner (Enhanced for High-Contrast Light & Dark Mode) */}
          <div className="relative z-10 max-w-lg mx-auto grid grid-cols-2 gap-3 sm:gap-4">
            {/* Points Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-indigo-100/60 to-white dark:from-indigo-950/60 dark:via-indigo-900/30 dark:to-slate-950 border-2 border-indigo-300 dark:border-indigo-700/60 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-1">
                <Trophy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Points Scored</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-700 dark:text-indigo-300 tracking-tight">
                +{score} <span className="text-xs font-bold text-indigo-800/80 dark:text-indigo-400/80">PTS</span>
              </div>
            </div>

            {/* Streak Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/60 to-white dark:from-amber-950/60 dark:via-amber-900/30 dark:to-slate-950 border-2 border-amber-300 dark:border-amber-700/60 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-current" />
                <span>Prediction Streak</span>
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
              className="font-bold text-xs px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              Play Again
            </Button>
          </div>
        </div>
      ) : (
        /* ═══ PLAYING STATE — 2-Column Responsive Layout (Tablet & Desktop) ═══ */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-start">
          {/* ── LEFT COLUMN: 3D Stage + Target Code (Sticky on Tablet & Desktop) ── */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-3 md:sticky md:top-24 self-start">
            {/* 3D Data Flow Visualizer with HUD */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-800 h-44 sm:h-48 md:h-52 bg-slate-950">
              <GameAnimation3DRenderer
                animationType={currentChallenge.animationType}
                defaultForGame="predictor"
                selectedOptionIndex={selectedOption}
                correctIndex={currentChallenge.correctIndex}
                isAnswered={feedback !== null}
                isCorrect={feedback?.isSuccess ?? false}
              />

              {/* HUD Overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-2.5 pointer-events-none bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    feedback?.isSuccess
                      ? 'bg-emerald-400'
                      : feedback !== null
                      ? 'bg-rose-500'
                      : selectedOption !== null
                      ? 'bg-indigo-400'
                      : 'bg-slate-400'
                  }`} />
                  <span className="text-slate-300">
                    {feedback?.isSuccess
                      ? 'CPU EXECUTION VERIFIED'
                      : feedback !== null
                      ? 'LOGIC MISMATCH'
                      : selectedOption !== null
                      ? `CHANNEL ${String.fromCharCode(65 + selectedOption)} SELECTED`
                      : 'AWAITING PREDICTION'}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  {currentChallenge.options.length} Channels
                </span>
              </div>
            </div>

            {/* Target Code Snippet Card */}
            <div className="rounded-2xl border-2 border-slate-700/80 overflow-hidden shadow-2xl bg-[#1e1e1e] flex-1 flex flex-col text-slate-200">
              <div className="h-8 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between text-[11px] font-mono text-slate-300 font-semibold select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  <span className="ml-1 text-slate-400">code.{currentChallenge.language === 'python' ? 'py' : currentChallenge.language === 'javascript' ? 'js' : 'ts'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">SOURCE</span>
              </div>

              <div className="p-3.5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto select-none bg-[#1E1E1E] text-emerald-300 flex-1">
                <pre className="whitespace-pre">{currentChallenge.code}</pre>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Prediction Options & Verification ── */}
          <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-between gap-3">
            <div className="space-y-3">
              {/* Question Header */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {currentChallenge.language} • Question {challengeIndex + 1} of {activeChallenges.length}
                  </span>
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                    Choose what prints to console
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {currentChallenge.title}
                </h3>
              </div>

              {/* Multiple Choice Terminal Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentChallenge.options.map((option, idx) => {
                  const isSelected = selectedOption === idx
                  const isCorrect = idx === currentChallenge.correctIndex

                  let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:scale-[1.01]'
                  if (feedback) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold scale-[1.01]'
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 dark:bg-rose-950 border-2 border-rose-500 text-rose-800 dark:text-rose-300 font-bold'
                    } else {
                      btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800'
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePickOption(idx)}
                      disabled={feedback !== null}
                      className={`p-3.5 rounded-xl border text-left font-mono text-xs sm:text-sm transition-all cursor-pointer shadow-2xs flex items-center gap-2.5 ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-sans font-bold text-xs shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="truncate">{option}</span>
                    </button>
                  )
                })}
              </div>

              {/* Feedback & Explanation */}
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
                      <h4 className="font-bold text-sm">{feedback.isSuccess ? 'Correct Prediction!' : 'Not quite!'}</h4>
                      <p className="text-xs mt-0.5 leading-relaxed">{feedback.message}</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button variant="primary" size="sm" onClick={handleNext} className="font-bold px-5 bg-indigo-600 hover:bg-indigo-700 text-white">
                      Next Challenge →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
