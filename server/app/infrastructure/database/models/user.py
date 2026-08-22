"""
User Model.
"""

from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.infrastructure.database.base import Base, TimestampMixin


class UserModel(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    full_name: Mapped[str] = mapped_column(String(128))
    email: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    preferred_language: Mapped[str] = mapped_column(String(32), default="python")
    is_active: Mapped[bool] = mapped_column(default=True)
