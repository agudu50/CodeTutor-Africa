/**
 * Hybrid AI Service.
 *
 * Automatically detects whether the local FastAPI backend (http://127.0.0.1:8000)
 * is running. If online, executes real local LLM inference / diagnostics via HTTP/SSE.
 * If offline (e.g. Vercel web preview or server not started), gracefully falls back to
 * the client-side mock simulation with zero errors.
 */

import { IAIService } from './ai.service'
import {
  GenerateTutorReplyRequest,
  GenerateTutorReplyResponse,
  AnalyzeCodeDebugRequest,
  AnalyzeCodeDebugResponse,
  GenerateCurriculumRequest,
  GenerateCurriculumResponse,
  AnalyzeTicketRequest,
  AnalyzeTicketResponse,
} from './ai.types'
import { MockAIService } from './mock-ai.service'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

export class HybridAIService implements IAIService {
  private fallbackService = new MockAIService()
  private isBackendAvailable: boolean | null = null
  private lastHealthCheck: number = 0

  async checkModelHealth(): Promise<boolean> {
    const now = Date.now()
    if (this.isBackendAvailable !== null && now - this.lastHealthCheck < 10000) {
      return this.isBackendAvailable
    }

    try {
      const res = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(1500),
      })
      this.isBackendAvailable = res.ok
    } catch {
      this.isBackendAvailable = false
    }

    this.lastHealthCheck = now
    return this.isBackendAvailable
  }

  async generateTutorResponse(
    request: GenerateTutorReplyRequest
  ): Promise<GenerateTutorReplyResponse> {
    const isOnline = await this.checkModelHealth()

    if (!isOnline) {
      return this.fallbackService.generateTutorResponse(request)
    }

    try {
      const modeMap: Record<string, string> = {
        socratic: 'explain',
        direct: 'explain',
        hint: 'hint',
        debug: 'debug',
        review: 'review',
        quiz: 'quiz',
      }

      const backendMode = modeMap[request.mode] || 'explain'

      const response = await fetch(`${API_BASE}/api/v1/tutor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: request.prompt,
          language: request.language || 'python',
          mode: backendMode,
          session_id: request.sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        reply: data.answer,
        suggestedFollowups: data.suggested_followups || [
          'Can you explain why this happens?',
          'Give me an exercise to practice this.',
        ],
        codeSnippets: [],
        inferenceTimeMs: data.metrics?.latency_ms || 45,
        tokensUsed: data.metrics?.total_tokens || 85,
      }
    } catch (err) {
      console.warn('Backend tutor call failed, falling back to local simulator:', err)
      return this.fallbackService.generateTutorResponse(request)
    }
  }

  async analyzeDebugCode(
    request: AnalyzeCodeDebugRequest
  ): Promise<AnalyzeCodeDebugResponse> {
    const isOnline = await this.checkModelHealth()

    if (!isOnline) {
      return this.fallbackService.analyzeDebugCode(request)
    }

    try {
      const response = await fetch(`${API_BASE}/api/v1/debugger/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: request.code,
          language: request.language || 'python',
          error_message: request.runtimeError || null,
        }),
      })

      if (!response.ok) {
        throw new Error(`Backend debugger error: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        hasErrors: data.has_bugs,
        explanation: data.root_cause_explanation,
        suggestedFix: data.guided_fix_hint,
        fixedCode: data.fixed_code_snippet || request.code,
        keyConcepts: ['Variable Mutation', 'Boundary Conditions'],
      }
    } catch (err) {
      console.warn('Backend debugger call failed, falling back to local simulator:', err)
      return this.fallbackService.analyzeDebugCode(request)
    }
  }

  async generateLessonCurriculum(
    request: GenerateCurriculumRequest
  ): Promise<GenerateCurriculumResponse> {
    return this.fallbackService.generateLessonCurriculum(request)
  }

  async analyzeTicketIssue(
    request: AnalyzeTicketRequest
  ): Promise<AnalyzeTicketResponse> {
    return this.fallbackService.analyzeTicketIssue(request)
  }
}

export const hybridAIService: IAIService = new HybridAIService()
