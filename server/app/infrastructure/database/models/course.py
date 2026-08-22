"""
Course, Module, and Lesson Database Models.
"""

from typing import List
from sqlalchemy import String, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.infrastructure.database.base import Base, TimestampMixin


class CourseModel(Base, TimestampMixin):
    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(128))
    language: Mapped[str] = mapped_column(String(32), index=True)
    difficulty: Mapped[str] = mapped_column(String(32))
    total_lessons: Mapped[int] = mapped_column(Integer, default=0)
    estimated_hours: Mapped[int] = mapped_column(Integer, default=0)

    modules: Mapped[List["ModuleModel"]] = relationship("ModuleModel", back_populates="course", cascade="all, delete-orphan")


class ModuleModel(Base, TimestampMixin):
    __tablename__ = "modules"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    course_id: Mapped[str] = mapped_column(String(64), ForeignKey("courses.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    order: Mapped[int] = mapped_column(Integer, default=1)

    course: Mapped["CourseModel"] = relationship("CourseModel", back_populates="modules")
    lessons: Mapped[List["LessonModel"]] = relationship("LessonModel", back_populates="module", cascade="all, delete-orphan")


class LessonModel(Base, TimestampMixin):
    __tablename__ = "lessons"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    module_id: Mapped[str] = mapped_column(String(64), ForeignKey("modules.id"), index=True)
    course_id: Mapped[str] = mapped_column(String(64), ForeignKey("courses.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), index=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30)
    order: Mapped[int] = mapped_column(Integer, default=1)
    content_markdown: Mapped[str] = mapped_column(Text, default="")

    module: Mapped["ModuleModel"] = relationship("ModuleModel", back_populates="lessons")
