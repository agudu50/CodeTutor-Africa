import React, { useState, useEffect, useRef, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Cpu,
  Database,
  BatteryCharging,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { LightSectionBackground } from './LightSectionBackground'
import { SectionReveal } from './SectionReveal'
import { StepConnector } from './StepConnector'

/* ─────────────────────────────────── Optimized rAF Counter ──── */
const AnimatedCounter: React.FC<{
  target: number
  duration?: number
  inView: boolean
  formatter?: (val: number) => string
}> = memo(({ target, duration = 1500, inView, formatter = (v: number) => Math.floor(v).toString() }) => {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let startTimestamp: number | null = null
    let rafId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      setVal(easeProgress * target)

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration, inView])

  return <span>{formatter(val)}</span>
})

AnimatedCounter.displayName = 'AnimatedCounter'

export const HardwareSpecsSection: React.FC = memo(() => {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  return (
    <section id="architecture" className="py-20 sm:py-28 px-4 md:px-8 relative overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
      <LightSectionBackground
        symbols={['1.4 GB RAM', '52 Lessons', '320ms Instant', 'CPU Cool']}
        accentPosition="top-left"
      />
      <div className="max-w-5xl mx-auto space-y-12" ref={statsRef}>
        <SectionReveal>
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
              <Cpu className="w-3.5 h-3.5" />
              Step 04 • Everyday Laptops
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for Regular Student Laptops
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Designed to run smoothly on everyday laptops without slowing down your computer or draining your battery.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: RAM */}
          <SectionReveal delay={0} className="h-full">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="h-full p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider">Lightweight</span>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  <AnimatedCounter
                    target={1.4}
                    inView={statsInView}
                    duration={1500}
                    formatter={(val) => val.toFixed(1)}
                  />{' '}
                  <span className="text-lg text-slate-500 dark:text-slate-400 font-sans font-normal">GB RAM</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                  Uses very little memory, leaving plenty of room for your code editor and web browser.
                </p>
              </div>
              
              {/* Mini progress bar & footer */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={statsInView ? { width: '17.5%' } : { width: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full bg-brand-500"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>1.4 / 8.0 GB used by AI</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">17.5%</span>
                </div>
              </div>
            </motion.div>
          </SectionReveal>

          {/* Card 2: Lessons */}
          <SectionReveal delay={0.08} className="h-full">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="h-full p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider">Offline Lessons</span>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono">
                  50+ Lessons
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                  All course notes, exercises, and examples are saved directly on your laptop ready to learn.
                </p>
              </div>

              {/* Mini progress bar & footer */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={statsInView ? { width: '100%' } : { width: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full bg-amber-500"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-500" />
                    <AnimatedCounter target={52} inView={statsInView} duration={1400} /> lessons included
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Ready</span>
                </div>
              </div>
            </motion.div>
          </SectionReveal>

          {/* Card 3: Battery */}
          <SectionReveal delay={0.16} className="h-full">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="h-full p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BatteryCharging className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider">Fast & Cool</span>
                </div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                  <AnimatedCounter target={320} inView={statsInView} duration={1200} />
                  <span className="text-lg text-slate-500 dark:text-slate-400 font-sans font-normal">ms Instant</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                  Answers questions fast while keeping your laptop cool and battery lasting for hours.
                </p>
              </div>

              {/* Mini progress bar & footer */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={statsInView ? { width: '100%' } : { width: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-500" />
                    Battery friendly
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Low Temp</span>
                </div>
              </div>
            </motion.div>
          </SectionReveal>
        </div>

        {/* Journey Connector */}
        <StepConnector nextLabel="Next Step: Frequently Asked Questions" targetId="faq" stepNumber="05" />
      </div>
    </section>
  )
})

HardwareSpecsSection.displayName = 'HardwareSpecsSection'
