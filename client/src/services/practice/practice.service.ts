import { PracticeQuestion, CodeSubmission } from '@/types'
import { practiceStoreService } from './practice-store.service'

export interface IPracticeService {
  getQuestions(): Promise<PracticeQuestion[]>
  getQuestionById(id: string): Promise<PracticeQuestion | undefined>
  submitSolution(questionId: string, code: string): Promise<CodeSubmission>
}

export class MockPracticeService implements IPracticeService {
  async getQuestions(): Promise<PracticeQuestion[]> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return practiceStoreService.getAllQuestions()
  }

  async getQuestionById(id: string): Promise<PracticeQuestion | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return practiceStoreService.getQuestionById(id)
  }

  async submitSolution(questionId: string, code: string): Promise<CodeSubmission> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const question = practiceStoreService.getQuestionById(questionId)
    
    // Simulate test evaluation
    const results = (question?.testCases || []).map((tc) => ({
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
      runtimeMs: 38,
      testResults: results,
      feedback: 'All test cases passed! Clean, optimal solution. Great job!',
      createdAt: new Date().toISOString(),
    }
  }
}

export const practiceService: IPracticeService = new MockPracticeService()
