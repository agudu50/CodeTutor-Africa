"""
Practice Exercise and Progress Models.
"""

from sqlalchemy import String, Integer, Text, Boolean, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.infrastructure.database.base import Base, TimestampMixin


class PracticeExerciseModel(Base, TimestampMixin):
    __tablename__ = "practice_exercises"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    course_id: Mapped[str] = mapped_column(String(64), ForeignKey("courses.id"), nullable=True, index=True)
    lesson_id: Mapped[str] = mapped_column(String(64), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(32), index=True)
    difficulty: Mapped[str] = mapped_column(String(32), default="beginner")
    starter_code: Mapped[str] = mapped_column(Text, default="")
    solution_code: Mapped[str] = mapped_column(Text, default="")


class PracticeAttemptModel(Base, TimestampMixin):
    __tablename__ = "practice_attempts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), index=True)
    exercise_id: Mapped[str] = mapped_column(String(64), ForeignKey("practice_exercises.id"), index=True)
    submitted_code: Mapped[str] = mapped_column(Text)
    passed: Mapped[bool] = mapped_column(Boolean, default=False)
    execution_time_ms: Mapped[float] = mapped_column(Float, default=0.0)


class LearningProgressModel(Base, TimestampMixin):
    __tablename__ = "learning_progress"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), index=True)
    course_id: Mapped[str] = mapped_column(String(64), ForeignKey("courses.id"), index=True)
    lesson_id: Mapped[str] = mapped_column(String(64), ForeignKey("lessons.id"), index=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    study_duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
