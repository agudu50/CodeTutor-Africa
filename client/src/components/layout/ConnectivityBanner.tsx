import React, { useState, useEffect, useRef, memo } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { Wifi, WifiOff, X } from 'lucide-react'

export const ConnectivityBanner: React.FC = memo(() => {
  const { effectiveNetwork } = useSystemStatus()

  const [isVisible, setIsVisible] = useState(false)
  const isOffline = effectiveNetwork === 'offline'
  const prevNetworkRef = useRef(effectiveNetwork)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialMount = useRef(true)

  // Show a floating top popup modal when network status changes (offline or online), then auto-hide
  useEffect(() => {
    // Skip on very first load if online, but show if first loaded offline or whenever network transitions
    if (!isInitialMount.current || isOffline) {
      setIsVisible(true)

      if (timerRef.current) clearTimeout(timerRef.current)

      // Auto-hide popup after 4.5 seconds
      timerRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 4500)
    }

    isInitialMount.current = false
    prevNetworkRef.current = effectiveNetwork

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [effectiveNetwork, isOffline])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92vw] sm:w-auto animate-in slide-in-from-top-3 fade-in duration-200 pointer-events-auto">
      <div
        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
          isOffline
            ? 'bg-amber-500/95 dark:bg-amber-950/95 border-amber-300 dark:border-amber-700 text-white shadow-amber-500/10'
            : 'bg-emerald-600/95 dark:bg-emerald-950/95 border-emerald-400 dark:border-emerald-700 text-white shadow-emerald-500/10'
        }`}
      >
        <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0">
          {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
        </div>

        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs leading-tight">
              {isOffline ? "You're Learning Offline" : 'Back Online'}
            </span>
          </div>
          <p className="text-[11px] opacity-90 leading-tight truncate">
            {isOffline
              ? 'No internet needed. Everything works on your device.'
              : 'Connected. Your progress has been backed up.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
          title="Dismiss"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
})

ConnectivityBanner.displayName = 'ConnectivityBanner'
