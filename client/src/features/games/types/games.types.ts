export type GameId = 'speedrun' | 'bughunt' | 'predictor' | 'shuffle'
export type GameLanguage = 'all' | 'python' | 'javascript' | 'typescript' | 'java' | 'sql'

export interface GameMetadata {
  id: GameId
  title: string
  subtitle: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  estimatedMins: number
  iconName: string
  image?: string
  color: {
    bg: string
    text: string
    border: string
    accent: string
  }
}

// 1. Syntax Speedrun Types
export interface SpeedrunSnippet {
  id: string
  courseId?: string
  courseTitle?: string
  lessonTitle?: string
  language: 'python' | 'javascript' | 'typescript' | 'java' | 'sql'
  title: string
  description: string
  code: string
  timeLimitSecs: number
}

// 2. Bug Hunt Types
export interface BugHuntChallenge {
  id: string
  courseId?: string
  courseTitle?: string
  lessonTitle?: string
  language: 'python' | 'javascript' | 'typescript' | 'java' | 'sql'
  title: string
  description: string
  lines: string[]
  buggyLineIndex: number // 0-indexed
  bugExplanation: string
  correctOptions: {
    text: string
    isCorrect: boolean
    explanation?: string
  }[]
  timeLimitSecs: number
}

// 3. Output Predictor Types
export interface OutputPredictorChallenge {
  id: string
  courseId?: string
  courseTitle?: string
  lessonTitle?: string
  language: 'python' | 'javascript' | 'typescript' | 'java' | 'sql'
  title: string
  code: string
  options: string[]
  correctIndex: number
  explanation: string
  timeLimitSecs: number
}

// 4. Code Shuffle Types
export interface CodeShuffleChallenge {
  id: string
  courseId?: string
  courseTitle?: string
  lessonTitle?: string
  language: 'python' | 'javascript' | 'typescript' | 'java' | 'sql'
  title: string
  goalDescription: string
  expectedOutput: string
  scrambledBlocks: {
    id: string
    content: string
    indent: number
  }[]
  correctOrder: string[] // Array of block IDs in correct order
  explanation: string
}

// Player Statistics & Storage
export interface PlayerGameStats {
  gamesPlayed: number
  totalScore: number
  highScores: Record<GameId, number>
  bestStreak: number
  currentStreak: number
  soundEnabled: boolean
}
