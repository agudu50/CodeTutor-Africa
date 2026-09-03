import React, { useState, memo } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { Modal } from '@/components/ui'
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
      <div className="space-y-4 pt-1">
        {/* Top Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 w-fit shadow-3xs">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'bg-[#005F02] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            System Status
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#005F02] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            What Works Offline
          </button>
        </div>

        {activeTab === 'status' ? (
          <>
            {/* Network State & Mode Switcher Card */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border-2 space-y-3 shadow-3xs ${
                isOffline
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center border-2 shadow-3xs ${
                      isOffline
                        ? 'bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                        : 'bg-emerald-100 dark:bg-emerald-900/80 text-[#005F02] dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    }`}
                  >
                    {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                        {isOffline ? 'Offline Mode' : 'Connected to Internet'}
                      </span>
                      {isSimulatedOffline && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200 border border-amber-400 dark:border-amber-700 font-black shadow-3xs">
                          Simulated
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-tight mt-1 font-medium">
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
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0E1318] hover:bg-slate-100 dark:hover:bg-[#161B22] text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 hover:border-[#005F02] text-xs font-bold cursor-pointer shadow-3xs active:scale-95 transition-all"
                  >
                    {isOffline ? 'Test Online' : 'Test Offline'}
                  </button>
                  {!isOffline && (
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={handleSync}
                      className="px-4 py-2 rounded-xl bg-[#005F02] hover:bg-[#004e02] border-2 border-[#005F02] text-white text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Sync Progress</span>
                    </button>
                  )}
                </div>
              </div>

              {syncFeedback && (
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/90 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center gap-2 shadow-3xs animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{syncFeedback}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
              {/* AI Assistant Card */}
              <div className="p-4 sm:p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] space-y-2.5 shadow-3xs">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-black uppercase font-mono text-[10px] text-slate-500 dark:text-slate-400">AI Coding Assistant</span>
                </div>
                <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">Built-in AI Assistant</p>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                    Ready to Help
                  </span>
                  <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-3xs">
                    Works Offline
                  </span>
                </div>
              </div>

              {/* Storage Card */}
              <div className="p-4 sm:p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] space-y-2.5 shadow-3xs">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
                    <HardDrive className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-black uppercase font-mono text-[10px] text-slate-500 dark:text-slate-400">Saved Content</span>
                </div>
                <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                  Lessons & Exercises Saved
                </p>
                <div className="pt-0.5">
                  <span className="text-[10px] font-mono font-black text-[#005F02] dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 shadow-3xs inline-block">
                    Saved On Device
                  </span>
                </div>
              </div>
            </div>

            {/* Simple Feature Checklist */}
            <div className="p-4 sm:p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] space-y-3 shadow-3xs">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300 font-bold">AI Coding Tutor:</span>
                <span className="flex items-center gap-1.5 font-black text-[#005F02] dark:text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Ready (No internet)</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300 font-bold">Code Runner:</span>
                <span className="flex items-center gap-1.5 font-black text-[#005F02] dark:text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Python, JS & Java</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5">
                <span className="text-slate-700 dark:text-slate-300 font-bold">Your Progress:</span>
                <span className="font-black text-slate-900 dark:text-white text-xs">
                  {isOffline ? 'Saved on this device' : 'Synced with cloud'}
                </span>
              </div>
            </div>
          </>
        ) : (
          /* Feature Availability Matrix */
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {capabilities.map((cap) => (
                <div
                  key={cap.id}
                  className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] space-y-2 shadow-3xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-xs text-slate-900 dark:text-white truncate">
                      {cap.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg shrink-0 border shadow-3xs ${
                        cap.isAvailableOffline
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                          : 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                      }`}
                    >
                      {cap.isAvailableOffline ? 'Works Offline' : 'Online Feature'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug font-normal">
                    {cap.description}
                  </p>
                  {cap.offlineFallbackNote && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-800 font-mono">
                      {cap.offlineFallbackNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Built to work completely offline anytime, anywhere.</span>
          </div>
          <button
            type="button"
            disabled={isRefreshing}
            onClick={handleRefresh}
            className={`inline-flex items-center gap-1.5 h-10 px-4 text-xs font-bold border-2 rounded-xl shadow-3xs cursor-pointer active:scale-95 transition-all self-start sm:self-center ${
              testedSuccess
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-[#0E1318] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
            }`}
          >
            {testedSuccess ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            )}
            <span>{testedSuccess ? 'AI Assistant Ready ✓' : 'Check AI Status'}</span>
          </button>
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
