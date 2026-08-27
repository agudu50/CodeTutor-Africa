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
    <div className="w-full space-y-4 sm:space-y-5">
      {/* Game Header Bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors shadow-3xs"
          >
            ← Back to Games
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </span>
            <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Syntax Speedrun
            </span>
            {isOffline && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-3xs">
                <WifiOff className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Offline
              </span>
            )}
          </div>
        </div>

        {/* Live Metrics (Sticky Timer & Scores) */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono font-bold">
          {/* Prominent Live Timer */}
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border shadow-3xs transition-all ${
            timeLeft <= 5 && isPlaying
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse ring-2 ring-rose-500/40'
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/80'
          }`}>
            <Timer className={`w-4 h-4 ${timeLeft <= 5 && isPlaying ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
            <span className="text-sm font-extrabold">{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-3xs">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>{streak}x Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 shadow-3xs">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score} pts</span>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-3xs"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Language Selector (Visible only before round starts so it doesn't push down the game during play) */}
      {!isPlaying && (
        <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-3xs">
          <GameLanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
          />
        </div>
      )}

      {/* Main Game Surface */}
      {!isPlaying && !isGameOver ? (
        <div className="p-8 sm:p-14 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
            <Zap className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Ready for the Speedrun?</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Type the exact course code snippets as fast and accurately as you can before time expires.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" size="lg" onClick={startGame} className="font-bold px-8 bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs">
              Start Speedrun Blitz
            </Button>
          </div>
        </div>
      ) : isGameOver ? (
        <div className="p-6 sm:p-10 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-5 animate-in zoom-in-95">
          <VictoryBurst3D />
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Run Complete!</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Here is your speedrun performance summary:</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto font-mono text-center">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-3xs">
              <span className="text-[10px] uppercase text-slate-400 block font-sans font-bold">Final Score</span>
              <span className="text-xl font-extrabold text-[#005F02] dark:text-emerald-400">{score}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-3xs">
              <span className="text-[10px] uppercase text-slate-400 block font-sans font-bold">Max Streak</span>
              <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{streak}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-3xs">
              <span className="text-[10px] uppercase text-slate-400 block font-sans font-bold">Speed</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{wpm} WPM</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-3xs">
              <span className="text-[10px] uppercase text-slate-400 block font-sans font-bold">Accuracy</span>
              <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400">{accuracy}%</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={onBack} className="font-semibold text-xs px-4">
              Exit to Hub
            </Button>
            <Button variant="primary" size="sm" onClick={restartGame} leftIcon={<RotateCcw className="w-3.5 h-3.5" />} className="font-bold text-xs px-4 bg-[#005F02] hover:bg-[#004e02] text-white">
              Play Again
            </Button>
          </div>
        </div>
      ) : (
        /* ═══ PLAYING STATE — full-width spacious side-by-side layout ═══ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

          {/* ── LEFT PANEL: 3D world + code reference ── */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Expanded 3D canvas with HUD overlay */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-800 h-64 sm:h-72 bg-slate-950">
              <CyberRacer3D
                progressPercent={completionPercent}
                wpm={wpm}
                hasError={accuracy < 90 && userInput.length > 0}
                isCompleted={isCodeComplete}
              />
              {/* HUD overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-3.5 pointer-events-none">
                <div className="w-full max-w-[240px]">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1.5">
                    <span className="text-emerald-400">PROGRESS</span>
                    <span className="text-white">{completionPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/90 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${completionPercent}%`,
                        background: isCodeComplete
                          ? '#005F02'
                          : accuracy < 90 && userInput.length > 0
                          ? '#f43f5e'
                          : '#005F02',
                      }}
                    />
                  </div>
                </div>
                <div className="ml-2 flex items-center gap-2 shrink-0">
                  {/* In-HUD Countdown Badge */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold ${
                    timeLeft <= 5 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900/80 text-amber-300 border border-amber-400/40'
                  }`}>
                    <Timer className="w-2.5 h-2.5" />
                    <span>{timeLeft}s</span>
                  </span>

                  {isCodeComplete ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold font-mono shadow-xs">
                      <CheckCircle2 className="w-3 h-3" /> DONE
                    </span>
                  ) : accuracy < 90 && userInput.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold font-mono shadow-xs">
                      <AlertTriangle className="w-3 h-3" /> ERR
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold font-mono border border-emerald-500/40">
                      <Zap className="w-3 h-3" /> {wpm} WPM
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Target Code reference card */}
            <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs overflow-hidden flex-1 flex flex-col justify-between">
              <div>
                {/* Card header */}
                <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex-wrap bg-slate-50/70 dark:bg-slate-950/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {currentSnippet.language} · Snippet {snippetIndex + 1}/{activeSnippets.length}
                    </span>
                    {currentSnippet.courseTitle && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <BookOpen className="w-3.5 h-3.5 text-[#005F02]" />
                        {currentSnippet.courseTitle}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">{currentSnippet.title}</span>
                </div>

                {/* Step 1 Instructions callout */}
                <div className="px-4 py-2 bg-emerald-50/60 dark:bg-emerald-950/30 border-b border-emerald-200/50 dark:border-emerald-900/50 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  <span className="font-bold text-xs bg-[#005F02] text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span><strong>Target Code to Type:</strong> Type this exact snippet into the arena on the right →</span>
                </div>

                {/* Code block */}
                <div className="p-4 sm:p-5 bg-slate-950 font-mono text-sm sm:text-base leading-relaxed overflow-auto select-none border-b border-slate-800/80">
                  <pre className="whitespace-pre text-emerald-300 font-semibold">{currentSnippet.code}</pre>
                </div>
              </div>

              {/* Description & Concept Context */}
              {currentSnippet.description && (
                <div className="px-4 sm:px-5 py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/40 space-y-0.5">
                  <p className="font-bold text-slate-700 dark:text-slate-200">Concept Explanation:</p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{currentSnippet.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL: typing area + submit (Sleek & balanced) ── */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="space-y-2.5">
              {/* Accuracy / WPM bar & Step 2 Guide + INLINE TIMER */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-500 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs bg-[#005F02] text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">Your Typing Arena</span>
                </div>

                {/* Direct Eye-Level Countdown Timer in Typing Arena */}
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-bold text-xs transition-all ${
                    timeLeft <= 5
                      ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                      : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-800/80'
                  }`}>
                    <Timer className="w-3.5 h-3.5" />
                    <span>{timeLeft}s left</span>
                  </div>

                  <span className={accuracy < 90 && userInput.length > 0 ? 'text-rose-500 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
                    {accuracy}% acc · {wpm} WPM
                  </span>
                </div>
              </div>

              {/* Textarea wrapper */}
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmitCode()
                    }
                  }}
                  rows={8}
                  placeholder={`Type the target code here (e.g. ${currentSnippet.code.split('\n')[0]})...\nPress Enter ↵ or click Submit Code when done!`}
                  className={`w-full p-4 sm:p-5 pb-16 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border-2 font-mono text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none resize-none shadow-xs transition-colors leading-relaxed ${
                    isCodeComplete
                      ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'
                      : accuracy < 90 && userInput.length > 0
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                      : 'border-emerald-600/40 focus:border-[#005F02] focus:ring-2 focus:ring-emerald-500/30'
                  }`}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />

                {/* Submit button — fixed inside textarea bottom */}
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    {isCodeComplete ? (
                      <span className="text-xs sm:text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Perfect match! (Auto-submitting...)
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                        Press <strong className="text-slate-600 dark:text-slate-300">Enter ↵</strong> to submit
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmitCode}
                    disabled={userInput.trim().length === 0}
                    className={`pointer-events-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed ${
                      isCodeComplete
                        ? 'bg-[#005F02] hover:bg-[#004e02] text-white ring-2 ring-emerald-400/40 scale-105'
                        : 'bg-[#005F02] hover:bg-[#004e02] text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Submit Code</span>
                  </button>
                </div>
              </div>
            </div>

            {/* How to Submit instructions callout */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-slate-900/80 border border-emerald-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-3xs">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#005F02] text-white font-bold text-[10px]">
                  ✓
                </span>
                <span><strong>How to Submit:</strong> Match the target snippet above. Press <strong>Enter ↵</strong> or click <strong>Submit Code</strong> to accelerate your racer!</span>
              </div>
              <span className="font-mono text-[11px] uppercase font-bold text-[#005F02] dark:text-emerald-400 shrink-0">Auto-Check Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
