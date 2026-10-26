import sys
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure root is in sys.path
_WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_WORKSPACE_ROOT) not in sys.path:
    sys.path.insert(0, str(_WORKSPACE_ROOT))

from backend.app.core.config import settings
from backend.app.routes.predictions import router as predictions_router
from backend.app.services.inference_service import InferenceService


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Eagerly load model on startup
    print(f"[FastAPI] Initializing Brain Tumor MRI Inference Service...")
    service = InferenceService.get_instance()
    if service.is_loaded:
        print(f"[FastAPI] Model loaded successfully: {service.model_path.name}")
    else:
        print(f"[FastAPI] WARNING: Model loading encountered error: {service.load_error}")
    yield
    print("[FastAPI] Shutting down inference service...")


app = FastAPI(
    title="Brain Tumor MRI Classification & Explainability API",
    description="Internal backend API serving EfficientNetB0 classification and Grad-CAM visual explainability.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "InternalServerError", "detail": str(exc)},
    )


# Include endpoints under /api prefix
app.include_router(predictions_router, prefix="/api")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
