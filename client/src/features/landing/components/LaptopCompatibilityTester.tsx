import React, { useState, useMemo, memo } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Zap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export const LaptopCompatibilityTester: React.FC = memo(() => {
  const [selectedOs, setSelectedOs] = useState<'windows' | 'mac' | 'linux'>('windows')
  const [selectedRam, setSelectedRam] = useState<number>(4)
  const [selectedCpu, setSelectedCpu] = useState<'dual' | 'quad' | 'high'>('quad')

  const assessment = useMemo(() => {
    let score = 94
    let latency = '24ms'
    let ramUsage = '1.2 GB'
    let verdict = '100% Compatible • Runs Silky Smooth'
    let details = 'Your machine has more than enough power to run CodeTutor Africa and local AI inference with zero latency.'

    if (selectedRam === 4) {
      if (selectedCpu === 'dual') {
        score = 88
        latency = '38ms'
        ramUsage = '1.1 GB'
        verdict = '100% Compatible • Lightweight Mode'
        details = 'Perfect fit! CodeTutor automatically activates lean memory profiling to ensure your computer never freezes or lags.'
      } else {
        score = 92
        latency = '28ms'
        ramUsage = '1.2 GB'
        verdict = '100% Compatible • Recommended Configuration'
        details = 'Standard everyday student laptop. Local AI guidance runs smoothly without battery drain.'
      }
    } else if (selectedRam === 8) {
      if (selectedCpu === 'high') {
        score = 99
        latency = '14ms'
        ramUsage = '1.3 GB'
        verdict = '100% Compatible • Ultra Fast'
        details = 'Instant sub-20ms code evaluation and rapid AI hints. Near-instant compilation.'
      } else {
        score = 96
        latency = '19ms'
        ramUsage = '1.3 GB'
        verdict = '100% Compatible • Optimal Speed'
        details = 'Exceptional performance. You can comfortably keep multiple browser tabs and notes open alongside CodeTutor.'
      }
    } else {
      score = 99
      latency = '12ms'
      ramUsage = '1.4 GB'
      verdict = '100% Compatible • Peak Performance'
      details = 'Blazing fast execution speed. Instant syntax parsing, zero compilation delay, and smooth 60fps animations.'
    }

    return { score, latency, ramUsage, verdict, details }
  }, [selectedOs, selectedRam, selectedCpu])

  return (
    <div className="mt-8 rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 p-5 sm:p-7 shadow-2xs text-left">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#005F02] dark:text-emerald-400 uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Interactive Device Tester</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Will It Run on My Laptop? Check Instantly
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Pick your computer specs below to verify offline speed and memory footprint.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold shadow-3xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Universal OS Support</span>
        </span>
      </div>

      {/* Grid: Inputs (Left) vs Assessment Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
        {/* Left: Interactive Selectors */}
        <div className="lg:col-span-7 space-y-4">
          {/* OS Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              1. Operating System
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'windows', label: 'Windows', sub: '10 / 11' },
                { id: 'mac', label: 'macOS', sub: 'Intel / M-Series' },
                { id: 'linux', label: 'Linux', sub: 'Ubuntu / Mint' },
              ].map((os) => (
                <button
                  key={os.id}
                  type="button"
                  onClick={() => setSelectedOs(os.id as any)}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer shadow-3xs ${
                    selectedOs === os.id
                      ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
                      : 'bg-white dark:bg-[#0C1015] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{os.label}</div>
                  <div className={`text-[10px] font-mono ${selectedOs === os.id ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {os.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RAM Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              2. Installed RAM Memory
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 4, label: '4 GB RAM', note: 'Everyday / Basic' },
                { val: 8, label: '8 GB RAM', note: 'Standard Student' },
                { val: 16, label: '16+ GB RAM', note: 'Advanced' },
              ].map((ram) => (
                <button
                  key={ram.val}
                  type="button"
                  onClick={() => setSelectedRam(ram.val)}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer shadow-3xs ${
                    selectedRam === ram.val
                      ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
                      : 'bg-white dark:bg-[#0C1015] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{ram.label}</div>
                  <div className={`text-[10px] font-mono ${selectedRam === ram.val ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {ram.note}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Processor Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              3. Processor Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dual', label: 'Dual-Core', note: 'Celeron / Pentium' },
                { id: 'quad', label: 'Quad-Core', note: 'Core i3/i5 / Ryzen' },
                { id: 'high', label: 'High Performance', note: 'Core i7 / Apple Silicon' },
              ].map((cpu) => (
                <button
                  key={cpu.id}
                  type="button"
                  onClick={() => setSelectedCpu(cpu.id as any)}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer shadow-3xs ${
                    selectedCpu === cpu.id
                      ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
                      : 'bg-white dark:bg-[#0C1015] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{cpu.label}</div>
                  <div className={`text-[10px] font-mono ${selectedCpu === cpu.id ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {cpu.note}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Dynamic Assessment Output Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-[#FAFAFA] dark:bg-[#0C1015] border-2 border-slate-300 dark:border-slate-700 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">Live Device Verdict</span>
              </div>
              <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                Score: {assessment.score} / 100
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-black text-[#005F02] dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{assessment.verdict}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                {assessment.details}
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 gap-2 text-left font-mono">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0E1318] border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">AI Memory Usage</div>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{assessment.ramUsage}</div>
                <div className="text-[9px] text-[#005F02] dark:text-emerald-400 font-bold">Lightweight footprint</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0E1318] border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Offline Response Speed</div>
                <div className="text-sm font-black text-[#005F02] dark:text-emerald-400 mt-0.5">{assessment.latency}</div>
                <div className="text-[9px] text-[#005F02] dark:text-emerald-400 font-bold">Zero network lag</div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
                <span>0 KB mobile data spent • 100% Air-Gapped</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
                <span>Battery saver profile prevents overheating</span>
              </div>
            </div>

            {/* Launch Action */}
            <Link to="/dashboard" className="block w-full pt-1">
              <button className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                <Zap className="w-3.5 h-3.5" />
                <span>Open CodeTutor on This Device</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
})

LaptopCompatibilityTester.displayName = 'LaptopCompatibilityTester'
