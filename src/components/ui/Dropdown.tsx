import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

export interface DropdownOption<T extends string = string> {
  value: T
  label: string
  icon?: React.ReactNode
  description?: string
  disabled?: boolean
}

export interface DropdownProps<T extends string = string> {
  options: DropdownOption<T>[]
  value: T
  onChange: (value: T) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function Dropdown<T extends string = string>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option',
  className,
  disabled = false,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={cn('relative w-full space-y-1.5', className)}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs transition-colors',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <svg
          className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm rounded-lg transition-colors',
                option.value === value
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                option.disabled && 'opacity-40 pointer-events-none'
              )}
            >
              {option.icon}
              <div className="flex flex-col">
                <span>{option.label}</span>
                {option.description && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{option.description}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
