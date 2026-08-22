"""
Unit Tests for Lightweight Offline RAG Pipeline.
"""

from app.infrastructure.rag.chunker import MarkdownChunker
from app.infrastructure.rag.embeddings import LightweightSparseEmbedding
from app.infrastructure.rag.vector_store import LocalVectorStore
from app.services.rag.knowledge_service import KnowledgeService


def test_markdown_chunker():
    chunker = MarkdownChunker(chunk_size=100, chunk_overlap=20)
    sample_md = (
        "# Python Scope\n\nVariables defined inside functions are local.\n\n"
        "## Global Scope\n\nGlobal variables persist across functions."
    )
    chunks = chunker.chunk_text(sample_md, course_id="course-py-101", lesson_id="les-1", topic="Scope")

    assert len(chunks) >= 2
    assert chunks[0].course_id == "course-py-101"
    assert chunks[0].topic == "Scope"
    assert "Variables defined" in chunks[0].content


def test_lightweight_embedding_generator():
    embedder = LightweightSparseEmbedding(dimension=128)
    vec1 = embedder.embed_text("Python memory references and pointers")
    vec2 = embedder.embed_text("Python memory model and pointers")
    vec3 = embedder.embed_text("JavaScript asynchronous event loop")

    assert vec1.shape == (128,)
    # Similar texts should have positive dot product
    sim1_2 = float(vec1 @ vec2)
    sim1_3 = float(vec1 @ vec3)
    assert sim1_2 > sim1_3


def test_local_vector_store_search():
    store = LocalVectorStore()
    chunker = MarkdownChunker()
    chunks = chunker.chunk_text(
        "# Promises in JS\nPromises represent asynchronous operations.",
        course_id="course-js-201",
        topic="Async",
    )
    store.add_chunks(chunks)

    results = store.search(query="How do JavaScript promises work?", top_k=1)
    assert len(results) == 1
    chunk, score = results[0]
    assert chunk.course_id == "course-js-201"
    assert score > 0.1


def test_knowledge_service_retrieval():
    service = KnowledgeService()
    sources = service.retrieve_context(query="Python list reference mutation b = a", course_id="course-py-101")
    assert len(sources) > 0
    assert "course-py-101" in sources[0].course_id or "Memory" in sources[0].document
