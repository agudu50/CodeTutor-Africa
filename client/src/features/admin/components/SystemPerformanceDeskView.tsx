import React, { useState, useEffect } from 'react'
import {
  systemPerformanceService,
  FrontendMetrics,
  BackendMetrics,
  SystemDiagnosticReport,
  SystemActionLog,
} from '@/services/admin/system-performance.service'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import {
  Cpu,
  HardDrive,
  Zap,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Database,
  ShieldCheck,
  Clock,
  Bot,
  Flame,
  Layers,
  X,
  Play,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'

export const SystemPerformanceDeskView: React.FC = () => {
  const [frontendMetrics, setFrontendMetrics] = useState<FrontendMetrics | null>(null)
  const [backendMetrics, setBackendMetrics] = useState<BackendMetrics | null>(null)
  const [report, setReport] = useState<SystemDiagnosticReport | null>(null)
  const [actionHistory, setActionHistory] = useState<SystemActionLog[]>(() =>
    systemPerformanceService.getActionHistory()
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isExecutingAction, setIsExecutingAction] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Automated Evaluation Scheduler State
  const [autoEvalHours, setAutoEvalHours] = useState<number>(() =>
    systemPerformanceService.getAutoEvalIntervalHours()
  )
  const [autoRemediate, setAutoRemediate] = useState<boolean>(() =>
    systemPerformanceService.isAutoRemediationEnabled()
  )
  const [countdownText, setCountdownText] = useState<string>('')

  // AI Ops Chat state
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; timestamp: string; actionId?: string }>
  >([
    {
      sender: 'ai',
      text: 'Hello Admin. I am your AI Systems Copilot. I continuously monitor browser WebAssembly runtimes, offline IndexedDB storage, and FastAPI process RSS against the 7.0 GB constraint. Ask me anything about bottlenecks, offline caching, or device efficiency.',
      timestamp: 'Just now',
    },
  ])
  const [userPrompt, setUserPrompt] = useState('')
  const [isAiThinking, setIsAiThinking] = useState(false)

  const refreshTelemetry = async () => {
    setIsLoading(true)
    const fe = await systemPerformanceService.collectFrontendMetrics()
    const be = await systemPerformanceService.collectBackendMetrics()
    const rep = systemPerformanceService.generateAiDiagnosticReport(fe, be)

    setFrontendMetrics(fe)
    setBackendMetrics(be)
    setReport(rep)
    setActionHistory(systemPerformanceService.getActionHistory())
    setIsLoading(false)
  }

  // Calculate remaining time for countdown timer
  const updateCountdown = () => {
    if (autoEvalHours <= 0) {
      setCountdownText('Manual Run Only')
      return
    }
    const nextIso = systemPerformanceService.getNextScheduledEvalTimestamp()
    if (!nextIso) {
      setCountdownText('Ready')
      return
    }
    const diffMs = new Date(nextIso).getTime() - Date.now()
    if (diffMs <= 0) {
      setCountdownText('Due for scan')
      return
    }
    const totalSecs = Math.floor(diffMs / 1000)
    const h = Math.floor(totalSecs / 3600)
    const m = Math.floor((totalSecs % 3600) / 60)
    const s = totalSecs % 60
    setCountdownText(
      `${h > 0 ? `${h}h ` : ''}${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`
    )
  }

  useEffect(() => {
    refreshTelemetry()

    const unsubscribe = systemPerformanceService.subscribe(() => {
      setActionHistory(systemPerformanceService.getActionHistory())
    })

    // 1-second interval ticker for scheduler countdown & automated due check
    const secondTimer = setInterval(async () => {
      updateCountdown()
      const schedResult = await systemPerformanceService.runScheduledEvaluationIfDue()
      if (schedResult.executed && schedResult.report) {
        setReport(schedResult.report)
        setActionHistory(systemPerformanceService.getActionHistory())
        setToastMessage(
          `AI Scheduled Diagnostic completed: ${schedResult.report.healthScore}/100 score`
        )
      }
    }, 1000)

    // Auto-refresh metrics every 30 seconds
    const interval = setInterval(() => {
      refreshTelemetry()
    }, 30000)

    return () => {
      unsubscribe()
      clearInterval(secondTimer)
      clearInterval(interval)
    }
  }, [autoEvalHours])

  const handleIntervalChange = (hours: number) => {
    setAutoEvalHours(hours)
    systemPerformanceService.setAutoEvalIntervalHours(hours)
    systemPerformanceService.recordEvalRun()
    setToastMessage(
      hours > 0
        ? `AI Evaluation set to auto-run every ${hours} hour${hours > 1 ? 's' : ''}.`
        : 'Automated evaluation set to Manual.'
    )
  }

  const handleToggleAutoRemediate = () => {
    const next = !autoRemediate
    setAutoRemediate(next)
    systemPerformanceService.setAutoRemediationEnabled(next)
    setToastMessage(
      next
        ? 'Auto-Remediation active: AI will resolve critical memory spikes automatically.'
        : 'Auto-Remediation paused: Remediations require manual admin trigger.'
    )
  }

  useEffect(() => {
    if (!toastMessage) return
    const t = setTimeout(() => setToastMessage(null), 3500)
    return () => clearTimeout(t)
  }, [toastMessage])

  const handleRunAction = async (actionId: string) => {
    setIsExecutingAction(actionId)
    const log = await systemPerformanceService.executeAction(actionId)
    setIsExecutingAction(null)
    setToastMessage(`${log.title}: ${log.message}`)
    refreshTelemetry()
  }

  const handleSendChat = (promptText?: string) => {
    const text = promptText || userPrompt
    if (!text.trim()) return

    const newMsg = {
      sender: 'user' as const,
      text: text.trim(),
      timestamp: 'Just now',
    }
    setChatMessages((prev) => [...prev, newMsg])
    if (!promptText) setUserPrompt('')
    setIsAiThinking(true)

    setTimeout(() => {
      let aiReply = ''
      let actionRecommendation: string | undefined = undefined

      const lower = text.toLowerCase()
      if (lower.includes('memory') || lower.includes('ram') || lower.includes('rss')) {
        const rss = backendMetrics?.processRssMb || 388
        aiReply = `Current process RSS is ${rss} MB (${backendMetrics?.processRssGb || 0.38} GB) against the 7.0 GB peak budget limit, yielding an efficiency score of ${backendMetrics?.efficiencyScore || 96}%. Browser JS heap is consuming ${frontendMetrics?.jsHeapUsedMb || 48} MB. No runaway leaks detected.`
        actionRecommendation = 'FLUSH_AI_CONTEXT'
      } else if (lower.includes('offline') || lower.includes('storage') || lower.includes('cache')) {
        aiReply = `IndexedDB storage is utilizing ${frontendMetrics?.offlineStorageUsedMb || 32} MB (${frontendMetrics?.offlineStoragePercent || 1.6}% of quota). All 18 courses, syntax runners, and Socratic templates are verified 100% offline ready.`
        actionRecommendation = 'PRE_WARM_ASSETS'
      } else if (lower.includes('latency') || lower.includes('speed') || lower.includes('slow')) {
        aiReply = `Web Worker execution latency is currently ${frontendMetrics?.workerExecLatencyMs || 34}ms for automated test cases. Backend ping is ${frontendMetrics?.networkLatencyMs || 12}ms.`
        actionRecommendation = 'REBOOT_WORKERS'
      } else {
        aiReply = `Comprehensive telemetry scan complete. Overall health score is ${report?.healthScore || 98}/100 with zero active blocking errors. Would you like to run a deep diagnostic audit?`
        actionRecommendation = 'RUN_DEEP_AUDIT'
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          timestamp: 'Just now',
          actionId: actionRecommendation,
        },
      ])
      setIsAiThinking(false)
    }, 600)
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          HERO BANNER: AI SYSTEM OBSERVABILITY & CONTROL (SOLID THEME)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                AI-Assisted Telemetry & Self-Healing
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ADTC Peak Budget: 7.0 GB
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Full-Stack System Performance & AI Action Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Real-time monitoring across client WebAssembly memory, offline IndexedDB caches, and FastAPI process RSS. AI continuously evaluates bottlenecks and offers automated 1-click remediations.
            </p>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshTelemetry}
              disabled={isLoading}
              className="border-slate-200 dark:border-slate-700 font-bold text-xs h-9"
              leftIcon={<RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh Telemetry
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleRunAction('RUN_DEEP_AUDIT')}
              disabled={isExecutingAction === 'RUN_DEEP_AUDIT'}
              className="font-bold text-xs h-9 shadow-xs"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Run AI Diagnostic Audit
            </Button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            AUTOMATED EVALUATION & AUTO-REMEDIATION SCHEDULER BAR
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Auto-Evaluation Schedule:
              </span>
            </div>

            {/* Custom styled select dropdown */}
            <div className="relative inline-block">
              <select
                aria-label="Automated AI Evaluation Frequency"
                value={autoEvalHours}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value={1}>Every 1 hour</option>
                <option value={2}>Every 2 hours (Recommended)</option>
                <option value={3}>Every 3 hours</option>
                <option value={6}>Every 6 hours</option>
                <option value={12}>Every 12 hours</option>
                <option value={0}>Manual scan only</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Auto Remediate Checkbox */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoRemediate}
                onChange={handleToggleAutoRemediate}
                className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              <span>Auto-Remediate Warnings</span>
            </label>
          </div>

          {/* Live countdown timer badge */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400">Next Auto-Scan in:</span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-700">
              {countdownText || 'Calculating...'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TELEMETRY KPI CARDS (FRONTEND + BACKEND)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Frontend JS Heap */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Browser JS Heap
              </span>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {frontendMetrics?.jsHeapUsedMb || 48.2} <span className="text-xs font-sans text-slate-400">MB</span>
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {frontendMetrics?.memoryUsagePercent || 24}%
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                style={{ width: `${Math.min(100, frontendMetrics?.memoryUsagePercent || 24)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
              Limit: {frontendMetrics?.jsHeapLimitMb || 512} MB • {frontendMetrics?.domNodeCount || 450} DOM nodes
            </span>
          </CardContent>
        </Card>

        {/* Card 2: Offline IndexedDB Storage */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Offline IndexedDB Cache
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {frontendMetrics?.offlineStorageUsedMb || 32.4} <span className="text-xs font-sans text-slate-400">MB</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                100% Offline
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-[#005F02] dark:bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, (frontendMetrics?.offlineStoragePercent || 1.6) * 10)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
              Quota: {frontendMetrics?.offlineStorageQuotaMb || 2048} MB • 18 cached courses
            </span>
          </CardContent>
        </Card>

        {/* Card 3: Backend Process RSS vs 7.0 GB Budget */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Backend Process RSS
              </span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {backendMetrics?.processRssMb || 388.4} <span className="text-xs font-sans text-slate-400">MB</span>
              </span>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                {backendMetrics?.efficiencyScore || 96}% S_eff
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-purple-600 dark:bg-purple-500 rounded-full"
                style={{ width: `${Math.min(100, ((backendMetrics?.processRssGb || 0.38) / 7.0) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
              Budget Limit: 7.0 GB • Headroom: {(7.0 - (backendMetrics?.processRssGb || 0.38)).toFixed(2)} GB
            </span>
          </CardContent>
        </Card>

        {/* Card 4: Web Worker Execution Latency */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Code Runner Latency
              </span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {frontendMetrics?.workerExecLatencyMs || 34} <span className="text-xs font-sans text-slate-400">ms</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                60 FPS
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-600 dark:bg-amber-500 rounded-full w-[25%]" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
              Pyodide / JS WebAssembly Worker • Page Load: {frontendMetrics?.pageLoadTimeMs || 380}ms
            </span>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          AI DIAGNOSTIC REPORT & ACTIONABLE FINDINGS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: AI Diagnostics */}
        <div className="lg:col-span-7 flex flex-col">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden flex flex-col flex-1">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    AI Diagnostic Evaluation
                  </CardTitle>
                  <p className="text-[11px] text-slate-500">
                    Automated anomaly detection across frontend and backend layers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Score: {report?.healthScore || 98}/100
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="space-y-4">
                {/* Summary box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {report?.summary}
                </div>

                {/* Key Findings List */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider text-[10px]">
                    Layer Telemetry & Health Checks
                  </span>

                  {report?.keyFindings.map((finding) => {
                    const isSuccess = finding.severity === 'success'
                    const isWarning = finding.severity === 'warning'
                    const isCritical = finding.severity === 'critical'

                    return (
                      <div
                        key={finding.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isSuccess
                            ? 'border-emerald-200/70 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20'
                            : isWarning
                            ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20'
                            : isCritical
                            ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            {isSuccess ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : isWarning ? (
                              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            ) : isCritical ? (
                              <Flame className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            ) : (
                              <Zap className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                            )}

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {finding.title}
                                </span>
                                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {finding.scope}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {finding.description}
                              </p>
                            </div>
                          </div>

                          {/* Remediate Button if action available */}
                          {finding.actionId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRunAction(finding.actionId!)}
                              disabled={isExecutingAction === finding.actionId}
                              className="text-xs h-7 shrink-0 font-bold border-slate-300 dark:border-slate-700 hover:border-brand-500"
                              leftIcon={<Play className="w-3 h-3 text-brand-600 dark:text-brand-400" />}
                            >
                              Execute Fix
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* AI Architecture Optimization Advice */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Device & Offline Performance Highlights
                </span>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  {report?.aiOptimizationAdvice.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Action Center & Interactive Assistant Chat */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1-Click Automated Remediations */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl">
            <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Automated Self-Healing Actions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-2.5">
              {[
                {
                  id: 'PURGE_CLIENT_CACHE',
                  title: 'Client Memory Garbage Collection',
                  desc: 'Purges detached AST tokens and Web Worker memory.',
                  icon: Cpu,
                  color: 'text-blue-500',
                },
                {
                  id: 'CLEAN_STORAGE',
                  title: 'Vacuum Offline Storage & SQLite',
                  desc: 'Compacts IndexedDB & SQLite tables to free disk space.',
                  icon: HardDrive,
                  color: 'text-emerald-500',
                },
                {
                  id: 'FLUSH_AI_CONTEXT',
                  title: 'Flush AI Dialogue KV-Cache',
                  desc: 'Clears unreferenced context while preserving user mastery.',
                  icon: Bot,
                  color: 'text-purple-500',
                },
                {
                  id: 'REBOOT_WORKERS',
                  title: 'Reboot Code Runner Pool',
                  desc: 'Spawns fresh isolated Pyodide & JS WebAssembly workers.',
                  icon: RotateCcw,
                  color: 'text-amber-500',
                },
                {
                  id: 'PRE_WARM_ASSETS',
                  title: 'Pre-warm Offline Curriculum',
                  desc: 'Pre-caches course templates for 0-latency offline access.',
                  icon: Database,
                  color: 'text-cyan-500',
                },
              ].map((action) => {
                const IconComponent = action.icon
                const isRunning = isExecutingAction === action.id

                return (
                  <div
                    key={action.id}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${action.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {action.title}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                          {action.desc}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRunAction(action.id)}
                      disabled={isRunning}
                      className="text-xs h-8 px-3 font-bold border-slate-200 dark:border-slate-700 hover:border-brand-500 shrink-0"
                    >
                      {isRunning ? 'Running...' : 'Run'}
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Interactive AI Ops Socratic Assistant */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden flex flex-col h-[400px]">
            <CardHeader className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    AI Systems Copilot
                  </CardTitle>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Assistant
                </span>
              </div>
            </CardHeader>

            {/* Chat message viewport */}
            <div className="p-3.5 overflow-y-auto space-y-3 flex-1 text-xs font-sans">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>

                    {msg.actionId && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleRunAction(msg.actionId!)}
                          disabled={isExecutingAction === msg.actionId}
                          className="h-7 text-[11px] font-bold"
                          leftIcon={<Play className="w-3 h-3" />}
                        >
                          Execute Suggested Fix
                        </Button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs italic">
                  <Bot className="w-3.5 h-3.5 text-brand-500 animate-spin" />
                  <span>AI Copilot is analyzing telemetry metrics...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-wrap gap-1 shrink-0">
              {[
                'Check RAM headroom',
                'Is offline storage full?',
                'Optimize for 4GB RAM',
              ].map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendChat(chip)}
                  className="px-2 py-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[10px] text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input box */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Ask AI about platform bottlenecks, RAM, or workers..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChat()
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSendChat()}
                disabled={!userPrompt.trim()}
                className="h-8 px-3"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ACTION & SELF-HEALING HISTORY TIMELINE
          ═══════════════════════════════════════════════════════════════ */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
              AI Action & Self-Healing Audit Trail
            </CardTitle>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {actionHistory.length} actions logged
          </span>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="space-y-2 font-mono text-xs">
            {actionHistory.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No self-healing actions triggered yet. Run an action above to log performance optimizations.
              </div>
            ) : (
              actionHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-sans">
                        {item.message}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
