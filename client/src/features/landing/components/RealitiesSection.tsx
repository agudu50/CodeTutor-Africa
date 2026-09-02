import React, { memo } from 'react'
import { motion } from 'framer-motion'
import {
  WifiOff,
  DollarSign,
  Users,
  CheckCircle2,
  GraduationCap,
  Heart,
} from 'lucide-react'

const realitiesData = [
  {
    icon: WifiOff,
    tag: 'NO INTERNET NEEDED',
    title: 'No Wi-Fi? No Problem.',
    description: 'Learn without stress. When local internet or campus Wi-Fi drops, CodeTutor Africa keeps executing your code, explaining concepts, and saving your progress with zero interruptions.',
    stat: '0ms',
    statLabel: 'delay on Wi-Fi loss',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800',
    highlights: [
      'Run code and check exercises completely offline',
      'All beginner to advanced lessons ready anytime',
      'Keep learning uninterrupted during power or network outages',
    ],
  },
  {
    icon: DollarSign,
    tag: '100% FREE FOREVER',
    title: 'Zero Mobile Data Costs',
    description: 'Online cloud AI tools consume expensive mobile data every time you ask a question. CodeTutor Africa runs 100% locally on your laptop, keeping your hard-earned data in your pocket.',
    stat: '0 KB',
    statLabel: 'mobile data spent',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    iconBg: 'bg-[#005F02] text-white',
    highlights: [
      'No expensive mobile data bundles required',
      'Zero monthly subscriptions, API keys, or hidden paywalls',
      '100% private and runs locally on your laptop storage',
    ],
  },
  {
    icon: Users,
    tag: 'PATIENT 1-ON-1 HELP',
    title: 'Help For Every Student',
    description: 'In crowded university lecture halls or studying alone late at night, asking basic questions can feel intimidating. Your AI tutor provides a friendly, patient space to learn at your own pace.',
    stat: '∞',
    statLabel: 'questions you can ask',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800',
    highlights: [
      'Gentle Socratic hints that guide you without spoiling the answer',
      'Friendly explanations when you make syntax mistakes',
      'Practice as many times as you need without fear or judgment',
    ],
  },
]

export const RealitiesSection: React.FC = memo(() => {
  return (
    <section id="why-offline" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold shadow-3xs">
          <Heart className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
          <span>THE REALITIES WE SOLVE ACROSS AFRICA</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Built Around the Daily Experience{' '}
          <span className="text-[#005F02] dark:text-emerald-400">of African Coders &amp; Schools</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
          Coding education should never halt because Wi-Fi dropped, mobile data ran out, or electricity fluctuated. CodeTutor guarantees continuous learning anywhere.
        </p>
      </div>

      {/* 3 Realities Cards Grid - Dashboard Card Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {realitiesData.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: idx * 0.08 }}
              className="p-5 sm:p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-2xs hover:shadow-md hover:border-[#005F02] dark:hover:border-emerald-500 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Stat Badge */}
                  <div className="text-right font-mono">
                    <span className="block text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {card.stat}
                    </span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      {card.statLabel}
                    </span>
                  </div>
                </div>

                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border mb-2 ${card.badgeColor} shadow-3xs`}>
                    {card.tag}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                    {card.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>

              {/* Bullet Highlights */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 mt-5">
                {card.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* School & Institution Inclusivity Banner - Dashboard Style */}
      <div className="mt-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xs text-left">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#005F02] dark:text-emerald-400 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Built for All Learning Paths</span>
          </div>
          <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
            Self-Learners, High Schools, Coding Clubs, Tech Hubs &amp; Universities
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            From absolute first-time beginners in Senior High Schools (SHS) to engineering students building software and practicing algorithms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {[
            'Self-Taught Learners',
            'Secondary / SHS',
            'Polytechnics',
            'University Labs',
            'Community Hubs',
          ].map((level) => (
            <span
              key={level}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold shadow-3xs"
            >
              {level}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
})

RealitiesSection.displayName = 'RealitiesSection'
