import React from 'react'
import { GameAnimationType, GameId } from '../../types/games.types'
import { CyberRacer3D } from './CyberRacer3D'
import { CircuitBugScanner3D } from './CircuitBugScanner3D'
import { MemoryStackFlow3D } from './MemoryStackFlow3D'
import { AlgorithmBlocks3D } from './AlgorithmBlocks3D'
import { WarpSpeed3D } from './WarpSpeed3D'
import { HologramBug3D } from './HologramBug3D'
import { Arcade3DHero } from './Arcade3DHero'

export interface GameAnimation3DRendererProps {
  animationType?: GameAnimationType
  defaultForGame?: GameId
  // Speedrun props
  wpm?: number
  accuracy?: number
  completionPercent?: number
  isErrorState?: boolean
  // Bug hunt props
  totalLines?: number
  selectedLineIndex?: number | null
  buggyLineIndex?: number
  isLocked?: boolean
  isSquashed?: boolean
  hasError?: boolean
  // Output predictor props
  selectedOptionIndex?: number | null
  correctIndex?: number
  isAnswered?: boolean
  isCorrect?: boolean
  // Shuffle props
  blockOrder?: string[]
  isSuccess?: boolean | null
  className?: string
}

export const GameAnimation3DRenderer: React.FC<GameAnimation3DRendererProps> = ({
  animationType = 'default',
  defaultForGame = 'speedrun',
  wpm = 0,
  accuracy = 100,
  completionPercent = 0,
  isErrorState = false,
  totalLines = 5,
  selectedLineIndex = null,
  buggyLineIndex = 1,
  isLocked = false,
  isSquashed = false,
  hasError = false,
  selectedOptionIndex = null,
  correctIndex = 0,
  isAnswered = false,
  isCorrect = false,
  blockOrder = ['1', '2', '3', '4'],
  isSuccess = null,
  className = '',
}) => {
  // Resolve effective animation
  let effective = animationType
  if (effective === 'default' || !effective) {
    if (defaultForGame === 'speedrun') effective = 'cyber-racer'
    else if (defaultForGame === 'bughunt') effective = 'circuit-scanner'
    else if (defaultForGame === 'predictor') effective = 'memory-flow'
    else if (defaultForGame === 'shuffle') effective = 'algorithm-blocks'
    else effective = 'cyber-racer'
  }

  switch (effective) {
    case 'cyber-racer':
      return (
        <CyberRacer3D
          progressPercent={completionPercent}
          wpm={wpm}
          hasError={isErrorState || (accuracy < 90 && completionPercent > 0)}
          isCompleted={completionPercent >= 100}
          className={className}
        />
      )
    case 'circuit-scanner':
      return (
        <CircuitBugScanner3D
          totalLines={totalLines}
          selectedLineIndex={selectedLineIndex}
          buggyLineIndex={buggyLineIndex}
          isLocked={isLocked}
          isSquashed={isSquashed}
          hasError={hasError}
          className={className}
        />
      )
    case 'memory-flow':
      return (
        <MemoryStackFlow3D
          selectedOptionIndex={selectedOptionIndex}
          correctIndex={correctIndex}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          className={className}
        />
      )
    case 'algorithm-blocks':
      return (
        <AlgorithmBlocks3D
          blockOrder={blockOrder}
          isSuccess={isSuccess}
          className={className}
        />
      )
    case 'warp-speed':
      return (
        <div className={`relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden ${className}`}>
          <WarpSpeed3D />
        </div>
      )
    case 'hologram-bug':
      return (
        <div className={`relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden ${className}`}>
          <HologramBug3D isTargetLocked={isLocked} isSquashed={isSquashed} />
        </div>
      )
    case 'arcade-hero':
      return (
        <div className={`relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden ${className}`}>
          <Arcade3DHero />
        </div>
      )
    default:
      return (
        <CyberRacer3D
          progressPercent={completionPercent}
          wpm={wpm}
          hasError={isErrorState || (accuracy < 90 && completionPercent > 0)}
          isCompleted={completionPercent >= 100}
          className={className}
        />
      )
  }
}
