"""
FastAPI Application Entry Point.
CodeTutor Africa - Offline-First AI Programming Tutor Backend.
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import get_settings
from app.core.logging import logger
from app.core.lifecycle import lifespan
from app.core.exceptions import AppBaseException
from app.api.v1.health import router as health_router
from app.api.router import api_v1_router
from app.schemas.common import ErrorResponse, ErrorDetail

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Offline-First AI Programming Tutor for ADTC 2026 Laptop LLM Track",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG or settings.APP_ENV == "development" else None,
    redoc_url=None,
)

# CORS Configuration for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ══════════════════════════════════════════════════════════════════════════
# GLOBAL EXCEPTION HANDLERS
# ══════════════════════════════════════════════════════════════════════════

@app.exception_handler(AppBaseException)
async def handle_app_exception(request: Request, exc: AppBaseException):
    logger.warning(f"Domain Exception [{exc.code}]: {exc.message} (path={request.url.path})")
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=ErrorDetail(
                code=exc.code,
                message=exc.message,
                details=exc.details if exc.details else None,
            )
        ).model_dump(),
    )


@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError):
    logger.warning(f"Request Validation Error: {exc.errors()} (path={request.url.path})")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error=ErrorDetail(
                code="VALIDATION_ERROR",
                message="Invalid request payload or query parameter.",
                details={"errors": exc.errors()},
            )
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def handle_generic_exception(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error=ErrorDetail(
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected internal server error occurred.",
            )
        ).model_dump(),
    )


# ══════════════════════════════════════════════════════════════════════════
# ROUTE REGISTRATION
# ══════════════════════════════════════════════════════════════════════════

# Lightweight Root Health Check
app.include_router(health_router)

# Versioned API Routes (/api/v1)
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
