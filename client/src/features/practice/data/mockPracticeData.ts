import { PracticeQuestion } from '@/types'

export const MOCK_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // ═════════════════════════════════════════════════════════════
  // PYTHON TRACK: Learn to code with Python (course-py-101)
  // ═════════════════════════════════════════════════════════════
  {
    id: 'practice-py-m1',
    title: 'Output & Welcome Badge Formatter',
    slug: 'python-output-welcome-badge',
    description: 'Write a Python function `print_welcome_badge(name: str, country: str) -> str` that formats a student welcome greeting with neat formatting.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Output & Statements',
    tags: ['Python', 'Print', 'Strings', 'Module 1'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-1',
    moduleTitle: 'Module 1: Your First Lines of Code',
    moduleOrder: 1,
    starterCode: `def print_welcome_badge(name: str, country: str) -> str:
    # TODO: Return formatted welcome badge string
    return f"Welcome {name} from {country} to CodeTutor Africa!"
`,
    testCases: [
      { id: 'tc-py-1', input: 'name = "Kofi", country = "Ghana"', expectedOutput: '"Welcome Kofi from Ghana to CodeTutor Africa!"', passed: true },
      { id: 'tc-py-2', input: 'name = "Amina", country = "Nigeria"', expectedOutput: '"Welcome Amina from Nigeria to CodeTutor Africa!"', passed: true },
    ],
    hints: ['Use Python f-strings `f"Welcome {name}..."` to embed variables.'],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'practice-py-m2',
    title: 'Shopping Bill & Tax Calculator',
    slug: 'python-shopping-bill-calculator',
    description: 'Write a Python function `calculate_total_bill(subtotal: float, tax_rate: float, discount: float) -> float` that computes the final bill rounded to 2 decimal places.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Variables & Arithmetic',
    tags: ['Python', 'Variables', 'Math', 'Module 2'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-2',
    moduleTitle: 'Module 2: Variables & Memory Boxes',
    moduleOrder: 2,
    starterCode: `def calculate_total_bill(subtotal: float, tax_rate: float, discount: float) -> float:
    discounted = subtotal - discount
    total = discounted + (discounted * tax_rate)
    return round(total, 2)
`,
    testCases: [
      { id: 'tc-py-3', input: 'subtotal = 100.0, tax_rate = 0.15, discount = 10.0', expectedOutput: '103.5', passed: true },
      { id: 'tc-py-4', input: 'subtotal = 50.0, tax_rate = 0.05, discount = 0.0', expectedOutput: '52.5', passed: true },
    ],
    hints: ['Subtract discount first, apply tax rate, then use `round(total, 2)`.'],
    createdAt: '2026-01-11T00:00:00Z',
  },
  {
    id: 'practice-py-m3',
    title: 'Student Grade & Pass-Fail Classifier',
    slug: 'python-student-grade-classifier',
    description: 'Write a Python function `determine_grade(score: int) -> str` that returns `"A"` (>= 90), `"B"` (>= 80), `"C"` (>= 70), `"D"` (>= 60), or `"F"` (< 60).',
    difficulty: 'beginner',
    language: 'python',
    category: 'Conditionals & If/Else',
    tags: ['Python', 'Conditionals', 'Logic', 'Module 3'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-3',
    moduleTitle: 'Module 3: Making Decisions with If/Else',
    moduleOrder: 3,
    starterCode: `def determine_grade(score: int) -> str:
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
    hints: ['Use `if-elif-else` branches starting from highest score threshold.'],
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'practice-py-m4',
    title: 'Sum of Even Numbers & Loop Accumulator',
    slug: 'python-sum-even-numbers',
    description: 'Write a Python function `sum_even_numbers(n: int) -> int` that calculates the sum of all positive even integers from 2 up to `n` (inclusive) using a loop.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Loops & Iteration',
    tags: ['Python', 'Loops', 'Accumulator', 'Module 4'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-4',
    moduleTitle: 'Module 4: Loops: Repeating Without Copy-Paste',
    moduleOrder: 4,
    starterCode: `def sum_even_numbers(n: int) -> int:
    total = 0
    for i in range(2, n + 1, 2):
        total += i
    return total
`,
    testCases: [
      { id: 'tc-py-8', input: 'n = 10', expectedOutput: '30', passed: true },
      { id: 'tc-py-9', input: 'n = 6', expectedOutput: '12', passed: true },
    ],
    hints: ['`range(2, n + 1, 2)` steps through only even numbers.'],
    createdAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 'practice-py-m5',
    title: 'Temperature Converter with Unit Defaults',
    slug: 'python-temperature-converter',
    description: 'Write a Python function `convert_temperature(val: float, to_unit: str = "F") -> float` that converts Celsius to Fahrenheit (`(val * 9/5) + 32`) or Fahrenheit to Celsius (`(val - 32) * 5/9`). Round to 1 decimal place.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Functions & Parameters',
    tags: ['Python', 'Functions', 'Parameters', 'Module 5'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-5',
    moduleTitle: 'Module 5: Functions: Reusable Code Machines',
    moduleOrder: 5,
    starterCode: `def convert_temperature(val: float, to_unit: str = "F") -> float:
    if to_unit.upper() == "F":
        return round((val * 9/5) + 32, 1)
    else:
        return round((val - 32) * 5/9, 1)
`,
    testCases: [
      { id: 'tc-py-10', input: 'val = 0.0, to_unit = "F"', expectedOutput: '32.0', passed: true },
      { id: 'tc-py-11', input: 'val = 100.0, to_unit = "C"', expectedOutput: '37.8', passed: true },
    ],
    hints: ['Check `to_unit.upper()` to handle both uppercase and lowercase arguments.'],
    createdAt: '2026-01-14T00:00:00Z',
  },
  {
    id: 'practice-py-m6',
    title: 'List Extrema & Outlier Filter',
    slug: 'python-list-extrema-filter',
    description: 'Write a Python function `find_extrema(nums: list[int]) -> dict` that returns a dictionary `{"min": x, "max": y, "avg": z}` without using `max()` or `min()` built-ins.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Lists & Arrays',
    tags: ['Python', 'Lists', 'Collections', 'Module 6'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-6',
    moduleTitle: 'Module 6: Lists & Arrays: Managing Collections',
    moduleOrder: 6,
    starterCode: `def find_extrema(nums: list[int]) -> dict:
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
    hints: ['Initialize `curr_min` and `curr_max` with `nums[0]` and iterate through the list.'],
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'practice-py-m7',
    title: 'Word Frequency Counter & Dictionary Analyzer',
    slug: 'python-word-frequency-counter',
    description: 'Write a Python function `count_word_frequencies(text: str) -> dict` that lowercases words, strips punctuation, and tallies frequency counts.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Dictionaries & Key-Value Stores',
    tags: ['Python', 'Dictionaries', 'Text', 'Module 7'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-7',
    moduleTitle: 'Module 7: Objects & Dictionaries: Key-Value Stores',
    moduleOrder: 7,
    starterCode: `import re

def count_word_frequencies(text: str) -> dict:
    words = re.findall(r'\\b\\w+\\b', text.lower())
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts
`,
    testCases: [
      { id: 'tc-py-13', input: '"Code code learn python"', expectedOutput: '{"code": 2, "learn": 1, "python": 1}', passed: true },
    ],
    hints: ['Use regex `\\b\\w+\\b` to extract words cleanly and `dict.get()` for incrementing.'],
    createdAt: '2026-01-16T00:00:00Z',
  },
  {
    id: 'practice-rec-1',
    title: 'Recursive Palindrome Checker',
    slug: 'recursive-palindrome-checker',
    description: 'Write a recursive function `is_palindrome(s: str) -> bool` that determines if a string is a palindrome using recursion without slice reversal like `s[::-1]`.',
    difficulty: 'beginner',
    language: 'python',
    category: 'Strings & Recursion',
    tags: ['Python', 'Strings', 'Recursion', 'Module 8'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-8',
    moduleTitle: 'Module 8: Strings & Text Manipulation',
    moduleOrder: 8,
    starterCode: `def is_palindrome(s: str) -> bool:
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
    hints: ['Check if first and last characters match, then call recursively on `clean_s[1:-1]`.'],
    createdAt: '2026-01-17T00:00:00Z',
  },
  {
    id: 'practice-algo-1',
    title: 'Two Sum with Optimal Hash Map',
    slug: 'two-sum-hash-map',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target in O(N) time.',
    difficulty: 'intermediate',
    language: 'python',
    category: 'Algorithms & Hash Maps',
    tags: ['Python', 'Algorithms', 'Hash Map', 'Module 15'],
    courseId: 'course-py-101',
    courseTitle: 'Learn to code with Python',
    moduleId: 'mod-py-15',
    moduleTitle: 'Module 15: Algorithms: Searching & Sorting',
    moduleOrder: 15,
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
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
    hints: ['Store each number index in a hash map as you iterate through the list.'],
    createdAt: '2026-01-18T00:00:00Z',
  },

  // ═════════════════════════════════════════════════════════════
  // JAVASCRIPT TRACK: Learn to code with JS (course-js-201)
  // ═════════════════════════════════════════════════════════════
  {
    id: 'practice-js-m1',
    title: 'Console Greeting & String Badge Formatter',
    slug: 'js-console-greeting-formatter',
    description: 'Write a JavaScript function `formatGreeting(name, role)` that returns a standardized welcome badge string.',
    difficulty: 'beginner',
    language: 'javascript',
    category: 'Statements & Output',
    tags: ['JavaScript', 'Strings', 'Console', 'Module 1'],
    courseId: 'course-js-201',
    courseTitle: 'Learn to code with JS',
    moduleId: 'mod-js-1',
    moduleTitle: 'Module 1: Your First Lines of Code',
    moduleOrder: 1,
    starterCode: `function formatGreeting(name, role) {
  // TODO: Return formatted greeting
  return \`Welcome \${name}, registered as \${role}!\`;
}
`,
    testCases: [
      { id: 'tc-js-m1', input: 'name = "Abebe", role = "Frontend Dev"', expectedOutput: '"Welcome Abebe, registered as Frontend Dev!"', passed: true },
    ],
    hints: ['Use template literals with backticks: `\\`Welcome ${name}...\\``.'],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'practice-js-m2',
    title: 'Dynamic Type & Balance Calculator',
    slug: 'js-balance-calculator',
    description: 'Write a JavaScript function `calculateBalance(initial, deposits, withdrawals)` that performs financial math and returns a fixed 2-decimal number.',
    difficulty: 'beginner',
    language: 'javascript',
    category: 'Variables & Data Types',
    tags: ['JavaScript', 'Variables', 'Math', 'Module 2'],
    courseId: 'course-js-201',
    courseTitle: 'Learn to code with JS',
    moduleId: 'mod-js-2',
    moduleTitle: 'Module 2: Variables & Memory Boxes',
    moduleOrder: 2,
    starterCode: `function calculateBalance(initial, deposits, withdrawals) {
  const finalBalance = initial + deposits - withdrawals;
  return Number(finalBalance.toFixed(2));
}
`,
    testCases: [
      { id: 'tc-js-m2', input: 'initial = 100, deposits = 50, withdrawals = 20.5', expectedOutput: '129.5', passed: true },
    ],
    hints: ['Use `Number(val.toFixed(2))` to avoid floating point precision quirks.'],
    createdAt: '2026-01-11T00:00:00Z',
  },
  {
    id: 'practice-js-m3',
    title: 'User Role & Permission Gatekeeper',
    slug: 'js-permission-gatekeeper',
    description: 'Write a JavaScript function `checkAccessLevel(role, isVerified)` that returns `"FULL_ACCESS"` for verified admins, `"STANDARD_ACCESS"` for verified members, and `"RESTRICTED"` otherwise.',
    difficulty: 'beginner',
    language: 'javascript',
    category: 'Conditionals & Logic',
    tags: ['JavaScript', 'Conditionals', 'Booleans', 'Module 3'],
    courseId: 'course-js-201',
    courseTitle: 'Learn to code with JS',
    moduleId: 'mod-js-3',
    moduleTitle: 'Module 3: Making Decisions with If/Else',
    moduleOrder: 3,
    starterCode: `function checkAccessLevel(role, isVerified) {
  if (!isVerified) return "RESTRICTED";
  if (role === "admin") return "FULL_ACCESS";
  if (role === "member") return "STANDARD_ACCESS";
  return "RESTRICTED";
}
`,
    testCases: [
      { id: 'tc-js-m3', input: 'role = "admin", isVerified = true', expectedOutput: '"FULL_ACCESS"', passed: true },
      { id: 'tc-js-m4', input: 'role = "admin", isVerified = false', expectedOutput: '"RESTRICTED"', passed: true },
    ],
    hints: ['Guard with `if (!isVerified)` first.'],
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'practice-js-2',
    title: 'Array Flatten & Deduplicate',
    slug: 'array-flatten-deduplicate',
    description: 'Write a JavaScript function `flattenAndUnique(arr)` that flattens a nested array of arbitrary depth and returns only the unique numbers in ascending order.',
    difficulty: 'beginner',
    language: 'javascript',
    category: 'Array Algorithms',
    tags: ['JavaScript', 'Arrays', 'Sets', 'Module 6'],
    courseId: 'course-js-201',
    courseTitle: 'Learn to code with JS',
    moduleId: 'mod-js-6',
    moduleTitle: 'Module 6: Lists & Arrays: Managing Collections',
    moduleOrder: 6,
    starterCode: `function flattenAndUnique(arr) {
  const flat = arr.flat(Infinity);
  const unique = Array.from(new Set(flat));
  return unique.sort((a, b) => a - b);
}
`,
    testCases: [
      { id: 'tc-js-m5', input: '[1, [2, [3, 2, 1], 4], [5, 4]]', expectedOutput: '[1, 2, 3, 4, 5]', passed: true },
    ],
    hints: ['Use `arr.flat(Infinity)` and `new Set()`.'],
    createdAt: '2026-01-16T00:00:00Z',
  },
  {
    id: 'practice-js-3',
    title: 'Debounce Function Implementation',
    slug: 'debounce-function-implementation',
    description: 'Write a JavaScript `debounce(fn, delayMs)` higher-order function that delays invoking `fn` until after `delayMs` milliseconds have elapsed.',
    difficulty: 'intermediate',
    language: 'javascript',
    category: 'Closures & Modern Patterns',
    tags: ['JavaScript', 'Debounce', 'Closures', 'Module 17'],
    courseId: 'course-js-201',
    courseTitle: 'Learn to code with JS',
    moduleId: 'mod-js-17',
    moduleTitle: 'Module 17: Asynchronous & Modern Patterns',
    moduleOrder: 17,
    starterCode: `function debounce(fn, delayMs) {
  let timerId = null;
  return function (...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delayMs);
  };
}
`,
    testCases: [
      { id: 'tc-js-m6', input: 'call debounce 3 times with 50ms delay', expectedOutput: 'called exactly 1 time', passed: true },
    ],
    hints: ['Clear the previous `timerId` with `clearTimeout`.'],
    createdAt: '2026-01-21T00:00:00Z',
  },
  {
    id: 'practice-js-1',
    title: 'Custom Promise.all Implementation',
    slug: 'custom-promise-all',
    description: 'Implement a function `promiseAll(promises)` that returns a Promise that resolves when all input promises have resolved or rejects as soon as any promise rejects.',
    difficulty: 'advanced',
    language: 'javascript',
    category: 'Async Patterns & Concurrency',
    tags: ['JavaScript', 'Promises', 'Async', 'Module 17'],
    courseId: 'course-js-201',
    courseTitle: 'Learn to code with JS',
    moduleId: 'mod-js-17',
    moduleTitle: 'Module 17: Asynchronous & Modern Patterns',
    moduleOrder: 17,
    starterCode: `function promiseAll(promises) {
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
    hints: ['Track a `completed` counter and resolve when `completed === promises.length`.'],
    createdAt: '2026-01-22T00:00:00Z',
  },

  // ═════════════════════════════════════════════════════════════
  // JAVA TRACK: Learn to code with Java (course-java-301)
  // ═════════════════════════════════════════════════════════════
  {
    id: 'practice-java-m1',
    title: 'Console Message & System Alert Formatter',
    slug: 'java-console-alert-formatter',
    description: 'Write a Java method `formatAlert(String systemName, int errorCode) -> String` that formats a system alert string.',
    difficulty: 'beginner',
    language: 'java',
    category: 'Output & Statements',
    tags: ['Java', 'Print', 'Syntax', 'Module 1'],
    courseId: 'course-java-301',
    courseTitle: 'Learn to code with Java',
    moduleId: 'mod-java-1',
    moduleTitle: 'Module 1: Your First Lines of Code',
    moduleOrder: 1,
    starterCode: `public class Solution {
    public static String formatAlert(String systemName, int errorCode) {
        return String.format("[ALERT] System: %s | Error: #%d", systemName, errorCode);
    }
}
`,
    testCases: [
      { id: 'tc-j-m1', input: 'systemName = "AUTH_SERVICE", errorCode = 401', expectedOutput: '"[ALERT] System: AUTH_SERVICE | Error: #401"', passed: true },
    ],
    hints: ['Use `String.format()` with `%s` for strings and `%d` for integers.'],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'practice-java-2',
    title: 'Array Inversion & Reversal in Place',
    slug: 'array-inversion-in-place',
    description: 'Write a Java method `reverseArray(int[] arr)` that reverses an integer array in-place without allocating a new array, using a two-pointer approach.',
    difficulty: 'beginner',
    language: 'java',
    category: 'Arrays & Two-Pointers',
    tags: ['Java', 'Arrays', 'Two Pointers', 'Module 6'],
    courseId: 'course-java-301',
    courseTitle: 'Learn to code with Java',
    moduleId: 'mod-java-6',
    moduleTitle: 'Module 6: Lists & Arrays: Managing Collections',
    moduleOrder: 6,
    starterCode: `public class Solution {
    public static void reverseArray(int[] arr) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
}
`,
    testCases: [
      { id: 'tc-j-m2', input: '[1, 2, 3, 4, 5]', expectedOutput: '[5, 4, 3, 2, 1]', passed: true },
    ],
    hints: ['Swap elements at `left` and `right` and move towards the center.'],
    createdAt: '2026-01-16T00:00:00Z',
  },
  {
    id: 'practice-java-3',
    title: 'String Anagrams Counter',
    slug: 'string-anagrams-counter',
    description: 'Given two strings `s` and `t`, write a Java method `isAnagram(String s, String t) -> boolean` that checks if `t` is an anagram of `s` using a frequency bucket.',
    difficulty: 'beginner',
    language: 'java',
    category: 'Strings & Hash Tables',
    tags: ['Java', 'Strings', 'Frequency', 'Module 8'],
    courseId: 'course-java-301',
    courseTitle: 'Learn to code with Java',
    moduleId: 'mod-java-8',
    moduleTitle: 'Module 8: Strings & Text Manipulation',
    moduleOrder: 8,
    starterCode: `public class Solution {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
            freq[t.charAt(i) - 'a']--;
        }
        for (int c : freq) {
            if (c != 0) return false;
        }
        return true;
    }
}
`,
    testCases: [
      { id: 'tc-j-m3', input: 's = "anagram", t = "nagaram"', expectedOutput: 'true', passed: true },
    ],
    hints: ['Check string lengths first, then increment for `s` and decrement for `t`.'],
    createdAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 'practice-java-1',
    title: 'Valid Parentheses & Bracket Matching',
    slug: 'valid-parentheses-brackets',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid using a Stack.',
    difficulty: 'intermediate',
    language: 'java',
    category: 'Data Structures & Stacks',
    tags: ['Java', 'Stack', 'Data Structures', 'Module 14'],
    courseId: 'course-java-301',
    courseTitle: 'Learn to code with Java',
    moduleId: 'mod-java-14',
    moduleTitle: 'Module 14: Data Structures: Stacks, Queues & Sets',
    moduleOrder: 14,
    starterCode: `import java.util.Stack;

public class Solution {
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
    hints: ['Whenever you encounter an open bracket, push the expected close bracket.'],
    createdAt: '2026-01-20T00:00:00Z',
  },

  // ═════════════════════════════════════════════════════════════
  // TYPESCRIPT TRACK: Learn to code with TypeScript (course-ts-401)
  // ═════════════════════════════════════════════════════════════
  {
    id: 'practice-ts-m1',
    title: 'Typed Greeting & Profile Formatter',
    slug: 'ts-typed-greeting-formatter',
    description: 'Write a TypeScript function `formatUserProfile(user: { id: string; name: string; isPro: boolean }) -> string` that returns a clean summary string.',
    difficulty: 'beginner',
    language: 'typescript',
    category: 'Types & Interfaces',
    tags: ['TypeScript', 'Types', 'Interfaces', 'Module 1'],
    courseId: 'course-ts-401',
    courseTitle: 'Learn to code with TypeScript',
    moduleId: 'mod-ts-1',
    moduleTitle: 'Module 1: Your First Lines of Code',
    moduleOrder: 1,
    starterCode: `interface UserProfile {
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
    hints: ['Check `user.isPro` with a ternary operator.'],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'practice-ts-3',
    title: 'Generic Stack with Maximum Value Query',
    slug: 'generic-stack-max-query',
    description: 'Implement a generic `MaxStack<T extends number>` in TypeScript with `push()`, `pop()`, `peek()`, and `getMax()` all executing in O(1) time.',
    difficulty: 'beginner',
    language: 'typescript',
    category: 'Generics & Data Structures',
    tags: ['TypeScript', 'Generics', 'Stack', 'Module 14'],
    courseId: 'course-ts-401',
    courseTitle: 'Learn to code with TypeScript',
    moduleId: 'mod-ts-14',
    moduleTitle: 'Module 14: Data Structures: Stacks, Queues & Sets',
    moduleOrder: 14,
    starterCode: `class MaxStack<T extends number> {
  private items: T[] = [];
  private maxItems: T[] = [];

  push(val: T): void {
    this.items.push(val);
    if (this.maxItems.length === 0 || val >= this.maxItems[this.maxItems.length - 1]) {
      this.maxItems.push(val);
    }
  }

  pop(): T | undefined {
    const val = this.items.pop();
    if (val !== undefined && val === this.maxItems[this.maxItems.length - 1]) {
      this.maxItems.pop();
    }
    return val;
  }

  getMax(): T | undefined {
    return this.maxItems[this.maxItems.length - 1];
  }
}
`,
    testCases: [
      { id: 'tc-ts-m2', input: 'push(5), push(1), push(10), getMax()', expectedOutput: '10', passed: true },
    ],
    hints: ['Maintain an auxiliary `maxItems` stack that records the maximum at each depth.'],
    createdAt: '2026-01-19T00:00:00Z',
  },
  {
    id: 'practice-ts-1',
    title: 'TypeScript Type-Safe Object Mapper',
    slug: 'typescript-type-safe-mapper',
    description: 'Write a TypeScript utility function `mapObject<T, K, V>` that transforms all values of an object according to a mapping function while preserving strict type keys.',
    difficulty: 'intermediate',
    language: 'typescript',
    category: 'Mapped Types & Generics',
    tags: ['TypeScript', 'Generics', 'Objects', 'Module 7'],
    courseId: 'course-ts-401',
    courseTitle: 'Learn to code with TypeScript',
    moduleId: 'mod-ts-7',
    moduleTitle: 'Module 7: Objects & Dictionaries: Key-Value Stores',
    moduleOrder: 7,
    starterCode: `function mapObject<K extends string | number, T, U>(
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
    hints: ['Use `K extends string | number` and cast `Object.keys(obj) as K[]`.'],
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'practice-ts-2',
    title: 'Strict Discriminated Union Event Dispatcher',
    slug: 'discriminated-union-dispatcher',
    description: 'Design a type-safe Event Dispatcher in TypeScript with Discriminated Unions for `UserLoggedIn`, `LessonCompleted`, and `PaymentReceived` events with comprehensive pattern matching.',
    difficulty: 'intermediate',
    language: 'typescript',
    category: 'Pattern Matching & Unions',
    tags: ['TypeScript', 'Unions', 'Pattern Matching', 'Module 17'],
    courseId: 'course-ts-401',
    courseTitle: 'Learn to code with TypeScript',
    moduleId: 'mod-ts-17',
    moduleTitle: 'Module 17: Asynchronous & Modern Patterns',
    moduleOrder: 17,
    starterCode: `type AppEvent =
  | { type: 'LOGIN'; userId: string; timestamp: number }
  | { type: 'LESSON_COMPLETE'; lessonId: string; score: number }
  | { type: 'PAYMENT'; amount: number; currency: string };

function handleAppEvent(event: AppEvent): string {
  switch (event.type) {
    case 'LOGIN':
      return \`User \${event.userId} logged in\`;
    case 'LESSON_COMPLETE':
      return \`Completed lesson \${event.lessonId} with score \${event.score}\`;
    case 'PAYMENT':
      return \`Received \${event.amount} \${event.currency}\`;
  }
}
`,
    testCases: [
      { id: 'tc-ts-m4', input: '{ type: "LOGIN", userId: "usr_1", timestamp: 1700000000 }', expectedOutput: '"User usr_1 logged in"', passed: true },
    ],
    hints: ['Leverage exhaustive TypeScript switch-case over `event.type`.'],
    createdAt: '2026-01-22T00:00:00Z',
  },
]
