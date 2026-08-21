import {
  GenerateTutorReplyRequest,
  GenerateTutorReplyResponse,
  AnalyzeCodeDebugRequest,
  AnalyzeCodeDebugResponse,
} from './ai.types'

export interface IAIService {
  generateTutorResponse(request: GenerateTutorReplyRequest): Promise<GenerateTutorReplyResponse>
  analyzeDebugCode(request: AnalyzeCodeDebugRequest): Promise<AnalyzeCodeDebugResponse>
  checkModelHealth(): Promise<boolean>
}
