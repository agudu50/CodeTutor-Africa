import React from 'react'
import { motion } from 'framer-motion'

export const BackgroundCodeAnimation: React.FC = () => {
  const codeTokens = [
    { text: 'def binary_search(arr):', x: '8%', y: '15%', duration: 18, delay: 0 },
    { text: '{ offline: true }', x: '82%', y: '12%', duration: 22, delay: 2 },
    { text: 'while low <= high:', x: '12%', y: '45%', duration: 20, delay: 1 },
    { text: 'const tutor = new OfflineAI()', x: '75%', y: '52%', duration: 25, delay: 3 },
    { text: 'class LinkedList<T>', x: '5%', y: '78%', duration: 19, delay: 0.5 },
    { text: 'return memo[n]', x: '85%', y: '82%', duration: 24, delay: 1.5 },
    { text: '<CodeTutorAfrica />', x: '50%', y: '8%', duration: 21, delay: 2.5 },
    { text: 'RAM <= 1.4GB', x: '48%', y: '88%', duration: 17, delay: 1 },
  ]

  const floatingNodes = [
    { x: '18%', y: '28%', size: 4, duration: 12 },
    { x: '68%', y: '22%', size: 5, duration: 15 },
    { x: '35%', y: '65%', size: 3, duration: 10 },
    { x: '88%', y: '40%', size: 4, duration: 14 },
    { x: '22%', y: '85%', size: 5, duration: 16 },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Background Matrix Grid Pattern with crisp solid color */}
      <svg
        className="absolute inset-0 w-full h-full text-slate-200 dark:text-slate-800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="code-grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#code-grid-pattern)" />
      </svg>

      {/* Floating Animated Code Snippets in solid colors */}
      {codeTokens.map((token, idx) => (
        <motion.div
          key={idx}
          className="absolute font-mono text-xs font-semibold text-slate-400 dark:text-slate-600 hidden sm:block"
          style={{ left: token.x, top: token.y }}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: token.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: token.delay,
          }}
        >
          {token.text}
        </motion.div>
      ))}

      {/* Floating Network Connection Nodes in solid brand color */}
      {floatingNodes.map((node, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full bg-brand-400 dark:bg-brand-700"
          style={{
            left: node.x,
            top: node.y,
            width: node.size * 2,
            height: node.size * 2,
          }}
          animate={{
            y: [0, -25, 0],
          }}
          transition={{
            duration: node.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: idx * 1.2,
          }}
        />
      ))}
    </div>
  )
}
