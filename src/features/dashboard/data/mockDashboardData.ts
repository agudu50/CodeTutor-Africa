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
    university: 'University of Ghana / KNUST',
    streakDays: 7,
    totalHours: 18.5,
    problemsSolved: 34,
  },
  continueLearning: {
    courseId: 'course-py-101',
    courseTitle: 'Python for University Computer Science',
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
      topic: 'Recursion Base Conditions',
      subject: 'Data Structures',
      accuracy: 45,
      recommendedPracticeId: 'practice-rec-1',
    },
    {
      topic: 'Time Complexity Analysis',
      subject: 'Algorithms',
      accuracy: 58,
      recommendedPracticeId: 'practice-algo-1',
    },
  ],
  recommendedPractices: [
    {
      id: 'practice-rec-1',
      title: 'Recursive Palindrome Checker',
      difficulty: 'beginner',
      language: 'python',
      category: 'Recursion',
    },
    {
      id: 'practice-algo-1',
      title: 'Two Sum with Optimal Hash Map',
      difficulty: 'intermediate',
      language: 'python',
      category: 'Data Structures',
    },
    {
      id: 'practice-js-1',
      title: 'Custom Promise.all Implementation',
      difficulty: 'intermediate',
      language: 'javascript',
      category: 'Async Patterns',
    },
  ],
}
