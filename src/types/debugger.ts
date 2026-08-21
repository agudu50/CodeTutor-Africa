import { BaseEntity, ProgrammingLanguage } from './common'

export interface DebugIssue {
  line: number
  column?: number
  severity: 'error' | 'warning' | 'info'
  type: string
  message: string
  suggestedFix?: string
}

export interface DebugResult extends BaseEntity {
  language: ProgrammingLanguage
  originalCode: string
  errorMessage?: string
  hasErrors: boolean
  issues: DebugIssue[]
  explanationMarkdown: string
  fixedCode: string
  conceptsInvolved: string[]
}
