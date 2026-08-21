import { PracticeQuestion } from '@/types'

export const MOCK_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'practice-rec-1',
    title: 'Recursive Palindrome Checker',
    slug: 'recursive-palindrome-checker',
    description: 'Write a recursive function `is_palindrome(s: str) -> bool` that determines if a string is a palindrome. You must use recursion and not slice reversal like `s[::-1]`. Ignore spaces and casing.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Recursion',
    tags: ['Python', 'Strings', 'Recursion', 'Foundations'],
    starterCode: `def is_palindrome(s: str) -> bool:
    # Normalize string
    clean_s = ''.join(c.lower() for c in s if c.isalnum())
    
    # TODO: Implement base and recursive cases
    pass
`,
    testCases: [
      {
        id: 'tc-1',
        input: '"racecar"',
        expectedOutput: 'True',
        passed: true,
      },
      {
        id: 'tc-2',
        input: '"A man a plan a canal Panama"',
        expectedOutput: 'True',
        passed: true,
      },
      {
        id: 'tc-3',
        input: '"university"',
        expectedOutput: 'False',
        passed: true,
      },
    ],
    hints: [
      'What are the base cases? (A string of length 0 or 1 is always a palindrome).',
      'If the first and last characters match, check if the middle substring `clean_s[1:-1]` is also a palindrome.',
    ],
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'practice-js-2',
    title: 'Array Flatten & Deduplicate',
    slug: 'array-flatten-deduplicate',
    description: 'Write a JavaScript function `flattenAndUnique(arr)` that flattens a nested array of arbitrary depth and returns only the unique numbers in ascending order.',
    difficulty: 'beginner',
    language: 'javascript',
    category: 'Array Algorithms',
    tags: ['JavaScript', 'Arrays', 'Sets', 'Functional'],
    starterCode: `function flattenAndUnique(arr) {
  // TODO: Flatten deeply nested arrays and remove duplicate values
  return [];
}
`,
    testCases: [
      {
        id: 'tc-js-1',
        input: '[1, [2, [3, 2, 1], 4], [5, 4]]',
        expectedOutput: '[1, 2, 3, 4, 5]',
        passed: true,
      },
      {
        id: 'tc-js-2',
        input: '[[10, 20], [20, 30], 10]',
        expectedOutput: '[10, 20, 30]',
        passed: true,
      },
    ],
    hints: [
      'You can use recursion or `arr.flat(Infinity)` to flatten deeply nested items.',
      'Wrap the values into a `Set` to remove duplicates, then sort numerically with `.sort((a, b) => a - b)`.',
    ],
    createdAt: '2026-01-16T00:00:00Z',
  },
  {
    id: 'practice-java-1',
    title: 'Valid Parentheses & Bracket Matching',
    slug: 'valid-parentheses-brackets',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid using a Stack.',
    difficulty: 'intermediate',
    language: 'java',
    category: 'Data Structures',
    tags: ['Java', 'Stack', 'Parsing', 'Algorithms'],
    starterCode: `import java.util.Stack;

public class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        // TODO: Push opening brackets and pop matching pairs
        return false;
    }
}
`,
    testCases: [
      {
        id: 'tc-j-1',
        input: '"()[]{}"',
        expectedOutput: 'true',
        passed: true,
      },
      {
        id: 'tc-j-2',
        input: '"([)]"',
        expectedOutput: 'false',
        passed: true,
      },
      {
        id: 'tc-j-3',
        input: '"{[]}"',
        expectedOutput: 'true',
        passed: true,
      },
    ],
    hints: [
      'Whenever you see an opening bracket `(`, `{`, `[`, push the corresponding closing bracket onto the stack.',
      'When you see a closing bracket, pop from the stack and verify it matches the current character.',
    ],
    createdAt: '2026-01-17T00:00:00Z',
  },
  {
    id: 'practice-algo-1',
    title: 'Two Sum with Optimal Hash Map',
    slug: 'two-sum-hash-map',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target in O(N) time.',
    difficulty: 'intermediate',
    language: 'python',
    category: 'Data Structures',
    tags: ['Python', 'Arrays', 'Hash Map', 'O(N)'],
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # TODO: Store complement in a hash map for O(1) lookup
    seen = {}
    for i, num in enumerate(nums):
        pass
`,
    testCases: [
      {
        id: 'tc-4',
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]',
        passed: true,
      },
      {
        id: 'tc-5',
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]',
        passed: true,
      },
    ],
    hints: [
      'Calculate `complement = target - num`. Have we encountered this complement before?',
    ],
    createdAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 'practice-js-1',
    title: 'Custom Promise.all Implementation',
    slug: 'custom-promise-all',
    description: 'Implement a function `promiseAll(promises)` that returns a Promise that resolves when all input promises have resolved or rejects as soon as any promise rejects.',
    difficulty: 'advanced',
    language: 'javascript',
    category: 'Async Patterns',
    tags: ['JavaScript', 'Promises', 'Concurrency'],
    starterCode: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    // TODO: Track resolved count and outputs
  });
}
`,
    testCases: [
      {
        id: 'tc-6',
        input: '[Promise.resolve(1), Promise.resolve(2)]',
        expectedOutput: '[1, 2]',
        passed: true,
      },
    ],
    hints: [
      'Keep track of a `completed` counter. Resolve the outer promise only when `completed === promises.length`.',
    ],
    createdAt: '2026-01-19T00:00:00Z',
  },
]
