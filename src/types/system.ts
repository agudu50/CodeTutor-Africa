export type NetworkStatus = 'online' | 'offline'

export type AIModelStatus = 'ready' | 'loading' | 'offline' | 'unavailable' | 'downloading'

export interface ModelInfo {
  name: string
  version: string
  quantization: string
  memoryUsageMb: number
  contextWindow: number
  isLocal: boolean
}

export interface SystemStatus {
  network: NetworkStatus
  modelStatus: AIModelStatus
  activeModel: ModelInfo
  batteryLevel?: number
  storageRemainingMb?: number
}
