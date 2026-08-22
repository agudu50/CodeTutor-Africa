import { IAIService } from './ai.service'
import {
  GenerateTutorReplyRequest,
  GenerateTutorReplyResponse,
  AnalyzeCodeDebugRequest,
  AnalyzeCodeDebugResponse,
  GenerateCurriculumRequest,
  GenerateCurriculumResponse,
} from './ai.types'
import { QuizQuestion } from '@/types'

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

  // ══════════════════════════════════════════════════════════════════════
  // AI CURRICULUM, THEORY & MULTI-FORMAT ASSESSMENT GENERATOR
  // ══════════════════════════════════════════════════════════════════════
  async generateLessonCurriculum(request: GenerateCurriculumRequest): Promise<GenerateCurriculumResponse> {
    // Simulate on-device local model synthesis
    await new Promise((resolve) => setTimeout(resolve, 800))

    const topic = request.topic.trim() || 'Fundamentals & Core Concepts'
    const lang = request.language
    const langLabel = lang === 'python' ? 'Python 3' : lang === 'java' ? 'Java 21' : 'JavaScript (ES2024)'

    // Recommended YouTube Links by language & domain
    const recommendedVideoUrl =
      lang === 'python'
        ? 'https://www.youtube.com/watch?v=kqtD5dpn9C8'
        : lang === 'java'
        ? 'https://www.youtube.com/watch?v=A74TOX803D0'
        : 'https://www.youtube.com/watch?v=W6NZfCO5SIk'

    // Pre-video rich markdown theory content
    const contentMarkdown = `# ${topic}

Welcome to this in-depth guide on **${topic}** in **${langLabel}**. Read through this conceptual breakdown before proceeding to the video tutorial and assessment.

---

## 1. Core Architectural Concepts

Understanding ${topic.toLowerCase()} is vital for building robust, scalable software. In ${langLabel}, the runtime manages this logic efficiently through standard compiler/interpreter optimizations.

### Key Principles:
- **First Principles**: Establishing a clean mental model before writing production code.
- **Memory & Lifecycle**: How references and variables reside on the call stack vs. dynamic heap memory.
- **Predictability & Invariants**: Designing functions that avoid unintended side-effects.

---

## 2. Practical Syntax & Implementation

\`\`\`${lang}
${
  lang === 'python'
    ? `# ${topic} Example in Python
def process_data(items: list) -> dict:
    result = {"count": len(items), "valid": True}
    for item in items:
        if item is None:
            result["valid"] = False
            break
    return result

print(process_data([10, 20, 30]))`
    : lang === 'java'
    ? `// ${topic} Example in Java
import java.util.*;

public class DataProcessor {
    public static Map<String, Object> processData(List<Integer> items) {
        Map<String, Object> result = new HashMap<>();
        result.put("count", items.size());
        result.put("valid", !items.contains(null));
        return result;
    }
}`
    : `// ${topic} Example in JavaScript
function processData(items) {
  return {
    count: items.length,
    valid: !items.some((x) => x == null),
  };
}

console.log(processData([10, 20, 30]));`
}
\`\`\`

---

## 3. Common Pitfalls & Edge Cases

> [!WARNING]
> Always guard against boundary conditions such as empty collections, \`null\`/\`None\` references, and unexpected type coercions.

1. **Unchecked Bounds**: Verify array/list bounds before direct indexing.
2. **Resource Cleanup**: Ensure open streams or async promises resolve cleanly.
3. **Time Complexity**: Aim for optimal time complexity (e.g. O(1) or O(N)) when processing large inputs.
`

    // Multi-Format Assessments (MCQs, Fill-in-the-Blank, and Practical Coding)
    const quizQuestions: QuizQuestion[] = [
      {
        id: `q-mcq-1-${Date.now()}`,
        type: 'mcq',
        question: `In ${langLabel}, what is the primary advantage of validating boundary conditions before processing collections?`,
        options: [
          'It eliminates compile-time type verification entirely',
          'It prevents runtime exceptions (such as out-of-bounds or null reference crashes)',
          'It doubles the CPU clock frequency of the host machine',
          'It replaces the need for unit tests',
        ],
        correctAnswer: 1, // Second option
        explanation: 'Validating inputs and boundary conditions upfront protects the runtime against fatal crashes such as null pointer dereferences and index out-of-range exceptions.',
        hint: 'Think about runtime safety and crash prevention.',
      },
      {
        id: `q-mcq-2-${Date.now()}`,
        type: 'mcq',
        question: `What is the expected time complexity for searching an unsorted sequence of N items using linear traversal in ${langLabel}?`,
        options: [
          'O(1) Constant Time',
          'O(log N) Logarithmic Time',
          'O(N) Linear Time',
          'O(N^2) Quadratic Time',
        ],
        correctAnswer: 2, // Third option
        explanation: 'In an unsorted collection, finding an item in the worst case requires inspecting every element one-by-one from start to finish, yielding O(N) complexity.',
        hint: 'Linear search checks each element in sequence.',
      },
      {
        id: `q-fill-1-${Date.now()}`,
        type: 'fill_in',
        question: `Fill in the missing keyword in ${langLabel} to terminate a loop immediately upon meeting a search condition:`,
        codeSnippet:
          lang === 'python'
            ? `for item in items:\n    if item == target:\n        found = True\n        _____ # Terminate loop immediately`
            : `for (let i = 0; i < items.length; i++) {\n    if (items[i] === target) {\n        found = true;\n        _____; // Terminate loop immediately\n    }\n}`,
        correctAnswer: 'break',
        explanation: 'The `break` statement halts the execution of the innermost enclosing loop and continues program execution at the following statement.',
        hint: 'The standard loop termination keyword in C, Python, JavaScript, and Java.',
      },
      {
        id: `q-code-1-${Date.now()}`,
        type: 'code',
        question: `Practical Coding: Implement a function that takes an array of numbers and returns the sum of all strictly positive numbers (> 0).`,
        initialCode:
          lang === 'python'
            ? `def sum_positive_numbers(numbers: list) -> int:\n    # Write your solution here\n    pass`
            : lang === 'java'
            ? `public class Solution {\n    public static int sumPositiveNumbers(int[] numbers) {\n        // Write your solution here\n        return 0;\n    }\n}`
            : `function sumPositiveNumbers(numbers) {\n  // Write your solution here\n}`,
        testCases: [
          { input: '[1, -4, 7, 12]', expectedOutput: '20' },
          { input: '[-1, -2, -3]', expectedOutput: '0' },
          { input: '[10, 20, 30]', expectedOutput: '60' },
        ],
        correctAnswer:
          lang === 'python'
            ? `def sum_positive_numbers(numbers):\n    return sum(x for x in numbers if x > 0)`
            : `function sumPositiveNumbers(numbers) {\n  return numbers.filter(x => x > 0).reduce((acc, x) => acc + x, 0);\n}`,
        explanation: 'Iterate through the array and accumulate values that satisfy the condition (> 0).',
        hint: 'Filter or loop through elements and check if x > 0.',
      },
    ]

    return {
      title: topic,
      description: `Comprehensive breakdown of ${topic} with interactive theory, video guide, and verified quizzes.`,
      durationMinutes: 30,
      recommendedVideoUrl,
      contentMarkdown,
      quizQuestions,
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // AI TICKET & STUDENT ISSUE DIAGNOSTIC ASSISTANT
  // ══════════════════════════════════════════════════════════════════════
  async analyzeTicketIssue(request: import('./ai.types').AnalyzeTicketRequest): Promise<import('./ai.types').AnalyzeTicketResponse> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const sub = request.subject.toLowerCase()
    const desc = request.description.toLowerCase()
    const code = request.codeSnippet || ''

    if (sub.includes('palindrome') || desc.includes('palindrome') || code.includes('palindrome')) {
      return {
        summary: `The student (${request.studentName}) observed that test case 2 expects phrases like "A man a plan a canal Panama" to ignore whitespace and casing, which was ambiguous in the problem description.`,
        codeDiagnosis: `The student's submitted recursive function \`is_palindrome\` correctly attempts whitespace normalization with \`s.replace(" ", "").lower()\`. While \`replace(" ", "")\` removes spaces, multi-word phrases require all spaces removed. The student's question is primarily a curriculum clarification request for problem requirements.`,
        suggestedReply: `Hi ${request.studentName}, thank you for reaching out! You are absolutely right—we have updated the Palindrome Checker problem description to explicitly state that all whitespace and casing must be stripped before recursive evaluation. Great eye for detail and happy coding!`,
        suggestedAction: 'Update Problem Description & Resolve',
        suggestedStatus: 'resolved',
      }
    }

    if (sub.includes('leak') || desc.includes('memory') || desc.includes('listener')) {
      return {
        summary: `The student reported a potential listener or stream resource lifecycle warning.`,
        codeDiagnosis: `Event listener lifecycle has been reinforced with automatic unsubscription on view teardown.`,
        suggestedReply: `Hello ${request.studentName}, thank you for the feedback. We have verified the stream listener lifecycle and patched the teardown hook for air-gapped runtimes.`,
        suggestedAction: 'Patch Lifecycle Hook',
        suggestedStatus: 'resolved',
      }
    }

    // Default intelligent pedagogical diagnosis
    return {
      summary: `Inquiry regarding "${request.subject}" submitted by ${request.studentName}.`,
      codeDiagnosis: code
        ? `Code analysis confirms syntax structure. The inquiry relates to test case boundary expectations.`
        : `Pedagogical question regarding curriculum concepts.`,
      suggestedReply: `Hi ${request.studentName}, thank you for bringing this to our attention! We have investigated the issue and updated our curriculum notes accordingly.`,
      suggestedAction: 'Send Pedagogical Clarification',
      suggestedStatus: 'resolved',
    }
  }

  async checkModelHealth(): Promise<boolean> {
    return true
  }
}

export const aiService: IAIService = new MockAIService()

