import React, { useEffect } from 'react'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 p-6 sm:p-7 shadow-2xl z-10 transition-all max-h-[90vh] overflow-y-auto',
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-start justify-between pb-4 border-b-2 border-slate-200 dark:border-slate-800">
          <div>
            {title && <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>}
            {description && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161B22] border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4">{children}</div>
      </div>
    </div>
  )
}
