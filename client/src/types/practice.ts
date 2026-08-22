import { BaseEntity, DifficultyLevel, ProgrammingLanguage } from './common'

export interface TestCase {
  id: string
  input: string
  expectedOutput: string
  actualOutput?: string
  passed?: boolean
  isHidden?: boolean
}

export interface PracticeQuestion extends BaseEntity {
  title: string
  slug: string
  description: string
  difficulty: DifficultyLevel
  language: ProgrammingLanguage
  category: string
  starterCode: string
  solutionCode?: string
  testCases: TestCase[]
  hints: string[]
  tags: string[]
}

export interface CodeSubmission extends BaseEntity {
  questionId: string
  code: string
  language: ProgrammingLanguage
  status: 'passed' | 'failed' | 'syntax_error' | 'timeout'
  runtimeMs?: number
  testResults: TestCase[]
  feedback?: string
}
