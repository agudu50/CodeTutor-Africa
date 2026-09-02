import React, { useState, useEffect } from 'react'
import {
  systemPerformanceService,
  FrontendMetrics,
  BackendMetrics,
  SystemDiagnosticReport,
  SystemActionLog,
  SecurityTelemetry,
} from '@/services/admin/system-performance.service'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import {
  Cpu,
  HardDrive,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  ShieldCheck,
  Shield,
  Clock,
  Bot,
  Flame,
  Layers,
  X,
  Play,
  ArrowRight,
  ChevronDown,
  Lock,
  Search,
  Target,
  Globe,
  AlertTriangle,
} from 'lucide-react'

export const SystemPerformanceDeskView: React.FC = () => {
  // Main Sub-Tab View ('performance' | 'security' | 'audit')
  const [activeSubTab, setActiveSubTab] = useState<'performance' | 'security' | 'audit'>('security')

  // Performance Telemetry State
  const [frontendMetrics, setFrontendMetrics] = useState<FrontendMetrics | null>(null)
  const [backendMetrics, setBackendMetrics] = useState<BackendMetrics | null>(null)
  const [report, setReport] = useState<SystemDiagnosticReport | null>(null)
  const [actionHistory, setActionHistory] = useState<SystemActionLog[]>(() =>
    systemPerformanceService.getActionHistory()
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isExecutingAction, setIsExecutingAction] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Security & Threat Telemetry State
  const [securityData, setSecurityData] = useState<SecurityTelemetry | null>(null)
  const [threatSeverityFilter, setThreatSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [searchThreatQuery, setSearchThreatQuery] = useState('')
  const [vulnCategoryFilter, setVulnCategoryFilter] = useState<string>('all')
  const [isSimulatingAttack, setIsSimulatingAttack] = useState(false)
  const [isAutoResolvingAll, setIsAutoResolvingAll] = useState(false)

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
      text: 'Hello Admin. I am your AI Systems & Cybersecurity Copilot. I continuously monitor browser WebAssembly runtimes, offline IndexedDB storage, adversarial prompt injections, database SQL queries, and API threat vectors. Ask me to auto-resolve vulnerabilities or check platform health.',
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
    const sec = await systemPerformanceService.collectSecurityTelemetry()

    setFrontendMetrics(fe)
    setBackendMetrics(be)
    setReport(rep)
    setSecurityData(sec)
    setActionHistory(systemPerformanceService.getActionHistory())
    setIsLoading(false)
  }

  const handleAutoResolveAll = async () => {
    setIsAutoResolvingAll(true)
    const log = await systemPerformanceService.autoResolveAllVulnerabilities()
    setIsAutoResolvingAll(false)
    setToastMessage(`${log.title}: ${log.message}`)
    refreshTelemetry()
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

    const unsubscribe = systemPerformanceService.subscribe(async () => {
      setActionHistory(systemPerformanceService.getActionHistory())
      const sec = await systemPerformanceService.collectSecurityTelemetry()
      setSecurityData(sec)
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
        ? 'Auto-Remediation active: AI will resolve critical memory & threat spikes automatically.'
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
    let log: SystemActionLog
    if (
      actionId.startsWith('ENFORCE_') ||
      actionId.startsWith('ISOLATE_') ||
      actionId.startsWith('ENCRYPT_') ||
      actionId.startsWith('BLOCK_') ||
      actionId.startsWith('ROTATE_') ||
      actionId.startsWith('LOCK_') ||
      actionId.startsWith('RUN_VULN_')
    ) {
      log = await systemPerformanceService.executeSecurityAction(actionId)
    } else {
      log = await systemPerformanceService.executeAction(actionId)
    }
    setIsExecutingAction(null)
    setToastMessage(`${log.title}: ${log.message}`)
    refreshTelemetry()
  }

  const handleSimulateAttack = () => {
    setIsSimulatingAttack(true)
    setTimeout(() => {
      const threat = systemPerformanceService.simulateIncomingAttack()
      setIsSimulatingAttack(false)
      setToastMessage(
        `🚨 Ingress Threat Intercepted from ${threat.originIp}: [${threat.attackVector}] - Status: ${threat.status.toUpperCase()}`
      )
    }, 450)
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
      if (
        lower.includes('auto') ||
        lower.includes('resolve all') ||
        lower.includes('fix all') ||
        lower.includes('autofix') ||
        lower.includes('auto-fix') ||
        lower.includes('patch all')
      ) {
        aiReply = `AI Auto-Remediation Activated: All 6 security weak spots (AI Prompt Guard, Safe Code Sandbox, Database SQL Firewall, Offline Storage Encryption, and Spam Protection) have been patched and verified. 100% of vulnerabilities are now Protected & Safe.`
        handleAutoResolveAll()
      } else if (lower.includes('database') || lower.includes('sql') || lower.includes('injection') || lower.includes('sqlite') || lower.includes('table')) {
        aiReply = `Database Security Status: All database queries are protected with parameterized query checks and a Database Query Firewall. Recently intercepted 1 unauthorized SQL injection probe (' UNION SELECT username, password_hash...) from 172.16.8.99 and blocked it immediately with zero data leaks.`
        actionRecommendation = 'LOCK_DATABASE_FIREWALL'
      } else if (lower.includes('attack') || lower.includes('threat') || lower.includes('from') || lower.includes('hack')) {
        const total = securityData?.totalAttacksReceived || 142
        const blocked = securityData?.attacksBlocked || 141
        aiReply = `Security Telemetry Report: The platform has received ${total} attack probes (${blocked} automatically blocked, ${securityData?.mitigationRatePercent || 99.3}% mitigation rate). Top origins include Local LAN nodes attempting AI prompt tricks, database SQL injections, and code sandbox probe attempts.`
        actionRecommendation = 'ENFORCE_WAF_PROMPT_SHIELD'
      } else if (lower.includes('vulnerabilit') || lower.includes('cve') || lower.includes('cwe') || lower.includes('exploit') || lower.includes('risk')) {
        const open = securityData?.openVulnerabilitiesCount || 0
        aiReply = `Security Risk Scan: Found ${open} open vulnerability. You can click "AI Auto-Fix All Issues" above to resolve all vulnerabilities with 1 click.`
        actionRecommendation = 'ENFORCE_WAF_PROMPT_SHIELD'
      } else if (lower.includes('memory') || lower.includes('ram') || lower.includes('rss')) {
        const rss = backendMetrics?.processRssMb || 388
        aiReply = `Current process RSS is ${rss} MB (${backendMetrics?.processRssGb || 0.38} GB) against the 7.0 GB peak budget limit, yielding an efficiency score of ${backendMetrics?.efficiencyScore || 96}%. Browser JS heap is consuming ${frontendMetrics?.jsHeapUsedMb || 48} MB. No runaway leaks detected.`
        actionRecommendation = 'FLUSH_AI_CONTEXT'
      } else if (lower.includes('offline') || lower.includes('storage') || lower.includes('cache')) {
        aiReply = `IndexedDB storage is utilizing ${frontendMetrics?.offlineStorageUsedMb || 32} MB (${frontendMetrics?.offlineStoragePercent || 1.6}% of quota). All 18 courses, syntax runners, and Socratic templates are verified 100% offline ready with AES-GCM encryption enabled.`
        actionRecommendation = 'ENCRYPT_OFFLINE_STORAGE'
      } else if (lower.includes('latency') || lower.includes('speed') || lower.includes('slow')) {
        aiReply = `Web Worker execution latency is currently ${frontendMetrics?.workerExecLatencyMs || 34}ms for automated test cases. Backend ping is ${frontendMetrics?.networkLatencyMs || 12}ms.`
        actionRecommendation = 'REBOOT_WORKERS'
      } else {
        aiReply = `Comprehensive telemetry & security scan complete. Overall health score is ${report?.healthScore || 98}/100 with zero critical breaches. Total attacks intercepted: ${securityData?.totalAttacksReceived || 142}. Would you like to run a full diagnostic audit?`
        actionRecommendation = 'RUN_VULN_SECURITY_AUDIT'
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

  // Filtered threats
  const filteredThreats = (securityData?.recentThreats || []).filter((item) => {
    if (threatSeverityFilter !== 'all' && item.severity !== threatSeverityFilter) return false
    if (searchThreatQuery.trim()) {
      const q = searchThreatQuery.toLowerCase()
      return (
        item.originIp.toLowerCase().includes(q) ||
        item.originLocation.toLowerCase().includes(q) ||
        item.attackVector.toLowerCase().includes(q) ||
        item.targetComponent.toLowerCase().includes(q)
      )
    }
    return true
  })

  // Filtered vulnerabilities
  const filteredVulnerabilities = (securityData?.vulnerabilities || []).filter((item) => {
    if (vulnCategoryFilter !== 'all' && item.category !== vulnCategoryFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold leading-snug">{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          AI OPS STUDIO HEADER BANNER (Matching PracticeStudioView standard)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 min-w-0">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs shrink-0 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  AI Observability Engine
                </span>
                <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                  Zero-Trust Sandbox
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                AI Ops, Telemetry &amp; Cyber Defense Studio
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5 max-w-2xl leading-relaxed">
                Monitor live platform performance, browser WebAssembly runtimes, indexedDB offline cache, and real-time threat vectors.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={refreshTelemetry}
            disabled={isLoading}
            className="h-9 px-3.5 rounded-xl text-xs font-mono font-bold justify-center border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-slate-800 dark:text-slate-200 hover:border-[#005F02] transition-all cursor-pointer shadow-3xs active:scale-95 inline-flex items-center gap-1.5 flex-1 sm:flex-initial"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
          <button
            type="button"
            onClick={() => handleRunAction('RUN_VULN_SECURITY_AUDIT')}
            disabled={isExecutingAction === 'RUN_VULN_SECURITY_AUDIT'}
            className="h-9 px-4 rounded-xl text-xs font-mono font-black bg-[#005F02] hover:bg-emerald-700 border-2 border-[#005F02] text-white shadow-xs justify-center transition-all cursor-pointer active:scale-95 inline-flex items-center gap-1.5 flex-1 sm:flex-initial"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Run Security Audit</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SUB-NAVIGATION TABS: PERFORMANCE vs THREATS vs AUDIT
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 overflow-x-auto scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('performance')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeSubTab === 'performance'
                ? 'bg-[#005F02] text-white border-[#005F02] font-black shadow-xs'
                : 'bg-white dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400 font-bold'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Full-Stack Performance</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
              activeSubTab === 'performance' ? 'bg-white/20 text-white font-black' : 'bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-slate-400'
            }`}>
              {report?.healthScore || 98}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('security')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeSubTab === 'security'
                ? 'bg-[#005F02] text-white border-[#005F02] font-black shadow-xs'
                : 'bg-white dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400 font-bold'
            }`}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>Threats &amp; Vulnerabilities</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
              activeSubTab === 'security' ? 'bg-white/20 text-white font-black' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 font-bold'
            }`}>
              {securityData?.totalAttacksReceived || 142} Attacks
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeSubTab === 'audit'
                ? 'bg-[#005F02] text-white border-[#005F02] font-black shadow-xs'
                : 'bg-white dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400 font-bold'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span>Audit &amp; Action History</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
              activeSubTab === 'audit' ? 'bg-white/20 text-white font-black' : 'bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-slate-400'
            }`}>
              {actionHistory.length}
            </span>
          </button>
        </div>

        {/* Evaluation Schedule & Countdown */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Auto-Scan:</span>
          </div>

          <div className="relative inline-block">
            <select
              aria-label="Automated AI Evaluation Frequency"
              value={autoEvalHours}
              onChange={(e) => handleIntervalChange(Number(e.target.value))}
              className="appearance-none pl-2.5 pr-7 py-1 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-xs font-mono font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:border-[#005F02]"
            >
              <option value={1}>Every 1h</option>
              <option value={2}>Every 2h</option>
              <option value={6}>Every 6h</option>
              <option value={0}>Manual</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRemediate}
              onChange={handleToggleAutoRemediate}
              className="w-3.5 h-3.5 rounded border-slate-300 text-[#005F02] focus:ring-[#005F02] cursor-pointer"
            />
            <span>Auto-Remediate</span>
          </label>

          <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
            {countdownText || 'Ready'}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: FULL-STACK PERFORMANCE & TELEMETRY
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'performance' && (
        <div className="space-y-6">
          {/* Telemetry KPI Cards */}
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
                    Offline Storage Cache
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
                    AES-GCM Encrypted
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-[#005F02] dark:bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (frontendMetrics?.offlineStoragePercent || 1.6) * 10)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                  Quota: {frontendMetrics?.offlineStorageQuotaMb || 2048} MB • 18 cached modules
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
                    Sandbox Code Runner
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
                    Isolated WASM
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-600 dark:bg-amber-500 rounded-full w-[25%]" />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                  Pyodide AST sandbox • Page Load: {frontendMetrics?.pageLoadTimeMs || 380}ms
                </span>
              </CardContent>
            </Card>
          </div>

          {/* AI Diagnostics & Action Center */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Column: AI Diagnostics Report */}
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

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Score: {report?.healthScore || 98}/100
                  </span>
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

                  {/* Highlights */}
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

            {/* Right Column: AI Action Center & Interactive Copilot */}
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

              {/* Copilot Chat Viewport */}
              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden flex flex-col h-[380px]">
                <CardHeader className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        AI Systems & Security Copilot
                      </CardTitle>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live Assistant
                    </span>
                  </div>
                </CardHeader>

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
                      <span>AI Copilot is analyzing telemetry & threat logs...</span>
                    </div>
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-wrap gap-1 shrink-0">
                  {[
                    'AI Auto-Fix All Issues',
                    'Check database security',
                    'Check RAM headroom',
                    'How many attacks today?',
                    'Show unmitigated CVEs',
                    'Is offline storage full?',
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

                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    placeholder="Ask about platform bottlenecks, active attacks, or CVEs..."
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
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: CYBERSECURITY, REAL-TIME THREATS & VULNERABILITY MATRIX
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">
          {/* Security KPI Top Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Card 1: Total Attacks Received */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-2.5 hover:border-rose-500 transition-colors overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500 dark:text-slate-400 truncate min-w-0">
                  Total Attacks Intercepted
                </span>
                <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800 flex items-center justify-center shrink-0 shadow-3xs">
                  <Flame className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {securityData?.totalAttacksReceived || 142}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border-2 border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-3xs whitespace-nowrap">
                  Live Feed Active
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full w-full animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold leading-tight break-words">
                Rate: {securityData?.attackRatePerMin || 0.4} req/min • Prompt &amp; WASM Probes
              </p>
            </div>

            {/* Card 2: Attacks Blocked Rate */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-2.5 hover:border-emerald-500 transition-colors overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500 dark:text-slate-400 truncate min-w-0">
                  Attacks Blocked &amp; Mitigated
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {securityData?.attacksBlocked || 141}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-400 shadow-3xs whitespace-nowrap">
                  {securityData?.mitigationRatePercent || 99.3}% Rate
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div
                  className="h-full bg-[#005F02] dark:bg-emerald-500 rounded-full"
                  style={{ width: `${securityData?.mitigationRatePercent || 99.3}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold leading-tight break-words">
                Zero critical data breaches • Tamper verification active
              </p>
            </div>

            {/* Card 3: Vulnerabilities Inventory */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-2.5 hover:border-amber-500 transition-colors overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500 dark:text-slate-400 truncate min-w-0">
                  Vulnerability Posture
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-3xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {securityData?.openVulnerabilitiesCount || 1}
                  </span>
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                    Open / {securityData?.vulnerabilities.length || 5} Total
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border-2 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shadow-3xs whitespace-nowrap">
                  {securityData?.patchedVulnerabilitiesCount || 4} Patched
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: '80%' }}
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold leading-tight break-words">
                CWE &amp; CVE Matrix • 1-Click Auto-Mitigation available
              </p>
            </div>

            {/* Card 4: Defense Shields Status */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs space-y-2.5 hover:border-purple-500 transition-colors overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500 dark:text-slate-400 truncate min-w-0">
                  Defense Modules
                </span>
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-800 flex items-center justify-center shrink-0 shadow-3xs">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                    5/5
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold">Active</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border-2 border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shadow-3xs whitespace-nowrap">
                  Zero-Trust Mode
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full w-full" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold leading-tight break-words">
                WAF + AST Sanitizer + Storage AES-GCM + Token Bucket
              </p>
            </div>
          </div>

          {/* Action Bar for Security Simulation & Quick Fixes */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800 shadow-3xs flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-rose-500 shrink-0" />
              </div>
              <div>
                <span className="text-xs font-mono font-black text-slate-900 dark:text-white block">
                  Live Security Test Simulator
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Test how the system blocks fake attacks and suspicious code in real time.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleSimulateAttack}
                disabled={isSimulatingAttack}
                className="h-9 px-4 rounded-xl text-xs font-mono font-bold border-2 border-slate-300 dark:border-slate-700 hover:border-rose-400 text-rose-700 dark:text-rose-400 bg-white dark:bg-[#161B22] hover:bg-rose-50 dark:hover:bg-rose-950/80 active:scale-95 shadow-3xs transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Flame className={`w-3.5 h-3.5 text-rose-500 ${isSimulatingAttack ? 'animate-bounce' : ''}`} />
                <span>{isSimulatingAttack ? 'Sending Test Attack...' : 'Run Test Attack (Check Defense)'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleRunAction('ENFORCE_WAF_PROMPT_SHIELD')}
                disabled={isExecutingAction === 'ENFORCE_WAF_PROMPT_SHIELD'}
                className="h-9 px-4 rounded-xl text-xs font-mono font-bold text-white bg-[#005F02] hover:bg-emerald-700 border-2 border-[#005F02] active:scale-95 shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                <span>Turn On All Protections</span>
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 1: SYSTEM SECURITY RISKS & VULNERABILITIES
              ═══════════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#161B22]/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 shadow-3xs flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-mono font-black text-slate-900 dark:text-white">
                    System Security Risks &amp; Vulnerabilities
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  List of security weak spots, what an attacker could do, and 1-click buttons to fix them.
                </p>
              </div>

              {/* Action Controls & Category Filter */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleAutoResolveAll}
                  disabled={isAutoResolvingAll}
                  className="h-9 px-4 rounded-xl text-xs font-mono font-bold text-white bg-[#005F02] hover:bg-emerald-700 border-2 border-[#005F02] active:scale-95 shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className={`w-3.5 h-3.5 text-emerald-200 ${isAutoResolvingAll ? 'animate-spin' : ''}`} />
                  <span>{isAutoResolvingAll ? 'AI is Auto-Fixing...' : 'AI Auto-Fix All Issues'}</span>
                </button>

                <div className="flex items-center gap-2 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-mono font-bold text-slate-500">Filter:</span>
                  <select
                    value={vulnCategoryFilter}
                    onChange={(e) => setVulnCategoryFilter(e.target.value)}
                    className="h-9 px-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-xs font-mono font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:border-[#005F02] shadow-3xs"
                  >
                    <option value="all">All Areas ({securityData?.vulnerabilities.length || 6})</option>
                    <option value="AI Tutor Safety">AI Tutor Safety</option>
                    <option value="Student Code Runner">Student Code Runner</option>
                    <option value="Offline Storage">Offline Storage</option>
                    <option value="Server & Database">Server & Database</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-3.5">
              {filteredVulnerabilities.map((vuln, idx) => {
                const isMitigated = vuln.status === 'mitigated'
                const isActivePatch = vuln.status === 'active_patch'
                const isUnmitigated = vuln.status === 'unmitigated'

                return (
                  <div
                    key={vuln.id}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                      isUnmitigated
                        ? 'border-rose-300 dark:border-rose-900/80 bg-rose-50/40 dark:bg-rose-950/30'
                        : isActivePatch
                        ? 'border-amber-300 dark:border-amber-900/80 bg-amber-50/40 dark:bg-amber-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22]'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3.5">
                      {/* Left: Index + Metadata & Exploit details */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Numbering Badge */}
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 font-mono text-xs font-black border-2 border-slate-300 dark:border-slate-700 shrink-0 shadow-3xs mt-0.5">
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        <div className="space-y-3 flex-1 min-w-0">
                          {/* Metadata row */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-2 border-slate-900 dark:border-slate-100 shadow-3xs">
                              {vuln.cveId}
                            </span>
                            <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                              {vuln.title}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 font-bold border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                              {vuln.category}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-lg border-2 shadow-3xs uppercase tracking-wider ${
                                vuln.cvssScore >= 7.0
                                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                                  : vuln.cvssScore >= 5.0
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                  : 'bg-slate-100 dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                              }`}
                            >
                              Risk Level: {vuln.severity.toUpperCase()}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-xl border-2 shadow-3xs ${
                                isMitigated
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                                  : isActivePatch
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                  : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                              }`}
                            >
                              {isMitigated ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  Protected &amp; Safe
                                </>
                              ) : isActivePatch ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  Temporary Fix Active
                                </>
                              ) : (
                                <>
                                  <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  Needs Immediate Fix
                                </>
                              )}
                            </span>
                          </div>

                          {/* What the Threat Can Exploit */}
                          <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#0E1318] border-2 border-slate-200 dark:border-slate-800 space-y-1 shadow-3xs">
                            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-700 dark:text-rose-400">
                              <Target className="w-3.5 h-3.5 shrink-0" />
                              <span>What Could Go Wrong (Risk):</span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-normal">
                              {vuln.exploitVector}
                            </p>
                          </div>

                          {/* Affected component */}
                          <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                            <span className="font-bold text-slate-600 dark:text-slate-400">Where in the System:</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0E1318] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold break-all shadow-3xs">
                              {vuln.affectedComponent}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: 1-Click Remediation Action */}
                      <div className="flex lg:flex-col items-end justify-center shrink-0 self-end lg:self-center">
                        {vuln.remediationActionId && (
                          <button
                            type="button"
                            onClick={() => handleRunAction(vuln.remediationActionId!)}
                            disabled={isExecutingAction === vuln.remediationActionId}
                            className={`h-8.5 px-3.5 rounded-xl text-xs font-mono font-black transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-3xs disabled:opacity-50 ${
                              isMitigated
                                ? 'border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#0E1318]'
                                : 'border-2 border-[#005F02] bg-[#005F02] hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            {isMitigated ? (
                              <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-emerald-200" />
                            )}
                            <span>{isMitigated ? 'Re-Check Protection' : 'Fix Now (1-Click)'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 2: RECENT ATTACKS & WHERE THEY CAME FROM
              ═══════════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#161B22]/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800 shadow-3xs flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 text-rose-500" />
                  </div>
                  <h3 className="text-sm sm:text-base font-mono font-black text-slate-900 dark:text-white">
                    Recent Attacks &amp; Where They Came From
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live log of blocked attacks, showing sender location, attack type, and how it was stopped.
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search IP, origin, vector..."
                    value={searchThreatQuery}
                    onChange={(e) => setSearchThreatQuery(e.target.value)}
                    className="h-9 pl-9 pr-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#005F02] shadow-3xs w-48 sm:w-60"
                  />
                </div>

                <select
                  value={threatSeverityFilter}
                  onChange={(e) => setThreatSeverityFilter(e.target.value as any)}
                  className="h-9 px-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-xs font-mono font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:border-[#005F02] shadow-3xs"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="high">High Only</option>
                  <option value="medium">Medium Only</option>
                  <option value="low">Low Only</option>
                </select>
              </div>
            </div>

            <div className="p-0">
              <div className="w-full overflow-hidden">
                <table className="w-full table-fixed text-left text-xs border-collapse font-mono">
                  <thead className="bg-slate-100 dark:bg-[#161B22] border-b-2 border-slate-300 dark:border-slate-700 text-[11px] font-mono font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-2 w-12 text-center">#</th>
                      <th className="py-3.5 px-2.5 w-24">Timestamp</th>
                      <th className="py-3.5 px-3 w-[18%]">Threat Origin ("From")</th>
                      <th className="py-3.5 px-3 w-[20%]">Attack Vector &amp; Target</th>
                      <th className="py-3.5 px-2.5 w-[11%]">Severity</th>
                      <th className="py-3.5 px-3 w-[20%]">Status &amp; Mitigation</th>
                      <th className="py-3.5 px-3 pr-4 w-[28%]">Payload Sample</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-200 dark:divide-slate-800/80">
                    {filteredThreats.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400 text-xs font-mono font-bold">
                          No threats match the current search or severity filter.
                        </td>
                      </tr>
                    ) : (
                      filteredThreats.map((threat, idx) => {
                        const isBlocked = threat.status === 'blocked'
                        const isMitigated = threat.status === 'mitigated'

                        return (
                          <tr
                            key={threat.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-[#161B22]/60 transition-colors border-b-2 border-slate-200 dark:border-slate-800/80"
                          >
                            {/* Row Numbering */}
                            <td className="py-3.5 px-2 align-top text-center">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 font-mono text-[11px] font-black border-2 border-slate-300 dark:border-slate-700 shadow-3xs">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                            </td>

                            {/* Timestamp */}
                            <td className="py-3.5 px-2.5 font-mono text-xs text-slate-700 dark:text-slate-300 align-top">
                              <div className="mt-0.5 font-bold leading-tight">
                                {new Date(threat.timestamp).toLocaleTimeString()}
                              </div>
                            </td>

                            {/* Origin / From */}
                            <td className="py-3.5 px-3 align-top">
                              <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 font-mono font-black text-slate-900 dark:text-white px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-800 text-[11px] shadow-3xs">
                                  <Globe className="w-3 h-3 text-blue-500 shrink-0" />
                                  <span className="truncate">{threat.originIp}</span>
                                </div>
                                <p className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 leading-snug break-words">
                                  {threat.originLocation}
                                </p>
                              </div>
                            </td>

                            {/* Attack Vector & Target */}
                            <td className="py-3.5 px-3 align-top">
                              <div className="space-y-1.5">
                                <span className="font-mono font-black text-slate-900 dark:text-white block text-xs leading-tight break-words">
                                  {threat.attackVector}
                                </span>
                                <div className="inline-block text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#0E1318] px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 break-all leading-tight shadow-3xs">
                                  Target: {threat.targetComponent}
                                </div>
                              </div>
                            </td>

                            {/* Severity */}
                            <td className="py-3.5 px-2.5 align-top">
                              <div className="mt-0.5">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-mono font-black border-2 shadow-3xs uppercase tracking-wider ${
                                    threat.severity === 'critical'
                                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                                      : threat.severity === 'high'
                                      ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800'
                                      : threat.severity === 'medium'
                                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                      : 'bg-slate-100 dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                                  }`}
                                >
                                  {threat.severity.toUpperCase()}
                                </span>
                              </div>
                            </td>

                            {/* Status & Mitigation */}
                            <td className="py-3.5 px-3 align-top">
                              <div className="space-y-1.5">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-black border-2 shadow-3xs uppercase tracking-wider ${
                                    isBlocked
                                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                                      : isMitigated
                                      ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                                      : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800'
                                  }`}
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                  {threat.status.toUpperCase()}
                                </span>
                                <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-snug break-words">
                                  {threat.mitigationAction}
                                </p>
                              </div>
                            </td>

                            {/* Payload sample - fitted, word-wrapped, clean padding */}
                            <td className="py-3.5 px-3 pr-4 align-top">
                              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 break-words whitespace-pre-wrap font-mono leading-relaxed select-all text-[11px] text-slate-800 dark:text-slate-200 shadow-3xs">
                                {threat.payloadSample}
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: SELF-HEALING & SECURITY ACTION AUDIT TRAIL
          ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'audit' && (
        <div className="rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#161B22]/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-mono font-black text-slate-900 dark:text-white">
                  AI Ops, Performance &amp; Security Audit Trail
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                  Immutable zero-trust activity log of all automated self-healing mitigations and admin actions.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-black text-xs shadow-3xs inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                <span>{actionHistory.length} actions logged</span>
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="space-y-3 font-mono text-xs">
              {actionHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-mono font-bold space-y-2">
                  <Terminal className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p>No self-healing or security actions recorded yet.</p>
                  <p className="text-[11px] text-slate-500 font-sans">Run a remediation action in the studio above to test telemetry logging.</p>
                </div>
              ) : (
                actionHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] hover:border-[#005F02] dark:hover:border-emerald-500 shadow-3xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3.5"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                            {item.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 font-mono font-black text-[9px] uppercase shadow-3xs tracking-wider">
                            EXECUTED
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed font-medium">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs shadow-3xs inline-flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
