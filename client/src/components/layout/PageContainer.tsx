import React from 'react'
import { cn } from '@/utils/cn'

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'full',
  className,
  ...props
}) => {
  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[1600px]',
    full: 'w-full',
  }

  return (
    <main
      className={cn(
        'flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full animate-in fade-in duration-150',
        maxWidthClasses[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
}
