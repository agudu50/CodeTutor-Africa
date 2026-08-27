import { PracticeQuestion } from '@/types'
import { MOCK_PRACTICE_QUESTIONS } from '@/features/practice/data/mockPracticeData'

const PRACTICE_STORAGE_KEY = 'codetutor_practice_questions_v3'

class PracticeStoreService {
  private questions: PracticeQuestion[] = []

  constructor() {
    this.init()
  }

  private init() {
    try {
      const stored = localStorage.getItem(PRACTICE_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length >= MOCK_PRACTICE_QUESTIONS.length) {
          this.questions = parsed
        } else {
          this.questions = [...MOCK_PRACTICE_QUESTIONS]
          this.save()
        }
      } else {
        this.questions = [...MOCK_PRACTICE_QUESTIONS]
        this.save()
      }
    } catch {
      this.questions = [...MOCK_PRACTICE_QUESTIONS]
    }
  }

  private save() {
    try {
      localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(this.questions))
      window.dispatchEvent(new Event('practice_updated'))
    } catch {
      // ignore storage quota error
    }
  }

  public getAllQuestions(): PracticeQuestion[] {
    return [...this.questions]
  }

  public getQuestionsByCourse(courseId: string): PracticeQuestion[] {
    return this.questions.filter((q) => q.courseId === courseId)
  }

  public getQuestionById(id: string): PracticeQuestion | undefined {
    return this.questions.find((q) => q.id === id || q.slug === id)
  }

  public createQuestion(
    questionData: Omit<PracticeQuestion, 'id' | 'createdAt'>
  ): PracticeQuestion {
    const newQuestion: PracticeQuestion = {
      ...questionData,
      id: `practice-${questionData.language}-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    }
    this.questions = [newQuestion, ...this.questions]
    this.save()
    return newQuestion
  }

  public updateQuestion(
    id: string,
    updates: Partial<PracticeQuestion>
  ): PracticeQuestion | null {
    const index = this.questions.findIndex((q) => q.id === id)
    if (index === -1) return null

    this.questions[index] = {
      ...this.questions[index],
      ...updates,
    }
    this.save()
    return this.questions[index]
  }

  public deleteQuestion(id: string): boolean {
    const prevLen = this.questions.length
    this.questions = this.questions.filter((q) => q.id !== id)
    if (this.questions.length !== prevLen) {
      this.save()
      return true
    }
    return false
  }

  public resetToDefaults() {
    this.questions = [...MOCK_PRACTICE_QUESTIONS]
    this.save()
  }
}

export const practiceStoreService = new PracticeStoreService()
