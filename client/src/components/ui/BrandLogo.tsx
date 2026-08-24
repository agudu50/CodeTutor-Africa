import React from 'react'
import { cn } from '@/utils/cn'

interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'badge'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showSubtext?: boolean
  subtext?: string
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className,
  showSubtext = false,
  subtext = 'Offline AI Core',
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', imgHeight: 'h-6', text: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8', imgHeight: 'h-8', text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 'w-9 h-9', imgHeight: 'h-9', text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', imgHeight: 'h-12', text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', imgHeight: 'h-16', text: 'text-2xl', sub: 'text-sm' },
  }

  const s = sizeMap[size]

  if (variant === 'icon') {
    return (
      <div className={cn('relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden', className)}>
        <img
          src="/logo.jpg"
          alt="CodeTutor Africa"
          className={cn(s.icon, 'object-cover rounded-full drop-shadow-sm transition-transform hover:scale-105')}
        />
      </div>
    )
  }

  if (variant === 'badge') {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-full overflow-hidden bg-white dark:bg-emerald-950/60 border border-emerald-500/30 p-0.5 shadow-2xs shrink-0',
          className
        )}
      >
        <img
          src="/logo.jpg"
          alt="CodeTutor Africa"
          className={cn(s.icon, 'object-cover rounded-full')}
        />
      </div>
    )
  }

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <div className="relative shrink-0 flex items-center justify-center rounded-full overflow-hidden bg-white dark:bg-emerald-950/50 border border-emerald-500/30 p-0.5 shadow-2xs">
        <img
          src="/logo.jpg"
          alt="CodeTutor Africa"
          className={cn(s.icon, 'object-cover rounded-full')}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className={cn('font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center gap-1', s.text)}>
          CodeTutor <span className="text-[#005F02] dark:text-emerald-400 font-extrabold">Africa</span>
        </span>
        {showSubtext && (
          <span className={cn('font-mono tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500', s.sub)}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  )
}
