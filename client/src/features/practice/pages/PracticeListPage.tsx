import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, Button, Input, Dropdown } from '@/components/ui'
import { MOCK_PRACTICE_QUESTIONS } from '../data/mockPracticeData'
import { ArrowRight, Search, Code2, ShieldCheck, CheckCircle2 } from 'lucide-react'

export const PracticeListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLang, setSelectedLang] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const filteredQuestions = MOCK_PRACTICE_QUESTIONS.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLang = selectedLang === 'all' || q.language === selectedLang
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty
    return matchesSearch && matchesLang && matchesDifficulty
  })

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ]

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 shadow-3xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Interactive Code Practice
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            Strengthen your problem-solving skills with offline automated test suites and instant AI hints.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-[#005F02] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 self-start sm:self-center shadow-3xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>100% Offline Test Engine</span>
        </span>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search problems by title, topic, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="bg-white dark:bg-slate-900 rounded-xl"
            />
          </div>
          <div className="w-full sm:w-56">
            <Dropdown
              options={[
                { value: 'all', label: 'All Languages' },
                { value: 'python', label: 'Python 3.12' },
                { value: 'javascript', label: 'JavaScript' },
                { value: 'java', label: 'Java 21' },
              ]}
              value={selectedLang}
              onChange={setSelectedLang}
            />
          </div>
        </div>

        {/* Difficulty Pill Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1 font-mono">
            Difficulty:
          </span>
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              type="button"
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-3xs ${
                selectedDifficulty === diff.id
                  ? 'bg-[#005F02] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {diff.label}
            </button>
          ))}
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono ml-auto hidden sm:inline">
            Showing {filteredQuestions.length} challenges
          </span>
        </div>
      </div>

      {/* Problems Grid (Equal Height Cards) */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <Code2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No practice problems found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query or language filter to discover available drills.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setSelectedLang('all')
              setSelectedDifficulty('all')
            }}
            className="text-xs font-semibold"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-stretch">
          {filteredQuestions.map((question) => {
            const difficultyBadge =
              question.difficulty === 'beginner'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80'
                : question.difficulty === 'intermediate'
                ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80'
                : 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/80'

            return (
              <Card
                key={question.id}
                hoverable
                className="flex flex-col justify-between p-5 sm:p-6 lg:p-7 space-y-4 sm:space-y-5 border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs rounded-2xl sm:rounded-3xl h-full group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <span className={`text-[10px] sm:text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg border ${difficultyBadge}`}>
                      {question.difficulty}
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] uppercase font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {question.language}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {question.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {question.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-mono border border-slate-200/80 dark:border-slate-700/80 shadow-3xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                  <span className="text-[11px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{question.testCases.length} Test Cases</span>
                  </span>
                  <Link to={`/practice/${question.id}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs text-xs justify-center cursor-pointer px-3.5 sm:px-4 h-9 sm:h-9"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1 opacity-80" />}
                    >
                      Solve Problem
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}

export default PracticeListPage
