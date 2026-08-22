"""
In-Memory SQL Execution Sandbox.
Executes student SQL queries against lightweight in-memory SQLite databases.
"""

import sqlite3
import time
from typing import List, Dict, Any, Tuple
from app.infrastructure.code_runner.base import ExecutionResult, TestCaseResult, TestCase

# Default sandbox database schema for SQL exercises
SQL_SANDBOX_SCHEMA = """
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    grade INTEGER
);

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS enrollments (
    student_id INTEGER,
    course_id INTEGER,
    score REAL
);

INSERT INTO students (id, name, country, grade) VALUES
(1, 'Amina Mensah', 'Ghana', 92),
(2, 'Kwame Adebayo', 'Nigeria', 85),
(3, 'Fatima Diallo', 'Senegal', 78),
(4, 'Tariq Al-Mansoor', 'Egypt', 95),
(5, 'Zola Ndlovu', 'South Africa', 88);

INSERT INTO courses (id, title, category) VALUES
(101, 'Python Fundamentals', 'Computer Science'),
(102, 'Data Structures', 'Computer Science'),
(103, 'Web Development', 'Software Engineering');

INSERT INTO enrollments (student_id, course_id, score) VALUES
(1, 101, 94.5),
(1, 102, 89.0),
(2, 101, 88.0),
(3, 103, 91.5),
(4, 101, 97.0),
(5, 102, 86.0);
"""


class SQLSandboxRunner:
    """Executes SQL queries against an in-memory SQLite sandbox."""

    def execute_query(self, query: str) -> Tuple[str, str, int, float]:
        start = time.perf_counter()
        conn = sqlite3.connect(":memory:")
        cursor = conn.cursor()

        try:
            # Seed schema
            cursor.executescript(SQL_SANDBOX_SCHEMA)

            # Clean and execute user query
            clean_query = query.strip().rstrip(";")
            cursor.execute(clean_query)
            rows = cursor.fetchall()

            headers = [desc[0] for desc in cursor.description] if cursor.description else []
            formatted_lines = []
            if headers:
                formatted_lines.append(" | ".join(headers))
                formatted_lines.append("-" * len(formatted_lines[0]))
            for row in rows:
                formatted_lines.append(" | ".join(str(val) for val in row))

            stdout = "\n".join(formatted_lines)
            stderr = ""
            exit_code = 0
        except Exception as e:
            stdout = ""
            stderr = f"SQL Error: {str(e)}"
            exit_code = 1
        finally:
            conn.close()

        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        return stdout, stderr, exit_code, duration_ms


sql_runner = SQLSandboxRunner()
