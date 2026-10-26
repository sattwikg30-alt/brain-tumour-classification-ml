import {
  GradCAMResponse,
  HealthResponse,
  ModelInfoResponse,
  PredictionResponse,
} from "@/types/prediction";

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch("/api/health", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Health check failed with status: ${res.status}`);
  }
  return res.json();
}

export async function getModelInfo(): Promise<ModelInfoResponse> {
  const res = await fetch("/api/model-info", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load model info: ${res.status}`);
  }
  return res.json();
}

export async function predictTumor(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/predict", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ detail: "Unknown inference failure" }));
    throw new Error(errorBody.detail || `Prediction failed with status: ${res.status}`);
  }

  return res.json();
}

export async function generateGradCAM(
  file: File,
  targetClass?: string
): Promise<GradCAMResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (targetClass) {
    formData.append("target_class", targetClass);
  }

  const res = await fetch("/api/gradcam", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ detail: "Unknown explainability error" }));
    throw new Error(errorBody.detail || `Grad-CAM failed with status: ${res.status}`);
  }

  return res.json();
}
