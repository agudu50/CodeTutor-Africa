import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside component tree:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
          <div className="max-w-md w-full p-8 rounded-2xl border border-red-500/20 bg-slate-900/90 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Something went wrong</h2>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                CodeTutor Africa encountered an unexpected UI rendering error. Your local learning data and offline progress are safe.
              </p>
            </div>
            {this.state.error && (
              <pre className="text-left text-[11px] p-3 rounded-lg bg-slate-950 border border-slate-800 text-red-400 overflow-x-auto max-h-32 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <Button
              onClick={this.handleReset}
              variant="primary"
              className="w-full"
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reload Application
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
