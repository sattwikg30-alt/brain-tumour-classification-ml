from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from backend.app.schemas.prediction import (
    GradCAMResponse,
    HealthResponse,
    ModelInfoResponse,
    PredictionResponse,
)
from backend.app.services.inference_service import InferenceService

router = APIRouter(prefix="", tags=["Predictions & Explainability"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Return backend server status and model availability."""
    service = InferenceService.get_instance()
    status_str = "healthy" if service.is_loaded else "degraded"
    return HealthResponse(
        status=status_str,
        model_loaded=service.is_loaded,
        model_name="EfficientNetB0",
        version="1.0.0",
    )


@router.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info() -> ModelInfoResponse:
    """Return model architecture, verified benchmark metrics, and class schema."""
    service = InferenceService.get_instance()
    return service.get_model_info()


@router.post("/predict", response_model=PredictionResponse)
async def predict_tumor(file: UploadFile = File(...)) -> PredictionResponse:
    """Run tumor classification on an uploaded brain MRI image."""
    service = InferenceService.get_instance()
    if not service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Inference service unavailable: {service.load_error}",
        )

    try:
        content = await file.read()
        image = service.validate_and_load_image(content, file.filename or "uploaded.jpg")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    try:
        return service.predict(image)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model inference failed: {exc}",
        )


@router.post("/gradcam", response_model=GradCAMResponse)
async def explain_tumor(
    file: UploadFile = File(...),
    target_class: Optional[str] = Form(None),
) -> GradCAMResponse:
    """Compute prediction and Grad-CAM activation heatmap on an uploaded brain MRI scan."""
    service = InferenceService.get_instance()
    if not service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Inference service unavailable: {service.load_error}",
        )

    try:
        content = await file.read()
        image = service.validate_and_load_image(content, file.filename or "uploaded.jpg")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    try:
        return service.generate_gradcam(image, target_class=target_class)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Grad-CAM generation failed: {exc}",
        )
