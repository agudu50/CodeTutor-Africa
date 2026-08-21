import { DebugResult } from '@/types'

export const SAMPLE_BUGGY_SNIPPETS = {
  python: `def compute_average(scores):
    total = 0
    # Bug: Off-by-one boundary access
    for i in range(len(scores) + 1):
        total += scores[i]
    return total / len(scores)

print(compute_average([80, 90, 100]))`,
  javascript: `function fetchUserData(userId) {
  let user;
  // Bug: Asynchronous assignment race condition
  setTimeout(() => {
    user = { id: userId, name: "Ama" };
  }, 100);
  return user.name; // Uncaught TypeError: Cannot read property 'name' of undefined
}`,
  java: `public class ArraySearch {
    public static int search(int[] arr, int target) {
        // Bug: Loop condition causes ArrayIndexOutOfBoundsException
        for (int i = 0; i <= arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }
}`,
}

export const MOCK_INITIAL_DEBUG_RESULT: DebugResult = {
  id: 'dbg-sample-1',
  language: 'python',
  originalCode: SAMPLE_BUGGY_SNIPPETS.python,
  errorMessage: 'IndexError: list index out of range at line 5',
  hasErrors: true,
  issues: [
    {
      line: 4,
      severity: 'error',
      type: 'BoundaryConditionError',
      message: '`range(len(scores) + 1)` attempts to iterate from index 0 to 3 for a list of length 3.',
      suggestedFix: 'Replace `range(len(scores) + 1)` with `range(len(scores))` or iterate directly over items `for score in scores:`',
    },
  ],
  explanationMarkdown: `### Bug Breakdown: Off-by-One Loop Bounds
In Python, lists are **0-indexed**. If a list has 3 items (\`[80, 90, 100]\`), valid indices are \`0, 1, 2\`.

1. \`len(scores)\` returns \`3\`.
2. \`range(len(scores) + 1)\` creates the sequence \`[0, 1, 2, 3]\`.
3. On the 4th iteration, \`scores[3]\` does not exist, triggering an **IndexError**.`,
  fixedCode: `def compute_average(scores):
    if not scores:
        return 0
    total = 0
    for score in scores:
        total += score
    return total / len(scores)

print(compute_average([80, 90, 100])) # Output: 90.0`,
  conceptsInvolved: ['Zero-based Indexing', 'IndexError Prevention', 'Idiomatic For-in Loops'],
  createdAt: '2026-02-21T00:00:00Z',
}
