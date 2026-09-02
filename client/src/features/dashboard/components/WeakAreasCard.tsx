import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, Target } from 'lucide-react'

interface WeakArea {
  topic: string
  subject: string
  accuracy: number
  recommendedPracticeId: string
}

export const WeakAreasCard: React.FC<{ weakAreas: WeakArea[] }> = memo(({ weakAreas }) => {
  return (
    <div className="h-full flex flex-col justify-between border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs rounded-3xl p-5 sm:p-6 space-y-4">
      <div className="space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-3xs">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Focus Areas
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-300 dark:border-slate-700 shrink-0 shadow-3xs">
            Personalized
          </span>
        </div>

        {/* Areas List */}
        <div className="space-y-3">
          {weakAreas.map((area) => (
            <div
              key={area.topic}
              className="p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] space-y-2.5 shadow-3xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 truncate">
                    {area.topic}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {area.subject}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800 shrink-0 shadow-3xs">
                  {area.accuracy}% Accuracy
                </span>
              </div>

              {/* Progress Bar (Solid Amber) */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-300 dark:border-slate-700 p-0.5">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${area.accuracy}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Recommended review
                </span>
                <Link to={`/practice/${area.recommendedPracticeId}`}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] hover:border-[#005F02] hover:text-[#005F02] text-slate-800 dark:text-slate-200 text-xs font-bold shadow-3xs transition-all cursor-pointer active:scale-95"
                  >
                    <span>Practice Topic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Mastery Footer */}
      <div className="pt-2">
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold shadow-3xs">
          <Target className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
          <span>Practicing focus areas increases mastery by up to 2.4x.</span>
        </div>
      </div>
    </div>
  )
})

WeakAreasCard.displayName = 'WeakAreasCard'
