"""
Learning, Course, and Progress Repositories.
"""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.infrastructure.database.models.course import CourseModel
from app.infrastructure.database.models.tutor import TutorSessionModel, TutorMessageModel
from app.infrastructure.database.models.practice import PracticeExerciseModel, LearningProgressModel


class CourseRepository(BaseRepository[CourseModel]):
    def __init__(self, session: AsyncSession):
        super().__init__(CourseModel, session)

    async def get_courses_with_modules(self) -> List[CourseModel]:
        stmt = select(CourseModel).options(selectinload(CourseModel.modules))
        result = await self.session.execute(stmt)
        return list(result.scalars().all())


class TutorSessionRepository(BaseRepository[TutorSessionModel]):
    def __init__(self, session: AsyncSession):
        super().__init__(TutorSessionModel, session)

    async def get_with_messages(self, session_id: str) -> Optional[TutorSessionModel]:
        stmt = (
            select(TutorSessionModel)
            .where(TutorSessionModel.id == session_id)
            .options(selectinload(TutorSessionModel.messages))
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()


class PracticeExerciseRepository(BaseRepository[PracticeExerciseModel]):
    def __init__(self, session: AsyncSession):
        super().__init__(PracticeExerciseModel, session)

    async def get_by_language(self, language: str) -> List[PracticeExerciseModel]:
        stmt = select(PracticeExerciseModel).where(PracticeExerciseModel.language == language)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
