import { IAIService } from './ai.service'
import {
  GenerateTutorReplyRequest,
  GenerateTutorReplyResponse,
  AnalyzeCodeDebugRequest,
  AnalyzeCodeDebugResponse,
} from './ai.types'

export class MockAIService implements IAIService {
  async generateTutorResponse(request: GenerateTutorReplyRequest): Promise<GenerateTutorReplyResponse> {
    // Simulate lightweight local on-device inference latency
    await new Promise((resolve) => setTimeout(resolve, 600))

    const promptLower = request.prompt.toLowerCase()

    if (promptLower.includes('recursion') || promptLower.includes('recursive')) {
      return {
        reply: `Great question about recursion! In ${request.language}, recursion occurs when a function calls itself to solve a smaller instance of the same problem. Every recursive function requires two core components:\n\n1. **Base Case:** The condition that terminates recursion and prevents a stack overflow.\n2. **Recursive Step:** The logic that moves the problem towards the base case.\n\nLet's examine how a factorial function works step-by-step:`,
        codeSnippets: [
          {
            language: request.language,
            code: request.language === 'python'
              ? `def factorial(n: int) -> int:\n    # 1. Base Case\n    if n <= 1:\n        return 1\n    # 2. Recursive Step\n    return n * factorial(n - 1)\n\nprint(factorial(5)) # Output: 120`
              : `function factorial(n) {\n  // 1. Base Case\n  if (n <= 1) return 1;\n  // 2. Recursive Step\n  return n * factorial(n - 1);\n}\n\nconsole.log(factorial(5)); // Output: 120`,
          },
        ],
        suggestedFollowups: [
          'What happens if we forget the base case?',
          'How does the call stack manage recursion in memory?',
          'Can we convert this to an iterative loop with O(1) space?',
        ],
        inferenceTimeMs: 420,
        tokensUsed: 184,
      }
    }

    if (promptLower.includes('array') || promptLower.includes('list') || promptLower.includes('complexity')) {
      return {
        reply: `Understanding time complexity with data structures is essential for university exams and technical interviews. In ${request.language}, accessing an element by index takes **O(1)** constant time because contiguous memory addresses allow instant mathematical offsets. However, inserting or deleting from the middle takes **O(n)** time due to memory shifts.`,
        codeSnippets: [
          {
            language: request.language,
            code: request.language === 'python'
              ? `# Fast O(1) direct access\nscores = [85, 92, 78, 90]\nfirst = scores[0]\n\n# O(n) linear search\ndef find_score(target, arr):\n    for s in arr:\n        if s == target:\n            return True\n    return False`
              : `// Fast O(1) direct access\nconst scores = [85, 92, 78, 90];\nconst first = scores[0];\n\n// O(n) linear search\nfunction findScore(target, arr) {\n  return arr.includes(target);\n}`,
          },
        ],
        suggestedFollowups: [
          'What is the difference between a Dynamic Array and a Linked List?',
          'Explain amortized O(1) append complexity',
          'How do Hash Tables achieve average O(1) lookups?',
        ],
        inferenceTimeMs: 380,
        tokensUsed: 160,
      }
    }

    // Default pedagogical response
    return {
      reply: `I understand you're asking about "${request.prompt}". As your offline tutor, let's break this down into first principles in **${request.language.toUpperCase()}**. What specific part of this concept would you like to explore first?`,
      suggestedFollowups: [
        'Show me a simple code example',
        'Explain the common edge cases',
        'Give me a mini practice exercise on this',
      ],
      inferenceTimeMs: 310,
      tokensUsed: 110,
    }
  }

  async analyzeDebugCode(request: AnalyzeCodeDebugRequest): Promise<AnalyzeCodeDebugResponse> {
    await new Promise((resolve) => setTimeout(resolve, 750))

    return {
      hasErrors: true,
      explanation: `**Root Cause Identified:** The code contains an off-by-one boundary index error in the loop termination condition. In ${request.language}, array indexes are zero-indexed from \`0\` to \`length - 1\`. Accessing index \`length\` leads to an ${request.language === 'python' ? 'IndexError: list index out of range' : 'undefined reference error'}.`,
      suggestedFix: `Adjust the loop comparison to strictly less than length (\`< arr.length\` or \`range(len(arr))\`) instead of \`<= length\`.`,
      fixedCode: request.code.replace(/<=/g, '<'),
      keyConcepts: ['Zero-based Indexing', 'Boundary Conditions', 'Off-by-one Prevention'],
    }
  }

  async checkModelHealth(): Promise<boolean> {
    return true
  }
}

export const aiService: IAIService = new MockAIService()
