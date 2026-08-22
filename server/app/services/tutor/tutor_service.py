"""
Tutor Service.

Coordinates pedagogical AI tutoring interactions across multiple modes:
- Explain: Deep mental models, memory representations, conceptual step-by-step
- Hint: Socratic clues without spoiling solutions
- Practice: Coding problems linked to curriculum
- Debug: Root-cause analysis and compiler error guidance
- Review: Code quality, complexity, and best practices
- Quiz: Active recall verification
"""

from typing import AsyncGenerator, List
from app.schemas.tutor import TutorChatRequest, TutorChatResponse, TutorSource
from app.services.inference.inference_service import inference_service
from app.core.logging import logger


class TutorService:
    """Pedagogical AI Tutor Service."""

    MODE_PROMPTS = {
        "explain": (
            "Mode: EXPLAIN. Provide a clear, conceptual explanation. "
            "Use relatable analogies, draw ASCII memory diagrams if applicable, and explain *why* the language behaves this way."
        ),
        "hint": (
            "Mode: HINT. Do NOT provide the full solution. "
            "Give a single, high-leverage conceptual hint or ask a guiding question that helps the student spot their mistake."
        ),
        "practice": (
            "Mode: PRACTICE. Provide a bite-sized coding exercise targeting this topic. "
            "Include input/output examples and starter function signature."
        ),
        "debug": (
            "Mode: DEBUG. Analyze the error and code. "
            "Identify the conceptual bug type (e.g. off-by-one, mutable reference mutation, unhandled promise) and explain how to reason about it."
        ),
        "review": (
            "Mode: REVIEW. Review the code for time/space complexity, idiomatic patterns, and edge case safety."
        ),
        "quiz": (
            "Mode: QUIZ. Formulate a short conceptual multiple-choice question to test student comprehension."
        ),
    }

    async def chat(self, request: TutorChatRequest) -> TutorChatResponse:
        """Processes a student tutoring request and returns structured guidance."""
        logger.info(f"Processing Tutor request (lang={request.language}, mode={request.mode})")

        prompt = self._build_tutoring_prompt(request)
        system_prompt = self._build_system_prompt(request)

        answer, metrics = await inference_service.generate_response(
            prompt=prompt,
            system_prompt=system_prompt,
        )

        sources = self._get_relevant_sources(request)
        followups = self._generate_suggested_followups(request)

        return TutorChatResponse(
            answer=answer,
            mode=request.mode,
            language=request.language,
            sources=sources,
            suggested_followups=followups,
            model=metrics.model_name or "Qwen2.5-Coder-3B-Instruct",
            metrics=metrics,
            metadata={"session_id": request.session_id},
        )

    async def stream_chat(self, request: TutorChatRequest) -> AsyncGenerator[str, None]:
        """Streams tutoring tokens token-by-token for responsive frontend display."""
        prompt = self._build_tutoring_prompt(request)
        system_prompt = self._build_system_prompt(request)

        async for token in inference_service.stream_response(
            prompt=prompt,
            system_prompt=system_prompt,
        ):
            yield token

    def _build_system_prompt(self, request: TutorChatRequest) -> str:
        mode_instruction = self.MODE_PROMPTS.get(request.mode, self.MODE_PROMPTS["explain"])
        return (
            "You are CodeTutor Africa, an AI programming tutor for university students in Africa. "
            "Your philosophy is Socratic and pedagogical. Never write complete homework solutions directly. "
            "Encourage deep conceptual understanding, clean idioms, and computational thinking.\n\n"
            f"Programming Language Target: {request.language.upper()}\n"
            f"Current Pedagogical Strategy: {mode_instruction}"
        )

    def _build_prompt(self, request: TutorChatRequest) -> str:
        return self._build_tutoring_prompt(request)

    def _build_tutoring_prompt(self, request: TutorChatRequest) -> str:
        prompt_parts = []

        if request.course_id:
            prompt_parts.append(f"Course Context: {request.course_id}")
        if request.lesson_id:
            prompt_parts.append(f"Lesson Context: {request.lesson_id}")
        if request.code_context:
            prompt_parts.append(f"Student Code Context:\n```{request.language}\n{request.code_context}\n```")

        prompt_parts.append(f"Student Question: {request.message}")
        return "\n\n".join(prompt_parts)

    def _get_relevant_sources(self, request: TutorChatRequest) -> List[TutorSource]:
        sources = []
        if request.course_id:
            sources.append(TutorSource(
                document="CodeTutor Africa Standard Curriculum",
                course_id=request.course_id,
                lesson_id=request.lesson_id,
                section="Core Concepts",
            ))
        return sources

    def _generate_suggested_followups(self, request: TutorChatRequest) -> List[str]:
        if request.mode == "explain":
            return [
                f"Can you give me a coding exercise to practice this in {request.language}?",
                "What is the time and space complexity of this approach?",
                "Can you show a visual memory diagram of how this works?",
            ]
        elif request.mode == "hint":
            return [
                "I tried that, but I'm still getting an error. What's next?",
                "Can you explain the difference between value and reference here?",
            ]
        elif request.mode == "debug":
            return [
                "How can I write a test case to prevent this bug in the future?",
                "Is there an idiomatic shorthand for this in modern syntax?",
            ]
        return [
            "Tell me more about how this connects to real-world software.",
            "Test my understanding with a quick quiz question.",
        ]


tutor_service = TutorService()
