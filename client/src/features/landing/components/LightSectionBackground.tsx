import React, { memo } from 'react'
import { motion } from 'framer-motion'

interface LightSectionBackgroundProps {
  symbols?: string[]
  accentPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const LightSectionBackground: React.FC<LightSectionBackgroundProps> = memo(({
  symbols = ['{ }', '0 KB DATA', '✓ 100% OFFLINE', 'def logic():', 'AI.infer()', 'fast_cpu'],
  accentPosition = 'top-left'
}) => {
  const getAccentPos = () => {
    switch (accentPosition) {
      case 'top-right':
        return { top: '5%', right: '5%' }
      case 'bottom-left':
        return { bottom: '5%', left: '5%' }
      case 'bottom-right':
        return { bottom: '5%', right: '5%' }
      default:
        return { top: '5%', left: '5%' }
    }
  }

  const accentPos = getAccentPos()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0 select-none">
      {/* Primary Vibrant Ambient Glow Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 0.95, 1],
          opacity: [0.35, 0.6, 0.35],
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={accentPos}
        className="absolute w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] rounded-full bg-gradient-to-br from-[#005F02]/20 via-emerald-500/15 to-transparent dark:from-[#005F02]/30 dark:via-emerald-400/20 dark:to-transparent blur-3xl"
      />

      {/* Secondary Counter-Balance Ambient Glow Orb */}
      <motion.div
        animate={{
          scale: [1.1, 0.9, 1.2, 1.1],
          opacity: [0.25, 0.5, 0.25],
          x: [0, -35, 25, 0],
          y: [0, 25, -30, 0],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-4 right-8 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full bg-gradient-to-tl from-emerald-600/15 via-[#005F02]/15 to-transparent dark:from-emerald-400/25 dark:via-[#005F02]/20 dark:to-transparent blur-3xl"
      />

      {/* Center Subtle Neural Glow */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [0.95, 1.1, 0.95],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-[#005F02]/10 dark:bg-emerald-500/15 blur-3xl"
      />

      {/* Floating Animated Code Symbols */}
      <div className="absolute inset-0 font-mono text-xs select-none">
        {symbols[0] && (
          <motion.span
            animate={{ y: [0, -18, 0], opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[18%] left-[8%] px-2.5 py-1 rounded-md bg-[#005F02]/5 dark:bg-[#005F02]/20 border border-[#005F02]/15 dark:border-[#005F02]/30 text-[#005F02] dark:text-emerald-400 text-[11px] font-bold shadow-2xs"
          >
            {symbols[0]}
          </motion.span>
        )}
        {symbols[1] && (
          <motion.span
            animate={{ y: [0, 16, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-[28%] right-[10%] px-2.5 py-1 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-400/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-bold shadow-2xs"
          >
            {symbols[1]}
          </motion.span>
        )}
        {symbols[2] && (
          <motion.span
            animate={{ y: [0, -15, 0], opacity: [0.25, 0.65, 0.25] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-[22%] left-[12%] px-2.5 py-1 rounded-md bg-[#005F02]/5 dark:bg-[#005F02]/20 border border-[#005F02]/15 dark:border-[#005F02]/30 text-[#005F02] dark:text-emerald-400 text-[11px] font-mono font-bold shadow-2xs"
          >
            {symbols[2]}
          </motion.span>
        )}
        {symbols[3] && (
          <motion.span
            animate={{ y: [0, 20, 0], opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute bottom-[28%] right-[14%] px-2.5 py-1 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-400/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-bold shadow-2xs"
          >
            {symbols[3]}
          </motion.span>
        )}
      </div>

      {/* High-Definition Cyber Grid Matrix Overlay */}
      <div
        className="absolute inset-0 opacity-25 dark:opacity-40 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_65%,transparent_100%)]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,95,2,0.45) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
})

LightSectionBackground.displayName = 'LightSectionBackground'

