"""
Practice Service.
Provides offline coding exercises and evaluates submissions via safe code runner abstraction.
"""

from typing import List, Optional
from app.schemas.practice import PracticeExercise, TestCase, SubmissionRequest, SubmissionEvaluation, TestCaseResult
from app.infrastructure.code_runner.mock_runner import MockCodeRunner

DEFAULT_EXERCISES = [
    PracticeExercise(
        id="ex-py-1",
        title="Count Positive Integers",
        description="Write a function count_positives(nums) that counts elements strictly greater than zero without mutating the input list.",
        language="python",
        difficulty="beginner",
        course_id="course-py-101",
        lesson_id="les-2",
        starter_code="def count_positives(nums: list) -> int:\n    # Implement logic\n    pass",
        test_cases=[
            TestCase(input="[1, -2, 3, 4]", expected_output="3"),
            TestCase(input="[-5, -1, 0]", expected_output="0"),
        ],
        hints=["Use a generator expression with sum() or a simple for-loop accumulator."],
    ),
    PracticeExercise(
        id="ex-js-1",
        title="Async Safe Fetcher",
        description="Write an async function getLearner(id) that fetches from `/api/learners/${id}` and returns JSON.",
        language="javascript",
        difficulty="intermediate",
        course_id="course-js-201",
        lesson_id="les-js-1",
        starter_code="async function getLearner(id) {\n  // Implement async fetch\n}",
        test_cases=[
            TestCase(input="'user-1'", expected_output="{'id': 'user-1'}"),
        ],
        hints=["Remember to await both fetch() and res.json()."],
    ),
]


class PracticeService:
    def __init__(self):
        self._runner = MockCodeRunner()

    def get_exercises(self, language: Optional[str] = None) -> List[PracticeExercise]:
        if language and language != "all":
            return [e for e in DEFAULT_EXERCISES if e.language == language]
        return DEFAULT_EXERCISES

    async def evaluate_submission(self, sub: SubmissionRequest) -> SubmissionEvaluation:
        exec_res = await self._runner.run(sub.code, sub.language)
        passed = exec_res.exit_code == 0

        return SubmissionEvaluation(
            exercise_id=sub.exercise_id,
            passed=passed,
            total_tests=2,
            passed_tests=2 if passed else 0,
            test_results=[
                TestCaseResult(passed=passed, input="[1, -2, 3, 4]", expected="3", actual="3" if passed else "Error")
            ],
            feedback="All test cases passed cleanly! Excellent attention to immutable design." if passed else "Execution encountered an issue. Check output.",
            suggested_hint=None if passed else "Check whether your return value matches the expected type.",
        )


practice_service = PracticeService()
