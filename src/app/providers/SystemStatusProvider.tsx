import React, { createContext, useContext, useEffect, useState } from 'react'
import { AIModelStatus, ModelInfo, NetworkStatus, SystemStatus } from '@/types/system'

interface SystemStatusContextType extends SystemStatus {
  setModelStatus: (status: AIModelStatus) => void
  setNetworkStatus: (status: NetworkStatus) => void
  refreshLocalModel: () => Promise<void>
}

const DEFAULT_LOCAL_MODEL: ModelInfo = {
  name: 'Gemma 2B IT (Local)',
  version: '2.0.1-quantized',
  quantization: 'Q4_K_M',
  memoryUsageMb: 1420,
  contextWindow: 4096,
  isLocal: true,
}

const SystemStatusContext = createContext<SystemStatusContextType | undefined>(undefined)

export const SystemStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<NetworkStatus>(
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online'
  )
  const [modelStatus, setModelStatus] = useState<AIModelStatus>('ready')
  const [activeModel] = useState<ModelInfo>(DEFAULT_LOCAL_MODEL)

  useEffect(() => {
    const handleOnline = () => setNetwork('online')
    const handleOffline = () => setNetwork('offline')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const refreshLocalModel = async () => {
    setModelStatus('loading')
    // Simulate lightweight offline runtime check
    await new Promise((resolve) => setTimeout(resolve, 800))
    setModelStatus('ready')
  }

  return (
    <SystemStatusContext.Provider
      value={{
        network,
        modelStatus,
        activeModel,
        batteryLevel: 85,
        storageRemainingMb: 14500,
        setModelStatus,
        setNetworkStatus: setNetwork,
        refreshLocalModel,
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
