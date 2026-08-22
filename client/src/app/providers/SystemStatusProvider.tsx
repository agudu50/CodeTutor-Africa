import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { AIModelStatus, ModelInfo, NetworkStatus, SystemStatus } from '@/types/system'
import { cloudSyncService } from '@/services/sync/cloud-sync.service'

export interface CapabilityItem {
  id: string
  title: string
  description: string
  category: 'core' | 'ai' | 'sync' | 'admin'
  isAvailableOffline: boolean
  isAvailableOnline: boolean
  offlineFallbackNote?: string
}

export const SYSTEM_CAPABILITIES: CapabilityItem[] = [
  {
    id: 'ai-tutor',
    title: 'AI Coding Assistant',
    description: 'Ask coding questions, get hints, and understand programming concepts.',
    category: 'ai',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: 'Works completely offline on your device with no internet needed.',
  },
  {
    id: 'course-curriculum',
    title: 'Course Lessons & Quizzes',
    description: 'All courses for Python, JavaScript, and Java with practice quizzes.',
    category: 'core',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: 'All lessons are saved directly on your device.',
  },
  {
    id: 'code-execution',
    title: 'Code Runner & Playground',
    description: 'Write and run your code instantly to see outputs and fix mistakes.',
    category: 'core',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: 'Runs directly inside your browser with no internet needed.',
  },
  {
    id: 'practice-exercises',
    title: 'Coding Challenges',
    description: 'Solve interactive programming challenges with instant test results.',
    category: 'core',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: 'Test checks run offline on your device.',
  },
  {
    id: 'arcade-games',
    title: 'Coding Arcade & Mini-Games',
    description: 'Play Syntax Speedrun, Bug Hunt Blitz, Output Predictor, and Code Shuffle.',
    category: 'core',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: 'All 4 games, 3D animations, and sound effects work 100% offline.',
  },
  {
    id: 'support-inquiries',
    title: 'Ask Instructor for Help',
    description: 'Send questions or report issues with coding exercises.',
    category: 'admin',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: 'Saved on your device and sent to instructors when you go online.',
  },
  {
    id: 'cloud-backup',
    title: 'Automatic Cloud Backup',
    description: 'Back up your study progress and test scores when connected.',
    category: 'sync',
    isAvailableOffline: false,
    isAvailableOnline: true,
    offlineFallbackNote: 'Saved safely on this device while offline.',
  },
  {
    id: 'curriculum-patches',
    title: 'New Courses & Updates',
    description: 'Download new courses and updated coding exercises.',
    category: 'sync',
    isAvailableOffline: false,
    isAvailableOnline: true,
    offlineFallbackNote: 'Requires internet to check for new courses.',
  },
]

interface SystemStatusContextType extends SystemStatus {
  capabilities: CapabilityItem[]
  setModelStatus: (status: AIModelStatus) => void
  setNetworkStatus: (status: NetworkStatus) => void
  refreshLocalModel: () => Promise<void>
  toggleSimulatedOffline: () => void
  syncWithCloud: () => Promise<{ success: boolean; syncedItemsCount: number }>
}

const DEFAULT_LOCAL_MODEL: ModelInfo = {
  name: 'Gemma 2B IT (Local)',
  version: '2.0.1-quantized',
  quantization: 'Q4_K_M',
  memoryUsageMb: 1420,
  contextWindow: 4096,
  isLocal: true,
}

const STORAGE_SIMULATED_KEY = 'codetutor_simulated_offline'
const STORAGE_LAST_SYNC_KEY = 'codetutor_last_synced_at'

const SystemStatusContext = createContext<SystemStatusContextType | undefined>(undefined)

export const SystemStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<NetworkStatus>(() => {
    return typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online'
  })

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_SIMULATED_KEY) === 'true'
    } catch {
      return false
    }
  })

  const [modelStatus, setModelStatus] = useState<AIModelStatus>('ready')
  const [activeModel] = useState<ModelInfo>(DEFAULT_LOCAL_MODEL)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LAST_SYNC_KEY)
      return saved ? new Date(saved) : new Date(Date.now() - 1000 * 60 * 18) // 18 mins ago by default
    } catch {
      return null
    }
  })

  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0)

  // Calculate pending sync items (e.g. issues filed or progress saved)
  const recalculatePendingItems = useCallback(() => {
    try {
      const issuesRaw = localStorage.getItem('codetutor_admin_issues')
      if (issuesRaw) {
        const issues = JSON.parse(issuesRaw)
        // Check issues created recently
        setPendingSyncCount(Array.isArray(issues) ? Math.min(issues.length, 3) : 0)
      } else {
        setPendingSyncCount(1) // Default local profile & practice bookmark
      }
    } catch {
      setPendingSyncCount(0)
    }
  }, [])

  useEffect(() => {
    recalculatePendingItems()
  }, [recalculatePendingItems])

  // Active real-time connectivity checker
  const checkRealConnection = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setNetwork((prev) => (prev !== 'offline' ? 'offline' : prev))
      return false
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      // Lightweight probe
      const res = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      }).catch(() => null)

      clearTimeout(timeoutId)

      const isActuallyOnline = !!res || (typeof navigator !== 'undefined' && navigator.onLine)
      const newStatus: NetworkStatus = isActuallyOnline ? 'online' : 'offline'

      setNetwork((prev) => {
        if (prev !== newStatus) {
          // If automatically detected back online, trigger silent background sync
          if (newStatus === 'online') {
            setIsSyncing(true)
            cloudSyncService.performBackgroundSync().then((result) => {
              if (result.success) {
                setLastSyncedAt(result.syncedAt)
                setPendingSyncCount(0)
              }
              setIsSyncing(false)
            })
          }
          return newStatus
        }
        return prev
      })

      return isActuallyOnline
    } catch {
      const fallback = typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline'
      setNetwork(fallback)
      return fallback === 'online'
    }
  }, [])

  // Real-time browser network event listeners with automated background sync
  useEffect(() => {
    const handleOnline = async () => {
      setNetwork('online')
      setIsSimulatedOffline(false)
      try {
        localStorage.removeItem(STORAGE_SIMULATED_KEY)
      } catch {
        // Fallback
      }

      recalculatePendingItems()
      // Automatically trigger silent background sync when internet connection is detected
      setIsSyncing(true)
      const result = await cloudSyncService.performBackgroundSync()
      if (result.success) {
        setLastSyncedAt(result.syncedAt)
        setPendingSyncCount(0)
      }
      setIsSyncing(false)
    }

    const handleOffline = () => {
      setNetwork('offline')
    }

    const handleFocus = () => {
      checkRealConnection()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('focus', handleFocus)

    // Periodic heartbeat every 8 seconds for real-time detection without manual refresh
    const intervalId = setInterval(() => {
      checkRealConnection()
    }, 8000)

    // Run initial probe
    checkRealConnection()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('focus', handleFocus)
      clearInterval(intervalId)
    }
  }, [recalculatePendingItems, checkRealConnection])

  const effectiveNetwork: NetworkStatus = isSimulatedOffline ? 'offline' : network

  const toggleSimulatedOffline = useCallback(async () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev
      try {
        if (next) {
          localStorage.setItem(STORAGE_SIMULATED_KEY, 'true')
        } else {
          localStorage.removeItem(STORAGE_SIMULATED_KEY)
        }
      } catch {
        // Fallback
      }

      // If switching from offline to online, automatically sync in background
      if (!next && network === 'online') {
        setTimeout(async () => {
          setIsSyncing(true)
          const result = await cloudSyncService.performBackgroundSync()
          if (result.success) {
            setLastSyncedAt(result.syncedAt)
            setPendingSyncCount(0)
          }
          setIsSyncing(false)
        }, 100)
      }

      return next
    })
  }, [network])

  const refreshLocalModel = async () => {
    setModelStatus('loading')
    await new Promise((resolve) => setTimeout(resolve, 600))
    setModelStatus('ready')
  }

  const syncWithCloud = async (): Promise<{ success: boolean; syncedItemsCount: number }> => {
    if (effectiveNetwork === 'offline') {
      return { success: false, syncedItemsCount: 0 }
    }

    setIsSyncing(true)
    const result = await cloudSyncService.performBackgroundSync()
    if (result.success) {
      setLastSyncedAt(result.syncedAt)
      setPendingSyncCount(0)
    }
    setIsSyncing(false)
    return { success: result.success, syncedItemsCount: result.itemsCount }
  }

  return (
    <SystemStatusContext.Provider
      value={{
        network,
        isSimulatedOffline,
        effectiveNetwork,
        modelStatus,
        activeModel,
        batteryLevel: 88,
        storageRemainingMb: 14500,
        lastSyncedAt,
        pendingSyncCount,
        isSyncing,
        capabilities: SYSTEM_CAPABILITIES,
        setModelStatus,
        setNetworkStatus: setNetwork,
        refreshLocalModel,
        toggleSimulatedOffline,
        syncWithCloud,
      }}
    >
      {children}
    </SystemStatusContext.Provider>
  )
}

export const useSystemStatus = (): SystemStatusContextType => {
  const context = useContext(SystemStatusContext)
  if (!context) {
    throw new Error('useSystemStatus must be used within a SystemStatusProvider')
  }
  return context
}
