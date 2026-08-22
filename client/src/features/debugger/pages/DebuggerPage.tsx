import React, { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import {
  SAMPLE_BUGGY_SNIPPETS,
  SAMPLE_ERROR_MESSAGES,
  MOCK_DEBUG_RESULTS_BY_LANGUAGE,
} from '../data/mockDebuggerData'
import { aiService } from '@/services/ai/ai.service'
import { FixSuggestionCard } from '../components/FixSuggestionCard'
import { Button, Dropdown, Textarea } from '@/components/ui'
import { Bug, Sparkles, RotateCcw, Shield, Terminal, AlertCircle, Code2 } from 'lucide-react'
import { ProgrammingLanguage, DebugResult } from '@/types'

export const DebuggerPage: React.FC = () => {
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript')
  const [code, setCode] = useState(SAMPLE_BUGGY_SNIPPETS.javascript)
  const [errorMessage, setErrorMessage] = useState(SAMPLE_ERROR_MESSAGES.javascript)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [debugResult, setDebugResult] = useState<DebugResult | null>(
    MOCK_DEBUG_RESULTS_BY_LANGUAGE.javascript
  )

  const handleLanguageChange = (newLang: string) => {
    const lang = newLang as ProgrammingLanguage
    setLanguage(lang)
    const sample = SAMPLE_BUGGY_SNIPPETS[lang as keyof typeof SAMPLE_BUGGY_SNIPPETS] || ''
    const sampleErr = SAMPLE_ERROR_MESSAGES[lang as keyof typeof SAMPLE_ERROR_MESSAGES] || ''
    setCode(sample)
    setErrorMessage(sampleErr)
    setDebugResult(MOCK_DEBUG_RESULTS_BY_LANGUAGE[lang] || null)
  }

  const handleSelectPreset = (presetLang: ProgrammingLanguage) => {
    handleLanguageChange(presetLang)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
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
            Paste buggy code or compiler stack traces across Python, JavaScript, and Java for offline root cause explanations and patches.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80">
            <Shield className="w-3.5 h-3.5 text-emerald-500" /> 100% Offline AI
          </span>
          <div className="w-full sm:w-44">
            <Dropdown
              options={[
                { value: 'javascript', label: 'JavaScript (ES2024)' },
                { value: 'java', label: 'Java 21 (OpenJDK)' },
                { value: 'python', label: 'Python 3.12' },
              ]}
              value={language}
              onChange={handleLanguageChange}
              className="text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MULTI-LANGUAGE PRESET CHIPS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pl-1">
          Sample Bugs:
        </span>
        <button
          type="button"
          onClick={() => handleSelectPreset('javascript')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer border ${
            language === 'javascript'
              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
          }`}
        >
          <span className="text-[#ffd700] mr-1">JS:</span> Async Race Condition
        </button>
        <button
          type="button"
          onClick={() => handleSelectPreset('java')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer border ${
            language === 'java'
              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
          }`}
        >
          <span className="text-[#e06c75] mr-1">Java:</span> Array Bounds Exceeded
        </button>
        <button
          type="button"
          onClick={() => handleSelectPreset('python')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer border ${
            language === 'python'
              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
          }`}
        >
          <span className="text-[#4ec9b0] mr-1">Python:</span> Off-by-One Loop Error
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          EDITOR & STACK TRACE FORM
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        {/* Code Input Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Code Snippet
              </span>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                • {language} • {lineCount} lines
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCode('')}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="p-3 sm:p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              spellCheck={false}
              className="w-full p-3 font-mono text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 resize-y leading-relaxed"
              placeholder="// Paste your buggy code here..."
            />
          </div>
        </div>

        {/* Optional Error Trace Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Optional Runtime Error / Stack Trace
              </span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="p-3 sm:p-4">
            <Textarea
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              rows={3}
              className="font-mono text-xs text-rose-700 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/80"
              placeholder="Paste terminal error message (e.g., TypeError, NullPointerException, IndexError)..."
            />
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            variant="outline"
            onClick={() => handleLanguageChange(language)}
            className="text-xs font-semibold"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Sample
          </Button>

          <Button
            variant="primary"
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            className="font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Analyze & Explain Bug
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ROOT CAUSE DIAGNOSTICS & FIX CARDS
          ═══════════════════════════════════════════════════════════════ */}
      {debugResult && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Root Cause Diagnostics
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <AlertCircle className="w-3 h-3 text-emerald-500" />
                Bug Identified
              </span>
            </div>
          </div>

          <FixSuggestionCard
            result={debugResult}
            onApplyFix={(fixed) => setCode(fixed)}
          />
        </div>
      )}
    </PageContainer>
  )
}

export default DebuggerPage
