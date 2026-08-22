"""
Local Vector Store Implementation.
Performs sub-millisecond similarity search using vectorized dot products.
"""

from typing import List, Tuple, Optional
import numpy as np
from app.infrastructure.rag.chunker import DocumentChunk
from app.infrastructure.rag.embeddings import EmbeddingProvider, embedding_provider


class LocalVectorStore:
    """Fast, lightweight in-memory vector index with metadata filtering."""

    def __init__(self, embedder: Optional[EmbeddingProvider] = None):
        self.embedder = embedder or embedding_provider
        self.chunks: List[DocumentChunk] = []
        self.vectors: Optional[np.ndarray] = None

    def add_chunks(self, chunks: List[DocumentChunk]):
        """Adds and indexes a list of document chunks."""
        if not chunks:
            return

        texts = [c.content for c in chunks]
        new_vectors = self.embedder.embed_batch(texts)

        if self.vectors is None:
            self.vectors = new_vectors
            self.chunks = list(chunks)
        else:
            self.vectors = np.vstack([self.vectors, new_vectors])
            self.chunks.extend(chunks)

    def search(
        self,
        query: str,
        top_k: int = 3,
        course_id: Optional[str] = None,
        min_score: float = 0.1,
    ) -> List[Tuple[DocumentChunk, float]]:
        """Finds top-k most relevant document chunks for query."""
        if self.vectors is None or len(self.chunks) == 0:
            return []

        query_vec = self.embedder.embed_text(query)
        # Cosine similarity via dot product of normalized vectors
        scores = np.dot(self.vectors, query_vec)

        # Apply course filter if specified
        results: List[Tuple[DocumentChunk, float]] = []
        ranked_indices = np.argsort(scores)[::-1]

        for idx in ranked_indices:
            score = float(scores[idx])
            if score < min_score:
                break

            chunk = self.chunks[idx]
            if course_id and chunk.course_id != course_id and chunk.course_id != "general":
                continue

            results.append((chunk, score))
            if len(results) >= top_k:
                break

        return results

    def clear(self):
        """Clears all indexed chunks and vectors."""
        self.chunks = []
        self.vectors = None

    @property
    def total_chunks(self) -> int:
        return len(self.chunks)


vector_store = LocalVectorStore()
