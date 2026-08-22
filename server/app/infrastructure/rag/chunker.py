"""
Lightweight Document and Markdown Chunker.
Splits course documents and code examples while preserving metadata and headings.
"""

import re
from typing import List, Dict, Any
from pydantic import BaseModel, Field


class DocumentChunk(BaseModel):
    id: str
    content: str
    course_id: str = "general"
    lesson_id: str = "general"
    topic: str = "general"
    section: str = "main"
    metadata: Dict[str, Any] = Field(default_factory=dict)


class MarkdownChunker:
    """Zero-dependency markdown and text chunker."""

    def __init__(self, chunk_size: int = 400, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(
        self,
        text: str,
        course_id: str = "general",
        lesson_id: str = "general",
        topic: str = "general",
    ) -> List[DocumentChunk]:
        """Splits markdown by section headers and paragraphs."""
        # Split by markdown headers (#, ##, ###)
        sections = re.split(r'(?=(?:^|\n)#{1,3}\s+)', text)
        chunks: List[DocumentChunk] = []
        chunk_idx = 1

        for section in sections:
            clean_section = section.strip()
            if not clean_section:
                continue

            # Extract section title if present
            header_match = re.match(r'^#{1,3}\s+(.+)', clean_section)
            section_title = header_match.group(1).strip() if header_match else "Introduction"

            # If section is small enough, keep as single chunk
            words = clean_section.split()
            if len(words) <= self.chunk_size:
                chunks.append(
                    DocumentChunk(
                        id=f"{course_id}-{lesson_id}-chunk-{chunk_idx}",
                        content=clean_section,
                        course_id=course_id,
                        lesson_id=lesson_id,
                        topic=topic,
                        section=section_title,
                    )
                )
                chunk_idx += 1
            else:
                # Sliding window chunking
                step = max(1, self.chunk_size - self.chunk_overlap)
                for i in range(0, len(words), step):
                    chunk_words = words[i:i + self.chunk_size]
                    if len(chunk_words) < 20 and i > 0:
                        continue  # Skip tiny trailing fragments
                    
                    chunks.append(
                        DocumentChunk(
                            id=f"{course_id}-{lesson_id}-chunk-{chunk_idx}",
                            content=" ".join(chunk_words),
                            course_id=course_id,
                            lesson_id=lesson_id,
                            topic=topic,
                            section=section_title,
                        )
                    )
                    chunk_idx += 1

        return chunks


chunker = MarkdownChunker()
