"""
Knowledge & Offline RAG Ingestion Service.

Indexes offline course curricula, markdown documents, and programming textbooks,
providing contextual grounding and citations for Socratic AI tutoring.
"""

from typing import List, Optional, Dict, Any
from app.infrastructure.rag.chunker import chunker, DocumentChunk
from app.infrastructure.rag.vector_store import vector_store, LocalVectorStore
from app.schemas.tutor import TutorSource
from app.core.logging import logger

# Foundational offline curriculum knowledge base
CURRICULUM_DOCUMENTS = [
    {
        "course_id": "course-py-101",
        "lesson_id": "les-1",
        "topic": "Memory Model & Variables",
        "title": "Python Memory Model & Reference Assignment",
        "content": (
            "# Python Memory Model & References\n\n"
            "In Python, variables are named references (pointers) to objects stored in heap memory.\n"
            "When executing `b = a`, Python copies the memory reference, not the underlying object.\n"
            "For mutable objects (e.g. lists, dicts, sets), modifying `b.append(10)` mutates the shared heap object,\n"
            "affecting `a` simultaneously. To create an independent copy, use shallow slicing `a[:]` or `copy.deepcopy()`.\n"
            "Immutable objects (integers, strings, tuples) allocate a new object when reassigned."
        ),
    },
    {
        "course_id": "course-py-101",
        "lesson_id": "les-2",
        "topic": "List Comprehensions",
        "title": "Iteration, List Comprehensions & Generator Expressions",
        "content": (
            "# Iteration & List Comprehensions\n\n"
            "List comprehensions provide a concise syntax: `[expression for item in iterable if condition]`.\n"
            "They execute faster than equivalent for-loops in CPython due to optimized internal bytecode instructions.\n"
            "For large datasets where memory allocation must be bounded, use generator expressions `(x for x in data)`\n"
            "which evaluate lazily in O(1) memory."
        ),
    },
    {
        "course_id": "course-js-201",
        "lesson_id": "les-js-1",
        "topic": "Async & Promises",
        "title": "JavaScript Event Loop, Microtasks & Promises",
        "content": (
            "# JavaScript Event Loop Mechanics\n\n"
            "The JavaScript runtime consists of the Call Stack, Web APIs, Task (Macrotask) Queue, and Microtask Queue.\n"
            "Promises and `queueMicrotask` enqueue into the Microtask Queue.\n"
            "Microtasks possess higher execution priority: the runtime exhausts ALL pending microtasks before\n"
            "rendering frames or processing the next macrotask (e.g. `setTimeout`, `setInterval`)."
        ),
    },
    {
        "course_id": "course-java-301",
        "lesson_id": "les-java-1",
        "topic": "OOP & Polymorphism",
        "title": "Java Object-Oriented Principles & Dynamic Dispatch",
        "content": (
            "# Java Dynamic Method Dispatch & Polymorphism\n\n"
            "Dynamic method dispatch is the mechanism by which a call to an overridden method is resolved at runtime\n"
            "rather than compile time. In the JVM, this is implemented using virtual method tables (vtable).\n"
            "Abstract classes define shared state and partial implementations, whereas Interfaces declare pure behavioral contracts."
        ),
    },
]


class KnowledgeService:
    """Offline RAG Ingestion and Query Service."""

    def __init__(self, store: Optional[LocalVectorStore] = None):
        self.store = store or vector_store
        self._is_initialized = False
        self._initialize_curriculum_index()

    def _initialize_curriculum_index(self):
        """Pre-indexes standard curriculum modules."""
        if self._is_initialized:
            return

        all_chunks: List[DocumentChunk] = []
        for doc in CURRICULUM_DOCUMENTS:
            doc_chunks = chunker.chunk_text(
                text=doc["content"],
                course_id=doc["course_id"],
                lesson_id=doc["lesson_id"],
                topic=doc["topic"],
            )
            all_chunks.extend(doc_chunks)

        self.store.add_chunks(all_chunks)
        self._is_initialized = True
        logger.info(f"Offline RAG initialized with {len(all_chunks)} curriculum knowledge chunks.")

    def retrieve_context(
        self,
        query: str,
        course_id: Optional[str] = None,
        top_k: int = 2,
    ) -> List[TutorSource]:
        """Retrieves relevant knowledge chunks with source metadata."""
        matches = self.store.search(query=query, top_k=top_k, course_id=course_id)
        sources: List[TutorSource] = []

        for chunk, score in matches:
            sources.append(
                TutorSource(
                    document=f"{chunk.topic} — {chunk.section}",
                    course_id=chunk.course_id,
                    lesson_id=chunk.lesson_id,
                    section=chunk.section,
                    snippet=chunk.content[:200] + "...",
                )
            )

        return sources

    def get_stats(self) -> Dict[str, Any]:
        """Returns indexed document and chunk counts for system status."""
        return {
            "status": "ready" if self._is_initialized else "uninitialized",
            "documents_indexed": len(CURRICULUM_DOCUMENTS),
            "total_chunks": self.store.total_chunks,
            "embedding_model": "LightweightSparse-128D",
        }


knowledge_service = KnowledgeService()
