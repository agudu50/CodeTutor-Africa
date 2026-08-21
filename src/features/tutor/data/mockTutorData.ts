import { ChatMessage, TutorSession } from '@/types'

export const MOCK_TUTOR_SESSIONS: TutorSession[] = [
  {
    id: 'session-1',
    title: 'Recursion Call Stack & Memory Frames',
    topic: 'Recursion',
    language: 'python',
    mode: 'socratic',
    messageCount: 4,
    lastMessagePreview: 'Every recursive step places a frame onto the stack until reaching the base case...',
    createdAt: '2026-02-20T10:30:00Z',
  },
  {
    id: 'session-2',
    title: 'Async/Await & Promise Chaining',
    topic: 'Asynchronous Programming',
    language: 'javascript',
    mode: 'direct_explanation',
    messageCount: 6,
    lastMessagePreview: 'Remember that async functions always return a Promise implicitly.',
    createdAt: '2026-02-19T14:15:00Z',
  },
  {
    id: 'session-3',
    title: 'Java Polymorphism & Interfaces',
    topic: 'Object-Oriented Programming',
    language: 'java',
    mode: 'concept_deepdive',
    messageCount: 3,
    lastMessagePreview: 'Interfaces define contracts without implementation before Java 8 default methods.',
    createdAt: '2026-02-18T09:00:00Z',
  },
]

export const MOCK_INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'session-1': [
    {
      id: 'msg-1',
      sessionId: 'session-1',
      role: 'user',
      content: 'Can you explain why forgetting a base case in recursion causes a RecursionError in Python?',
      createdAt: '2026-02-20T10:30:00Z',
    },
    {
      id: 'msg-2',
      sessionId: 'session-1',
      role: 'assistant',
      content: `Let's visualize what happens in your computer's RAM when a function calls itself.

When a function executes, Python allocates a block of memory called a **Stack Frame** on the Call Stack to store its local variables, arguments, and return address.

Without a **Base Case**, the function will perpetually spawn new stack frames without ever returning and popping old ones. Eventually, Python hits its safety recursion limit (default: **1,000 frames**) and throws:

\`\`\`text
RecursionError: maximum recursion depth exceeded while calling a Python object
\`\`\`

Here is a side-by-side comparison:`,
      codeBlocks: [
        {
          language: 'python',
          code: `# ❌ DANGEROUS: Missing Base Case\ndef countdown_infinite(n):\n    print(n)\n    return countdown_infinite(n - 1)  # Infinite recursion!\n\n# ✅ SAFE: Clear Base Condition\ndef countdown_safe(n):\n    if n <= 0:  # Base Case\n        print("Blast off!")\n        return\n    print(n)\n    countdown_safe(n - 1)  # Moves towards base case`,
        },
      ],
      suggestedFollowups: [
        'How can I increase the recursion limit in sys?',
        'What is Tail Call Optimization (TCO) and does Python support it?',
        'Can you show me how to rewrite countdown with a while loop?',
      ],
      tokensCount: 220,
      inferenceTimeMs: 450,
      createdAt: '2026-02-20T10:30:10Z',
    },
  ],
}
