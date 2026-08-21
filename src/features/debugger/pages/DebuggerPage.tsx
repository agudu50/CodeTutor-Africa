import React, { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { SAMPLE_BUGGY_SNIPPETS, MOCK_INITIAL_DEBUG_RESULT } from '../data/mockDebuggerData'
import { aiService } from '@/services/ai/mock-ai.service'
import { FixSuggestionCard } from '../components/FixSuggestionCard'
import { Button, Dropdown, Textarea } from '@/components/ui'
import { Bug, Sparkles, RotateCcw, Shield, Terminal, AlertCircle } from 'lucide-react'
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

  const lineCount = code.split('\n').length

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80">
              <Bug className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Offline Code Debugger
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Paste buggy code or compiler stack traces to receive offline root cause explanations and suggested patches.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80">
            <Shield className="w-3.5 h-3.5" /> 100% Offline AI
          </span>
          <div className="w-40">
            <Dropdown
              options={[
                { value: 'python', label: 'Python 3.12' },
                { value: 'javascript', label: 'JavaScript' },
                { value: 'java', label: 'Java 21' },
              ]}
              value={language}
              onChange={handleLanguageChange}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TWO-COLUMN BALANCED DEBUGGER WORKSPACE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Code and Error Input */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs h-full flex flex-col justify-between">
            <div className="space-y-3 flex-1 flex flex-col">
              {/* Code Snippet Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Code Snippet
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span className="uppercase font-bold text-brand-600 dark:text-brand-400">{language}</span>
                  <span>•</span>
                  <span>{lineCount} lines</span>
                </div>
              </div>

              {/* Code Input Area */}
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                isCode
                rows={12}
                placeholder="# Paste your code here..."
                className="flex-1 min-h-[220px] font-mono text-xs leading-relaxed"
              />

              {/* Runtime Error / Stack Trace Input */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Optional Runtime Error / Stack Trace</span>
                </div>
                <input
                  type="text"
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                  placeholder="e.g. IndexError: list index out of range at line 5"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCode('')
                  setErrorMessage('')
                  setDebugResult(null)
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Clear
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
                disabled={!code.trim() || isAnalyzing}
                className="font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs text-xs"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Analyze & Explain Bug
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis & Fix (Equal Height) */}
        <div className="lg:col-span-6 flex flex-col">
          {debugResult ? (
            <FixSuggestionCard
              result={debugResult}
              onApplyFix={(fixed) => setCode(fixed)}
            />
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-slate-400 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                <Bug className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Ready for Local Debugging
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                  Paste your code snippet on the left and click "Analyze & Explain Bug" to trigger root cause diagnostics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default DebuggerPage
