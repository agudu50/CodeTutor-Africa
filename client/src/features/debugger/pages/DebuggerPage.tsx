import React, { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import {
  SAMPLE_BUGGY_SNIPPETS,
  SAMPLE_ERROR_MESSAGES,
  MOCK_DEBUG_RESULTS_BY_LANGUAGE,
} from '../data/mockDebuggerData'
import { aiService } from '@/services/ai/ai.service'
import { FixSuggestionCard } from '../components/FixSuggestionCard'
import { Button, Dropdown } from '@/components/ui'
import {
  Bug,
  Zap,
  Shield,
  Terminal,
  Code2,
  BookOpen,
  Gamepad2,
  ChevronRight,
  Cpu,
} from 'lucide-react'
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
  const fileExt = language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'java'

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80">
              <Bug className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Offline Socratic Debugger
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Inspect, trace, and diagnose runtime exceptions and logic traps across Python, JavaScript, and Java without cloud connection.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-[#005F02] bg-[#005F02]/10 border border-[#005F02]/30">
            <Shield className="w-3.5 h-3.5" /> 100% Offline AI
          </span>
          <div className="w-full sm:w-48">
            <Dropdown
              options={[
                { value: 'javascript', label: 'JavaScript' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'python', label: 'Python' },
                { value: 'java', label: 'Java' },
              ]}
              value={language}
              onChange={handleLanguageChange}
              className="text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MULTI-LANGUAGE PRESET CHIPS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pl-1">
          Sample Bugs:
        </span>
        <button
          type="button"
          onClick={() => handleSelectPreset('javascript')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
            language === 'javascript'
              ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#005F02]'
          }`}
        >
          <span className="text-[#ffd700] mr-1">JS:</span> Async Race Condition
        </button>
        <button
          type="button"
          onClick={() => handleSelectPreset('java')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
            language === 'java'
              ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#005F02]'
          }`}
        >
          <span className="text-[#e06c75] mr-1">Java:</span> Array Bounds Exceeded
        </button>
        <button
          type="button"
          onClick={() => handleSelectPreset('python')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
            language === 'python'
              ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#005F02]'
          }`}
        >
          <span className="text-[#4ec9b0] mr-1">Python:</span> Off-by-One Loop Error
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          VS CODE DEBUGGER IDE & TERMINAL WORKSPACE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-slate-700/80 bg-[#1E1E1E] shadow-2xl overflow-hidden text-slate-200 font-mono text-xs flex flex-col select-none">
        {/* VS Code Window Titlebar */}
        <div className="h-9 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block shadow-xs" />
          </div>

          <div className="flex-1 max-w-sm mx-auto flex items-center justify-center">
            <div className="w-full h-6 px-3 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-[11px] text-slate-400 flex items-center justify-center gap-2 truncate shadow-inner">
              <span className="text-slate-500">🔍</span>
              <span className="truncate text-slate-300">debug-workspace — bug_sample.{fileExt} (CodeTutor IDE)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setCode('')
                setErrorMessage('')
              }}
              className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-[#333333] transition-colors cursor-pointer"
            >
              Clear Workspace
            </button>
          </div>
        </div>

        {/* IDE Split Body (Activity Bar + Code Editor + Integrated Terminal) */}
        <div className="flex flex-1 min-h-[360px] overflow-hidden">
          {/* Left: Activity Bar */}
          <div className="w-10 bg-[#181818] border-r border-[#2D2D2D] flex flex-col items-center justify-between py-2 shrink-0 text-slate-400">
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="p-1.5 hover:text-white cursor-pointer" title="Explorer">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div className="p-1.5 hover:text-white cursor-pointer" title="Search">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <div className="relative p-1.5 text-white border-l-2 border-[#005F02] w-full flex justify-center cursor-pointer" title="Run & Debug">
                <Bug className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="p-1.5 hover:text-white cursor-pointer" title="Arcade Drills">
                <Gamepad2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-1.5 text-slate-500 hover:text-slate-300 cursor-pointer">
              <Cpu className="w-3.5 h-3.5 text-[#005F02]" />
            </div>
          </div>

          {/* Right: Code Canvas & Terminal Stack */}
          <div className="flex flex-col flex-1 min-w-0 bg-[#1E1E1E]">
            {/* Tab Bar */}
            <div className="h-9 px-2 bg-[#181818] border-b border-[#252526] flex items-center justify-between shrink-0">
              <div className="flex items-center h-full">
                <div className="h-full px-3 bg-[#1E1E1E] border-t-2 border-t-[#005F02] text-xs font-mono font-medium text-slate-100 flex items-center gap-2 border-r border-[#252526]">
                  <Code2 className="w-3.5 h-3.5 text-[#005F02] shrink-0" />
                  <span className="font-semibold truncate">bug_sample.{fileExt}</span>
                  <span className="text-[10px] text-slate-500 hover:text-white ml-1">×</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 pr-2">
                <span>{lineCount} lines</span>
              </div>
            </div>

            {/* Breadcrumb Bar */}
            <div className="h-6 px-3 bg-[#1E1E1E] border-b border-[#252526] flex items-center gap-1.5 text-[11px] text-slate-500 font-mono shrink-0">
              <span>workspace</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span>src</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-300 font-semibold">bug_sample.{fileExt}</span>
            </div>

            {/* Editor Canvas (Gutter + Textarea) */}
            <div className="flex-1 min-h-[160px] flex overflow-hidden relative bg-[#1E1E1E]">
              {/* Line Numbers Gutter */}
              <div className="w-9 sm:w-11 py-3 bg-[#1E1E1E] border-r border-[#2d2d2d] text-right pr-2 sm:pr-2.5 select-none text-[12px] font-mono text-[#858585] leading-6 shrink-0">
                {Array.from({ length: Math.max(lineCount, 8) }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 p-3 bg-transparent text-[#D4D4D4] font-mono text-xs sm:text-[13px] leading-6 resize-none focus:outline-none placeholder:text-slate-600 whitespace-pre overflow-y-auto selection:bg-[#005F02]/40"
                placeholder="// Paste your buggy code snippet here..."
              />
            </div>

            {/* ═══════════════════════════════════════════════════════════
                INTEGRATED VS CODE TERMINAL (FOR RUNTIME STACK TRACES)
                ═══════════════════════════════════════════════════════════ */}
            <div className="border-t border-[#2D2D2D] bg-[#181818] flex flex-col shrink-0">
              <div className="h-7 px-3 bg-[#1F1F1F] border-b border-[#282828] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold flex items-center gap-1.5 border-b-2 border-[#005F02] pb-0.5">
                    <Terminal className="w-3 h-3 text-[#005F02]" />
                    <span>TERMINAL / STACK TRACE</span>
                  </span>
                  <span className="text-slate-500 text-[10px]">DEBUG CONSOLE</span>
                  <span className="text-slate-500 text-[10px]">OUTPUT</span>
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  Optional Crash Log
                </span>
              </div>

              <div className="p-3 bg-[#181818]">
                <textarea
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                  rows={3}
                  spellCheck={false}
                  className="w-full bg-transparent font-mono text-xs text-rose-400 placeholder:text-slate-600 focus:outline-none leading-relaxed resize-none selection:bg-rose-900/50"
                  placeholder="Paste terminal error message or stack trace (e.g., TypeError, NullPointerException, IndexError)..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* VS Code Bottom Status Bar (#005F02) */}
        <div className="h-6 px-3 bg-[#005F02] text-white flex items-center justify-between text-[10px] font-mono shrink-0 select-none">
          <div className="flex items-center gap-3">
            <span className="font-bold">main*</span>
            <span>0 ⨂ 0 ⚠</span>
            <span className="hidden sm:inline">Offline Debugger Ready</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Spaces: 4</span>
            <span>UTF-8</span>
            <span className="font-bold uppercase">{language}</span>
            <span className="bg-white/20 px-1.5 py-0.2 rounded font-bold">100% OFFLINE</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ANALYZE ACTION BUTTON
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={handleAnalyze}
          isLoading={isAnalyzing}
          disabled={!code.trim()}
          className="font-bold text-sm bg-[#005F02] hover:bg-[#004e02] text-white shadow-md shadow-[#005F02]/20 px-8 py-3 rounded-2xl cursor-pointer"
          leftIcon={<Zap className="w-4 h-4 text-white" />}
        >
          {isAnalyzing ? 'Analyzing Root Cause Offline...' : 'Diagnose & Suggest Fix with AI'}
        </Button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          AI SOCRATIC FIX SUGGESTION REPORT
          ═══════════════════════════════════════════════════════════════ */}
      {debugResult && (
        <div className="space-y-4 pt-2">
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
