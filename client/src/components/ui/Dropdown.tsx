import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { ChevronDown, Check } from 'lucide-react'

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
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs transition-all cursor-pointer',
          isOpen && 'border-brand-500 ring-2 ring-brand-500/20',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2', isOpen && 'rotate-180 text-brand-500')}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-64 overflow-y-auto rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full flex items-center justify-between gap-2.5 px-3 py-2 text-left text-xs rounded-xl transition-all cursor-pointer',
                  isSelected
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80',
                  option.disabled && 'opacity-40 pointer-events-none'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {option.icon}
                  <div className="flex flex-col truncate">
                    <span className="truncate">{option.label}</span>
                    {option.description && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{option.description}</span>
                    )}
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
