"""
Database Models Registry.
"""

from app.infrastructure.database.models.user import UserModel
from app.infrastructure.database.models.course import CourseModel, ModuleModel, LessonModel
from app.infrastructure.database.models.tutor import TutorSessionModel, TutorMessageModel
from app.infrastructure.database.models.practice import PracticeExerciseModel, PracticeAttemptModel, LearningProgressModel

__all__ = [
    "UserModel",
    "CourseModel",
    "ModuleModel",
    "LessonModel",
    "TutorSessionModel",
    "TutorMessageModel",
    "PracticeExerciseModel",
    "PracticeAttemptModel",
    "LearningProgressModel",
]
