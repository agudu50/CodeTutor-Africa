import React, { useState, memo } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  X,
} from 'lucide-react'

export const ConnectivityBanner: React.FC = memo(() => {
  const {
    effectiveNetwork,
    isSimulatedOffline,
    toggleSimulatedOffline,
    syncWithCloud,
    isSyncing,
    lastSyncedAt,
    capabilities,
  } = useSystemStatus()

  const [isDismissed, setIsDismissed] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [syncToast, setSyncToast] = useState<string | null>(null)

  const isOffline = effectiveNetwork === 'offline'

  const handleSyncClick = async () => {
    const res = await syncWithCloud()
    if (res.success) {
      setSyncToast(`All progress backed up to central database.`)
      setTimeout(() => setSyncToast(null), 3000)
    }
  }

  if (isDismissed) {
    return (
      <div className="px-3 sm:px-6 py-1 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-1.5">
          {isOffline ? (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
              <WifiOff className="w-3 h-3" />
              <span>Offline (Local Mode)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <Wifi className="w-3 h-3" />
              <span>Online (Cloud Synced)</span>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsDismissed(false)}
          className="text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer"
        >
          Show Banner
        </button>
      </div>
    )
  }

  return (
    <div
      className={`border-b transition-colors ${
        isOffline
          ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-slate-800 dark:text-slate-200'
          : 'bg-brand-50/80 dark:bg-brand-950/40 border-brand-200/80 dark:border-brand-900/60 text-slate-800 dark:text-slate-200'
      }`}
    >
      <div className="px-3 sm:px-6 py-2 sm:py-2.5">
        {/* ═══════════════════════════════════════════════════════════════
            MOBILE VIEW (< sm)
            ═══════════════════════════════════════════════════════════════ */}
        <div className="sm:hidden space-y-1.5">
          {/* Top Line: Badges + Dismiss/Expand Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div
                className={`p-1 rounded-md shrink-0 ${
                  isOffline
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    : 'bg-brand-500/20 text-brand-700 dark:text-brand-300'
                }`}
              >
                {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              </div>

              <span
                className={`font-mono text-[11px] font-bold uppercase px-2 py-0.5 rounded-md ${
                  isOffline
                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                }`}
              >
                {isOffline ? 'Offline' : 'Online'}
              </span>

              {isSimulatedOffline && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold">
                  Simulated
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                title={isDetailsOpen ? 'Hide capabilities' : 'View capabilities'}
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Line: Description & Action Button */}
          <div className="flex items-center justify-between gap-2.5">
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug flex-1 min-w-0">
              {isOffline
                ? 'All courses, coding exercises, and the AI Tutor work completely offline.'
                : 'Connected to the internet. Progress is automatically backed up.'}
            </p>

            <div className="shrink-0">
              {!isOffline ? (
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleSyncClick}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleSimulatedOffline}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold cursor-pointer shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Test Online
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            DESKTOP VIEW (>= sm)
            ═══════════════════════════════════════════════════════════════ */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          {/* Left Status Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={`p-1.5 rounded-lg shrink-0 ${
                isOffline
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-800'
              }`}
            >
              {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            </div>

            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span
                className={`font-mono text-xs font-bold uppercase px-2 py-0.5 rounded-md ${
                  isOffline
                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                }`}
              >
                {isOffline ? 'Offline' : 'Online'}
              </span>

              {isSimulatedOffline && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold">
                  Simulated
                </span>
              )}

              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                {isOffline
                  ? 'All courses, coding exercises, and the AI Tutor work completely offline.'
                  : 'Connected to the internet. Progress is automatically backed up.'}
              </p>
            </div>
          </div>

          {/* Right Action Controls for Desktop */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sync Trigger when Online */}
            {!isOffline && (
              <button
                type="button"
                disabled={isSyncing}
                onClick={handleSyncClick}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Progress'}</span>
              </button>
            )}

            {/* Toggle Simulated Mode */}
            <button
              type="button"
              onClick={toggleSimulatedOffline}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer transition-all"
              title="Toggle between online and simulated offline mode"
            >
              {isOffline ? 'Test Online' : 'Test Offline'}
            </button>

            {/* Expand Capability Details */}
            <button
              type="button"
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              title={isDetailsOpen ? 'Hide capabilities' : 'View offline vs online capabilities'}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sync Success Toast Notification */}
      {syncToast && (
        <div className="px-3 sm:px-6 py-1.5 bg-emerald-500 text-white text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{syncToast}</span>
          </div>
          <span className="text-[10px] font-mono opacity-80">
            {lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Just now'}
          </span>
        </div>
      )}

      {/* Expandable Capabilities Breakdown Sheet */}
      {isDetailsOpen && (
        <div className="px-3 sm:px-6 py-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm space-y-2.5 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
              System Capability Matrix (Offline vs Online)
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Current state:{' '}
              <strong className={isOffline ? 'text-amber-600' : 'text-emerald-600'}>
                {isOffline ? 'AIR-GAPPED OFFLINE' : 'CLOUD CONNECTED'}
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {capabilities.map((cap) => {
              const isUsableNow = isOffline ? cap.isAvailableOffline : true

              return (
                <div
                  key={cap.id}
                  className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                    isUsableNow
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : 'bg-slate-50/60 dark:bg-slate-950/60 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {cap.title}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        cap.isAvailableOffline
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800'
                      }`}
                    >
                      {cap.isAvailableOffline ? '100% Offline' : 'Online Only'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                    {cap.description}
                  </p>

                  {cap.offlineFallbackNote && (
                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      {cap.offlineFallbackNote}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
})

ConnectivityBanner.displayName = 'ConnectivityBanner'
