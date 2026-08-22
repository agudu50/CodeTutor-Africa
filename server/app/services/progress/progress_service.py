"""
Progress & Mastery Service.
"""

from app.schemas.progress import ProgressSummaryResponse, TopicMastery


class ProgressService:
    def get_progress_summary(self, user_id: str = "default_student") -> ProgressSummaryResponse:
        return ProgressSummaryResponse(
            total_study_minutes=240,
            completed_lessons=4,
            total_exercises_attempted=12,
            total_exercises_passed=10,
            accuracy_percentage=83.3,
            current_streak_days=3,
            best_streak_days=7,
            mastery_by_topic=[
                TopicMastery(topic="Memory Model & Variables", language="python", mastery_score=85, exercises_completed=4),
                TopicMastery(topic="Async & Promises", language="javascript", mastery_score=72, exercises_completed=3),
                TopicMastery(topic="OOP & Polymorphism", language="java", mastery_score=60, exercises_completed=3),
            ],
            recent_activities=[
                {"activity": "Completed Lesson 2: List Comprehensions", "time": "2 hours ago"},
                {"activity": "Passed Exercise: Count Positive Integers", "time": "3 hours ago"},
            ]
        )


progress_service = ProgressService()
