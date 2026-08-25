import React from 'react'
import { motion } from 'framer-motion'

export const BackgroundCodeAnimation: React.FC = () => {
  const codeTokens = [
    { text: 'def binary_search(arr):', x: '7%', y: '14%', duration: 16, delay: 0 },
    { text: '{ offline: true, zero_data: true }', x: '72%', y: '10%', duration: 20, delay: 2 },
    { text: 'while low <= high:', x: '10%', y: '42%', duration: 18, delay: 1 },
    { text: 'const tutor = new OfflineAI()', x: '68%', y: '48%', duration: 22, delay: 3 },
    { text: 'class LinkedList<T>', x: '5%', y: '75%', duration: 17, delay: 0.5 },
    { text: 'return memo[n] // 0ms', x: '78%', y: '80%', duration: 21, delay: 1.5 },
    { text: '<CodeTutorAfrica />', x: '45%', y: '6%', duration: 19, delay: 2.5 },
    { text: 'RAM <= 1.4GB • Local CPU', x: '42%', y: '90%', duration: 15, delay: 1 },
  ]

  const floatingNodes = [
    { x: '15%', y: '25%', size: 6, duration: 9 },
    { x: '75%', y: '20%', size: 8, duration: 11 },
    { x: '30%', y: '62%', size: 5, duration: 8 },
    { x: '85%', y: '38%', size: 7, duration: 10 },
    { x: '20%', y: '82%', size: 8, duration: 12 },
    { x: '60%', y: '72%', size: 6, duration: 9.5 },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Dynamic Ambient Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 0.95, 1],
          opacity: [0.35, 0.65, 0.35],
          x: [0, 40, -30, 0],
          y: [0, -40, 30, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-10 -left-10 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#005F02]/25 via-emerald-500/15 to-transparent dark:from-[#005F02]/40 dark:via-emerald-400/20 dark:to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1.1, 0.9, 1.2, 1.1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, -50, 35, 0],
          y: [0, 35, -40, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-10 -right-10 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-emerald-600/20 via-[#005F02]/20 to-transparent dark:from-emerald-400/30 dark:via-[#005F02]/30 dark:to-transparent blur-3xl"
      />

      {/* Layer 1: High-Contrast Matrix Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full text-[#005F02]/15 dark:text-[#005F02]/25 opacity-80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="code-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#code-grid-pattern)" />
      </svg>

      {/* Layer 2: Dot Mesh Matrix */}
      <div
        className="absolute inset-0 opacity-25 dark:opacity-40 [mask-image:radial-gradient(ellipse_85%_65%_at_50%_50%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,95,2,0.5) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Animated Code Snippet Badges */}
      {codeTokens.map((token, idx) => (
        <motion.div
          key={idx}
          className="absolute font-mono text-[11px] font-bold text-[#005F02] dark:text-emerald-300 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/75 dark:bg-slate-900/75 border border-[#005F02]/20 dark:border-emerald-500/30 shadow-sm backdrop-blur-xs"
          style={{ left: token.x, top: token.y }}
          animate={{
            y: [0, -22, 0, 22, 0],
            x: [0, 12, 0, -12, 0],
            opacity: [0.35, 0.8, 0.35],
          }}
          transition={{
            duration: token.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: token.delay,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
          <span>{token.text}</span>
        </motion.div>
      ))}

      {/* Floating Network Connection Nodes with Pulsing Glow */}
      {floatingNodes.map((node, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full bg-[#005F02] dark:bg-emerald-400 shadow-[0_0_12px_#005F02] dark:shadow-[0_0_14px_#34d399]"
          style={{
            left: node.x,
            top: node.y,
            width: node.size,
            height: node.size,
          }}
          animate={{
            y: [0, -35, 0],
            scale: [0.8, 1.4, 0.8],
            opacity: [0.3, 0.95, 0.3],
          }}
          transition={{
            duration: node.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: idx * 0.8,
          }}
        />
      ))}
    </div>
  )
}

