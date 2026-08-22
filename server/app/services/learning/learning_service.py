"""
Learning Service.
Provides offline access to courses, modules, and lessons.
"""

from typing import List, Optional
from app.schemas.learning import CourseResponse, ModuleSummary, LessonSummary

# Default foundational courses matching CodeTutor curriculum
DEFAULT_COURSES = [
    CourseResponse(
        id="course-py-101",
        title="Python Programming & Problem Solving",
        slug="python-programming-fundamentals",
        description="Master Python syntax, memory model, recursion, and problem solving for African software engineers.",
        category="Core Programming",
        language="python",
        difficulty="Beginner",
        total_lessons=18,
        estimated_hours=24,
        progress_percentage=68,
        modules=[
            ModuleSummary(
                id="mod-1",
                title="Foundations & Control Flow",
                description="Variables, memory model, loops, and clean code principles.",
                order=1,
                lessons=[
                    LessonSummary(id="les-1", title="Memory Model & Variable Scope", slug="memory-model-and-variables", duration_minutes=25, order=1, is_completed=True),
                    LessonSummary(id="les-2", title="Iteration & List Comprehensions", slug="iteration-list-comprehensions", duration_minutes=35, order=2, is_completed=True),
                    LessonSummary(id="les-3", title="Functions & Recursion", slug="functions-and-recursion", duration_minutes=45, order=3, is_completed=False),
                ]
            )
        ]
    ),
    CourseResponse(
        id="course-js-201",
        title="Modern JavaScript & Async Architecture",
        slug="modern-javascript-async",
        description="Deep dive into event loop mechanics, microtasks, Promises, and non-blocking IO.",
        category="Web Engineering",
        language="javascript",
        difficulty="Intermediate",
        total_lessons=14,
        estimated_hours=20,
        progress_percentage=42,
        modules=[
            ModuleSummary(
                id="mod-js-1",
                title="Event Loop & Concurrency",
                description="Call stack, Task Queue, Microtask Queue, and Promises.",
                order=1,
                lessons=[
                    LessonSummary(id="les-js-1", title="Asynchronous JavaScript & Promises", slug="async-js-promises", duration_minutes=40, order=1, is_completed=True),
                ]
            )
        ]
    ),
    CourseResponse(
        id="course-java-301",
        title="Java OOP & Enterprise Design Patterns",
        slug="java-oop-design-patterns",
        description="Object-oriented fundamentals, polymorphism, abstract contracts, and generic JVM collections.",
        category="Software Engineering",
        language="java",
        difficulty="Intermediate",
        total_lessons=20,
        estimated_hours=28,
        progress_percentage=15,
        modules=[
            ModuleSummary(
                id="mod-java-1",
                title="Object-Oriented Principles",
                description="Class architecture, encapsulation, and reference semantics.",
                order=1,
                lessons=[
                    LessonSummary(id="les-java-1", title="Classes, Objects & Constructors", slug="java-classes-and-constructors", duration_minutes=35, order=1, is_completed=True),
                    LessonSummary(id="les-java-2", title="Inheritance & Interfaces", slug="java-inheritance-interfaces", duration_minutes=45, order=2, is_completed=False),
                ]
            )
        ]
    ),
]


class LearningService:
    """Learning and curriculum service."""

    def get_all_courses(self) -> List[CourseResponse]:
        return DEFAULT_COURSES

    def get_course_by_id(self, course_id: str) -> Optional[CourseResponse]:
        return next((c for c in DEFAULT_COURSES if c.id == course_id or c.slug == course_id), None)


learning_service = LearningService()
