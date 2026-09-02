import React, { useState, useEffect } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { CodeShuffleChallenge, GameLanguage } from '../types/games.types'
import { gameSound } from '../services/gameSound.service'
import { courseGameAdapter } from '../services/courseGameAdapter.service'
import { GameLanguageSelector } from './GameLanguageSelector'
import { GameAnimation3DRenderer } from './3d/GameAnimation3DRenderer'
import { AlgorithmBlocks3D } from './3d/AlgorithmBlocks3D'
import { VictoryBurst3D } from './3d/VictoryBurst3D'
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
  Terminal,
  Lightbulb,
  Target,
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
      {/* Game Header Bar (Ultra-Compact Single-Row HUD) */}
      <div className="sticky top-2 z-30 px-4 sm:px-5 py-3 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Back Button + Lesson & Challenge Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="h-9 px-3.5 rounded-xl font-mono text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 active:scale-95 shadow-3xs transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-5 w-0.5 bg-slate-300 dark:border-slate-700 shrink-0" />

          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs shrink-0">
              <Shuffle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Shuffle</span>
            </span>
            <span className="text-xs sm:text-sm font-mono font-black text-slate-900 dark:text-white tracking-tight">
              {currentChallenge?.title || 'Code Shuffle'}
            </span>
            {currentChallenge?.lessonTitle && (
              <span className="hidden sm:inline text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#161B22] px-2.5 py-1 rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                {currentChallenge.lessonTitle}
              </span>
            )}
            {isOffline && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 shadow-3xs shrink-0">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            )}
          </div>
        </div>

        {/* Right: Live Metrics HUD */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold ml-auto shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs font-mono font-black">
            <Trophy className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
            <span>{score}<span className="text-[10px] font-bold ml-0.5">pts</span></span>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#0E1318] active:scale-95 shadow-3xs transition-all cursor-pointer"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Language Selector (Visible only before round starts in global mode) */}
      {!isPlaying && !isGameOver && !initialChallengeTitle && (
        <div className="p-3 sm:p-3.5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs">
          <GameLanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
          />
        </div>
      )}

      {!isPlaying && !isGameOver ? (
        <div className="relative overflow-hidden p-6 sm:p-10 text-center rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-6">
          <div className="relative h-48 sm:h-60 rounded-2xl overflow-hidden shadow-inner border-2 border-slate-300 dark:border-slate-700 bg-slate-950">
            <AlgorithmBlocks3D
              blockOrder={['1', '2', '3', '4']}
              isSuccess={null}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border-2 border-emerald-500/40 shadow-3xs backdrop-blur-sm mb-3">
                <Shuffle className="w-7 h-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">Code Sequence Shuffle</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed mt-1 font-mono font-medium">
                Reorder the scrambled algorithm blocks into the proper execution sequence.
              </p>
            </div>
          </div>
          <div className="pt-1">
            <button
              type="button"
              onClick={startGame}
              className="h-12 px-8 rounded-2xl font-mono text-sm font-black text-white bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] active:scale-95 shadow-3xs transition-all inline-flex items-center gap-2.5 cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>Start Puzzle</span>
            </button>
          </div>
        </div>
      ) : isGameOver ? (
        <div className="relative overflow-hidden p-6 sm:p-10 text-center rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-6 animate-in zoom-in-95 duration-200">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/10 dark:bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

          <VictoryBurst3D />

          {/* Header & Badges */}
          <div className="relative z-10 space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 text-xs font-mono font-black uppercase tracking-wider shadow-3xs">
              <Shuffle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Shuffle Complete</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-900 dark:text-white tracking-tight">
              {currentChallenge?.title || 'Puzzle Reconstructed!'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {score > 0
                ? 'Algorithmic logic mastery! You successfully ordered and verified program lines.'
                : 'Session ended. Review block execution order and try again!'}
            </p>
          </div>

          {/* Points Highlight Banner */}
          <div className="relative z-10 max-w-sm mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-[#161B22] border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs flex flex-col items-center justify-center text-center space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-black uppercase tracking-wider text-[#005F02] dark:text-emerald-300">
                <Trophy className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                <span>Points Scored</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-[#005F02] dark:text-emerald-300 tracking-tight">
                +{score} <span className="text-xs font-bold text-[#005F02]/80 dark:text-emerald-400/80">PTS</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="h-10 px-5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#0E1318] text-slate-800 dark:text-slate-200 font-mono text-xs font-black active:scale-95 shadow-3xs cursor-pointer transition-all inline-flex items-center gap-1.5"
            >
              ← Back to Roadmap
            </button>
            <button
              type="button"
              onClick={restartGame}
              className="h-10 px-6 rounded-xl font-mono text-xs font-black text-white bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] active:scale-95 shadow-3xs cursor-pointer transition-all inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      ) : (
        /* ═══ PLAYING STATE — 2-Column Responsive Layout (Tablet & Desktop) ═══ */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-start">
          {/* ── LEFT COLUMN: 3D Stage + Goal Context ── */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-3 md:sticky md:top-24 self-start">
            {/* 3D Algorithm Blocks Visualizer with HUD */}
            <div className="relative rounded-3xl overflow-hidden shadow-xs border-2 border-slate-300 dark:border-slate-700 h-44 sm:h-48 md:h-52 bg-slate-950">
              <GameAnimation3DRenderer
                animationType={currentChallenge.animationType}
                defaultForGame="shuffle"
                blockOrder={blocks.map((b) => b.id)}
                isSuccess={feedback ? feedback.isSuccess : null}
              />

              {/* HUD Overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-2.5 pointer-events-none bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    feedback?.isSuccess
                      ? 'bg-emerald-400'
                      : feedback !== null
                      ? 'bg-rose-500'
                      : 'bg-emerald-500'
                  }`} />
                  <span className="text-slate-300">
                    {feedback?.isSuccess
                      ? 'ALGORITHM ASSEMBLED'
                      : feedback !== null
                      ? 'INCORRECT ORDER'
                      : 'REARRANGING BLOCKS'}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
                  {blocks.length} Blocks
                </span>
              </div>
            </div>

            {/* Goal & Target Output Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800 shadow-3xs">
                  {currentChallenge.language} • Puzzle {challengeIndex + 1} of {activeChallenges.length}
                </span>
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  Algorithm Assembly
                </span>
              </div>

              <div>
                <h3 className="font-mono font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-tight leading-snug">
                  {currentChallenge.title}
                </h3>
              </div>

              {/* Structured Objective & Hint Box */}
              <div className="space-y-2 text-[11px] leading-relaxed">
                <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-[#161B22] border-2 border-emerald-200 dark:border-emerald-800/80 text-slate-700 dark:text-slate-300 space-y-1 shadow-3xs">
                  <div className="font-black flex items-center gap-1.5 text-[#005F02] dark:text-emerald-400 font-mono text-[11px]">
                    <Target className="w-3.5 h-3.5" />
                    <span>Objective:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal font-mono">
                    {currentChallenge.goalDescription && !currentChallenge.goalDescription.startsWith('Reconstruct the algorithm blocks for')
                      ? currentChallenge.goalDescription
                      : `Arrange the code blocks on the right into the correct execution sequence so the algorithm runs properly and produces the target output.`}
                  </p>
                </div>

                {currentChallenge.explanation && (
                  <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-[#161B22] border-2 border-amber-200 dark:border-amber-800/60 text-slate-700 dark:text-slate-300 space-y-1 shadow-3xs">
                    <div className="font-black flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-mono text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Execution Flow:</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono leading-normal">
                      {currentChallenge.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Expected Console Output Terminal */}
              <div className="rounded-2xl bg-slate-950 p-3 border-2 border-slate-700 text-[11px] font-mono shadow-inner">
                <div className="text-[9.5px] uppercase font-black text-slate-400 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Terminal className="w-3 h-3" /> Expected Console Output:
                  </span>
                </div>
                <div className="text-emerald-300 whitespace-pre leading-relaxed font-bold bg-[#0E1318] p-2.5 rounded-xl border border-slate-800 text-[11px]">
                  {currentChallenge.expectedOutput ? currentChallenge.expectedOutput.replace(/\\n/g, '\n') : 'Target Output'}
                </div>
              </div>

              {currentChallenge.courseTitle && (
                <div className="pt-2 border-t-2 border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500">
                  <BookOpen className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="truncate">{currentChallenge.courseTitle}</span>
                  {currentChallenge.lessonTitle && <span className="truncate">• {currentChallenge.lessonTitle}</span>}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Reorderable Code Blocks ── */}
          <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-between gap-3">
            <div className="space-y-3">
              {/* VS Code Style Reorderable Blocks Arena */}
              <div className="rounded-3xl border-2 border-slate-700 overflow-hidden shadow-xl bg-[#0E1318] flex flex-col text-slate-200">
                {/* Titlebar */}
                <div className="h-10 px-4 bg-[#161B22] border-b-2 border-slate-700 flex items-center justify-between gap-3 shrink-0 select-none">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/80 inline-block" />
                  </div>

                  <div className="flex items-center gap-2 truncate text-[11px] font-mono text-slate-300 font-black">
                    <span>algorithm.{currentChallenge.language === 'python' ? 'py' : currentChallenge.language === 'javascript' ? 'js' : 'ts'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-black">REORDER</span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Use ▲ ▼ to sort
                  </span>
                </div>

                {/* Blocks Area */}
                <div className="p-3.5 font-mono text-xs sm:text-sm space-y-2 bg-[#0E1318]">
                  {blocks.map((block, idx) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl bg-[#161B22] border-2 border-slate-700 hover:border-emerald-500 font-mono text-xs sm:text-[13px] text-slate-100 shadow-3xs transition-all"
                      style={{ marginLeft: `${block.indent * 1.5}rem` }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-[#0E1318] text-slate-400 text-[10px] font-mono font-black flex items-center justify-center select-none shrink-0 border border-slate-700">
                          {idx + 1}
                        </span>
                        <pre className="whitespace-pre truncate text-emerald-300 font-bold">{block.content}</pre>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, idx - 1)}
                          disabled={idx === 0 || feedback !== null}
                          className="p-1.5 rounded-xl bg-[#0E1318] hover:bg-emerald-600 disabled:opacity-30 text-slate-200 cursor-pointer transition-colors shadow-3xs border border-slate-700 active:scale-95"
                          title="Move block up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, idx + 1)}
                          disabled={idx === blocks.length - 1 || feedback !== null}
                          className="p-1.5 rounded-xl bg-[#0E1318] hover:bg-emerald-600 disabled:opacity-30 text-slate-200 cursor-pointer transition-colors shadow-3xs border border-slate-700 active:scale-95"
                          title="Move block down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Check Button */}
              {!feedback ? (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleCheckOrder}
                    className="h-12 px-8 rounded-2xl font-mono text-xs font-black text-white bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] active:scale-95 shadow-3xs cursor-pointer inline-flex items-center gap-2 transition-all"
                  >
                    Run &amp; Verify Sequence
                  </button>
                </div>
              ) : (
                <div
                  className={`p-5 rounded-3xl border-2 space-y-3.5 shadow-xs font-mono animate-in zoom-in-95 ${
                    feedback.isSuccess
                      ? 'bg-emerald-500/10 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-500/10 border-2 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {feedback.isSuccess ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-mono font-black text-sm">{feedback.isSuccess ? 'Algorithm Assembled!' : 'Order Mismatch'}</h4>
                      <p className="text-xs mt-0.5 leading-relaxed font-bold">{feedback.message}</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="h-10 px-6 rounded-xl font-mono text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 border-2 border-emerald-500 active:scale-95 shadow-3xs cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>Next Challenge →</span>
                    </button>
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
