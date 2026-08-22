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
import { LightSectionBackground } from './LightSectionBackground'
import { SectionReveal } from './SectionReveal'
import { StepConnector } from './StepConnector'

const realitiesData = [
  {
    icon: WifiOff,
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconBorder: 'border-amber-200 dark:border-amber-800',
    iconColor: 'text-amber-600 dark:text-amber-400',
    tag: 'No Internet Needed',
    title: 'No Wi-Fi? No Problem.',
    description: 'Learn without stress. When local internet or school Wi-Fi drops, CodeTutor Africa keeps running your code, explaining concepts, and saving your progress with zero interruptions.',
    stat: '0ms',
    statLabel: 'delay on Wi-Fi loss',
    highlights: [
      'Run your code and check answers completely offline',
      'All beginner to advanced lessons ready anytime',
      'Keep practicing even during power outages',
    ],
  },
  {
    icon: DollarSign,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconBorder: 'border-emerald-200 dark:border-emerald-800',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    tag: '100% Free Forever',
    title: 'Zero Mobile Data Costs',
    description: 'Online AI tools consume expensive internet data every time you ask a question. CodeTutor Africa runs 100% on your laptop, keeping your mobile data in your pocket.',
    stat: '0 KB',
    statLabel: 'mobile data spent',
    highlights: [
      'No mobile data bundles required',
      'No monthly subscriptions or hidden fees',
      'Completely private and runs easily on your laptop',
    ],
  },
  {
    icon: Users,
    iconBg: 'bg-brand-50 dark:bg-brand-950/50',
    iconBorder: 'border-brand-200 dark:border-brand-800',
    iconColor: 'text-brand-600 dark:text-brand-400',
    tag: 'Friendly & Patient',
    title: '1-on-1 Help For Every Student',
    description: 'In crowded classrooms or studying alone late at night, asking questions can feel intimidating. Your AI tutor provides a friendly, patient space to learn at your own pace.',
    stat: '∞',
    statLabel: 'questions you can ask',
    highlights: [
      'Gentle hints that guide you without just spoiling the answer',
      'Friendly explanations when you make mistakes',
      'Practice as many times as you need in private',
    ],
  },
]

export const RealitiesSection: React.FC = memo(() => {
  return (
    <section id="why-offline" className="py-20 sm:py-28 px-4 md:px-8 relative overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
      <LightSectionBackground
        symbols={['0ms delay', '100% free', '∞ questions', 'Zero Wi-Fi']}
        accentPosition="top-right"
      />
      <div className="max-w-6xl mx-auto space-y-16">
        <SectionReveal>
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
              <Heart className="w-3.5 h-3.5" />
              Step 02 • The Realities We Solve
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built Around the Real Daily Experience{' '}
              <span className="text-brand-600 dark:text-brand-400">of African Coders & Schools</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Coding education shouldn't stop when internet drops, electricity fluctuates, or monthly data bundles run out.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {realitiesData.map((card, idx) => {
            const Icon = card.icon
            return (
              <SectionReveal key={card.title} delay={idx * 0.08}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="relative p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl ${card.iconBg} border ${card.iconBorder} ${card.iconColor} flex items-center justify-center transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {/* Stat badge */}
                      <div className="text-right">
                        <span className="block text-2xl font-bold font-mono text-slate-900 dark:text-white">{card.stat}</span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-mono">{card.statLabel}</span>
                      </div>
                    </div>

                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
                        {card.tag}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {card.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 mt-4">
                    {card.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </SectionReveal>
            )
          })}
        </div>

        {/* School & Institution Inclusivity Banner */}
        <SectionReveal delay={0.15}>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm text-left">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                Built for All Learning Paths
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Self-Learners, High Schools, Coding Clubs, Tech Hubs & Colleges
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Learning tracks and problem sets scale from first-time coding basics to real-world software development and algorithmic problem solving.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {['Self-Taught', 'Coding Clubs', 'High Schools / SHS', 'Polytechnics', 'Universities'].map((level) => (
                <span
                  key={level}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold"
                >
                  {level}
                </span>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Journey Connector */}
        <StepConnector nextLabel="Next Step: Explore The Interactive Workspace" targetId="features" stepNumber="03" />
      </div>
    </section>
  )
})

RealitiesSection.displayName = 'RealitiesSection'
