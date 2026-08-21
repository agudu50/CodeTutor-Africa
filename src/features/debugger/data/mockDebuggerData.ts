import { DebugResult } from '@/types'

export const SAMPLE_BUGGY_SNIPPETS = {
  javascript: `function fetchUserData(userId) {
  let user;
  // Bug: Asynchronous assignment race condition
  setTimeout(() => {
    user = { id: userId, name: "Ama" };
  }, 100);
  return user.name; // TypeError: Cannot read properties of undefined (reading 'name')
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
  python: `def compute_average(scores):
    total = 0
    # Bug: Off-by-one boundary access
    for i in range(len(scores) + 1):
        total += scores[i]
    return total / len(scores)

print(compute_average([80, 90, 100]))`,
}

export const SAMPLE_ERROR_MESSAGES = {
  javascript: `TypeError: Cannot read properties of undefined (reading 'name')
    at fetchUserData (app.js:6:14)
    at main (app.js:10:1)`,
  java: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
    at ArraySearch.search(ArraySearch.java:4)
    at Main.main(Main.java:8)`,
  python: `IndexError: list index out of range
    at compute_average (solution.py:5)
    at <module> (solution.py:8)`,
}

export const MOCK_DEBUG_RESULTS_BY_LANGUAGE: Record<string, DebugResult> = {
  javascript: {
    id: 'dbg-js-1',
    language: 'javascript',
    originalCode: SAMPLE_BUGGY_SNIPPETS.javascript,
    errorMessage: SAMPLE_ERROR_MESSAGES.javascript,
    hasErrors: true,
    issues: [
      {
        line: 6,
        severity: 'error',
        type: 'AsyncRaceCondition',
        message: '`setTimeout` schedules the assignment callback to run asynchronously, but `return user.name` executes synchronously while `user` is still `undefined`.',
        suggestedFix: 'Use a `Promise` or `async/await` to wait for asynchronous resolution before accessing properties.',
      },
    ],
    explanationMarkdown: `### Bug Breakdown: Asynchronous Callback Race Condition
In JavaScript, \`setTimeout\` is **asynchronous** and non-blocking:

1. \`let user;\` declares \`user\` with value \`undefined\`.
2. \`setTimeout(..., 100)\` pushes the callback to the Event Loop timer queue.
3. The function continues immediately to \`return user.name\` **before** the 100ms timer fires.
4. Accessing \`.name\` on \`undefined\` throws a **TypeError**.`,
    fixedCode: `function fetchUserData(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = { id: userId, name: "Ama" };
      resolve(user.name);
    }, 100);
  });
}

// Usage:
// const name = await fetchUserData(101); // "Ama"`,
    conceptsInvolved: ['JavaScript Event Loop', 'Promises & Async/Await', 'Undefined Property Access'],
    createdAt: '2026-02-21T00:00:00Z',
  },

  java: {
    id: 'dbg-java-1',
    language: 'java',
    originalCode: SAMPLE_BUGGY_SNIPPETS.java,
    errorMessage: SAMPLE_ERROR_MESSAGES.java,
    hasErrors: true,
    issues: [
      {
        line: 4,
        severity: 'error',
        type: 'ArrayIndexOutOfBoundsException',
        message: '`i <= arr.length` evaluates `arr[arr.length]` on the final iteration, which exceeds the valid index range 0 to arr.length - 1.',
        suggestedFix: 'Change the loop condition from `i <= arr.length` to `i < arr.length` or use an enhanced for-each loop.',
      },
    ],
    explanationMarkdown: `### Bug Breakdown: Java Array Index Out Of Bounds
Java arrays are **0-indexed** with fixed capacity:

1. For an array with \`length = 3\`, valid indices are strictly \`0, 1, 2\`.
2. The loop condition \`i <= arr.length\` causes \`i\` to reach \`3\`.
3. Evaluating \`arr[3]\` on an array of length 3 triggers a JVM runtime **ArrayIndexOutOfBoundsException**.`,
    fixedCode: `public class ArraySearch {
    public static int search(int[] arr, int target) {
        // Corrected: Strictly less than array length
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }
}`,
    conceptsInvolved: ['Java Array Bounds', '0-based Indexing', 'ArrayIndexOutOfBoundsException'],
    createdAt: '2026-02-21T00:00:00Z',
  },

  python: {
    id: 'dbg-python-1',
    language: 'python',
    originalCode: SAMPLE_BUGGY_SNIPPETS.python,
    errorMessage: SAMPLE_ERROR_MESSAGES.python,
    hasErrors: true,
    issues: [
      {
        line: 4,
        severity: 'error',
        type: 'BoundaryConditionError',
        message: '`range(len(scores) + 1)` attempts to iterate from index 0 to 3 for a list of length 3.',
        suggestedFix: 'Replace `range(len(scores) + 1)` with `range(len(scores))` or iterate directly `for score in scores:`',
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
  },
}
