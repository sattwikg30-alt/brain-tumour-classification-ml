from typing import Any
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(..., example="healthy")
    model_loaded: bool = Field(..., example=True)
    model_name: str = Field(..., example="EfficientNetB0")
    version: str = Field(..., example="1.0.0")


class ClassScore(BaseModel):
    class_name: str = Field(..., example="glioma")
    display_name: str = Field(..., example="Glioma")
    score: float = Field(..., example=0.9854)
    percentage: float = Field(..., example=98.54)


class ModelMetrics(BaseModel):
    test_accuracy: float = 0.8750
    test_loss: float = 0.5056
    precision_macro: float = 0.8792
    recall_macro: float = 0.8750
    f1_score_macro: float = 0.8699
    roc_auc_macro: float = 0.9718
    notumor_recall: float = 1.0000
    pituitary_recall: float = 0.9900
    meningioma_recall: float = 0.8525
    glioma_recall: float = 0.6575


class ModelInfoResponse(BaseModel):
    model_name: str = Field(..., example="EfficientNetB0")
    architecture: str = Field(..., example="EfficientNetB0 + Custom Dense Head")
    supported_classes: list[str] = Field(..., example=["glioma", "meningioma", "notumor", "pituitary"])
    display_names: dict[str, str] = Field(..., example={"glioma": "Glioma", "meningioma": "Meningioma", "notumor": "No Tumor", "pituitary": "Pituitary"})
    input_dimensions: list[int] = Field(..., example=[224, 224, 3])
    supported_features: list[str] = Field(..., example=["multi-class classification", "grad-cam visual explainability", "confidence score distribution"])
    model_size_bytes: int = Field(..., example=19032373)
    target_conv_layer: str = Field(..., example="top_activation")
    metrics: ModelMetrics = Field(default_factory=ModelMetrics)


class PredictionResponse(BaseModel):
    predicted_class: str = Field(..., example="glioma")
    display_name: str = Field(..., example="Glioma")
    confidence: float = Field(..., example=0.9854)
    confidence_percentage: float = Field(..., example=98.54)
    scores: list[ClassScore] = Field(...)
    input_dimensions: list[int] = Field(..., example=[224, 224])
    inference_time_ms: float = Field(..., example=45.2)


class GradCAMResponse(BaseModel):
    predicted_class: str = Field(..., example="glioma")
    display_name: str = Field(..., example="Glioma")
    confidence: float = Field(..., example=0.9854)
    confidence_percentage: float = Field(..., example=98.54)
    target_class: str = Field(..., example="glioma")
    target_display_name: str = Field(..., example="Glioma")
    conv_layer_used: str = Field(..., example="top_activation")
    scores: list[ClassScore] = Field(...)
    original_image_base64: str = Field(...)
    heatmap_image_base64: str = Field(...)
    overlay_image_base64: str = Field(...)
    inference_time_ms: float = Field(..., example=85.6)


class ErrorResponse(BaseModel):
    error: str = Field(...)
    detail: str = Field(...)
