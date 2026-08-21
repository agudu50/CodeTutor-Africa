import { ChatMessage, TutorMode, ProgrammingLanguage } from '@/types'

export interface GenerateTutorReplyRequest {
  sessionId: string
  prompt: string
  conversationHistory: ChatMessage[]
  mode: TutorMode
  language: ProgrammingLanguage
  contextSnippet?: string
}

export interface GenerateTutorReplyResponse {
  reply: string
  suggestedFollowups: string[]
  codeSnippets?: Array<{
    language: ProgrammingLanguage
    code: string
  }>
  inferenceTimeMs: number
  tokensUsed: number
}

export interface AnalyzeCodeDebugRequest {
  code: string
  language: ProgrammingLanguage
  runtimeError?: string
}

export interface AnalyzeCodeDebugResponse {
  hasErrors: boolean
  explanation: string
  suggestedFix: string
  fixedCode: string
  keyConcepts: string[]
}
