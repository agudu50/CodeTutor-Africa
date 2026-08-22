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
    title: 'Interactive AI Coding Tutor',
    description: 'Real-time pedagogical code analysis, error explanation, and concept tutoring.',
    category: 'ai',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: 'Runs via on-device quantized Gemma 2B model with zero internet required.',
  },
  {
    id: 'course-curriculum',
    title: 'Offline Course Library & Lessons',
    description: 'Comprehensive curriculum with theory, interactive diagrams, and assessment quizzes.',
    category: 'core',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: '100% pre-cached locally in IndexedDB/LocalStorage.',
  },
  {
    id: 'code-execution',
    title: 'Browser Code Playground & Debugger',
    description: 'Real-time client-side JavaScript & Python execution environment and step debugger.',
    category: 'core',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: 'Runs in-browser sandbox with zero server latency.',
  },
  {
    id: 'practice-exercises',
    title: 'Algorithm Practice & Test Runner',
    description: 'Hands-on coding challenges with multi-case unit test validation and feedback.',
    category: 'core',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: 'All unit test suites evaluate locally on-device.',
  },
  {
    id: 'support-inquiries',
    title: 'Student Support & Ticket Desk',
    description: 'File curriculum errata or test suite bug reports directly to course instructors.',
    category: 'admin',
    isAvailableOffline: true,
    isAvailableOnline: true,
    offlineFallbackNote: 'Queued locally when offline; automatically synced to instructors when reconnected.',
  },
  {
    id: 'cloud-backup',
    title: 'Automated Cloud Progress Backup',
    description: 'Synchronize learning milestones, streak data, and code practice solutions to the cloud.',
    category: 'sync',
    isAvailableOffline: false,
    isAvailableOnline: true,
    offlineFallbackNote: 'Safely cached locally until connection is restored.',
  },
  {
    id: 'curriculum-patches',
    title: 'Live Errata & Course Patch Downloader',
    description: 'Download new course modules, updated test boundary assertions, and live patch bundles.',
    category: 'sync',
    isAvailableOffline: false,
    isAvailableOnline: true,
    offlineFallbackNote: 'Requires internet to fetch new content packs; existing courses remain 100% available.',
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

  // Real-time browser network event listeners with automated background sync
  useEffect(() => {
    const handleOnline = async () => {
      setNetwork('online')
      recalculatePendingItems()
      // Automatically trigger silent background sync when internet connection is detected
      if (!isSimulatedOffline) {
        setIsSyncing(true)
        const result = await cloudSyncService.performBackgroundSync()
        if (result.success) {
          setLastSyncedAt(result.syncedAt)
          setPendingSyncCount(0)
        }
        setIsSyncing(false)
      }
    }

    const handleOffline = () => {
      setNetwork('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [recalculatePendingItems, isSimulatedOffline])

  const effectiveNetwork: NetworkStatus = isSimulatedOffline ? 'offline' : network

  const toggleSimulatedOffline = useCallback(async () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_SIMULATED_KEY, String(next))
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
