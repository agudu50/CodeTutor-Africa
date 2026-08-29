export interface DashboardData {
  user: {
    name: string
    university: string
    streakDays: number
    totalHours: number
    problemsSolved: number
  }
  continueLearning: {
    courseId: string
    courseTitle: string
    moduleTitle: string
    lessonId: string
    lessonTitle: string
    lessonNumber: number
    totalLessons: number
    completedLessons: number
    progressPercent: number
    estimatedRemainingMinutes: number
    language: 'python' | 'javascript' | 'java'
    concepts: string[]
    nextExerciseTitle: string
    nextExerciseId: string
  }
  recentTutorSessions: Array<{
    id: string
    title: string
    language: string
    lastUpdated: string
    messageCount: number
  }>
  weakAreas: Array<{
    topic: string
    subject: string
    accuracy: number
    recommendedPracticeId: string
  }>
  recommendedPractices: Array<{
    id: string
    title: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    language: string
    category: string
  }>
}

export const MOCK_DASHBOARD_DATA: DashboardData = {
  user: {
    name: 'Kofi Mensah',
    university: 'Independent Learner • Tech Hub Accra',
    streakDays: 7,
    totalHours: 18.5,
    problemsSolved: 34,
  },
  continueLearning: {
    courseId: 'course-py-101',
    courseTitle: 'Python Programming & Problem Solving',
    moduleTitle: 'Module 1 • Foundations & Control Flow',
    lessonId: 'les-3',
    lessonTitle: 'Functions, Scoping, and Recursion',
    lessonNumber: 3,
    totalLessons: 18,
    completedLessons: 12,
    progressPercent: 68,
    estimatedRemainingMinutes: 20,
    language: 'python',
    concepts: ['Call Stack Memory', 'Base Conditions', 'RecursionError Prevention'],
    nextExerciseTitle: 'Recursive Palindrome Checker',
    nextExerciseId: 'practice-rec-1',
  },
  recentTutorSessions: [
    {
      id: 'session-1',
      title: 'Recursion Call Stack & Memory Frames',
      language: 'python',
      lastUpdated: '2 hours ago',
      messageCount: 8,
    },
    {
      id: 'session-2',
      title: 'Async/Await & Promise Chaining',
      language: 'javascript',
      lastUpdated: 'Yesterday',
      messageCount: 14,
    },
    {
      id: 'session-3',
      title: 'Linked List Reversal Algorithm',
      language: 'python',
      lastUpdated: '3 days ago',
      messageCount: 6,
    },
  ],
  weakAreas: [
    {
      topic: 'Loops & Accumulator Logic',
      subject: 'Python Track • Module 4: Loops & Repetition',
      accuracy: 54,
      recommendedPracticeId: 'practice-py-m4',
    },
    {
      topic: 'Functions & Return Values',
      subject: 'JavaScript Track • Module 5: Functions & Closures',
      accuracy: 62,
      recommendedPracticeId: 'practice-js-m5',
    },
  ],
  recommendedPractices: [
    {
      id: 'practice-py-m4',
      title: 'Number Sequence & Accumulator Loop',
      difficulty: 'beginner',
      language: 'python',
      category: 'Loops & Iteration',
    },
    {
      id: 'practice-js-m5',
      title: 'Tax & Currency Converter Function',
      difficulty: 'beginner',
      language: 'javascript',
      category: 'Functions & Scope',
    },
    {
      id: 'practice-java-m3',
      title: 'Student Grade Evaluator',
      difficulty: 'beginner',
      language: 'java',
      category: 'Conditionals & Logic',
    },
  ],
}
