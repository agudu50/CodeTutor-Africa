import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'outline'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'brand', size = 'md', dot = false, children, ...props }, ref) => {
    const sizeStyles = {
      sm: 'text-[11px] px-2 py-0.5 font-medium',
      md: 'text-xs px-2.5 py-1 font-semibold',
    }

    const variantStyles = {
      brand: 'bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20',
      accent: 'bg-accent-500/10 text-accent-700 dark:text-accent-300 border border-accent-500/20',
      neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
      success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20',
      error: 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20',
      info: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20',
      outline: 'bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700',
    }

    const dotColors = {
      brand: 'bg-brand-500',
      accent: 'bg-accent-500',
      neutral: 'bg-slate-400',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      error: 'bg-red-500',
      info: 'bg-sky-500',
      outline: 'bg-slate-400',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full transition-colors',
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {dot && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
