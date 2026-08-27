import { PracticeQuestion } from '@/types'

export const MOCK_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // ═════════════════════════════════════════════════════════════
  // PYTHON TRACK: Learn to code with Python (course-py-101)
  // ═════════════════════════════════════════════════════════════
  {
    id: 'practice-py-m1',
    title: 'Output & Welcome Badge Formatter',
    slug: 'python-output-welcome-badge',
    description: 'Write a Python function print_welcome_badge(name: str, country: str) -> str that returns a formatted greeting badge in the exact format: "Welcome {name} from {country} to CodeTutor Africa!".',
    difficulty: 'beginner',
    language: 'python',
    category: 'Output & Statements',
    tags: ['Python', 'Print', 'Strings', 'Module 1'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-1',
    moduleTitle: 'Module 1: Your First Lines of Code',
    moduleOrder: 1,
    timeLimitMinutes: 10,
    maxAttempts: 5,
    starterCode: `def print_welcome_badge(name: str, country: str) -> str:
    # TODO: Construct and return the welcome badge string
    # Format: "Welcome {name} from {country} to CodeTutor Africa!"
    pass
`,
    solutionCode: `def print_welcome_badge(name: str, country: str) -> str:
    return f"Welcome {name} from {country} to CodeTutor Africa!"
`,
    testCases: [
      { id: 'tc-py-1', input: 'name = "Kofi", country = "Ghana"', expectedOutput: '"Welcome Kofi from Ghana to CodeTutor Africa!"', passed: true },
      { id: 'tc-py-2', input: 'name = "Amina", country = "Nigeria"', expectedOutput: '"Welcome Amina from Nigeria to CodeTutor Africa!"', passed: true },
    ],
    hints: [
      'Use a Python f-string: f"Welcome {name} from {country} to CodeTutor Africa!".',
      'Ensure the casing and exclamation point match the expected output exactly.',
    ],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'practice-py-m2',
    title: 'Shopping Bill & Tax Calculator',
    slug: 'python-shopping-bill-calculator',
    description: 'Write a Python function calculate_total_bill(subtotal: float, tax_rate: float, discount: float) -> float that deducts the discount, applies the tax rate to the discounted amount, and returns the final total rounded to 2 decimal places.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Variables & Arithmetic',
    tags: ['Python', 'Variables', 'Math', 'Module 2'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-2',
    moduleTitle: 'Module 2: Variables & Memory Boxes',
    moduleOrder: 2,
    timeLimitMinutes: 12,
    maxAttempts: 3,
    starterCode: `def calculate_total_bill(subtotal: float, tax_rate: float, discount: float) -> float:
    # 1. Deduct discount from subtotal
    # 2. Add tax on the discounted amount
    # 3. Return the result rounded to 2 decimals using round(total, 2)
    pass
`,
    solutionCode: `def calculate_total_bill(subtotal: float, tax_rate: float, discount: float) -> float:
    discounted = subtotal - discount
    total = discounted + (discounted * tax_rate)
    return round(total, 2)
`,
    testCases: [
      { id: 'tc-py-3', input: 'subtotal = 100.0, tax_rate = 0.15, discount = 10.0', expectedOutput: '103.5', passed: true },
      { id: 'tc-py-4', input: 'subtotal = 50.0, tax_rate = 0.05, discount = 0.0', expectedOutput: '52.5', passed: true },
    ],
    hints: [
      'First calculate: discounted = subtotal - discount.',
      'Then compute: total = discounted + (discounted * tax_rate).',
      'Finally return round(total, 2).',
    ],
    createdAt: '2026-01-11T00:00:00Z',
  },
  {
    id: 'practice-py-m3',
    title: 'Student Grade & Pass-Fail Classifier',
    slug: 'python-student-grade-classifier',
    description: 'Write a Python function determine_grade(score: int) -> str that returns letter grades: "A" (>= 90), "B" (>= 80), "C" (>= 70), "D" (>= 60), or "F" (< 60).',
    difficulty: 'beginner',
    language: 'python',
    category: 'Conditionals & If/Else',
    tags: ['Python', 'Conditionals', 'Logic', 'Module 3'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-3',
    moduleTitle: 'Module 3: Making Decisions with If/Else',
    moduleOrder: 3,
    timeLimitMinutes: 10,
    maxAttempts: 3,
    starterCode: `def determine_grade(score: int) -> str:
    # TODO: Write conditional if-elif-else statements to classify score
    pass
`,
    solutionCode: `def determine_grade(score: int) -> str:
    if score >= 90: return "A"
    elif score >= 80: return "B"
    elif score >= 70: return "C"
    elif score >= 60: return "D"
    return "F"
`,
    testCases: [
      { id: 'tc-py-5', input: 'score = 95', expectedOutput: '"A"', passed: true },
      { id: 'tc-py-6', input: 'score = 72', expectedOutput: '"C"', passed: true },
      { id: 'tc-py-7', input: 'score = 55', expectedOutput: '"F"', passed: true },
    ],
    hints: [
      'Check highest scores first with if score >= 90: return "A".',
      'Use elif score >= 80: down to the final else: return "F".',
    ],
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'practice-py-m4',
    title: 'Sum of Even Numbers & Loop Accumulator',
    slug: 'python-sum-even-numbers',
    description: 'Write a Python function sum_even_numbers(n: int) -> int that calculates and returns the sum of all positive even integers from 2 up to n (inclusive) using a loop.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Loops & Iteration',
    tags: ['Python', 'Loops', 'Accumulator', 'Module 4'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-4',
    moduleTitle: 'Module 4: Loops: Repeating Without Copy-Paste',
    moduleOrder: 4,
    timeLimitMinutes: 12,
    maxAttempts: 3,
    starterCode: `def sum_even_numbers(n: int) -> int:
    # 1. Initialize an accumulator variable total = 0
    # 2. Iterate through even numbers up to n
    # 3. Return the total sum
    pass
`,
    solutionCode: `def sum_even_numbers(n: int) -> int:
    total = 0
    for i in range(2, n + 1, 2):
        total += i
    return total
`,
    testCases: [
      { id: 'tc-py-8', input: 'n = 10', expectedOutput: '30', passed: true },
      { id: 'tc-py-9', input: 'n = 6', expectedOutput: '12', passed: true },
    ],
    hints: [
      'You can step by 2 using range(2, n + 1, 2).',
      'Or check if each number is divisible by 2 with i % 2 == 0.',
    ],
    createdAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 'practice-py-m6',
    title: 'List Extrema & Outlier Filter',
    slug: 'python-list-extrema-filter',
    description: 'Write a Python function find_extrema(nums: list[int]) -> dict that returns a dictionary {"min": x, "max": y, "avg": z} containing minimum, maximum, and average values rounded to 1 decimal.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Lists & Arrays',
    tags: ['Python', 'Lists', 'Collections', 'Module 6'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-6',
    moduleTitle: 'Module 6: Lists & Arrays: Managing Collections',
    moduleOrder: 6,
    timeLimitMinutes: 15,
    maxAttempts: 3,
    starterCode: `def find_extrema(nums: list[int]) -> dict:
    # Guard against empty list
    if not nums:
        return {"min": 0, "max": 0, "avg": 0.0}
    
    # TODO: Find min, max, and calculate average without mutating input
    pass
`,
    solutionCode: `def find_extrema(nums: list[int]) -> dict:
    if not nums:
        return {"min": 0, "max": 0, "avg": 0.0}
    curr_min = nums[0]
    curr_max = nums[0]
    total = 0
    for num in nums:
        if num < curr_min: curr_min = num
        if num > curr_max: curr_max = num
        total += num
    return {"min": curr_min, "max": curr_max, "avg": round(total / len(nums), 1)}
`,
    testCases: [
      { id: 'tc-py-12', input: 'nums = [10, 5, 20, 15]', expectedOutput: '{"min": 5, "max": 20, "avg": 12.5}', passed: true },
    ],
    hints: [
      'Initialize curr_min and curr_max with nums[0].',
      'Iterate through the list and update extrema while adding to total.',
    ],
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'practice-rec-1',
    title: 'Recursive Palindrome Checker',
    slug: 'recursive-palindrome-checker',
    description: 'Write a recursive function is_palindrome(s: str) -> bool that determines if a string is a palindrome. You must use recursion and not slice reversal like s[::-1]. Ignore spaces and casing.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Strings & Recursion',
    tags: ['Python', 'Strings', 'Recursion', 'Module 8'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-8',
    moduleTitle: 'Module 8: Strings & Text Manipulation',
    moduleOrder: 8,
    timeLimitMinutes: 15,
    maxAttempts: 3,
    starterCode: `def is_palindrome(s: str) -> bool:
    # 1. Normalize string: strip spaces/punctuation and lowercase
    clean_s = ''.join(c.lower() for c in s if c.isalnum())
    
    # TODO: Implement base cases (len <= 1) and recursive comparison
    pass
`,
    solutionCode: `def is_palindrome(s: str) -> bool:
    clean_s = ''.join(c.lower() for c in s if c.isalnum())
    if len(clean_s) <= 1:
        return True
    if clean_s[0] != clean_s[-1]:
        return False
    return is_palindrome(clean_s[1:-1])
`,
    testCases: [
      { id: 'tc-py-14', input: '"racecar"', expectedOutput: 'True', passed: true },
      { id: 'tc-py-15', input: '"university"', expectedOutput: 'False', passed: true },
    ],
    hints: [
      'Base Case: If len(clean_s) <= 1, it is always a palindrome (return True).',
      'If clean_s[0] != clean_s[-1], return False.',
      'Otherwise, make the recursive call: return is_palindrome(clean_s[1:-1]).',
    ],
    createdAt: '2026-01-17T00:00:00Z',
  },
  {
    id: 'practice-algo-1',
    title: 'Two Sum with Optimal Hash Map',
    slug: 'two-sum-hash-map',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target in O(N) time.',
    difficulty: 'intermediate',
    language: 'python',
    category: 'Algorithms & Hash Maps',
    tags: ['Python', 'Algorithms', 'Hash Map', 'Module 15'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-15',
    moduleTitle: 'Module 15: Algorithms: Searching & Sorting',
    moduleOrder: 15,
    timeLimitMinutes: 20,
    maxAttempts: 3,
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # TODO: Use a dictionary (seen = {}) to store numbers and indices for O(1) lookup
    pass
`,
    solutionCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
`,
    testCases: [
      { id: 'tc-py-16', input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', passed: true },
    ],
    hints: [
      'Calculate complement = target - num.',
      'If complement in seen: return [seen[complement], i].',
      'Otherwise record seen[num] = i.',
    ],
    createdAt: '2026-01-18T00:00:00Z',
  },

  // ═════════════════════════════════════════════════════════════
  // JAVASCRIPT TRACK: Learn to code with JS (course-js-201)
  // ═════════════════════════════════════════════════════════════
  {
    id: 'practice-js-m1',
    title: 'Console Greeting & String Badge Formatter',
    slug: 'js-console-greeting-formatter',
    description: 'Write a JavaScript function formatGreeting(name, role) that returns a standardized welcome badge string in the format: "Welcome {name}, registered as {role}!".',
    difficulty: 'beginner',
    language: 'javascript',
    category: 'Statements & Output',
    tags: ['JavaScript', 'Strings', 'Console', 'Module 1'],
    courseId: 'course-js-201',
    courseTitle: 'Learn to code with JS',
    moduleId: 'mod-js-1',
    moduleTitle: 'Module 1: Your First Lines of Code',
    moduleOrder: 1,
    timeLimitMinutes: 10,
    maxAttempts: 5,
    starterCode: `function formatGreeting(name, role) {
  // TODO: Return formatted greeting using template literals
  // Format: "Welcome {name}, registered as {role}!"
  
}
`,
    solutionCode: `function formatGreeting(name, role) {
  return \`Welcome \${name}, registered as \${role}!\`;
}
`,
    testCases: [
      { id: 'tc-js-m1', input: 'name = "Abebe", role = "Frontend Dev"', expectedOutput: '"Welcome Abebe, registered as Frontend Dev!"', passed: true },
    ],
    hints: [
      'Use template literals: `Welcome ${name}, registered as ${role}!`.',
    ],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'practice-js-m2',
    title: 'Dynamic Type & Balance Calculator',
    slug: 'js-balance-calculator',
    description: 'Write a JavaScript function calculateBalance(initial, deposits, withdrawals) that performs arithmetic and returns a fixed 2-decimal number.',
    difficulty: 'beginner',
    language: 'javascript',
    category: 'Variables & Data Types',
    tags: ['JavaScript', 'Variables', 'Math', 'Module 2'],
    courseId: 'course-js-201',
    courseTitle: 'Learn to code with JS',
    moduleId: 'mod-js-2',
    moduleTitle: 'Module 2: Variables & Memory Boxes',
    moduleOrder: 2,
    timeLimitMinutes: 12,
    maxAttempts: 3,
    starterCode: `function calculateBalance(initial, deposits, withdrawals) {
  // TODO: Compute (initial + deposits - withdrawals) and return as number
  
}
`,
    solutionCode: `function calculateBalance(initial, deposits, withdrawals) {
  const finalBalance = initial + deposits - withdrawals;
  return Number(finalBalance.toFixed(2));
}
`,
    testCases: [
      { id: 'tc-js-m2', input: 'initial = 100, deposits = 50, withdrawals = 20.5', expectedOutput: '129.5', passed: true },
    ],
    hints: [
      'Compute: const total = initial + deposits - withdrawals.',
      'Use Number(total.toFixed(2)) to format nicely.',
    ],
    createdAt: '2026-01-11T00:00:00Z',
  },
  {
    id: 'practice-js-2',
    title: 'Array Flatten & Deduplicate',
    slug: 'array-flatten-deduplicate',
    description: 'Write a JavaScript function flattenAndUnique(arr) that flattens a nested array of arbitrary depth and returns only the unique numbers in ascending order.',
    difficulty: 'beginner',
    language: 'javascript',
    category: 'Array Algorithms',
    tags: ['JavaScript', 'Arrays', 'Sets', 'Module 6'],
    courseId: 'course-js-201',
    courseTitle: 'Learn to code with JS',
    moduleId: 'mod-js-6',
    moduleTitle: 'Module 6: Lists & Arrays: Managing Collections',
    moduleOrder: 6,
    timeLimitMinutes: 15,
    maxAttempts: 3,
    starterCode: `function flattenAndUnique(arr) {
  // 1. Flatten nested items of any depth
  // 2. Remove duplicate values
  // 3. Sort numerically ascending
  
}
`,
    solutionCode: `function flattenAndUnique(arr) {
  const flat = arr.flat(Infinity);
  const unique = Array.from(new Set(flat));
  return unique.sort((a, b) => a - b);
}
`,
    testCases: [
      { id: 'tc-js-m5', input: '[1, [2, [3, 2, 1], 4], [5, 4]]', expectedOutput: '[1, 2, 3, 4, 5]', passed: true },
    ],
    hints: [
      'Use arr.flat(Infinity) to unpack all nested sub-arrays.',
      'Pass the result to new Set() to eliminate duplicate numbers.',
      'Use .sort((a, b) => a - b) for numeric sort.',
    ],
    createdAt: '2026-01-16T00:00:00Z',
  },
  {
    id: 'practice-js-1',
    title: 'Custom Promise.all Implementation',
    slug: 'custom-promise-all',
    description: 'Implement a function promiseAll(promises) that returns a Promise that resolves when all input promises have resolved or rejects as soon as any promise rejects.',
    difficulty: 'advanced',
    language: 'javascript',
    category: 'Async Patterns & Concurrency',
    tags: ['JavaScript', 'Promises', 'Async', 'Module 17'],
    courseId: 'course-js-201',
    courseTitle: 'Learn to code with JS',
    moduleId: 'mod-js-17',
    moduleTitle: 'Module 17: Asynchronous & Modern Patterns',
    moduleOrder: 17,
    timeLimitMinutes: 20,
    maxAttempts: 3,
    starterCode: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    // TODO: Track resolved count and outputs in an array
    
  });
}
`,
    solutionCode: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises) || promises.length === 0) return resolve([]);
    const results = [];
    let completed = 0;

    promises.forEach((p, idx) => {
      Promise.resolve(p)
        .then((val) => {
          results[idx] = val;
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}
`,
    testCases: [
      { id: 'tc-js-m7', input: '[Promise.resolve(1), Promise.resolve(2)]', expectedOutput: '[1, 2]', passed: true },
    ],
    hints: [
      'Keep track of a completed counter.',
      'Resolve only when completed === promises.length.',
    ],
    createdAt: '2026-01-22T00:00:00Z',
  },

  // ═════════════════════════════════════════════════════════════
  // JAVA TRACK: Learn to code with Java (course-java-301)
  // ═════════════════════════════════════════════════════════════
  {
    id: 'practice-java-m1',
    title: 'Console Message & System Alert Formatter',
    slug: 'java-console-alert-formatter',
    description: 'Write a Java method formatAlert(String systemName, int errorCode) -> String that formats a system alert in the format: "[ALERT] System: {systemName} | Error: #{errorCode}".',
    difficulty: 'beginner',
    language: 'java',
    category: 'Output & Statements',
    tags: ['Java', 'Print', 'Syntax', 'Module 1'],
    courseId: 'course-java-301',
    courseTitle: 'Learn to code with Java',
    moduleId: 'mod-java-1',
    moduleTitle: 'Module 1: Your First Lines of Code',
    moduleOrder: 1,
    timeLimitMinutes: 10,
    maxAttempts: 5,
    starterCode: `public class Solution {
    public static String formatAlert(String systemName, int errorCode) {
        // TODO: Return formatted alert string
        return "";
    }
}
`,
    solutionCode: `public class Solution {
    public static String formatAlert(String systemName, int errorCode) {
        return String.format("[ALERT] System: %s | Error: #%d", systemName, errorCode);
    }
}
`,
    testCases: [
      { id: 'tc-j-m1', input: 'systemName = "AUTH_SERVICE", errorCode = 401', expectedOutput: '"[ALERT] System: AUTH_SERVICE | Error: #401"', passed: true },
    ],
    hints: [
      'Use String.format("[ALERT] System: %s | Error: #%d", systemName, errorCode);.',
    ],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'practice-java-1',
    title: 'Valid Parentheses & Bracket Matching',
    slug: 'valid-parentheses-brackets',
    description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid using a Stack.',
    difficulty: 'intermediate',
    language: 'java',
    category: 'Data Structures & Stacks',
    tags: ['Java', 'Stack', 'Data Structures', 'Module 14'],
    courseId: 'course-java-301',
    courseTitle: 'Learn to code with Java',
    moduleId: 'mod-java-14',
    moduleTitle: 'Module 14: Data Structures: Stacks, Queues & Sets',
    moduleOrder: 14,
    timeLimitMinutes: 15,
    maxAttempts: 3,
    starterCode: `import java.util.Stack;

public class Solution {
    public static boolean isValid(String s) {
        // TODO: Push matching closing brackets onto stack and verify
        return false;
    }
}
`,
    solutionCode: `public class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}
`,
    testCases: [
      { id: 'tc-j-m4', input: '"()[]{}"', expectedOutput: 'true', passed: true },
      { id: 'tc-j-m5', input: '"([)]"', expectedOutput: 'false', passed: true },
    ],
    hints: [
      'When you see an opening bracket, push its matching closing bracket onto the stack.',
      'When you see a closing bracket, pop from the stack and ensure it equals the character.',
    ],
    createdAt: '2026-01-20T00:00:00Z',
  },

  // ═════════════════════════════════════════════════════════════
  // TYPESCRIPT TRACK: Learn to code with TypeScript (course-ts-401)
  // ═════════════════════════════════════════════════════════════
  {
    id: 'practice-ts-m1',
    title: 'Typed Greeting & Profile Formatter',
    slug: 'ts-typed-greeting-formatter',
    description: 'Write a TypeScript function formatUserProfile(user: { id: string; name: string; isPro: boolean }) -> string that returns "[PRO] {name} ({id})" if isPro is true, or "[FREE] {name} ({id})" otherwise.',
    difficulty: 'beginner',
    language: 'typescript',
    category: 'Types & Interfaces',
    tags: ['TypeScript', 'Types', 'Interfaces', 'Module 1'],
    courseId: 'course-ts-401',
    courseTitle: 'Learn to code with TypeScript',
    moduleId: 'mod-ts-1',
    moduleTitle: 'Module 1: Your First Lines of Code',
    moduleOrder: 1,
    timeLimitMinutes: 10,
    maxAttempts: 5,
    starterCode: `interface UserProfile {
  id: string;
  name: string;
  isPro: boolean;
}

function formatUserProfile(user: UserProfile): string {
  // TODO: Return formatted profile string with [PRO] or [FREE] badge
  
}
`,
    solutionCode: `interface UserProfile {
  id: string;
  name: string;
  isPro: boolean;
}

function formatUserProfile(user: UserProfile): string {
  const badge = user.isPro ? "[PRO]" : "[FREE]";
  return \`\${badge} \${user.name} (\${user.id})\`;
}
`,
    testCases: [
      { id: 'tc-ts-m1', input: '{ id: "usr_10", name: "Chinedu", isPro: true }', expectedOutput: '"[PRO] Chinedu (usr_10)"', passed: true },
    ],
    hints: [
      'Check: const badge = user.isPro ? "[PRO]" : "[FREE]";.',
      'Return template string with backticks and interpolated variables.',
    ],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'practice-ts-1',
    title: 'TypeScript Type-Safe Object Mapper',
    slug: 'typescript-type-safe-mapper',
    description: 'Write a TypeScript utility function mapObject<T, K, V> that transforms all values of an object according to a mapping function while preserving strict type keys.',
    difficulty: 'intermediate',
    language: 'typescript',
    category: 'Mapped Types & Generics',
    tags: ['TypeScript', 'Generics', 'Objects', 'Module 7'],
    courseId: 'course-ts-401',
    courseTitle: 'Learn to code with TypeScript',
    moduleId: 'mod-ts-7',
    moduleTitle: 'Module 7: Objects & Dictionaries: Key-Value Stores',
    moduleOrder: 7,
    timeLimitMinutes: 15,
    maxAttempts: 3,
    starterCode: `function mapObject<K extends string | number, T, U>(
  obj: Record<K, T>,
  transform: (val: T, key: K) => U
): Record<K, U> {
  // TODO: Transform all properties while keeping strict keys
  
}
`,
    solutionCode: `function mapObject<K extends string | number, T, U>(
  obj: Record<K, T>,
  transform: (val: T, key: K) => U
): Record<K, U> {
  const result = {} as Record<K, U>;
  for (const key of Object.keys(obj) as K[]) {
    result[key] = transform(obj[key], key);
  }
  return result;
}
`,
    testCases: [
      { id: 'tc-ts-m3', input: 'obj = { a: 1, b: 2 }, transform = x => x * 10', expectedOutput: '{ a: 10, b: 20 }', passed: true },
    ],
    hints: [
      'Iterate over Object.keys(obj) as K[].',
      'Assign result[key] = transform(obj[key], key).',
    ],
    createdAt: '2026-01-20T00:00:00Z',
  },
]
