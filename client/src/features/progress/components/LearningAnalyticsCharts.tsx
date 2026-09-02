import React, { useState } from 'react'
import {
  BarChart3,
  Activity,
  Layers,
  Code2,
  Terminal,
  Cpu,
  Database,
} from 'lucide-react'

interface DailyMetric {
  day: string
  fullDay: string
  solved: number
  xp: number
  minutes: number
}

const WEEKLY_DATA: DailyMetric[] = [
  { day: 'Mon', fullDay: 'Monday', solved: 4, xp: 280, minutes: 45 },
  { day: 'Tue', fullDay: 'Tuesday', solved: 6, xp: 420, minutes: 60 },
  { day: 'Wed', fullDay: 'Wednesday', solved: 3, xp: 210, minutes: 35 },
  { day: 'Thu', fullDay: 'Thursday', solved: 5, xp: 350, minutes: 50 },
  { day: 'Fri', fullDay: 'Friday', solved: 7, xp: 490, minutes: 75 },
  { day: 'Sat', fullDay: 'Saturday', solved: 9, xp: 630, minutes: 90 },
  { day: 'Sun', fullDay: 'Sunday', solved: 4, xp: 280, minutes: 40 },
]

interface LanguageShare {
  name: string
  key: string
  percent: number
  solved: number
  xp: number
  color: string
  border: string
  bg: string
  icon: React.FC<{ className?: string }>
}

const LANGUAGE_SHARES: LanguageShare[] = [
  {
    name: 'Python',
    key: 'python',
    percent: 42,
    solved: 24,
    xp: 1180,
    color: 'bg-[#005F02] text-white',
    border: 'border-emerald-300 dark:border-emerald-800',
    bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400',
    icon: Terminal,
  },
  {
    name: 'JavaScript',
    key: 'javascript',
    percent: 24,
    solved: 8,
    xp: 680,
    color: 'bg-amber-500 text-white',
    border: 'border-amber-300 dark:border-amber-800',
    bg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400',
    icon: Code2,
  },
  {
    name: 'Java',
    key: 'java',
    percent: 14,
    solved: 4,
    xp: 390,
    color: 'bg-rose-500 text-white',
    border: 'border-rose-300 dark:border-rose-800',
    bg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400',
    icon: Cpu,
  },
  {
    name: 'TypeScript',
    key: 'typescript',
    percent: 10,
    solved: 3,
    xp: 260,
    color: 'bg-blue-600 text-white',
    border: 'border-blue-300 dark:border-blue-800',
    bg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-400',
    icon: Code2,
  },
  {
    name: 'SQL & Database',
    key: 'sql',
    percent: 6,
    solved: 2,
    xp: 180,
    color: 'bg-purple-600 text-white',
    border: 'border-purple-300 dark:border-purple-800',
    bg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-400',
    icon: Database,
  },
  {
    name: 'HTML & CSS',
    key: 'web',
    percent: 4,
    solved: 1,
    xp: 90,
    color: 'bg-orange-500 text-white',
    border: 'border-orange-300 dark:border-orange-800',
    bg: 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-400',
    icon: Layers,
  },
]

export const LearningAnalyticsCharts: React.FC = () => {
  const [metricType, setMetricType] = useState<'solved' | 'xp' | 'minutes'>('solved')
  const [activeDayIndex, setActiveDayIndex] = useState<number>(5) // Saturday default (peak)

  const activeDay = WEEKLY_DATA[activeDayIndex]
  const maxMetricValue = Math.max(...WEEKLY_DATA.map((d) => d[metricType]))
  const totalMetric = WEEKLY_DATA.reduce((sum, d) => sum + d[metricType], 0)
  const avgMetric = (totalMetric / WEEKLY_DATA.length).toFixed(1)

  // Cumulative trajectory points (starting at 1200 to 2450)
  const trajectoryPoints = [
    { label: 'Day 1', xp: 1200 },
    { label: 'Day 2', xp: 1480 },
    { label: 'Day 3', xp: 1690 },
    { label: 'Day 4', xp: 1850 },
    { label: 'Day 5', xp: 2050 },
    { label: 'Day 6', xp: 2320 },
    { label: 'Day 7', xp: 2450 },
  ]
  const minXp = 1000
  const maxXp = 2600

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: WEEKLY CODING VELOCITY & HEATMAP
          ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs space-y-5">
        {/* Header with Title & Metric Toggle Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Weekly Study Velocity
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Day-by-day coding consistency and volume over the last 7 days.
              </p>
            </div>
          </div>

          {/* Metric Filter Tabs */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setMetricType('solved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border-2 active:scale-95 shadow-3xs ${
                metricType === 'solved'
                  ? 'bg-[#005F02] text-white border-[#005F02]'
                  : 'bg-slate-50 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
              }`}
            >
              Solved
            </button>
            <button
              type="button"
              onClick={() => setMetricType('xp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border-2 active:scale-95 shadow-3xs ${
                metricType === 'xp'
                  ? 'bg-[#005F02] text-white border-[#005F02]'
                  : 'bg-slate-50 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
              }`}
            >
              XP Earned
            </button>
            <button
              type="button"
              onClick={() => setMetricType('minutes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border-2 active:scale-95 shadow-3xs ${
                metricType === 'minutes'
                  ? 'bg-[#005F02] text-white border-[#005F02]'
                  : 'bg-slate-50 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02]'
              }`}
            >
              Time (mins)
            </button>
          </div>
        </div>

        {/* Quick Highlights Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">7-Day Total</span>
            <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
              {metricType === 'xp' ? `${totalMetric} pts` : metricType === 'minutes' ? `${totalMetric} mins` : `${totalMetric} Solved`}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">Daily Average</span>
            <span className="text-sm font-black font-mono text-[#005F02] dark:text-emerald-400">
              {metricType === 'xp' ? `${avgMetric} pts/day` : metricType === 'minutes' ? `${avgMetric} m/day` : `${avgMetric} /day`}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">Selected Day</span>
            <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
              {activeDay.fullDay}: {activeDay[metricType]} {metricType === 'xp' ? 'pts' : metricType === 'minutes' ? 'mins' : 'solved'}
            </span>
          </div>
        </div>

        {/* Sleek Compact Coordinate Bar Graph */}
        <div className="pt-1">
          <div className="p-4 sm:p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#12171E] space-y-3.5">
            {/* Coordinate Grid & Bars Container */}
            <div className="relative w-full h-36 sm:h-40 pt-4 pb-1">
              {/* Horizontal Background Reference Gridlines & Y-Axis Labels */}
              <div className="absolute inset-0 top-4 bottom-6 flex flex-col justify-between pointer-events-none">
                {[1, 0.66, 0.33, 0].map((ratio, i) => {
                  const gridVal = Math.round(ratio * maxMetricValue)
                  return (
                    <div key={i} className="relative w-full flex items-center">
                      <span className="w-8 sm:w-10 pr-2 text-right font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 select-none">
                        {gridVal}
                      </span>
                      <div className="flex-1 border-b border-dashed border-slate-300 dark:border-slate-700/80" />
                    </div>
                  )
                })}
              </div>

              {/* 7 Columns Spanning Width */}
              <div className="relative w-full h-full pl-8 sm:pl-10 flex items-end justify-between gap-1.5 sm:gap-3 md:gap-5">
                {WEEKLY_DATA.map((d, idx) => {
                  const val = d[metricType]
                  const heightPercent = Math.max(14, Math.round((val / maxMetricValue) * 100))
                  const isSelected = activeDayIndex === idx

                  return (
                    <div
                      key={d.day}
                      onClick={() => setActiveDayIndex(idx)}
                      className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group select-none"
                    >
                      {/* Top Value Tooltip Pill */}
                      <span
                        className={`mb-1.5 font-mono text-[11px] sm:text-xs transition-all ${
                          isSelected
                            ? 'font-black text-[#005F02] dark:text-emerald-400 scale-110'
                            : 'font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                        }`}
                      >
                        {val}
                      </span>

                      {/* Compact Column Slot Track */}
                      <div className="w-full max-w-[40px] sm:max-w-[48px] md:max-w-[56px] h-[78px] sm:h-[88px] rounded-xl bg-slate-200/50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 flex items-end p-0.5 sm:p-1 transition-colors group-hover:border-slate-300 dark:group-hover:border-slate-700">
                        {/* Solid Filled Bar with 2px Border */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-lg border-2 transition-all duration-300 ${
                            isSelected
                              ? 'bg-[#005F02] dark:bg-emerald-500 border-[#005F02] dark:border-emerald-400 shadow-sm'
                              : 'bg-emerald-600 dark:bg-emerald-600/90 border-emerald-700 dark:border-emerald-500 group-hover:bg-[#005F02] dark:group-hover:bg-emerald-500'
                          }`}
                        />
                      </div>

                      {/* Day Label at the Bottom */}
                      <span
                        className={`mt-1.5 font-mono text-[11px] sm:text-xs uppercase transition-all ${
                          isSelected
                            ? 'font-black text-[#005F02] dark:text-emerald-400'
                            : 'font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                        }`}
                      >
                        {d.day}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sleek Compact Day Telemetry Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t-2 border-slate-200 dark:border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-black border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs text-[11px]">
                  {activeDay.fullDay} Focus
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs">
                  {activeDay.solved} Solved • {activeDay.xp} XP • {activeDay.minutes} Mins Practiced
                </span>
              </div>
              {activeDay.solved >= 7 && (
                <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 self-start sm:self-auto shadow-3xs">
                  Peak Velocity Day
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: TRACK MASTERY & CUMULATIVE XP TRAJECTORY (2 COLS)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Graph 2A: Language Competency Share */}
        <div className="p-5 sm:p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs flex flex-col justify-between h-full space-y-4">
          <div className="space-y-1 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-3xs">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Track Mastery Distribution
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg border-2 border-amber-300 dark:border-amber-800 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-mono text-[11px] font-black shadow-3xs shrink-0">
                {LANGUAGE_SHARES.length} Tracks
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Proportion of solved coding drills across curriculum language tracks.
            </p>
          </div>

          {/* Segmented Multi-Color Horizontal Bar with 2px borders */}
          <div className="space-y-2">
            <div className="h-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden flex bg-slate-100 dark:bg-[#161B22] shadow-inner">
              {LANGUAGE_SHARES.map((item) => (
                <div
                  key={item.key}
                  style={{ width: `${item.percent}%` }}
                  title={`${item.name}: ${item.percent}% (${item.solved} Solved)`}
                  className={`${item.color} h-full transition-all hover:opacity-90`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold px-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Scrollable Language List with Auto-Scaling Container */}
          <div className="max-h-[220px] sm:max-h-[235px] overflow-y-auto pr-1 space-y-2 select-none">
            {LANGUAGE_SHARES.map((item) => {
              const IconComp = item.icon
              return (
                <div
                  key={item.key}
                  className="p-2.5 sm:p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#12161A] flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-3xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl border-2 ${item.border} ${item.bg} flex items-center justify-center shrink-0`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-slate-900 dark:text-white block truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold block">
                        {item.solved} Solved • {item.xp} XP
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="w-16 sm:w-20 h-2 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden hidden sm:block">
                      <div
                        className={`h-full rounded-full ${item.color.split(' ')[0]}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-black text-slate-900 dark:text-white min-w-[36px] text-right">
                      {item.percent}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Graph 2B: Cumulative XP Growth Trajectory */}
        <div className="p-5 sm:p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs flex flex-col justify-between h-full space-y-5">
          <div className="space-y-1 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Cumulative XP Trajectory
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Growth curve in offline experience points accumulated across sessions.
            </p>
          </div>

          {/* SVG Line Graph */}
          <div className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#12171E] flex flex-col justify-between">
            <svg viewBox="0 0 400 160" className="w-full h-36 overflow-visible">
              {/* Grid Lines */}
              <line x1="10" y1="20" x2="390" y2="20" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.25" strokeWidth="1" />
              <line x1="10" y1="65" x2="390" y2="65" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.25" strokeWidth="1" />
              <line x1="10" y1="110" x2="390" y2="110" stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.25" strokeWidth="1" />
              <line x1="10" y1="145" x2="390" y2="145" stroke="#64748b" strokeWidth="1.5" strokeOpacity="0.4" />

              {/* Connecting Polyline Path (Solid Emerald) */}
              <polyline
                fill="none"
                stroke="#005F02"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={trajectoryPoints
                  .map((pt, i) => {
                    const x = 30 + i * (340 / (trajectoryPoints.length - 1))
                    const y = 145 - ((pt.xp - minXp) / (maxXp - minXp)) * 125
                    return `${x},${y}`
                  })
                  .join(' ')}
              />

              {/* Data Nodes */}
              {trajectoryPoints.map((pt, i) => {
                const x = 30 + i * (340 / (trajectoryPoints.length - 1))
                const y = 145 - ((pt.xp - minXp) / (maxXp - minXp)) * 125
                const isFinal = i === trajectoryPoints.length - 1

                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isFinal ? 6 : 4}
                      fill="#005F02"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {isFinal && (
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        fill="#005F02"
                        className="text-[11px] font-mono font-black"
                      >
                        {pt.xp}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Day 1 (1,200 XP)</span>
              <span className="text-[#005F02] dark:text-emerald-400 font-black">+1,250 XP Growth</span>
              <span>Day 7 (2,450 XP)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-100 dark:bg-emerald-950/80">
            <span className="text-xs font-mono font-black text-[#005F02] dark:text-emerald-400">
              Diamond Tier Target: 3,000 XP
            </span>
            <span className="text-xs font-mono font-black text-slate-800 dark:text-slate-200">
              550 XP to Next Milestone
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
