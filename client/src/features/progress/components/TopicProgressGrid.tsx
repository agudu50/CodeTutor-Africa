import React, { memo, useState } from 'react'
import { TopicMastery } from '@/types'
import { Card, CardHeader, CardTitle, CardContent, Progress } from '@/components/ui'
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
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <CardHeader className="p-3.5 sm:p-4 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Topic & Language Mastery
            </CardTitle>
          </div>
        </div>

        {/* Compact Language Filter Pills */}
        <div className="flex items-center gap-1">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#005F02] text-white border-[#005F02] shadow-3xs'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                {lang}
              </button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 divide-y divide-slate-100 dark:divide-slate-800/70">
        {filteredMasteries.map((topic) => {
          const config = getLanguageBadge(topic.language)
          const Icon = config.icon
          return (
            <div
              key={topic.topic}
              className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
            >
              {/* Left: Language Chip + Topic Title */}
              <div className="flex items-center gap-2.5 min-w-0 sm:w-5/12">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase font-mono font-bold border shrink-0 ${config.bg}`}
                >
                  <Icon className="w-2.5 h-2.5" />
                  {topic.language}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {topic.topic}
                </h4>
              </div>

              {/* Right: Progress Bar + Solved Count + Mastery % */}
              <div className="flex items-center gap-3 sm:w-7/12 shrink-0">
                <div className="flex-1 min-w-[100px]">
                  <Progress
                    value={topic.masteryPercentage}
                    variant={config.barVariant}
                    size="sm"
                  />
                </div>
                <div className="flex items-center gap-2 text-right shrink-0 font-mono">
                  <span className="text-[11px] text-slate-400 font-semibold hidden md:inline">
                    {topic.problemsSolved}/{topic.totalProblems} Solved
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white min-w-[35px] text-right">
                    {topic.masteryPercentage}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
})

TopicProgressGrid.displayName = 'TopicProgressGrid'
