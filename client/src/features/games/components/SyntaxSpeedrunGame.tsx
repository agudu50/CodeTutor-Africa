import React, { useState, useEffect, useRef } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { SpeedrunSnippet, GameLanguage } from '../types/games.types'
import { gameSound } from '../services/gameSound.service'
import { courseGameAdapter } from '../services/courseGameAdapter.service'
import { GameLanguageSelector } from './GameLanguageSelector'
import { GameAnimation3DRenderer } from './3d/GameAnimation3DRenderer'
import { VictoryBurst3D } from './3d/VictoryBurst3D'
import { WarpSpeed3D } from './3d/WarpSpeed3D'
import {
  Timer,
  Zap,
  RotateCcw,
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Code2,
  ChevronRight,
  ArrowLeft,
  Terminal,
} from 'lucide-react'
import { renderVSCodeSyntax } from '@/utils/syntaxHighlight'

interface SyntaxSpeedrunGameProps {
  onBack: () => void
  onScoreUpdate: (score: number) => void
  initialLanguage?: GameLanguage
  initialCourseId?: string
  initialChallengeTitle?: string
  initialModuleId?: string
}

export const SyntaxSpeedrunGame: React.FC<SyntaxSpeedrunGameProps> = ({
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
  const courseSnippets = courseGameAdapter.getSpeedrunSnippets(initialCourseId)
  const filteredSnippets = selectedLanguage === 'all'
    ? courseSnippets
    : courseSnippets.filter((s) => s.language === selectedLanguage)
  const activeSnippets = filteredSnippets.length > 0 ? filteredSnippets : courseSnippets

  const getStartingIndex = () => {
    if (!initialChallengeTitle && !initialModuleId) return 0
    const idx = activeSnippets.findIndex(
      (s) =>
        (initialChallengeTitle && s.title.toLowerCase() === initialChallengeTitle.toLowerCase()) ||
        (initialChallengeTitle && s.lessonTitle?.toLowerCase().includes(initialChallengeTitle.toLowerCase())) ||
        (initialModuleId && s.lessonTitle?.toLowerCase().includes(initialModuleId.toLowerCase()))
    )
    return idx >= 0 ? idx : 0
  }

  const [snippetIndex, setSnippetIndex] = useState(getStartingIndex)
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
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 })
  const [pasteWarning, setPasteWarning] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const handleLanguageChange = (lang: GameLanguage) => {
    setSelectedLanguage(lang)
    setSnippetIndex(0)
    setUserInput('')
    setIsPlaying(false)
    setIsGameOver(false)
    setStreak(0)
    setValidationError(null)
    setPasteWarning(false)
  }

  const handleToggleSound = () => {
    const next = gameSound.toggleSound()
    setSoundEnabled(next)
  }

  const startGame = () => {
    setIsPlaying(true)
    setIsGameOver(false)
    setUserInput('')
    setValidationError(null)
    setPasteWarning(false)
    setTimeLeft(currentSnippet.timeLimitSecs)
    startTimeRef.current = Date.now()
    gameSound.playSuccess()
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  // Auto-start if launched from a specific drill
  useEffect(() => {
    if (initialChallengeTitle) {
      startGame()
    }
  }, [initialChallengeTitle])

  // Timer loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return
    timerRef.current = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, isGameOver, snippetIndex])

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsGameOver(true)
    setIsPlaying(false)
    gameSound.playGameOver()
  }

  // Synchronize textarea scroll with line numbers gutter
  const handleScroll = () => {
    if (inputRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = inputRef.current.scrollTop
    }
  }

  const updateCursorPosition = () => {
    if (!inputRef.current) return
    const selStart = inputRef.current.selectionStart
    const textBefore = userInput.substring(0, selStart)
    const lines = textBefore.split('\n')
    setCursorPos({
      line: lines.length,
      col: (lines[lines.length - 1]?.length || 0) + 1,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isPlaying || isGameOver) return
    const value = e.target.value
    setUserInput(value)
    if (validationError) setValidationError(null)
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
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setPasteWarning(true)
    setTimeout(() => setPasteWarning(false), 3500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const next = userInput.substring(0, start) + '    ' + userInput.substring(end)
      setUserInput(next)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = inputRef.current.selectionEnd = start + 4
          updateCursorPosition()
        }
      }, 0)
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      // Ctrl+Enter or Cmd+Enter submits and validates
      e.preventDefault()
      handleSubmitCode()
    }
    // Enter key creates a new line without submitting
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

    // If played from a specific drill, complete the drill and show summary!
    if (initialChallengeTitle || snippetIndex + 1 >= activeSnippets.length) {
      setIsGameOver(true)
      setIsPlaying(false)
    } else {
      setSnippetIndex((prev: number) => prev + 1)
      const nextSnippet = activeSnippets[snippetIndex + 1]
      setUserInput('')
      setValidationError(null)
      setTimeLeft(nextSnippet.timeLimitSecs)
      startTimeRef.current = Date.now()
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }

  const handleSubmitCode = () => {
    if (!isPlaying || isGameOver) return
    const targetCode = currentSnippet.code.trim()
    const submittedCode = userInput.trim()

    if (submittedCode === targetCode) {
      handleSnippetComplete()
    } else {
      setValidationError("Code does not match target syntax. Review line spacing, quotes, or keywords and try again!")
      gameSound.playError()
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

  const userLineCount = userInput.split('\n').length
  const targetLineCount = currentSnippet?.code ? currentSnippet.code.split('\n').length : 1
  const displayLineCount = Math.max(userLineCount, targetLineCount, 10)

  const fileExtension = currentSnippet?.language === 'python' ? 'py' : currentSnippet?.language === 'javascript' ? 'js' : 'java'
  const langLabel = currentSnippet?.language === 'python' ? 'Python' : currentSnippet?.language === 'javascript' ? 'JavaScript' : 'Java'
  const fileIconColor = currentSnippet?.language === 'python' ? 'text-[#4ec9b0]' : currentSnippet?.language === 'javascript' ? 'text-[#ffd700]' : 'text-[#e06c75]'

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* Game Header Bar (Ultra-Compact Single-Row HUD) */}
      <div className="sticky top-2 z-30 px-3.5 sm:px-5 py-3 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Back Button + Lesson & Challenge Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#161B22] hover:bg-slate-200 dark:hover:bg-[#1f252e] border-2 border-slate-300 dark:border-slate-700 cursor-pointer transition-all shadow-3xs active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-5 w-px bg-slate-300 dark:border-slate-700 shrink-0" />

          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="inline-flex items-center text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 shadow-3xs shrink-0">
              Speedrun
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight truncate">
              {currentSnippet?.title || 'Syntax Speedrun'}
            </span>
            {currentSnippet?.lessonTitle && (
              <span className="hidden md:inline text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#161B22] px-2.5 py-0.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 truncate max-w-[200px]">
                {currentSnippet.lessonTitle}
              </span>
            )}
            {isOffline && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs shrink-0">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            )}
          </div>
        </div>

        {/* Right: Live Metrics HUD */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold ml-auto shrink-0">
          {/* Prominent Live Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 shadow-3xs transition-all ${
            timeLeft <= 5 && isPlaying
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse ring-2 ring-rose-500/40'
              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800'
          }`}>
            <Timer className={`w-3.5 h-3.5 ${timeLeft <= 5 && isPlaying ? 'text-white' : 'text-amber-700 dark:text-amber-400'}`} />
            <span className="text-xs font-black tracking-tight">{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span className="font-black">{streak}x</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
            <Trophy className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
            <span className="font-black">{score}<span className="text-[10px] font-bold ml-0.5">pts</span></span>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            className="h-9 w-9 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-50 dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#1f252e] border-2 border-slate-300 dark:border-slate-700 cursor-pointer shadow-3xs transition-colors flex items-center justify-center active:scale-95"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Language Selector (Visible only before round starts in global mode) */}
      {!isPlaying && !isGameOver && !initialChallengeTitle && (
        <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs">
          <GameLanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
          />
        </div>
      )}

      {/* Main Game Surface */}
      {!isPlaying && !isGameOver ? (
        <div className="p-6 sm:p-8 md:p-10 text-center rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-6">
          <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-950 shadow-inner">
            <WarpSpeed3D />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/40 pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center border-2 border-amber-300 dark:border-amber-800 shadow-3xs mb-2">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Ready for the Speedrun?</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed mt-1 font-medium">
                Type the exact code snippets in the VS Code editor as fast and accurately as you can before time expires.
              </p>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-2xl font-black text-sm bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] text-white shadow-xs active:scale-95 cursor-pointer transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Start Speedrun Blitz</span>
            </button>
          </div>
        </div>
      ) : isGameOver ? (
        <div className="p-6 sm:p-10 text-center rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-6 animate-in zoom-in-95 duration-200">
          <VictoryBurst3D />

          {/* Header & Badges */}
          <div className="relative z-10 space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 text-xs font-mono font-black uppercase tracking-wider shadow-3xs">
              <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Speedrun Run Complete</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentSnippet?.title || 'Challenge Finished!'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              {score > 0
                ? 'Great precision and speed! Your coding muscle memory is getting sharper.'
                : 'Session ended. Review the syntax structure and try again to beat the clock!'}
            </p>
          </div>

          {/* XP & Score Highlight Banner */}
          <div className="relative z-10 max-w-lg mx-auto grid grid-cols-2 gap-3.5 sm:gap-4">
            {/* Points Card */}
            <div className="p-4 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#005F02] dark:text-emerald-400 mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Points Scored</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#005F02] dark:text-emerald-400 tracking-tight">
                +{score} <span className="text-xs font-bold">PTS</span>
              </div>
            </div>

            {/* Accuracy Rating Card */}
            <div className="p-4 rounded-3xl bg-sky-100 dark:bg-sky-950/80 border-2 border-sky-300 dark:border-sky-800 shadow-3xs flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accuracy Rating</span>
              </div>
              <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${accuracy >= 90 ? 'text-sky-800 dark:text-sky-400' : 'text-amber-800 dark:text-amber-400'}`}>
                {accuracy}%
              </div>
            </div>
          </div>

          {/* 4 Performance Metric Cards */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-xl mx-auto font-mono text-center">
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1">
                <Trophy className="w-3 h-3 text-[#005F02] dark:text-emerald-400" />
                <span>Final Score</span>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">{score}</span>
            </div>

            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1">
                <Flame className="w-3 h-3 text-amber-500 fill-current" />
                <span>Max Streak</span>
              </div>
              <span className="text-xl font-black text-amber-800 dark:text-amber-400">{streak}x</span>
            </div>

            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1">
                <Zap className="w-3 h-3 text-[#005F02] dark:text-emerald-400" />
                <span>Speed</span>
              </div>
              <span className="text-xl font-black text-[#005F02] dark:text-emerald-400">{wpm} WPM</span>
            </div>

            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1">
                <CheckCircle2 className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                <span>Accuracy</span>
              </div>
              <span className="text-xl font-black text-sky-800 dark:text-sky-400">{accuracy}%</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center h-10 px-5 rounded-xl font-bold text-xs bg-slate-50 dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#1f252e] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-3xs active:scale-95 cursor-pointer"
            >
              ← Back to Roadmap
            </button>
            <button
              type="button"
              onClick={restartGame}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-6 rounded-xl font-black text-xs bg-[#005F02] hover:bg-[#004e02] text-white border-2 border-[#005F02] shadow-xs active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      ) : (
        /* ═══ PLAYING STATE — side-by-side layout ═══ */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-start">

          {/* ── LEFT PANEL: 3D world + VS Code target reference ── */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-3.5 md:sticky md:top-24 self-start">
            {/* Expanded 3D canvas with HUD overlay */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700 h-44 sm:h-48 md:h-52 bg-slate-950">
              <GameAnimation3DRenderer
                animationType={currentSnippet?.animationType}
                defaultForGame="speedrun"
                completionPercent={completionPercent}
                wpm={wpm}
                accuracy={accuracy}
                isErrorState={accuracy < 90 && userInput.length > 0}
              />
              {/* HUD overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-3.5 pointer-events-none">
                <div className="w-full max-w-[240px]">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1.5">
                    <span className="text-emerald-400">PROGRESS</span>
                    <span className="text-white">{completionPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden shadow-inner">
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
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl font-mono text-[10px] font-black border-2 ${
                    timeLeft <= 5 ? 'bg-rose-500 text-white border-rose-600 animate-pulse' : 'bg-slate-900 text-amber-300 border-amber-400'
                  }`}>
                    <Timer className="w-2.5 h-2.5" />
                    <span>{timeLeft}s</span>
                  </span>

                  {isCodeComplete ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#005F02] text-white text-[10px] font-black font-mono border-2 border-[#005F02] shadow-xs">
                      <CheckCircle2 className="w-3 h-3" /> DONE
                    </span>
                  ) : accuracy < 90 && userInput.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-600 text-white text-[10px] font-black font-mono border-2 border-rose-600 shadow-xs">
                      <AlertTriangle className="w-3 h-3" /> ERR
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 text-[10px] font-black font-mono border-2 border-emerald-600">
                      <Zap className="w-3 h-3" /> {wpm} WPM
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Target Code VS Code Reference Window */}
            <div className="rounded-3xl border-2 border-slate-700 bg-[#1e1e1e] overflow-hidden shadow-2xl flex-1 flex flex-col justify-between text-slate-200">
              <div>
                {/* VS Code Window Titlebar */}
                <div className="h-9 px-3.5 bg-[#1F1F1F] border-b-2 border-[#2D2D2D] flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block shadow-xs" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block shadow-xs" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block shadow-xs" />
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[11px] font-mono text-slate-300 font-bold truncate">
                      target.{fileExtension} {initialChallengeTitle ? '(Target Reference)' : `(Snippet ${snippetIndex + 1}/${activeSnippets.length})`}
                    </span>
                  </div>

                  <div className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1 select-none">
                    <span>Manual Typing</span>
                  </div>
                </div>

                {/* File Tab Bar */}
                <div className="h-8 px-2 bg-[#181818] border-b border-[#252526] flex items-center justify-between shrink-0">
                  <div className="flex items-center h-full">
                    <div className="h-full px-3 bg-[#1E1E1E] text-xs font-mono font-bold text-slate-100 flex items-center gap-2 border-r border-[#252526]">
                      <Code2 className={`w-3.5 h-3.5 ${fileIconColor} shrink-0`} />
                      <span>target.{fileExtension}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-950 text-amber-400 border border-amber-700 font-mono font-black">TARGET</span>
                    </div>
                  </div>
                  {currentSnippet.courseTitle && (
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline truncate max-w-[160px]">
                      {currentSnippet.courseTitle}
                    </span>
                  )}
                </div>

                {/* Step 1 Instructions callout */}
                <div className="px-3.5 py-2.5 bg-[#162a1a] border-b-2 border-[#234229] flex items-center gap-2 text-xs text-emerald-300 font-medium">
                  <span className="font-mono font-black text-xs bg-[#005F02] text-white rounded-lg w-5 h-5 flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <span><strong>Target Code to Type:</strong> Type this exact snippet into the VS Code arena on the right →</span>
                </div>

                {/* Code Canvas with Gutter + Syntax Highlight */}
                <div className="flex overflow-auto max-h-56 bg-[#1E1E1E]">
                  {/* Line numbers */}
                  <div className="w-10 py-3 bg-[#1E1E1E] border-r-2 border-[#2d2d2d] text-right pr-2 select-none text-[12px] font-mono text-[#858585] leading-6 shrink-0">
                    {Array.from({ length: targetLineCount }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  {/* Syntax Highlighted Target Code */}
                  <div className="p-3 flex-1 font-mono text-xs sm:text-[13px] leading-6 overflow-x-auto select-none">
                    {renderVSCodeSyntax(currentSnippet.code)}
                  </div>
                </div>
              </div>

              {/* Description & Concept Context */}
              <div className="px-4 py-3 text-xs text-slate-400 bg-[#181818] border-t-2 border-[#2D2D2D] space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs font-mono">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Drill Focus: {currentSnippet.title}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs font-medium">
                  {currentSnippet.description && !currentSnippet.description.startsWith('Curriculum drill for Module')
                    ? currentSnippet.description
                    : `Practice muscle memory and syntax accuracy for ${currentSnippet.lessonTitle || 'this module'}. Type every token and symbol carefully into the arena on the right.`}
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: VS CODE TYPING ARENA ── */}
          <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-between gap-3.5">
            <div className="space-y-2.5">
              {/* Accuracy / WPM bar & Step 2 Guide + INLINE TIMER */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-500 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-xs bg-[#005F02] text-white rounded-lg w-5 h-5 flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <span className="font-black text-slate-900 dark:text-white">Your Typing Arena</span>
                </div>

                {/* Direct Eye-Level Countdown Timer in Typing Arena */}
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 font-mono font-bold text-xs transition-all shadow-3xs ${
                    timeLeft <= 5
                      ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                  }`}>
                    <Timer className="w-3.5 h-3.5" />
                    <span>{timeLeft}s left</span>
                  </div>

                  <span className={`font-mono font-bold ${accuracy < 90 && userInput.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-[#005F02] dark:text-emerald-400'}`}>
                    {accuracy}% acc · {wpm} WPM
                  </span>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  VS CODE TYPING ARENA CONTAINER
                  ═══════════════════════════════════════════════════════════ */}
              <div
                onClick={() => inputRef.current?.focus()}
                className={`rounded-3xl border-2 overflow-hidden shadow-2xl bg-[#1e1e1e] flex flex-col transition-all text-slate-200 cursor-text ${
                  isCodeComplete
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : accuracy < 90 && userInput.length > 0
                    ? 'border-rose-500 ring-2 ring-rose-500/30'
                    : 'border-slate-700 focus-within:border-emerald-500'
                }`}
              >
                {/* VS Code Window Titlebar */}
                <div className="h-9 px-3.5 bg-[#1F1F1F] border-b-2 border-[#2D2D2D] flex items-center justify-between gap-3 shrink-0 select-none">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block shadow-xs" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block shadow-xs" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block shadow-xs" />
                  </div>

                  <div className="flex-1 max-w-xs mx-auto flex items-center justify-center">
                    <div className="w-full h-6 px-2.5 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1.5 truncate shadow-inner">
                      <Terminal className="w-3 h-3 text-slate-400" />
                      <span className="truncate">speedrun.{fileExtension} — CodeTutor Arena</span>
                    </div>
                  </div>

                  {/* Reset snippet button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setUserInput('')
                      setAccuracy(100)
                      setValidationError(null)
                      setTimeout(() => inputRef.current?.focus(), 50)
                    }}
                    className="h-6 px-2.5 text-[10px] font-mono font-bold text-slate-400 hover:text-slate-200 hover:bg-[#333333] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Clear arena"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </div>

                {/* Paste warning banner */}
                {pasteWarning && (
                  <div className="m-3 p-3 rounded-2xl bg-amber-950/80 border-2 border-amber-800 text-amber-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Pasting is disabled in Speedrun!</strong> Type the snippet manually to build muscle memory.</span>
                  </div>
                )}

                {/* Validation error banner */}
                {validationError && (
                  <div className="m-3 p-3 rounded-2xl bg-rose-950/80 border-2 border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* File Tab Bar & Breadcrumbs */}
                <div className="h-8 px-2 bg-[#181818] border-b border-[#252526] flex items-center justify-between shrink-0 select-none">
                  <div className="flex items-center h-full">
                    <div className="h-full px-3 bg-[#1E1E1E] text-xs font-mono font-bold text-slate-100 flex items-center gap-2 border-r border-[#252526]">
                      <Code2 className={`w-3.5 h-3.5 ${fileIconColor} shrink-0`} />
                      <span>speedrun.{fileExtension}</span>
                      <span className="text-[10px] text-slate-500">●</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <span>speedrun</span>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span className="text-slate-200 font-bold">arena</span>
                  </div>
                </div>

                {/* Editor Body: Line numbers + Direct VS Code Code Editor Textarea */}
                <div className="flex min-h-[220px] sm:min-h-[260px] bg-[#1E1E1E] relative">
                  {/* Line Numbers Gutter */}
                  <div
                    ref={gutterRef}
                    className="w-10 sm:w-11 py-3 bg-[#1E1E1E] border-r-2 border-[#2d2d2d] text-right pr-2 sm:pr-2.5 select-none text-[12px] font-mono text-[#858585] leading-6 shrink-0 overflow-hidden"
                  >
                    {Array.from({ length: displayLineCount }).map((_, i) => (
                      <div
                        key={i}
                        className={i + 1 === cursorPos.line ? 'text-slate-100 font-bold' : ''}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Direct Native VS Code Styled Textarea with Paste Protection */}
                  <div className="flex-1 min-w-0 h-full relative">
                    <textarea
                      ref={inputRef}
                      value={userInput}
                      onChange={handleInputChange}
                      onPaste={handlePaste}
                      onKeyDown={handleKeyDown}
                      onKeyUp={updateCursorPosition}
                      onClick={updateCursorPosition}
                      onScroll={handleScroll}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder={`// Type the target code here (e.g. ${currentSnippet.code.split('\n')[0]})...\n// Press Enter for new lines, click Submit & Validate Code when finished!`}
                      className="w-full h-full min-h-[220px] sm:min-h-[260px] p-3 bg-transparent text-emerald-300 caret-white font-mono text-xs sm:text-[13px] leading-6 resize-none focus:outline-none placeholder:text-slate-600 placeholder:italic whitespace-pre selection:bg-emerald-800/50"
                      style={{ tabSize: 4 }}
                    />
                  </div>
                </div>

                {/* VS Code Bottom Action Bar & Status Bar */}
                <div className="bg-[#181818] border-t-2 border-[#2D2D2D] p-3 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5 select-none">
                  {/* Left: VS Code Status info */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="hidden sm:inline text-slate-300">{langLabel}</span>
                    <span className="hidden sm:inline text-slate-600">•</span>
                    <span className="hidden sm:inline text-slate-400">Spaces: 4</span>
                    <span className="hidden sm:inline text-slate-600">•</span>
                    <span className="hidden md:inline text-slate-400">Enter = New Line</span>
                  </div>

                  {/* Right: Submit Button */}
                  <div className="flex items-center gap-2">
                    {isCodeComplete ? (
                      <span className="text-xs font-mono text-[#005F02] dark:text-emerald-400 font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Match
                      </span>
                    ) : null}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSubmitCode()
                      }}
                      disabled={userInput.trim().length === 0}
                      className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-black bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] text-white transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Validate & Submit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Cheatbar & Keyboard Shortcuts */}
            <div className="p-3 sm:px-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 shrink-0">
                  <Code2 className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                  <span className="text-[11px] font-mono font-bold">Shortcuts:</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 font-mono text-[10px] font-black shadow-3xs">
                      Enter ↵
                    </kbd>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">New Line</span>
                  </span>

                  <span className="text-slate-300 dark:text-slate-700">•</span>

                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 font-mono text-[10px] font-black shadow-3xs">
                      Ctrl + Enter
                    </kbd>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Submit Code</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                <span className={`w-2 h-2 rounded-full ${isCodeComplete ? 'bg-[#005F02] dark:bg-emerald-400 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="font-mono text-[10.5px] uppercase font-black text-slate-600 dark:text-slate-400">
                  VS Code Arena
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


