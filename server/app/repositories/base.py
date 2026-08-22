"""
Base Repository Implementation with generic CRUD helpers.
"""

from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.infrastructure.database.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """Generic repository base class."""

    def __init__(self, model_cls: Type[ModelT], session: AsyncSession):
        self.model_cls = model_cls
        self.session = session

    async def get_by_id(self, id: str) -> Optional[ModelT]:
        return await self.session.get(self.model_cls, id)

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[ModelT]:
        stmt = select(self.model_cls).limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create(self, entity: ModelT) -> ModelT:
        self.session.add(entity)
        await self.session.flush()
        return entity

    async def delete(self, entity: ModelT) -> None:
        await self.session.delete(entity)
        await self.session.flush()
