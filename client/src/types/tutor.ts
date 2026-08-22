import { BaseEntity, ProgrammingLanguage } from './common'

export type MessageRole = 'user' | 'assistant' | 'system'

export type TutorMode = 'socratic' | 'direct_explanation' | 'code_review' | 'concept_deepdive'

export interface CodeBlockData {
  language: ProgrammingLanguage
  code: string
  lineNumbers?: boolean
}

export interface ChatMessage extends BaseEntity {
  sessionId: string
  role: MessageRole
  content: string
  codeBlocks?: CodeBlockData[]
  suggestedFollowups?: string[]
  tokensCount?: number
  inferenceTimeMs?: number
}

export interface TutorSession extends BaseEntity {
  title: string
  topic?: string
  language: ProgrammingLanguage
  mode: TutorMode
  messageCount: number
  lastMessagePreview: string
  courseContextId?: string
  lessonContextId?: string
}
