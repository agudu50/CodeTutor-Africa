"""
Unit Tests for Local Offline Multi-Language Code Runner.
"""

import pytest
from app.infrastructure.code_runner.local_runner import local_code_runner
from app.infrastructure.code_runner.sql_runner import sql_runner
from app.infrastructure.code_runner.base import TestCase


@pytest.mark.asyncio
async def test_python_successful_execution():
    code = "x = 10\ny = 25\nprint(x + y)"
    res = await local_code_runner.execute(code, "python")

    assert res.exit_code == 0
    assert res.stdout == "35"
    assert res.stderr == ""
    assert not res.is_timeout
    assert res.all_passed


@pytest.mark.asyncio
async def test_python_stdin_test_cases():
    code = "nums = list(map(int, input().split()))\nprint(sum(1 for x in nums if x > 0))"
    test_cases = [
        TestCase(id="tc-1", input_data="1 -2 3 4", expected_output="3"),
        TestCase(id="tc-2", input_data="-5 -1 0", expected_output="0"),
    ]

    res = await local_code_runner.run_tests(code, "python", test_cases)
    assert res.all_passed
    assert len(res.test_results) == 2
    assert res.test_results[0].passed
    assert res.test_results[1].passed


@pytest.mark.asyncio
async def test_python_syntax_and_runtime_error():
    code = "print(10 / 0)"
    res = await local_code_runner.execute(code, "python")

    assert res.exit_code != 0
    assert "ZeroDivisionError" in res.stderr
    assert not res.all_passed


@pytest.mark.asyncio
async def test_execution_timeout_abort():
    # Infinite loop test
    code = "while True:\n    pass"
    res = await local_code_runner.execute(code, "python", timeout_seconds=1.0)

    assert res.is_timeout
    assert res.exit_code == 124
    assert "Timeout Error" in res.stderr
    assert not res.all_passed


def test_sql_in_memory_sandbox():
    query = "SELECT name, country, grade FROM students WHERE grade >= 90 ORDER BY grade DESC"
    stdout, stderr, exit_code, duration_ms = sql_runner.execute_query(query)

    assert exit_code == 0
    assert "Tariq Al-Mansoor" in stdout
    assert "Amina Mensah" in stdout
    assert stderr == ""


def test_sql_syntax_error():
    query = "SELECT * FROM non_existent_table"
    stdout, stderr, exit_code, duration_ms = sql_runner.execute_query(query)

    assert exit_code != 0
    assert "SQL Error" in stderr
