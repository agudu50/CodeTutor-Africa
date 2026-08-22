import { ChatMessage, TutorMode, ProgrammingLanguage, QuizQuestion } from '@/types'

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

export interface GenerateCurriculumRequest {
  topic: string
  language: ProgrammingLanguage
  difficulty?: string
}

export interface GenerateCurriculumResponse {
  title: string
  description: string
  durationMinutes: number
  recommendedVideoUrl?: string
  contentMarkdown: string
  quizQuestions: QuizQuestion[]
}
