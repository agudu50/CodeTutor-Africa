import React from 'react'
import { Button, EmptyState } from '@/components/ui'
import { AlertCircle, RefreshCw } from 'lucide-react'

export interface ErrorFallbackProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = 'Failed to load content',
  description = 'An error occurred while loading this view. Please try again.',
  onRetry,
}) => {
  return (
    <div className="py-12 px-4">
      <EmptyState
        icon={<AlertCircle className="w-8 h-8 text-red-500" />}
        title={title}
        description={description}
        action={
          onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Retry
            </Button>
          )
        }
      />
    </div>
  )
}
