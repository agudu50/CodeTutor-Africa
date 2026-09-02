import React, { memo, useState } from 'react'
import { TopicMastery } from '@/types'
import { Code2, Terminal, Cpu, Layers } from 'lucide-react'

export const TopicProgressGrid: React.FC<{ masteries: TopicMastery[] }> = memo(({ masteries }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL')

  const languages = ['ALL', ...Array.from(new Set(masteries.map((m) => m.language)))]

  const filteredMasteries = selectedLanguage === 'ALL'
    ? masteries
    : masteries.filter((m) => m.language === selectedLanguage)

  const getLanguageBadge = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          barVariant: 'emerald' as const,
          icon: Terminal,
        }
      case 'javascript':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          barVariant: 'amber' as const,
          icon: Code2,
        }
      case 'java':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          barVariant: 'rose' as const,
          icon: Cpu,
        }
      default:
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
          barVariant: 'brand' as const,
          icon: Layers,
        }
    }
  }

  return (
    <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Topic & Language Mastery
            </h3>
          </div>
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-xl text-[11px] font-mono font-black uppercase transition-all cursor-pointer border-2 active:scale-95 shadow-3xs ${
                  isSelected
                    ? 'bg-[#005F02] text-white border-[#005F02]'
                    : 'bg-slate-50 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
                }`}
              >
                {lang}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-2.5">
        {filteredMasteries.map((topic) => {
          const config = getLanguageBadge(topic.language)
          const Icon = config.icon
          const barColor =
            topic.language.toLowerCase() === 'python'
              ? 'bg-[#005F02]'
              : topic.language.toLowerCase() === 'javascript'
              ? 'bg-amber-500'
              : topic.language.toLowerCase() === 'java'
              ? 'bg-rose-500'
              : 'bg-sky-500'

          return (
            <div
              key={topic.topic}
              className="p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#12161A] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-3xs"
            >
              {/* Left: Language Chip + Topic Title */}
              <div className="flex items-center gap-2.5 min-w-0 sm:w-5/12">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] uppercase font-mono font-black border-2 shrink-0 ${config.bg}`}
                >
                  <Icon className="w-3 h-3" />
                  {topic.language}
                </span>
                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                  {topic.topic}
                </h4>
              </div>

              {/* Right: Progress Bar + Solved Count + Mastery % */}
              <div className="flex items-center gap-3 sm:w-7/12 shrink-0">
                <div className="flex-1 min-w-[100px] h-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${topic.masteryPercentage}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-right shrink-0 font-mono">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold hidden md:inline">
                    {topic.problemsSolved}/{topic.totalProblems} Solved
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white min-w-[38px] text-right">
                    {topic.masteryPercentage}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

TopicProgressGrid.displayName = 'TopicProgressGrid'
