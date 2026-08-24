import { PracticeQuestion, CodeSubmission } from '@/types'
import { MOCK_PRACTICE_QUESTIONS } from '@/features/practice/data/mockPracticeData'

export interface IPracticeService {
  getQuestions(): Promise<PracticeQuestion[]>
  getQuestionById(id: string): Promise<PracticeQuestion | undefined>
  submitSolution(questionId: string, code: string): Promise<CodeSubmission>
}

export class MockPracticeService implements IPracticeService {
  async getQuestions(): Promise<PracticeQuestion[]> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return MOCK_PRACTICE_QUESTIONS
  }

  async getQuestionById(id: string): Promise<PracticeQuestion | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return MOCK_PRACTICE_QUESTIONS.find((q: PracticeQuestion) => q.id === id || q.slug === id)
  }

  async submitSolution(questionId: string, code: string): Promise<CodeSubmission> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    const question = MOCK_PRACTICE_QUESTIONS.find((q: PracticeQuestion) => q.id === questionId)
    
    // Simulate test evaluation
    const results = (question?.testCases || []).map((tc: PracticeQuestion['testCases'][number]) => ({
      ...tc,
      actualOutput: tc.expectedOutput,
      passed: true,
    }))

    return {
      id: `sub-${Date.now()}`,
      questionId,
      code,
      language: question?.language || 'python',
      status: 'passed',
      runtimeMs: 42,
      testResults: results,
      feedback: 'All test cases passed! Time complexity O(N), Space complexity O(1). Great job!',
      createdAt: new Date().toISOString(),
    }
  }
}

export const practiceService: IPracticeService = new MockPracticeService()
