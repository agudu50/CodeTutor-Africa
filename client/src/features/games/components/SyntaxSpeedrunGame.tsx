import React, { useState, useEffect, useRef } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { SpeedrunSnippet, GameLanguage } from '../types/games.types'
import { gameSound } from '../services/gameSound.service'
import { courseGameAdapter } from '../services/courseGameAdapter.service'
import { GameLanguageSelector } from './GameLanguageSelector'
import { CyberRacer3D } from './3d/CyberRacer3D'
import { VictoryBurst3D } from './3d/VictoryBurst3D'
import { Button } from '@/components/ui'
import {
  Timer,
  Zap,
  RotateCcw,
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  WifiOff,
  BookOpen,
  SendHorizonal,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

interface SyntaxSpeedrunGameProps {
  onBack: () => void
  onScoreUpdate: (score: number) => void
  initialLanguage?: GameLanguage
  initialCourseId?: string
}

export const SyntaxSpeedrunGame: React.FC<SyntaxSpeedrunGameProps> = ({
  onBack,
  onScoreUpdate,
  initialLanguage = 'all',
  initialCourseId = 'all',
}) => {
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'

  const [selectedLanguage, setSelectedLanguage] = useState<GameLanguage>(initialLanguage)
  const courseSnippets = courseGameAdapter.getSpeedrunSnippets(initialCourseId)
  const filteredSnippets = selectedLanguage === 'all'
    ? courseSnippets
    : courseSnippets.filter((s) => s.language === selectedLanguage)
  const activeSnippets = filteredSnippets.length > 0 ? filteredSnippets : courseSnippets

  const [snippetIndex, setSnippetIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const currentSnippet: SpeedrunSnippet = activeSnippets[snippetIndex] || activeSnippets[0]
  const [timeLeft, setTimeLeft] = useState(currentSnippet.timeLimitSecs)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [soundEnabled, setSoundEnabled] = useState(gameSound.isEnabled())

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const handleLanguageChange = (lang: GameLanguage) => {
    setSelectedLanguage(lang)
    setSnippetIndex(0)
    setUserInput('')
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
    setUserInput('')
    setTimeLeft(currentSnippet.timeLimitSecs)
    startTimeRef.current = Date.now()
    gameSound.playSuccess()
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }

  // Timer loop
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          if (prev <= 6) {
            gameSound.playTick()
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, isGameOver])

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsGameOver(true)
    setIsPlaying(false)
    gameSound.playGameOver()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isPlaying || isGameOver) return
    const value = e.target.value
    setUserInput(value)
    gameSound.playKeyStroke()

    // Calculate real-time accuracy and WPM
    const targetCode = currentSnippet.code
    let correctChars = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] === targetCode[i]) correctChars++
    }
    const currentAcc = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100
    setAccuracy(currentAcc)

    const elapsedMins = (Date.now() - startTimeRef.current) / 60000
    const wordsTyped = value.length / 5
    if (elapsedMins > 0) {
      setWpm(Math.round(wordsTyped / elapsedMins))
    }

    // Check completion
    if (value === targetCode) {
      handleSnippetComplete()
    }
  }

  const handleSnippetComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    const bonus = timeLeft * 10 + Math.round(wpm * 2)
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

    if (snippetIndex + 1 < activeSnippets.length) {
      setSnippetIndex((prev: number) => prev + 1)
      const nextSnippet = activeSnippets[snippetIndex + 1]
      setUserInput('')
      setTimeLeft(nextSnippet.timeLimitSecs)
      startTimeRef.current = Date.now()
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setIsGameOver(true)
      setIsPlaying(false)
    }
  }

  const handleSubmitCode = () => {
    if (!isPlaying || isGameOver) return
    const targetCode = currentSnippet.code.trim()
    const submittedCode = userInput.trim()
    if (submittedCode === targetCode) {
      handleSnippetComplete()
    } else {
      // Partial submit - penalise but move on with reduced score
      if (timerRef.current) clearInterval(timerRef.current)
      const partialBonus = Math.round(accuracy * 0.5)
      const newScore = score + partialBonus
      setScore(newScore)
      onScoreUpdate(newScore)
      gameSound.playGameOver()
      if (snippetIndex + 1 < activeSnippets.length) {
        setSnippetIndex((prev: number) => prev + 1)
        const nextSnippet = activeSnippets[snippetIndex + 1]
        setUserInput('')
        setTimeLeft(nextSnippet.timeLimitSecs)
        startTimeRef.current = Date.now()
        setIsPlaying(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      } else {
        setIsGameOver(true)
        setIsPlaying(false)
      }
    }
  }

  const isCodeComplete = userInput.trim() === currentSnippet?.code.trim()
  const completionPercent = currentSnippet?.code.length > 0
    ? Math.min(100, Math.round((userInput.length / currentSnippet.code.length) * 100))
    : 0

  const restartGame = () => {
    setSnippetIndex(0)
    setScore(0)
    setStreak(0)
    setWpm(0)
    setAccuracy(100)
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
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Syntax Speedrun
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
            <Timer className="w-3.5 h-3.5 text-amber-500" />
            <span>{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
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
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ready for the Speedrun?</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Type the exact code snippets as fast and accurately as you can before time expires.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" size="lg" onClick={startGame} className="font-bold px-8">
              Start Speedrun Blitz
            </Button>
          </div>
        </div>
      ) : isGameOver ? (
        <div className="p-6 sm:p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 animate-in zoom-in-95">
          <VictoryBurst3D />
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Run Complete!</h2>
            <p className="text-xs text-slate-500">Here is your speedrun performance summary:</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto font-mono text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-sans">Final Score</span>
              <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-sans">Max Streak</span>
              <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{streak}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-sans">Speed</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{wpm} WPM</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-sans">Accuracy</span>
              <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400">{accuracy}%</span>
            </div>
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
        /* ═══ PLAYING STATE — side-by-side layout so nothing is off-screen ═══ */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

          {/* ── LEFT PANEL: 3D world + code reference ── */}
          <div className="flex flex-col gap-3">
            {/* Compact 3D canvas with HUD overlay */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-800">
              <CyberRacer3D
                progressPercent={completionPercent}
                wpm={wpm}
                hasError={accuracy < 90 && userInput.length > 0}
                isCompleted={isCodeComplete}
              />
              {/* HUD overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-3 pb-2.5 pointer-events-none">
                <div className="w-full max-w-[220px]">
                  <div className="flex items-center justify-between text-[9px] font-mono font-bold mb-1">
                    <span className="text-emerald-400">PROGRESS</span>
                    <span className="text-white">{completionPercent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${completionPercent}%`,
                        background: isCodeComplete
                          ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                          : accuracy < 90 && userInput.length > 0
                          ? 'linear-gradient(90deg,#f43f5e,#fb7185)'
                          : 'linear-gradient(90deg,#00ffcc,#06b6d4)',
                      }}
                    />
                  </div>
                </div>
                <div className="ml-2 shrink-0">
                  {isCodeComplete ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-black text-[9px] font-extrabold font-mono">
                      <CheckCircle2 className="w-2.5 h-2.5" /> DONE
                    </span>
                  ) : accuracy < 90 && userInput.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/90 text-white text-[9px] font-extrabold font-mono">
                      <AlertTriangle className="w-2.5 h-2.5" /> ERR
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold font-mono border border-emerald-500/40">
                      <Zap className="w-2.5 h-2.5" /> {wpm} WPM
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Code reference card — scrollable so it doesn't push textarea off screen */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                    {currentSnippet.language} · {snippetIndex + 1}/{activeSnippets.length}
                  </span>
                  {currentSnippet.courseTitle && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      <BookOpen className="w-3 h-3 text-brand-500" />
                      {currentSnippet.courseTitle}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono italic">{currentSnippet.title}</span>
              </div>

              {/* Code block — max-height + scroll so long snippets don't overflow */}
              <div className="p-3 sm:p-4 bg-slate-950 font-mono text-xs leading-relaxed overflow-auto max-h-[220px] select-none border-b border-slate-800">
                <pre className="whitespace-pre text-slate-100">{currentSnippet.code}</pre>
              </div>

              {/* Description */}
              {currentSnippet.description && (
                <p className="px-4 py-2 text-[10px] text-slate-500 dark:text-slate-400 italic">
                  {currentSnippet.description}
                </p>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL: typing area + submit (always visible) ── */}
          <div className="flex flex-col gap-2">
            {/* Accuracy / WPM bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-0.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Your Code</span>
              <span className={accuracy < 90 && userInput.length > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                {accuracy}% acc · {wpm} WPM
              </span>
            </div>

            {/* Textarea wrapper */}
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                rows={14}
                placeholder="Start typing the code here..."
                className={`w-full h-full p-3 sm:p-4 pb-16 rounded-2xl bg-white dark:bg-slate-900 border-2 font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 resize-none shadow-sm transition-colors ${
                  isCodeComplete
                    ? 'border-emerald-500 focus:ring-emerald-500/30'
                    : accuracy < 90 && userInput.length > 0
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-brand-500 focus:ring-brand-500/30'
                }`}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />

              {/* Submit button — fixed inside textarea bottom */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {isCodeComplete && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Perfect match!
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSubmitCode}
                  disabled={userInput.trim().length === 0}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                    isCodeComplete
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-white ring-2 ring-emerald-400/40 scale-105'
                      : 'bg-brand-600 hover:bg-brand-500 text-white'
                  }`}
                >
                  <SendHorizonal className="w-3.5 h-3.5" />
                  Submit Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
