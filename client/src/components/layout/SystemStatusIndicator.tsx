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

export interface SystemStatusModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = memo(({ isOpen, onClose }) => {
  const {
    effectiveNetwork,
    isSimulatedOffline,
    toggleSimulatedOffline,
    refreshLocalModel,
    syncWithCloud,
    isSyncing,
    lastSyncedAt,
    capabilities,
  } = useSystemStatus()

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="System & Connection"
      description="View your connection status and offline tools"
      size="lg"
    >
      <div className="space-y-2.5 sm:space-y-4 pt-1">
        {/* Top Switcher Tabs */}
        <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            System Status
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border space-y-2 sm:space-y-3 ${
                isOffline
                  ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/70'
                  : 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div
                    className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 ${
                      isOffline
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {isOffline ? <WifiOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {isOffline ? 'Offline Mode' : 'Connected to Internet'}
                      </span>
                      {isSimulatedOffline && (
                        <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold">
                          Simulated
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
                      {isOffline
                        ? 'No internet connection needed. Everything works directly on your device.'
                        : `Connected to internet. Last sync: ${lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Recently'}.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={toggleSimulatedOffline}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer shadow-2xs transition-all"
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
                      className="text-xs font-bold h-7 sm:h-8"
                      leftIcon={<RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
                    >
                      Sync Progress
                    </Button>
                  )}
                </div>
              </div>

              {syncFeedback && (
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500 text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{syncFeedback}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-stretch">
              {/* AI Assistant Card */}
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1 sm:space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs">
                  <div className="p-1 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                    <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="font-bold uppercase font-mono text-[9px] sm:text-[10px]">AI Coding Assistant</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">Built-in AI Assistant</p>
                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Ready to Help
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Works Offline
                  </span>
                </div>
              </div>

              {/* Storage Card */}
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1 sm:space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs">
                  <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <HardDrive className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="font-bold uppercase font-mono text-[9px] sm:text-[10px]">Saved Content</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Lessons & Exercises Saved
                </p>
                <div className="pt-0.5">
                  <span className="text-[9px] sm:text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                    Saved On Device
                  </span>
                </div>
              </div>
            </div>

            {/* Simple Feature Checklist */}
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5 sm:space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] sm:text-xs py-0.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-medium">AI Coding Tutor:</span>
                <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-[11px]">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" /> Ready (No internet)
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs py-0.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Code Runner:</span>
                <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-[11px]">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" /> Python, JS & Java
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs py-0.5">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Your Progress:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[10px] sm:text-[11px]">
                  {isOffline ? 'Saved on this device' : 'Synced with cloud'}
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
                      {cap.isAvailableOffline ? 'Works Offline' : 'Online Feature'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {cap.description}
                  </p>
                  {cap.offlineFallbackNote && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
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
            <AlertCircle className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span>Built to work completely offline anytime, anywhere.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            isLoading={isRefreshing}
            onClick={handleRefresh}
            className="h-8 text-xs font-bold border-slate-200 dark:border-slate-700 hover:border-brand-500 self-start sm:self-center"
            leftIcon={testedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <RefreshCw className="w-3.5 h-3.5" />}
          >
            {testedSuccess ? 'AI Assistant Ready ✓' : 'Check AI Status'}
          </Button>
        </div>
      </div>
    </Modal>
  )
})

SystemStatusModal.displayName = 'SystemStatusModal'

export interface SystemStatusIndicatorProps {
  onOpen?: () => void
}

export const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = memo(({ onOpen }) => {
  const { effectiveNetwork } = useSystemStatus()
  const [internalModalOpen, setInternalModalOpen] = useState(false)
  const isOffline = effectiveNetwork === 'offline'

  const handleTrigger = () => {
    if (onOpen) {
      onOpen()
    } else {
      setInternalModalOpen(true)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleTrigger}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-mono font-bold transition-all shadow-3xs cursor-pointer focus:outline-none shrink-0 ${
          isOffline
            ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900'
            : 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-[#005F02] dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900'
        }`}
        title={isOffline ? 'Offline Mode (Click for details)' : 'Online (Click to manage sync)'}
      >
        {isOffline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Offline</span>
            <span className="sm:hidden text-[11px]">Offline</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Online</span>
            <span className="sm:hidden text-[11px]">Online</span>
          </>
        )}
      </button>

      {!onOpen && (
        <SystemStatusModal
          isOpen={internalModalOpen}
          onClose={() => setInternalModalOpen(false)}
        />
      )}
    </>
  )
})

SystemStatusIndicator.displayName = 'SystemStatusIndicator'
