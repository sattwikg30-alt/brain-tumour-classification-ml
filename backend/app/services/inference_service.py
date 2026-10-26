from __future__ import annotations

import base64
import io
import time
from pathlib import Path
from typing import Optional, Tuple

import numpy as np
from PIL import Image, UnidentifiedImageError

from backend.app.core.config import settings
from backend.app.schemas.prediction import (
    ClassScore,
    GradCAMResponse,
    ModelInfoResponse,
    ModelMetrics,
    PredictionResponse,
)
from ml.explainability.gradcam import (
    TARGET_CONV_LAYER,
    compute_gradcam,
    load_and_prepare_model,
    overlay_heatmap,
    preprocess_image,
)
from ml.preprocessing.preprocess import CLASS_NAMES

DISPLAY_NAMES = {
    "glioma": "Glioma",
    "meningioma": "Meningioma",
    "notumor": "No Tumor",
    "pituitary": "Pituitary",
}


def _image_to_base64_png(image_array_or_pil: np.ndarray | Image.Image) -> str:
    """Encode an RGB numpy array or PIL Image into a base64 Data URL string."""
    if isinstance(image_array_or_pil, np.ndarray):
        pil_img = Image.fromarray(image_array_or_pil)
    else:
        pil_img = image_array_or_pil

    buffer = io.BytesIO()
    pil_img.save(buffer, format="PNG")
    raw_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{raw_b64}"


class InferenceService:
    _instance: Optional["InferenceService"] = None

    def __init__(self) -> None:
        self.model_path: Path = settings.MODEL_PATH
        self.full_model = None
        self.feature_extractor = None
        self.head_layers = None
        self.is_loaded: bool = False
        self.load_error: Optional[str] = None
        self.load_model()

    @classmethod
    def get_instance(cls) -> "InferenceService":
        if cls._instance is None:
            cls._instance = InferenceService()
        return cls._instance

    def load_model(self) -> None:
        """Load the model and Grad-CAM layers once at startup."""
        try:
            if not self.model_path.is_file():
                raise FileNotFoundError(f"Model checkpoint not found at: {self.model_path.resolve()}")

            self.full_model, self.feature_extractor, self.head_layers = load_and_prepare_model(
                self.model_path, conv_layer_name=TARGET_CONV_LAYER
            )
            self.is_loaded = True
            self.load_error = None
        except Exception as exc:
            self.is_loaded = False
            self.load_error = str(exc)

    def validate_and_load_image(self, file_bytes: bytes, filename: str) -> Image.Image:
        """Validate upload size, file extension, and image decode."""
        if not file_bytes:
            raise ValueError("Uploaded file is empty.")

        if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
            max_mb = settings.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)
            raise ValueError(f"File size exceeds maximum allowed limit of {max_mb:.0f} MB.")

        ext = Path(filename).suffix.lower()
        if ext not in settings.ALLOWED_IMAGE_EXTENSIONS:
            allowed = ", ".join(settings.ALLOWED_IMAGE_EXTENSIONS)
            raise ValueError(f"Unsupported file extension '{ext}'. Supported formats: {allowed}")

        try:
            image = Image.open(io.BytesIO(file_bytes))
            image.verify()  # Verify file integrity
            # Reopen after verify() since verify() closes image stream
            image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
            return image
        except (UnidentifiedImageError, OSError) as exc:
            raise ValueError(f"Uploaded file is not a valid or readable image: {exc}")

    def predict(self, image: Image.Image) -> PredictionResponse:
        """Run classification on a PIL image using the loaded model."""
        if not self.is_loaded or self.full_model is None:
            raise RuntimeError(f"Model is not loaded: {self.load_error}")

        start_time = time.perf_counter()
        preprocessed_tensor, orig_image_rgb, orig_size = preprocess_image(image)

        # Run inference
        raw_predictions = self.full_model.predict(preprocessed_tensor, verbose=0)[0]
        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        pred_idx = int(np.argmax(raw_predictions))
        pred_class = CLASS_NAMES[pred_idx]
        confidence = float(raw_predictions[pred_idx])

        scores = [
            ClassScore(
                class_name=c,
                display_name=DISPLAY_NAMES.get(c, c.title()),
                score=float(raw_predictions[i]),
                percentage=round(float(raw_predictions[i]) * 100, 2),
            )
            for i, c in enumerate(CLASS_NAMES)
        ]

        return PredictionResponse(
            predicted_class=pred_class,
            display_name=DISPLAY_NAMES.get(pred_class, pred_class.title()),
            confidence=confidence,
            confidence_percentage=round(confidence * 100, 2),
            scores=scores,
            input_dimensions=[orig_size[0], orig_size[1]],
            inference_time_ms=inference_time_ms,
        )

    def generate_gradcam(
        self,
        image: Image.Image,
        target_class: Optional[str] = None,
        alpha: float = 0.40,
    ) -> GradCAMResponse:
        """Compute predictions and Grad-CAM explainability maps."""
        if not self.is_loaded or self.full_model is None or self.feature_extractor is None:
            raise RuntimeError(f"Model or Grad-CAM extractor not loaded: {self.load_error}")

        start_time = time.perf_counter()
        preprocessed_tensor, orig_image_rgb, orig_size = preprocess_image(image)

        # Model Prediction
        raw_predictions = self.full_model.predict(preprocessed_tensor, verbose=0)[0]
        pred_idx = int(np.argmax(raw_predictions))
        pred_class = CLASS_NAMES[pred_idx]
        confidence = float(raw_predictions[pred_idx])

        # Target class for Grad-CAM
        if target_class is not None:
            target_class_clean = target_class.strip().lower()
            if target_class_clean not in CLASS_NAMES:
                raise ValueError(f"Unknown target class '{target_class}'. Must be one of {CLASS_NAMES}")
            cam_class_idx = CLASS_NAMES.index(target_class_clean)
            cam_class_name = target_class_clean
        else:
            cam_class_idx = pred_idx
            cam_class_name = pred_class

        # Compute Grad-CAM heatmap
        heatmap_2d = compute_gradcam(
            feature_extractor=self.feature_extractor,
            head_layers=self.head_layers,
            preprocessed_image=preprocessed_tensor,
            target_class_idx=cam_class_idx,
        )

        heatmap_rgb, overlay_rgb = overlay_heatmap(
            heatmap_2d=heatmap_2d,
            orig_image_rgb=orig_image_rgb,
            alpha=alpha,
            colormap_name="jet",
        )

        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        scores = [
            ClassScore(
                class_name=c,
                display_name=DISPLAY_NAMES.get(c, c.title()),
                score=float(raw_predictions[i]),
                percentage=round(float(raw_predictions[i]) * 100, 2),
            )
            for i, c in enumerate(CLASS_NAMES)
        ]

        return GradCAMResponse(
            predicted_class=pred_class,
            display_name=DISPLAY_NAMES.get(pred_class, pred_class.title()),
            confidence=confidence,
            confidence_percentage=round(confidence * 100, 2),
            target_class=cam_class_name,
            target_display_name=DISPLAY_NAMES.get(cam_class_name, cam_class_name.title()),
            conv_layer_used=TARGET_CONV_LAYER,
            scores=scores,
            original_image_base64=_image_to_base64_png(orig_image_rgb),
            heatmap_image_base64=_image_to_base64_png(heatmap_rgb),
            overlay_image_base64=_image_to_base64_png(overlay_rgb),
            inference_time_ms=inference_time_ms,
        )

    def get_model_info(self) -> ModelInfoResponse:
        """Return architecture details, supported classes, and benchmark metrics."""
        size_bytes = self.model_path.stat().st_size if self.model_path.is_file() else 0
        return ModelInfoResponse(
            model_name="EfficientNetB0 (Transfer Learning)",
            architecture="EfficientNetB0 ImageNet Backbone + Custom GAP/Dense Head",
            supported_classes=CLASS_NAMES,
            display_names=DISPLAY_NAMES,
            input_dimensions=[224, 224, 3],
            supported_features=[
                "Multi-class 4-way Brain MRI Classification",
                "Grad-CAM Anatomical Visual Explainability",
                "Class Probability and Confidence Scoring",
            ],
            model_size_bytes=size_bytes,
            target_conv_layer=TARGET_CONV_LAYER,
            metrics=ModelMetrics(),
        )
