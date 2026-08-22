import React, { useState, useEffect, useRef } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { OUTPUT_PREDICTOR_CHALLENGES } from '../data/gameData'
import { OutputPredictorChallenge, GameLanguage } from '../types/games.types'
import { gameSound } from '../services/gameSound.service'
import { GameLanguageSelector } from './GameLanguageSelector'
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
} from 'lucide-react'

interface OutputPredictorGameProps {
  onBack: () => void
  onScoreUpdate: (score: number) => void
  initialLanguage?: GameLanguage
}

export const OutputPredictorGame: React.FC<OutputPredictorGameProps> = ({
  onBack,
  onScoreUpdate,
  initialLanguage = 'all',
}) => {
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'

  const [selectedLanguage, setSelectedLanguage] = useState<GameLanguage>(initialLanguage)
  const filteredChallenges = selectedLanguage === 'all'
    ? OUTPUT_PREDICTOR_CHALLENGES
    : OUTPUT_PREDICTOR_CHALLENGES.filter((c) => c.language === selectedLanguage)
  const activeChallenges = filteredChallenges.length > 0 ? filteredChallenges : OUTPUT_PREDICTOR_CHALLENGES

  const [challengeIndex, setChallengeIndex] = useState(0)
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

    if (challengeIndex + 1 < OUTPUT_PREDICTOR_CHALLENGES.length) {
      setChallengeIndex((prev) => prev + 1)
      const nextChallenge = OUTPUT_PREDICTOR_CHALLENGES[challengeIndex + 1]
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
            <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Output Predictor
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
            <Timer className="w-3.5 h-3.5 text-indigo-500" />
            <span>{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
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

      {/* Main Game State */}
      {!isPlaying && !isGameOver ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Predict the Output!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Read each tricky snippet and choose what will be printed to the console before time runs out.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" size="lg" onClick={startGame} className="font-bold px-8 bg-indigo-600 hover:bg-indigo-700">
              Start Challenge
            </Button>
          </div>
        </div>
      ) : isGameOver ? (
        <div className="p-6 sm:p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 animate-in zoom-in-95">
          <VictoryBurst3D />
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quiz Finished!</h2>
            <p className="text-xs text-slate-500">Your total score:</p>
            <p className="text-4xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 pt-1">{score} pts</p>
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
          {/* 3D Memory Stack and Data Flow visualizer */}
          <MemoryStackFlow3D
            selectedOptionIndex={selectedOption}
            correctIndex={currentChallenge.correctIndex}
            isAnswered={feedback !== null}
            isCorrect={feedback?.isSuccess ?? false}
          />

          {/* Question Snippet */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {currentChallenge.language} • Question {challengeIndex + 1} of {OUTPUT_PREDICTOR_CHALLENGES.length}
              </span>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 truncate">
                {currentChallenge.title}
              </h3>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto select-none border border-slate-800">
              <pre className="whitespace-pre">{currentChallenge.code}</pre>
            </div>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentChallenge.options.map((option, idx) => {
              const isSelected = selectedOption === idx
              const isCorrect = idx === currentChallenge.correctIndex

              let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-500'
              if (feedback) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 dark:bg-emerald-950 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold'
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 dark:bg-rose-950 border-rose-400 text-rose-800 dark:text-rose-300 font-bold'
                } else {
                  btnStyle = 'opacity-50'
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePickOption(idx)}
                  disabled={feedback !== null}
                  className={`p-3.5 rounded-xl border text-left font-mono text-xs sm:text-sm transition-all cursor-pointer shadow-2xs ${btnStyle}`}
                >
                  <span className="text-slate-400 font-sans font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                  <span>{option}</span>
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
                  <h4 className="font-bold text-sm">{feedback.isSuccess ? 'Correct Answer!' : 'Not quite!'}</h4>
                  <p className="text-xs mt-0.5 leading-relaxed">{feedback.message}</p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button variant="primary" size="sm" onClick={handleNext} className="font-bold">
                  Next Question →
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
