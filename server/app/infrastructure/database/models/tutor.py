"""
Tutor Session & Message Database Models.
"""

from typing import List
from sqlalchemy import String, Text, ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.infrastructure.database.base import Base, TimestampMixin


class TutorSessionModel(Base, TimestampMixin):
    __tablename__ = "tutor_sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), index=True)
    course_id: Mapped[str] = mapped_column(String(64), nullable=True)
    title: Mapped[str] = mapped_column(String(255), default="Tutoring Session")
    mode: Mapped[str] = mapped_column(String(32), default="explain")

    messages: Mapped[List["TutorMessageModel"]] = relationship("TutorMessageModel", back_populates="session", cascade="all, delete-orphan")


class TutorMessageModel(Base, TimestampMixin):
    __tablename__ = "tutor_messages"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    session_id: Mapped[str] = mapped_column(String(64), ForeignKey("tutor_sessions.id"), index=True)
    role: Mapped[str] = mapped_column(String(16))  # user or assistant
    content: Mapped[str] = mapped_column(Text)
    mode: Mapped[str] = mapped_column(String(32), default="explain")
    model_name: Mapped[str] = mapped_column(String(64), nullable=True)
    latency_ms: Mapped[float] = mapped_column(Float, default=0.0)
    tokens_generated: Mapped[int] = mapped_column(Integer, default=0)

    session: Mapped["TutorSessionModel"] = relationship("TutorSessionModel", back_populates="messages")
