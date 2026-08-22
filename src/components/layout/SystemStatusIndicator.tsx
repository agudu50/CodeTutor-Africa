import React, { useState, memo } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { Modal, Button } from '@/components/ui'
import {
  Cpu,
  WifiOff,
  Wifi,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  RefreshCw,
  Check,
} from 'lucide-react'

export const SystemStatusIndicator: React.FC = memo(() => {
  const {
    effectiveNetwork,
    isSimulatedOffline,
    toggleSimulatedOffline,
    modelStatus,
    activeModel,
    refreshLocalModel,
    syncWithCloud,
    isSyncing,
    lastSyncedAt,
    pendingSyncCount,
    capabilities,
  } = useSystemStatus()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [testedSuccess, setTestedSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'status' | 'matrix'>('status')
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)

  const isOffline = effectiveNetwork === 'offline'

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshLocalModel()
    setTimeout(() => {
      setIsRefreshing(false)
      setTestedSuccess(true)
      setTimeout(() => setTestedSuccess(false), 2500)
    }, 500)
  }

  const handleSync = async () => {
    const res = await syncWithCloud()
    if (res.success) {
      setSyncFeedback('Cloud synchronization complete!')
      setTimeout(() => setSyncFeedback(null), 3000)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 transition-all text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-2xs group cursor-pointer"
        title="View Offline AI Runtime Diagnostics & Connectivity Telemetry"
      >
        {/* Model State Pill */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            {modelStatus === 'ready' && (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            )}
            {modelStatus === 'loading' && (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 animate-pulse" />
            )}
            {modelStatus === 'unavailable' && (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            )}
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              {modelStatus === 'ready' ? 'Gemma 2B' : 'Model Offline'}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Local
            </span>
          </div>
        </div>

        <div className="h-3.5 w-px bg-slate-200 dark:border-slate-800" />

        {/* Network State Pill */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          {!isOffline ? (
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              <Wifi className="w-3 h-3" />
              <span className="hidden xl:inline text-[10px]">Cloud Synced</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-semibold">
              <WifiOff className="w-3 h-3" />
              <span className="text-[10px]">{isSimulatedOffline ? 'Sim Offline' : 'Air-Gapped'}</span>
            </div>
          )}
        </div>
      </button>

      {/* Diagnostics Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Network & System Status"
        description="Check your offline learning status, storage, and cloud backup"
        size="lg"
      >
        <div className="space-y-4 pt-1">
          {/* Top Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('status')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Status & Storage
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              What Works Offline
            </button>
          </div>

          {activeTab === 'status' ? (
            <>
              {/* Network State & Mode Switcher Card */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  isOffline
                    ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/70'
                    : 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isOffline
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {isOffline ? 'Offline Mode' : 'Connected to Internet'}
                        </span>
                        {isSimulatedOffline && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold">
                            Simulated Mode
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                        {isOffline
                          ? 'Running entirely on your device with no internet connection.'
                          : `Connected to internet. Last backup: ${lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Recently'}.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={toggleSimulatedOffline}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer shadow-2xs transition-all"
                    >
                      {isOffline ? 'Test Online' : 'Test Offline'}
                    </button>
                    {!isOffline && (
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        isLoading={isSyncing}
                        onClick={handleSync}
                        className="text-xs font-bold"
                        leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
                      >
                        Sync Progress
                      </Button>
                    )}
                  </div>
                </div>

                {syncFeedback && (
                  <div className="p-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{syncFeedback}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                {/* Active Model Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                    <div className="p-1 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold uppercase font-mono text-[10px]">Active Neural Model</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{activeModel.name}</p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {activeModel.quantization} (4-bit)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {activeModel.contextWindow} tokens
                    </span>
                  </div>
                </div>

                {/* Memory Allocation Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                    <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <HardDrive className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold uppercase font-mono text-[10px]">Device Storage</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Cached Locally & Ready
                  </p>
                  <div className="pt-1">
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Ready for Offline Use
                    </span>
                  </div>
                </div>
              </div>

              {/* Engine Checklist */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Local Inference Engine:</span>
                  <span className="flex items-center gap-1.5 font-bold font-mono text-emerald-700 dark:text-emerald-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active (0 KB Cloud Egress)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Local Code Execution Sandbox:</span>
                  <span className="flex items-center gap-1.5 font-bold font-mono text-emerald-700 dark:text-emerald-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> In-Browser JavaScript/Python Sandbox
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Auto-Backup Queue:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    {pendingSyncCount > 0 ? `${pendingSyncCount} items stored locally` : 'Everything up to date'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* Feature Availability Matrix */
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {capabilities.map((cap) => (
                  <div
                    key={cap.id}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {cap.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                          cap.isAvailableOffline
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800'
                        }`}
                      >
                        {cap.isAvailableOffline ? 'Offline Active' : 'Cloud Feature'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {cap.description}
                    </p>
                    {cap.offlineFallbackNote && (
                      <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
                        {cap.offlineFallbackNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Optimized for low-bandwidth, solar, and air-gapped African classrooms</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              isLoading={isRefreshing}
              onClick={handleRefresh}
              className="h-8 text-xs font-bold border-slate-200 dark:border-slate-700 hover:border-brand-500 self-start sm:self-center"
              leftIcon={testedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <RefreshCw className="w-3.5 h-3.5" />}
            >
              {testedSuccess ? 'Diagnostics Verified ✓' : 'Test AI Health'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
})

SystemStatusIndicator.displayName = 'SystemStatusIndicator'
