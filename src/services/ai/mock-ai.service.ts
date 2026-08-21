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
              : request.language === 'java'
              ? `public class Factorial {\n    public static int factorial(int n) {\n        // 1. Base Case\n        if (n <= 1) return 1;\n        // 2. Recursive Step\n        return n * factorial(n - 1);\n    }\n}`
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
        reply: `Understanding time complexity with data structures is essential for writing efficient code and solving real-world programming problems. In ${request.language}, accessing an element by index takes **O(1)** constant time because contiguous memory addresses allow instant mathematical offsets. However, inserting or deleting from the middle takes **O(n)** time due to memory shifts.`,
        codeSnippets: [
          {
            language: request.language,
            code: request.language === 'python'
              ? `# Fast O(1) direct access\nscores = [85, 92, 78, 90]\nfirst = scores[0]\n\n# O(n) linear search\ndef find_score(target, arr):\n    for s in arr:\n        if s == target:\n            return True\n    return False`
              : request.language === 'java'
              ? `// Fast O(1) direct access\nint[] scores = {85, 92, 78, 90};\nint first = scores[0];\n\n// O(n) linear search\npublic static boolean findScore(int target, int[] arr) {\n    for (int s : arr) {\n        if (s == target) return true;\n    }\n    return false;\n}`
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
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (request.language === 'javascript') {
      return {
        hasErrors: true,
        explanation: `**Root Cause Identified (JavaScript):** The code attempts to read properties synchronously from an asynchronous operation (\`setTimeout\` or unresolved Promise). In JavaScript's single-threaded event loop, asynchronous callbacks execute only after current stack completion, meaning \`user\` is evaluated as \`undefined\`.`,
        suggestedFix: `Wrap the asynchronous callback in a Promise and return or \`await\` the resolved value before reading properties.`,
        fixedCode: request.code.includes('setTimeout')
          ? `function fetchUserData(userId) {\n  return new Promise((resolve) => {\n    setTimeout(() => {\n      const user = { id: userId, name: "Ama" };\n      resolve(user.name);\n    }, 100);\n  });\n}`
          : request.code,
        keyConcepts: ['JavaScript Event Loop', 'Promises & Async/Await', 'Undefined Reference Handling'],
      }
    }

    if (request.language === 'java') {
      return {
        hasErrors: true,
        explanation: `**Root Cause Identified (Java):** The loop termination condition \`i <= arr.length\` causes an \`ArrayIndexOutOfBoundsException\`. Java arrays are zero-indexed from \`0\` to \`arr.length - 1\`. Accessing index \`arr[arr.length]\` on the final iteration exceeds allocated memory bounds.`,
        suggestedFix: `Change the loop boundary condition to strictly less than length (\`i < arr.length\`).`,
        fixedCode: request.code.replace(/<=\s*([a-zA-Z0-9_]+)\.length/g, '< $1.length'),
        keyConcepts: ['Java Array Bounds', '0-based Indexing', 'ArrayIndexOutOfBoundsException'],
      }
    }

    return {
      hasErrors: true,
      explanation: `**Root Cause Identified (Python):** The code contains an off-by-one boundary index error in \`range(len(scores) + 1)\`. In Python, lists are 0-indexed with valid indices from \`0\` to \`len - 1\`. Indexing \`scores[len(scores)]\` triggers an \`IndexError: list index out of range\`.`,
      suggestedFix: `Iterate directly over elements using \`for score in scores:\` or constrain index generation to \`range(len(scores))\`.`,
      fixedCode: request.code.replace(/range\(len\(([^)]+)\)\s*\+\s*1\)/g, 'range(len($1))'),
      keyConcepts: ['Zero-based Indexing', 'IndexError Prevention', 'Idiomatic Python For-Loops'],
    }
  }

  async checkModelHealth(): Promise<boolean> {
    return true
  }
}

export const aiService: IAIService = new MockAIService()
