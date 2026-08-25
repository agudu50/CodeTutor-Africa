import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  Clock,
  Heart,
} from 'lucide-react'
import { LightSectionBackground } from './LightSectionBackground'
import { SectionReveal } from './SectionReveal'

export const CtaSection: React.FC = memo(() => {
  return (
    <section id="cta" className="py-10 sm:py-14 px-4 md:px-8 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      <LightSectionBackground
        symbols={['Start Now', '2 Min Setup', 'No Bundles', 'Free Forever']}
        accentPosition="bottom-right"
      />
      <div className="max-w-6xl mx-auto">
        <SectionReveal>
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-6 sm:p-8 lg:p-10 text-center text-slate-900 dark:text-white space-y-6 transition-colors duration-300">
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* Step Badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
                <Zap className="w-3.5 h-3.5" />
                Step 06 • Ready to Begin?
              </span>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Join the Offline Coding{' '}
                <span className="text-brand-600 dark:text-brand-400">
                  Revolution
                </span>{' '}
                Today
              </h2>

              {/* Empathy & Value Subtitle */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Equip yourself with the tools to master programming and build real-world software without barriers. 100% free, runs completely on your laptop, and tailored for every African learner.
              </p>

              {/* 3 Value Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-left">
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>100% Free Forever</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    No subscription fees, credit cards, or hidden costs.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-mono font-bold">
                    <Shield className="w-4 h-4" />
                    <span>Private & Offline</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Your code, notes, and progress stay safe on your computer.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
                    <Zap className="w-4 h-4" />
                    <span>Instant Start</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Setup in under 2 minutes and start coding right away.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link to="/signup">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="primary"
                      size="md"
                      className="font-bold shadow-md h-11 px-7 bg-brand-600 hover:bg-brand-700 text-white border border-brand-500 text-sm"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Create Free Account
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/dashboard">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="outline"
                      size="md"
                      className="font-semibold h-11 px-6 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm shadow-xs"
                    >
                      Explore as Guest
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {/* Trust Footer Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 pt-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> No sign-up data leaves your device
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Setup in under 2 minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Made for African developers
                </span>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
})

CtaSection.displayName = 'CtaSection'
