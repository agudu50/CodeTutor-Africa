export type ProgrammingLanguage = 'python' | 'javascript' | 'java' | 'typescript' | 'cpp' | 'c' | 'go' | 'rust' | 'csharp' | 'php' | 'sql' | 'html'

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt?: string
}

export type StatusState = 'idle' | 'loading' | 'success' | 'error'
