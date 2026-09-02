import React, { memo, useState, useMemo } from 'react'
import { TopicMastery } from '@/types'
import { Code2, Terminal, Cpu, Layers, Database, Search, X } from 'lucide-react'

export const TopicProgressGrid: React.FC<{ masteries: TopicMastery[] }> = memo(({ masteries }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Unique languages dynamically derived from data
  const languages = useMemo(() => {
    return ['ALL', ...Array.from(new Set(masteries.map((m) => m.language.toLowerCase())))]
  }, [masteries])

  // Count topics per language
  const languageCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: masteries.length }
    masteries.forEach((m) => {
      const key = m.language.toLowerCase()
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [masteries])

  // Filtered topics based on language and search query
  const filteredMasteries = useMemo(() => {
    return masteries.filter((m) => {
      const matchesLang =
        selectedLanguage === 'ALL' || m.language.toLowerCase() === selectedLanguage.toLowerCase()
      const matchesSearch =
        searchQuery.trim() === '' ||
        m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.language.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesLang && matchesSearch
    })
  }, [masteries, selectedLanguage, searchQuery])

  // Telemetry stats for active view
  const totalSolved = useMemo(() => filteredMasteries.reduce((acc, m) => acc + m.problemsSolved, 0), [filteredMasteries])
  const totalProblems = useMemo(() => filteredMasteries.reduce((acc, m) => acc + m.totalProblems, 0), [filteredMasteries])
  const avgMastery = useMemo(() => {
    if (filteredMasteries.length === 0) return 0
    const sum = filteredMasteries.reduce((acc, m) => acc + m.masteryPercentage, 0)
    return Math.round(sum / filteredMasteries.length)
  }, [filteredMasteries])

  const getLanguageBadge = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
          barColor: 'bg-[#005F02]',
          icon: Terminal,
        }
      case 'javascript':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800',
          barColor: 'bg-amber-500',
          icon: Code2,
        }
      case 'java':
        return {
          bg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-800',
          barColor: 'bg-rose-500',
          icon: Cpu,
        }
      case 'typescript':
        return {
          bg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-400 border-blue-300 dark:border-blue-800',
          barColor: 'bg-blue-600',
          icon: Code2,
        }
      case 'sql':
        return {
          bg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-400 border-purple-300 dark:border-purple-800',
          barColor: 'bg-purple-600',
          icon: Database,
        }
      case 'html/css':
      case 'web':
        return {
          bg: 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-400 border-orange-300 dark:border-orange-800',
          barColor: 'bg-orange-500',
          icon: Layers,
        }
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
          barColor: 'bg-slate-700 dark:bg-slate-300',
          icon: Code2,
        }
    }
  }

  const getDifficultyBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
      case 'intermediate':
        return 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
      case 'advanced':
        return 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
      default:
        return 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
    }
  }

  return (
    <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs overflow-hidden">
      {/* Header with Title, Topic Counter, and Quick Search */}
      <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Topic & Language Mastery
              </h3>
              <span className="px-2.5 py-0.5 rounded-lg border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 font-mono text-[11px] font-black shadow-3xs">
                {filteredMasteries.length} Modules
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Curriculum progression and mastery rate across all course modules.
            </p>
          </div>
        </div>

        {/* Search Input Filter for Quick Topic Lookup */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or module..."
            className="w-full h-9 pl-9 pr-8 text-xs font-mono rounded-xl bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700 focus:border-[#005F02] dark:focus:border-emerald-500 outline-none transition-all shadow-3xs placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Language Filter Track (Expands to any number of languages) */}
      <div className="px-4 sm:px-5 py-3 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#12161A] flex items-center gap-1.5 overflow-x-auto select-none scrollbar-none">
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang
          const count = languageCounts[lang] || 0

          return (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-black uppercase transition-all cursor-pointer border-2 shrink-0 active:scale-95 shadow-3xs inline-flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#005F02] text-white border-[#005F02]'
                  : 'bg-white dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
              }`}
            >
              <span>{lang}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Auto-Scaling Fixed-Height Scrollable Topic List */}
      <div className="p-4 sm:p-5 max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-1.5 space-y-2.5">
        {filteredMasteries.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                No modules found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Try selecting &ldquo;ALL&rdquo; tracks or changing your search terms.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedLanguage('ALL')
              }}
              className="px-4 py-1.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:border-[#005F02] transition-all cursor-pointer shadow-3xs active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMasteries.map((topic) => {
            const config = getLanguageBadge(topic.language)
            const Icon = config.icon
            const diffClass = getDifficultyBadge(topic.level)

            return (
              <div
                key={topic.topic}
                className="p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#12161A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-3xs"
              >
                {/* Left: Language Chip + Topic Title + Difficulty Badge */}
                <div className="flex items-center gap-2.5 min-w-0 sm:w-5/12">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] uppercase font-mono font-black border-2 shrink-0 ${config.bg}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {topic.language}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                      {topic.topic}
                    </h4>
                    {topic.level && (
                      <span className={`inline-block mt-0.5 text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${diffClass}`}>
                        {topic.level}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Progress Bar + Solved Count + Mastery % */}
                <div className="flex items-center gap-3 sm:w-7/12 shrink-0">
                  <div className="flex-1 min-w-[100px] h-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${config.barColor}`}
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
          })
        )}
      </div>

      {/* Telemetry Summary Footer */}
      <div className="px-4 sm:px-5 py-3 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#12161A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <span className="font-bold text-slate-600 dark:text-slate-400">
          Showing {filteredMasteries.length} of {masteries.length} modules
        </span>
        <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-bold">
          <span>
            Solved: <strong className="text-slate-900 dark:text-white">{totalSolved}/{totalProblems}</strong>
          </span>
          <span>•</span>
          <span>
            Avg. Mastery: <strong className="text-[#005F02] dark:text-emerald-400 font-black">{avgMastery}%</strong>
          </span>
        </div>
      </div>
    </div>
  )
})

TopicProgressGrid.displayName = 'TopicProgressGrid'
