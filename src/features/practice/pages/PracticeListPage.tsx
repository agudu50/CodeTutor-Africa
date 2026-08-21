import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, Badge, Button, Input, Dropdown } from '@/components/ui'
import { MOCK_PRACTICE_QUESTIONS } from '../data/mockPracticeData'
import { ArrowRight, Search, Sparkles } from 'lucide-react'

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interactive Code Practice
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Strengthen your problem-solving skills with offline automated test suites and instant AI hints.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search problems by name or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            options={[
              { value: 'all', label: 'All Languages' },
              { value: 'python', label: 'Python' },
              { value: 'javascript', label: 'JavaScript' },
              { value: 'java', label: 'Java' },
            ]}
            value={selectedLang}
            onChange={setSelectedLang}
          />
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.map((question) => (
          <Card
            key={question.id}
            hoverable
            className="flex flex-col justify-between p-5 space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    question.difficulty === 'beginner'
                      ? 'success'
                      : question.difficulty === 'intermediate'
                      ? 'warning'
                      : 'error'
                  }
                  size="sm"
                >
                  {question.difficulty}
                </Badge>
                <Badge variant="brand" size="sm" className="uppercase font-mono text-[10px]">
                  {question.language}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
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

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent-500" />
                {question.testCases.length} Test Cases
              </span>
              <Link to={`/practice/${question.id}`}>
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Solve Problem
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}

export default PracticeListPage
