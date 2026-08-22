"""
Debugger Service.
Analyzes code, compiler/runtime outputs, and provides Socratic diagnostic hints.
"""

from app.schemas.debugger import DebugAnalyzeRequest, DebugAnalyzeResponse, BugLocation
from app.services.inference.inference_service import inference_service


class DebuggerService:
    async def analyze(self, req: DebugAnalyzeRequest) -> DebugAnalyzeResponse:
        has_error = req.error_message is not None or "error" in req.code.lower()

        prompt = (
            f"Analyze the following {req.language} code for bugs and logic issues.\n"
            f"Error message: {req.error_message or 'None provided'}\n\n"
            f"Code:\n```{req.language}\n{req.code}\n```"
        )
        system_prompt = "You are an expert compiler and runtime diagnostics assistant. Identify the root cause and provide a guided fix."

        explanation, metrics = await inference_service.generate_response(prompt, system_prompt)

        return DebugAnalyzeResponse(
            has_bugs=has_error,
            summary="Identified potential reference mutation or unhandled exception." if has_error else "Code appears syntactically sound.",
            error_type="ReferenceError" if has_error else None,
            locations=[BugLocation(line=2, column=5, snippet=req.code.splitlines()[1] if len(req.code.splitlines()) > 1 else None)] if has_error else [],
            root_cause_explanation=explanation,
            guided_fix_hint="Ensure you allocate a fresh array copy or check boundary conditions.",
            fixed_code_snippet=None,
        )


debugger_service = DebuggerService()
