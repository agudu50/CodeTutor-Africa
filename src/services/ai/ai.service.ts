import {
  GenerateTutorReplyRequest,
  GenerateTutorReplyResponse,
  AnalyzeCodeDebugRequest,
  AnalyzeCodeDebugResponse,
  GenerateCurriculumRequest,
  GenerateCurriculumResponse,
} from './ai.types'

export interface IAIService {
  generateTutorResponse(request: GenerateTutorReplyRequest): Promise<GenerateTutorReplyResponse>
  analyzeDebugCode(request: AnalyzeCodeDebugRequest): Promise<AnalyzeCodeDebugResponse>
  generateLessonCurriculum(request: GenerateCurriculumRequest): Promise<GenerateCurriculumResponse>
  checkModelHealth(): Promise<boolean>
}
