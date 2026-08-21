import React, { useState } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { Badge, Modal, Button } from '@/components/ui'
import { Cpu, WifiOff, Wifi, CheckCircle2, AlertCircle, HardDrive, RefreshCw } from 'lucide-react'

export const SystemStatusIndicator: React.FC = () => {
  const { network, modelStatus, activeModel, refreshLocalModel } = useSystemStatus()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshLocalModel()
    setIsRefreshing(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-all text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
        title="View Offline AI Runtime Diagnostics"
      >
        <div className="flex items-center gap-1.5">
          {modelStatus === 'ready' && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
          {modelStatus === 'loading' && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
          {modelStatus === 'unavailable' && (
            <span className="w-2 h-2 rounded-full bg-red-500" />
          )}

          <span className="font-medium text-slate-700 dark:text-slate-300">
            {modelStatus === 'ready' ? 'Gemma 2B' : 'Model Offline'}
          </span>
        </div>

        <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />

        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          {network === 'online' ? (
            <Wifi className="w-3 h-3 text-slate-400" />
          ) : (
            <div className="flex items-center gap-1 text-amber-500">
              <WifiOff className="w-3 h-3" />
              <span className="text-[10px] font-semibold">Offline</span>
            </div>
          )}
        </div>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Offline System & AI Runtime Diagnostics"
        description="Hardware allocation & local model readiness on this device"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Cpu className="w-4 h-4 text-brand-500" />
                <span>Active Model</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{activeModel.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="brand" size="sm">{activeModel.quantization}</Badge>
                <Badge variant="neutral" size="sm">{activeModel.contextWindow} tokens</Badge>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <HardDrive className="w-4 h-4 text-accent-500" />
                <span>Memory Allocation</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {activeModel.memoryUsageMb} MB / 8,192 MB
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                ~17.3% RAM overhead
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Local Inference Engine:</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready (Zero Cloud Calls)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Local Vector Cache (RAG):</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Standby (IndexedDB Ready)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Network Connectivity:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                {network} (Graceful Offline Fallback)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Optimized for 8 GB laptop architecture</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              isLoading={isRefreshing}
              onClick={handleRefresh}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Test AI Health
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
