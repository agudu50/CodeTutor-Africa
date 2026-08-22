import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, Badge, Button, Input, Dropdown } from '@/components/ui'
import { MOCK_PRACTICE_QUESTIONS } from '../data/mockPracticeData'
import { ArrowRight, Search, Sparkles, Code2, Shield } from 'lucide-react'

export const PracticeListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLang, setSelectedLang] = useState<string>('all')

  const filteredQuestions = MOCK_PRACTICE_QUESTIONS.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLang = selectedLang === 'all' || q.language === selectedLang
    return matchesSearch && matchesLang
  })

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
              <Code2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Interactive Code Practice
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Strengthen your problem-solving skills with offline automated test suites and instant AI hints.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 shrink-0 self-start sm:self-center">
          <Shield className="w-3.5 h-3.5" /> 100% Offline Test Engine
        </span>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search problems by title, topic, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <div className="w-full sm:w-52">
          <Dropdown
            options={[
              { value: 'all', label: 'All Languages' },
              { value: 'python', label: 'Python 3.12' },
              { value: 'javascript', label: 'JavaScript' },
              { value: 'java', label: 'Java' },
            ]}
            value={selectedLang}
            onChange={setSelectedLang}
          />
        </div>
      </div>

      {/* Problems Grid (Equal Height Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {filteredQuestions.map((question) => {
          const difficultyBadge =
            question.difficulty === 'beginner'
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80'
              : question.difficulty === 'intermediate'
              ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80'
              : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80'

          return (
            <Card
              key={question.id}
              hoverable
              className="flex flex-col justify-between p-5 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs h-full"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${difficultyBadge}`}>
                    {question.difficulty}
                  </span>
                  <Badge variant="brand" size="sm" className="uppercase font-mono text-[10px] font-bold">
                    {question.language}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {question.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {question.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  {question.testCases.length} Test Cases
                </span>
                <Link to={`/practice/${question.id}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs text-xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Solve Problem
                  </Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </PageContainer>
  )
}

export default PracticeListPage
