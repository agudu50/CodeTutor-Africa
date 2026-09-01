export type ProgrammingLanguage =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'html'
  | 'css'
  | 'git'
  | 'java'
  | 'sql'
  | 'cpp'
  | 'c'
  | 'go'
  | 'rust'
  | 'csharp'
  | 'php'
  | (string & {})


export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt?: string
}

export type StatusState = 'idle' | 'loading' | 'success' | 'error'
