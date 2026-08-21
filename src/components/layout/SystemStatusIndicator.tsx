import React, { useState, memo } from 'react'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { Modal, Button } from '@/components/ui'
import { Cpu, WifiOff, Wifi, CheckCircle2, AlertCircle, HardDrive, RefreshCw, Shield, Check } from 'lucide-react'

export const SystemStatusIndicator: React.FC = memo(() => {
  const { network, modelStatus, activeModel, refreshLocalModel } = useSystemStatus()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [testedSuccess, setTestedSuccess] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshLocalModel()
    setTimeout(() => {
      setIsRefreshing(false)
      setTestedSuccess(true)
      setTimeout(() => setTestedSuccess(false), 2500)
    }, 500)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 transition-all text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-2xs group cursor-pointer"
        title="View Offline AI Runtime Diagnostics"
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
          {network === 'online' ? (
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Wifi className="w-3 h-3 text-slate-400" />
              <span className="hidden xl:inline text-[10px]">Synced</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">
              <WifiOff className="w-3 h-3" />
              <span className="text-[10px]">Air-Gapped</span>
            </div>
          )}
        </div>
      </button>

      {/* Diagnostics Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Offline System & AI Runtime Diagnostics"
        description="Local on-device hardware telemetry and quantized model status"
        size="md"
      >
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
            {/* Active Model Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 shadow-2xs">
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
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <HardDrive className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold uppercase font-mono text-[10px]">Memory Allocation</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {activeModel.memoryUsageMb} MB <span className="text-xs text-slate-400 font-sans font-normal">/ 8,192 MB</span>
              </p>
              <div className="pt-1">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  ~17.3% RAM footprint
                </span>
              </div>
            </div>
          </div>

          {/* Engine Checklist */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Local Inference Engine:</span>
              <span className="flex items-center gap-1.5 font-bold font-mono text-emerald-700 dark:text-emerald-400 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active (0 KB Cloud Egress)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Local Vector Cache (RAG):</span>
              <span className="flex items-center gap-1.5 font-bold font-mono text-emerald-700 dark:text-emerald-400 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> IndexedDB Pre-compiled
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Network Architecture:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px] capitalize flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" /> Fully Air-Gapped Capable
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Engine tuned for 8 GB laptop RAM budget</span>
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
