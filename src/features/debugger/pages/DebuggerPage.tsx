import React, { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { SAMPLE_BUGGY_SNIPPETS, MOCK_INITIAL_DEBUG_RESULT } from '../data/mockDebuggerData'
import { aiService } from '@/services/ai/mock-ai.service'
import { FixSuggestionCard } from '../components/FixSuggestionCard'
import { Button, Dropdown, Textarea } from '@/components/ui'
import { Bug, Sparkles, RotateCcw } from 'lucide-react'
import { ProgrammingLanguage, DebugResult } from '@/types'

export const DebuggerPage: React.FC = () => {
  const [language, setLanguage] = useState<ProgrammingLanguage>('python')
  const [code, setCode] = useState(SAMPLE_BUGGY_SNIPPETS.python)
  const [errorMessage, setErrorMessage] = useState(
    'IndexError: list index out of range at line 5'
  )
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [debugResult, setDebugResult] = useState<DebugResult | null>(MOCK_INITIAL_DEBUG_RESULT)

  const handleLanguageChange = (newLang: string) => {
    const lang = newLang as ProgrammingLanguage
    setLanguage(lang)
    const sample = SAMPLE_BUGGY_SNIPPETS[lang as keyof typeof SAMPLE_BUGGY_SNIPPETS] || ''
    setCode(sample)
    setErrorMessage('')
    setDebugResult(null)
  }

  const handleAnalyze = async () => {
    if (!code.trim() || isAnalyzing) return
    setIsAnalyzing(true)

    try {
      const res = await aiService.analyzeDebugCode({
        code,
        language,
        runtimeError: errorMessage,
      })

      setDebugResult({
        id: `dbg-${Date.now()}`,
        language,
        originalCode: code,
        errorMessage,
        hasErrors: res.hasErrors,
        issues: [
          {
            line: 4,
            severity: 'error',
            type: 'Logic/BoundaryIssue',
            message: res.explanation.slice(0, 120),
            suggestedFix: res.suggestedFix,
          },
        ],
        explanationMarkdown: res.explanation,
        fixedCode: res.fixedCode,
        conceptsInvolved: res.keyConcepts,
        createdAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Debug analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Bug className="w-6 h-6 text-red-500" /> Offline Code Debugger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Paste buggy code or compiler stack traces to receive offline root cause explanations and suggested patches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-44">
            <Dropdown
              options={[
                { value: 'python', label: 'Python' },
                { value: 'javascript', label: 'JavaScript' },
                { value: 'java', label: 'Java' },
              ]}
              value={language}
              onChange={handleLanguageChange}
            />
          </div>
        </div>
      </div>

      {/* Two-Column Debugger Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code and Error Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Code Snippet
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {language.toUpperCase()}
              </span>
            </div>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              isCode
              rows={12}
              placeholder="# Paste your code here..."
            />

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Optional Runtime Error / Stack Trace
              </span>
              <input
                type="text"
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="e.g. IndexError: list index out of range"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCode('')
                  setErrorMessage('')
                  setDebugResult(null)
                }}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Clear
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Analyze & Explain Bug
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis & Fix */}
        <div className="lg:col-span-6">
          {debugResult ? (
            <FixSuggestionCard
              result={debugResult}
              onApplyFix={(fixed) => setCode(fixed)}
            />
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 space-y-2">
              <Bug className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Ready to Analyze
              </p>
              <p className="text-xs max-w-xs">
                Paste your code and click "Analyze & Explain Bug" to trigger the local debugger.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default DebuggerPage
