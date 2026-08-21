import React from 'react'
import { cn } from '@/utils/cn'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: 'brand' | 'accent' | 'emerald' | 'amber' | 'rose'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, variant = 'brand', size = 'md', showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max(0, Math.round((value / max) * 100)), 100)

    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    }

    const barColors = {
      brand: 'bg-brand-500',
      accent: 'bg-accent-500',
      emerald: 'bg-emerald-500',
      amber: 'bg-amber-500',
      rose: 'bg-rose-500',
    }

    return (
      <div ref={ref} className={cn('w-full space-y-1.5', className)} {...props}>
        {showLabel && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Progress</span>
            <span className="font-mono">{percentage}%</span>
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn('w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden', sizeClasses[size])}
        >
          <div
            className={cn('h-full rounded-full transition-all duration-300 ease-out', barColors[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'
