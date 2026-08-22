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

export interface IAIService {
  generateTutorResponse(request: GenerateTutorReplyRequest): Promise<GenerateTutorReplyResponse>
  analyzeDebugCode(request: AnalyzeCodeDebugRequest): Promise<AnalyzeCodeDebugResponse>
  generateLessonCurriculum(request: GenerateCurriculumRequest): Promise<GenerateCurriculumResponse>
  analyzeTicketIssue(request: AnalyzeTicketRequest): Promise<AnalyzeTicketResponse>
  checkModelHealth(): Promise<boolean>
}
