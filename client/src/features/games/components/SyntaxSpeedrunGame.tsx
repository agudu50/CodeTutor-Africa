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
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react'
import { renderVSCodeSyntax } from '@/utils/syntaxHighlight'

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
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 })
  const [copiedTarget, setCopiedTarget] = useState(false)

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
    }, 100)
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

    // Check completion if exact match
    if (value === targetCode) {
      handleSnippetComplete()
    }
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
      // Ctrl+Enter or Cmd+Enter submits
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

    if (snippetIndex + 1 < activeSnippets.length) {
      setSnippetIndex((prev: number) => prev + 1)
      const nextSnippet = activeSnippets[snippetIndex + 1]
      setUserInput('')
      setTimeLeft(nextSnippet.timeLimitSecs)
      startTimeRef.current = Date.now()
      setTimeout(() => inputRef.current?.focus(), 80)
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
        setTimeout(() => inputRef.current?.focus(), 80)
      } else {
        setIsGameOver(true)
        setIsPlaying(false)
      }
    }
  }

  const handleCopyTarget = () => {
    navigator.clipboard?.writeText(currentSnippet.code)
    setCopiedTarget(true)
    setTimeout(() => setCopiedTarget(false), 2000)
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
  const langLabel = currentSnippet?.language === 'python' ? 'Python 3.12' : currentSnippet?.language === 'javascript' ? 'JavaScript' : 'Java 21'
  const fileIconColor = currentSnippet?.language === 'python' ? 'text-[#4ec9b0]' : currentSnippet?.language === 'javascript' ? 'text-[#ffd700]' : 'text-[#e06c75]'

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

      {/* Language Selector (Visible only before round starts) */}
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
              Type the exact code snippets in the VS Code editor as fast and accurately as you can before time expires.
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

          {/* ── LEFT PANEL: 3D world + VS Code target reference ── */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Expanded 3D canvas with HUD overlay */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-800 h-60 sm:h-64 bg-slate-950">
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

            {/* Target Code VS Code Reference Window */}
            <div className="rounded-2xl border border-slate-700/90 bg-[#1e1e1e] overflow-hidden shadow-2xl flex-1 flex flex-col justify-between text-slate-200">
              <div>
                {/* VS Code Window Titlebar */}
                <div className="h-9 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block" />
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[11px] font-mono text-slate-300 font-semibold truncate">
                      target.{fileExtension} (Snippet {snippetIndex + 1}/{activeSnippets.length})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyTarget}
                    className="h-6 px-2 text-[10px] font-mono text-slate-400 hover:text-slate-200 hover:bg-[#333333] rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy target snippet"
                  >
                    {copiedTarget ? <Check className="w-3 h-3 text-[#005F02]" /> : <Copy className="w-3 h-3" />}
                    <span className="hidden sm:inline">{copiedTarget ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* File Tab Bar */}
                <div className="h-8 px-2 bg-[#181818] border-b border-[#252526] flex items-center justify-between shrink-0">
                  <div className="flex items-center h-full">
                    <div className="h-full px-3 bg-[#1E1E1E] border-t-2 border-t-amber-500 text-xs font-mono font-medium text-slate-100 flex items-center gap-2 border-r border-[#252526]">
                      <Code2 className={`w-3.5 h-3.5 ${fileIconColor} shrink-0`} />
                      <span className="font-semibold">target.{fileExtension}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">TARGET</span>
                    </div>
                  </div>
                  {currentSnippet.courseTitle && (
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline truncate max-w-[160px]">
                      {currentSnippet.courseTitle}
                    </span>
                  )}
                </div>

                {/* Step 1 Instructions callout */}
                <div className="px-3.5 py-2 bg-[#162a1a] border-b border-[#234229] flex items-center gap-2 text-xs text-emerald-300 font-medium">
                  <span className="font-bold text-xs bg-[#005F02] text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span><strong>Target Code to Type:</strong> Type this exact snippet into the VS Code arena on the right →</span>
                </div>

                {/* Code Canvas with Gutter + Syntax Highlight */}
                <div className="flex overflow-auto max-h-56 bg-[#1E1E1E]">
                  {/* Line numbers */}
                  <div className="w-9 py-3 bg-[#1E1E1E] border-r border-[#2d2d2d] text-right pr-2 select-none text-[12px] font-mono text-[#858585] leading-6 shrink-0">
                    {Array.from({ length: targetLineCount }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  {/* Syntax Highlighted Target Code */}
                  <div className="p-3 flex-1 font-mono text-xs sm:text-[13px] leading-6 overflow-x-auto select-all">
                    {renderVSCodeSyntax(currentSnippet.code)}
                  </div>
                </div>
              </div>

              {/* Description & Concept Context */}
              {currentSnippet.description && (
                <div className="px-3.5 py-2.5 text-xs text-slate-400 bg-[#181818] border-t border-[#2D2D2D] space-y-0.5">
                  <p className="font-bold text-slate-300">{currentSnippet.title}:</p>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{currentSnippet.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL: VS CODE TYPING ARENA ── */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3">
            <div className="space-y-2">
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

              {/* ═══════════════════════════════════════════════════════════
                  VS CODE TYPING ARENA CONTAINER
                  ═══════════════════════════════════════════════════════════ */}
              <div
                onClick={() => inputRef.current?.focus()}
                className={`rounded-2xl border-2 overflow-hidden shadow-2xl bg-[#1e1e1e] flex flex-col transition-all text-slate-200 cursor-text ${
                  isCodeComplete
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : accuracy < 90 && userInput.length > 0
                    ? 'border-rose-500 ring-2 ring-rose-500/30'
                    : 'border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20'
                }`}
              >
                {/* VS Code Window Titlebar */}
                <div className="h-9 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-3 shrink-0 select-none">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block shadow-xs" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block shadow-xs" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block shadow-xs" />
                  </div>

                  <div className="flex-1 max-w-xs mx-auto flex items-center justify-center">
                    <div className="w-full h-6 px-2.5 rounded bg-[#2A2A2A] border border-[#3A3A3A] text-[11px] text-slate-400 flex items-center justify-center gap-1.5 truncate shadow-inner">
                      <span className="text-slate-500 text-[10px]">⌨️</span>
                      <span className="truncate text-slate-300">speedrun.{fileExtension} — CodeTutor Arena</span>
                    </div>
                  </div>

                  {/* Reset snippet button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setUserInput('')
                      setAccuracy(100)
                      setTimeout(() => inputRef.current?.focus(), 50)
                    }}
                    className="h-6 px-2 text-[10px] font-mono text-slate-400 hover:text-slate-200 hover:bg-[#333333] rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Clear arena"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </div>

                {/* File Tab Bar & Breadcrumbs */}
                <div className="h-8 px-2 bg-[#181818] border-b border-[#252526] flex items-center justify-between shrink-0 select-none">
                  <div className="flex items-center h-full">
                    <div className="h-full px-3 bg-[#1E1E1E] border-t-2 border-t-[#005F02] text-xs font-mono font-medium text-slate-100 flex items-center gap-2 border-r border-[#252526]">
                      <Code2 className={`w-3.5 h-3.5 ${fileIconColor} shrink-0`} />
                      <span className="font-semibold">speedrun.{fileExtension}</span>
                      <span className="text-[10px] text-slate-500">●</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <span>speedrun</span>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span className="text-slate-300">arena</span>
                  </div>
                </div>

                {/* Editor Body: Line numbers + Direct VS Code Code Editor Textarea */}
                <div className="flex min-h-[220px] sm:min-h-[260px] bg-[#1E1E1E] relative">
                  {/* Line Numbers Gutter */}
                  <div
                    ref={gutterRef}
                    className="w-10 sm:w-11 py-3 bg-[#1E1E1E] border-r border-[#2d2d2d] text-right pr-2 sm:pr-2.5 select-none text-[12px] font-mono text-[#858585] leading-6 shrink-0 overflow-hidden"
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

                  {/* Direct Native VS Code Styled Textarea */}
                  <div className="flex-1 min-w-0 h-full relative">
                    <textarea
                      ref={inputRef}
                      value={userInput}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onKeyUp={updateCursorPosition}
                      onClick={updateCursorPosition}
                      onScroll={handleScroll}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      placeholder={`// Type the target code here (e.g. ${currentSnippet.code.split('\n')[0]})...\n// Press Enter for new lines, click Submit Code when done!`}
                      className="w-full h-full min-h-[220px] sm:min-h-[260px] p-3 bg-transparent text-emerald-300 caret-white font-mono text-xs sm:text-[13px] leading-6 resize-none focus:outline-none placeholder:text-slate-600 placeholder:italic whitespace-pre selection:bg-emerald-800/50"
                      style={{ tabSize: 4 }}
                    />
                  </div>
                </div>

                {/* VS Code Bottom Action Bar & Status Bar */}
                <div className="bg-[#181818] border-t border-[#2D2D2D] p-2.5 sm:px-3 sm:py-2 flex flex-wrap items-center justify-between gap-2.5 select-none">
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
                      <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Ready to submit
                      </span>
                    ) : null}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSubmitCode()
                      }}
                      disabled={userInput.trim().length === 0}
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed ${
                        isCodeComplete
                          ? 'bg-[#005F02] hover:bg-[#004e02] text-white ring-2 ring-emerald-400/40 scale-105'
                          : 'bg-[#005F02] hover:bg-[#004e02] text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Submit Code</span>
                    </button>
                  </div>
                </div>

                {/* VS Code Bottom Accent Line */}
                <div className="h-1 bg-[#005F02] w-full" />
              </div>
            </div>

            {/* How to Submit guidance callout */}
            <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-slate-900/80 border border-emerald-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-3xs">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#005F02] text-white font-bold text-[10px]">
                  ✓
                </span>
                <span><strong>Multi-line Editing:</strong> Press <strong>Enter ↵</strong> to make a new line. Click <strong>Submit Code</strong> (or <strong>Ctrl+Enter</strong>) when finished!</span>
              </div>
              <span className="font-mono text-[11px] uppercase font-bold text-[#005F02] dark:text-emerald-400 shrink-0">VS Code Mode</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
