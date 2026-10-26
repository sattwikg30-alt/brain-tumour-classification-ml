export interface ClassScore {
  class_name: string;
  display_name: string;
  score: number;
  percentage: number;
}

export interface ModelMetrics {
  test_accuracy: number;
  test_loss: number;
  precision_macro: number;
  recall_macro: number;
  f1_score_macro: number;
  roc_auc_macro: number;
  notumor_recall: number;
  pituitary_recall: number;
  meningioma_recall: number;
  glioma_recall: number;
}

export interface ModelInfoResponse {
  model_name: string;
  architecture: string;
  supported_classes: string[];
  display_names: Record<string, string>;
  input_dimensions: number[];
  supported_features: string[];
  model_size_bytes: number;
  target_conv_layer: string;
  metrics: ModelMetrics;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_name: string;
  version: string;
}

export interface PredictionResponse {
  predicted_class: string;
  display_name: string;
  confidence: number;
  confidence_percentage: number;
  scores: ClassScore[];
  input_dimensions: [number, number];
  inference_time_ms: number;
}

export interface GradCAMResponse {
  predicted_class: string;
  display_name: string;
  confidence: number;
  confidence_percentage: number;
  target_class: string;
  target_display_name: string;
  conv_layer_used: string;
  scores: ClassScore[];
  original_image_base64: string;
  heatmap_image_base64: string;
  overlay_image_base64: string;
  inference_time_ms: number;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  filename: string;
  predicted_class: string;
  display_name: string;
  confidence_percentage: number;
  thumbnail_base64?: string;
  scores: ClassScore[];
  inference_time_ms: number;
}
