"""
Practice Service.
Provides offline coding exercises and evaluates submissions via safe code runner abstraction.
"""

from typing import List, Optional
from app.schemas.practice import (
    PracticeExercise,
    TestCase,
    SubmissionRequest,
    SubmissionEvaluation,
    TestCaseResult,
)
from app.infrastructure.code_runner.base import TestCase as RunnerTestCase
from app.infrastructure.code_runner.local_runner import local_code_runner

DEFAULT_EXERCISES = [
    PracticeExercise(
        id="ex-py-1",
        title="Count Positive Integers",
        description="Write code that reads space-separated integers from input and prints the count of elements strictly greater than zero.",
        language="python",
        difficulty="beginner",
        course_id="course-py-101",
        lesson_id="les-2",
        starter_code="nums = list(map(int, input().split()))\n# Print positive count\n",
        test_cases=[
            TestCase(input="1 -2 3 4", expected_output="3"),
            TestCase(input="-5 -1 0", expected_output="0"),
        ],
        hints=["Use a list comprehension or generator expression `sum(1 for x in nums if x > 0)`."],
    ),
    PracticeExercise(
        id="ex-js-1",
        title="Array Doubler",
        description="Write a JavaScript script that reads a line of JSON array of numbers and outputs their doubled values as JSON.",
        language="javascript",
        difficulty="intermediate",
        course_id="course-js-201",
        lesson_id="les-js-1",
        starter_code="const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst arr = JSON.parse(input);\n// Print doubled array JSON\n",
        test_cases=[
            TestCase(input="[1, 2, 3]", expected_output="[2,4,6]"),
        ],
        hints=["Use `arr.map(x => x * 2)` and `JSON.stringify()`."],
    ),
]


class PracticeService:
    def __init__(self):
        self._runner = local_code_runner

    def get_exercises(self, language: Optional[str] = None) -> List[PracticeExercise]:
        if language and language != "all":
            return [e for e in DEFAULT_EXERCISES if e.language == language]
        return DEFAULT_EXERCISES

    async def evaluate_submission(self, sub: SubmissionRequest) -> SubmissionEvaluation:
        # Find exercise definition if available
        exercise = next((e for e in DEFAULT_EXERCISES if e.id == sub.exercise_id), None)

        if exercise and exercise.test_cases:
            runner_test_cases = [
                RunnerTestCase(
                    id=f"tc-{idx+1}",
                    input_data=tc.input,
                    expected_output=tc.expected_output,
                    is_hidden=tc.is_hidden,
                )
                for idx, tc in enumerate(exercise.test_cases)
            ]

            exec_res = await self._runner.run_tests(
                code=sub.code,
                language=sub.language,
                test_cases=runner_test_cases,
                timeout_seconds=3.0,
            )

            test_results = [
                TestCaseResult(
                    passed=tr.passed,
                    input=tr.input_data or "",
                    expected=tr.expected_output,
                    actual=tr.actual_output,
                    error=tr.error_message,
                )
                for tr in exec_res.test_results
            ]

            passed_count = sum(1 for tr in test_results if tr.passed)
            total_count = len(test_results)
            all_passed = passed_count == total_count

            if all_passed:
                feedback = "Outstanding! All test cases passed with optimal execution time."
                hint = None
            else:
                feedback = f"{passed_count}/{total_count} test cases passed. Review edge cases and boundary conditions."
                hint = exercise.hints[0] if exercise.hints else "Consider edge cases with 0 and negative inputs."

            return SubmissionEvaluation(
                exercise_id=sub.exercise_id,
                passed=all_passed,
                total_tests=total_count,
                passed_tests=passed_count,
                test_results=test_results,
                feedback=feedback,
                suggested_hint=hint,
            )

        # Fallback for custom code submission
        exec_res = await self._runner.execute(
            code=sub.code,
            language=sub.language,
            timeout_seconds=3.0,
        )
        passed = exec_res.exit_code == 0 and not exec_res.is_timeout

        return SubmissionEvaluation(
            exercise_id=sub.exercise_id,
            passed=passed,
            total_tests=1,
            passed_tests=1 if passed else 0,
            test_results=[
                TestCaseResult(
                    passed=passed,
                    input="Custom Code",
                    expected="Exit Code 0",
                    actual=exec_res.stdout or ("Error: " + exec_res.stderr),
                    error=exec_res.stderr if not passed else None,
                )
            ],
            feedback="Code executed successfully without runtime exceptions." if passed else f"Execution failed: {exec_res.stderr}",
            suggested_hint=None if passed else "Check syntax and runtime trace.",
        )


practice_service = PracticeService()
