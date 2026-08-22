import React, { memo } from 'react'

interface LightSectionBackgroundProps {
  symbols?: string[]
  accentPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const LightSectionBackground: React.FC<LightSectionBackgroundProps> = memo(({
  symbols = ['{ }', '0 KB', '✓ offline', 'def logic():'],
  accentPosition = 'top-left'
}) => {
  const getAccentPosClasses = () => {
    switch (accentPosition) {
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      default:
        return 'top-10 left-10'
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0 select-none transform-gpu">
      {/* Light ambient aura 1 - hardware accelerated with static radial glow for smooth 60fps scrolling */}
      <div
        className={`absolute w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-brand-500/[0.035] dark:bg-brand-400/[0.045] blur-3xl ${getAccentPosClasses()}`}
        style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
      />

      {/* Light ambient aura 2 */}
      <div
        className="absolute bottom-6 right-8 w-72 sm:w-88 h-72 sm:h-88 rounded-full bg-emerald-500/[0.025] dark:bg-emerald-400/[0.035] blur-3xl"
        style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
      />

      {/* Floating subtle coding tokens */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] font-mono text-xs flex justify-around items-center">
        {symbols[0] && (
          <span className="absolute top-1/4 left-[7%]">
            {symbols[0]}
          </span>
        )}
        {symbols[1] && (
          <span className="absolute top-1/3 right-[9%]">
            {symbols[1]}
          </span>
        )}
        {symbols[2] && (
          <span className="absolute bottom-1/4 left-[14%]">
            {symbols[2]}
          </span>
        )}
        {symbols[3] && (
          <span className="absolute bottom-1/3 right-[18%]">
            {symbols[3]}
          </span>
        )}
      </div>

      {/* Subtle grid mesh */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  )
})

LightSectionBackground.displayName = 'LightSectionBackground'
