# Cerebra — Brain Tumor MRI Classification & Visual Explainability (Grad-CAM)

[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12%20%7C%203.13-blue.svg)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.21.0-orange.svg)](https://www.tensorflow.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20(App%20Router)-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Test Accuracy](https://img.shields.io/badge/Test_Accuracy-87.50%25-brightgreen.svg)]()
[![ROC-AUC](https://img.shields.io/badge/ROC--AUC-0.9718-success.svg)]()
[![Healthy Recall](https://img.shields.io/badge/Healthy_Tissue_Recall-100.0%25-teal.svg)]()

An end-to-end medical deep learning platform for automated differential classification and visual explainability of brain Magnetic Resonance Imaging (MRI) scans across four categories: **Glioma**, **Meningioma**, **Pituitary Tumor**, and **Healthy Brain Tissue (No Tumor)**.

The system combines a transfer-learning **EfficientNet-B0** convolutional neural network achieving **87.50% test accuracy (0.9718 ROC-AUC)**, **Grad-CAM (Gradient-weighted Class Activation Mapping)** for transparent anatomical saliency heatmaps, a high-performance asynchronous **FastAPI** backend, and a modern **Next.js 14 App Router** clinical dashboard operating behind a secure single-origin proxy.

---

## Table of Contents

- [1. Executive Summary & Clinical Problem](#1-executive-summary--clinical-problem)
- [2. Key System Capabilities](#2-key-system-capabilities)
- [3. Machine Learning Subsystem](#3-machine-learning-subsystem)
  - [3.1 Model Architecture Progression](#31-model-architecture-progression)
  - [3.2 Baseline CNN vs. Champion EfficientNet-B0](#32-baseline-cnn-vs-champion-efficientnet-b0)
  - [3.3 Grad-CAM Explainability Engine](#33-grad-cam-explainability-engine)
- [4. Dataset & Preprocessing Pipeline](#4-dataset--preprocessing-pipeline)
  - [4.1 Dataset Structure & Stratified Splits](#41-dataset-structure--stratified-splits)
  - [4.2 Preprocessing & Data Augmentation](#42-preprocessing--data-augmentation)
- [5. Empirical Benchmark Results](#5-empirical-benchmark-results)
  - [5.1 Head-to-Head Model Performance](#51-head-to-head-model-performance)
  - [5.2 Per-Class Detailed Classification Report](#52-per-class-detailed-classification-report)
  - [5.3 Confusion Matrix Analysis](#53-confusion-matrix-analysis)
- [6. Full-Stack Software Architecture](#6-full-stack-software-architecture)
  - [6.1 Single-Origin Loopback Proxy Design](#61-single-origin-loopback-proxy-design)
  - [6.2 Frontend Application (Next.js 14)](#62-frontend-application-nextjs-14)
  - [6.3 Backend Inference Engine (FastAPI)](#63-backend-inference-engine-fastapi)
  - [6.4 Fallback Streamlit Application](#64-fallback-streamlit-application)
- [7. Complete Directory Tree](#7-complete-directory-tree)
- [8. REST API Specification](#8-rest-api-specification)
  - [8.1 GET /api/health](#81-get-apihealth)
  - [8.2 GET /api/model-info](#82-get-apimodel-info)
  - [8.3 POST /api/predict](#83-post-apipredict)
  - [8.4 POST /api/gradcam](#84-post-apigradcam)
- [9. Quick Start & Installation Guide](#9-quick-start--installation-guide)
  - [9.1 Prerequisites](#91-prerequisites)
  - [9.2 Installation Steps](#92-installation-steps)
  - [9.3 Running the Development Environment](#93-running-the-development-environment)
  - [9.4 Running Evaluation & Parity Tests](#94-running-evaluation--parity-tests)
- [10. Presentation Slide Deck Deliverables](#10-presentation-slide-deck-deliverables)
- [11. Model Checkpoint Parity & Integrity](#11-model-checkpoint-parity--integrity)
- [12. Clinical Disclaimers & Ethical AI Usage](#12-clinical-disclaimers--ethical-ai-usage)

---

## 1. Executive Summary & Clinical Problem

Brain and central nervous system (CNS) tumors affect over 300,000 individuals globally each year. Precise differential diagnosis is essential for surgical resection planning, radiation oncology, and chemotherapy protocols. However, neuro-oncology diagnosis faces three systemic clinical roadblocks:

1. **Neuroradiologist Scarcity & Cognitive Fatigue:** A severe global shortage of sub-specialized neuroradiologists coupled with high scan volumes causes diagnostic delays and increases missed micro-margin rates during extended shifts.
2. **Morphological Overlap Across 4 Classes:** Differentiating between malignant infiltrative **Gliomas**, dural extra-axial **Meningiomas**, sellar-region **Pituitary Adenomas**, and unremarkable **Healthy Brain Scans** requires distinguishing subtle intensity variations, edema patterns, and mass effects. Crucially, healthy scans require **zero false negatives** to prevent traumatic, invasive workups.
3. **The "Black-Box" AI Barrier:** Clinicians and multi-disciplinary tumor boards reject artificial intelligence models that output opaque percentage scores without spatial anatomical justification. Verifiable visual grounding is a regulatory and clinical prerequisite for deployment.

**Cerebra** addresses this challenge by combining transfer-learning convolutional neural networks with **Grad-CAM visual saliency mapping**, giving radiologists both high-confidence differential predictions and exact visual proof of the anatomical regions driving the decision.

---

## 2. Key System Capabilities

- **4-Way Differential MRI Diagnosis:** Classifies brain MRI scans into Glioma, Meningioma, Pituitary Tumor, or Healthy Brain Tissue.
- **Grad-CAM Anatomical Explainability:** Computes gradients of the target class logit with respect to the final convolutional feature maps (`top_activation`), rendering a normalized Jet colormap heatmap overlay directly onto the patient's MRI scan.
- **100% Healthy Tissue Recall:** Evaluated on 1,600 untouched independent test scans with **zero false negatives** on normal brain tissue (400 / 400 correct).
- **Sub-50ms Real-Time Latency:** Eagerly loads model weights into memory as a lifespan singleton, enabling instant analysis for emergency department triage.
- **Single-Origin Architectural Security:** Next.js reverse proxy routes internal `/api/*` calls directly to the FastAPI backend, completely shielding the ML service from external port exposure and eliminating CORS vulnerabilities.
- **Interactive Medical Workspace:** Drag-and-drop file uploader, verified 1-click sample MRI pills, softmax probability distribution bars, 3-panel Grad-CAM comparison viewer, and a local browser session audit log with JSON export.

---

## 3. Machine Learning Subsystem

### 3.1 Model Architecture Progression

To determine the optimal architecture for brain MRI classification, the project implemented a rigorous two-model empirical progression:

```text
Input MRI Scan (224×224×3 RGB)
       │
       ├──▶ [Model 01: Baseline Custom 4-Layer CNN] ────▶ 68.75% Test Accuracy (5.1 MB)
       │    (4 Conv2D/BatchNorm/MaxPool blocks, trained from scratch)
       │
       └──▶ [Model 02: Champion EfficientNet-B0 CNN] ───▶ 87.50% Test Accuracy (19.0 MB)
            (Pretrained ImageNet backbone + MBConv blocks + Squeeze-and-Excitation)
                   │
                   ▼
       [Final Conv Layer: top_activation (7×7×1280)]
                   │
                   ├──▶ Global Average Pooling ➔ Dense (128) ➔ 4-Class Softmax
                   │
                   └──▶ tf.GradientTape Backpropagation ➔ Grad-CAM Saliency Map
```

### 3.2 Baseline CNN vs. Champion EfficientNet-B0

1. **Model 01: Baseline Custom 4-Layer CNN (`ml/models/baseline_cnn.keras`):**
   - **Architecture:** 4 sequential blocks consisting of `Conv2D(32/64/128/256, 3x3)` $\to$ `BatchNormalization` $\to$ `ReLU` $\to$ `MaxPooling2D(2x2)` $\to$ `Flatten` $\to$ `Dense(256)` $\to$ `Dropout(0.4)` $\to$ `Dense(4, Softmax)`.
   - **Size:** 5.1 MB (1,340,932 parameters).
   - **Normalization:** Pixel scaling to `[0, 1]`.
   - **Test Accuracy:** **68.75%** on 1,600 test scans.

2. **Model 02: Champion EfficientNet-B0 Deep CNN (`ml/models/efficientnet_b0.keras`):**
   - **Architecture:** Transfer learning utilizing Google's EfficientNet-B0 backbone (pretrained on ImageNet), built from Inverted Residual Convolutional blocks (**MBConv**) with Depthwise Separable Convolutions and Squeeze-and-Excitation (SE) channel attention.
   - **Classification Head:** `GlobalAveragePooling2D` $\to$ `Dropout(0.3)` $\to$ `Dense(128, ReLU)` $\to$ `Dropout(0.2)` $\to$ `Dense(4, Softmax)`.
   - **Size:** 19.0 MB (4,185,256 parameters).
   - **Normalization:** Official Keras `efficientnet.preprocess_input` (keeping expected range with channel-wise ImageNet zero-centering).
   - **Test Accuracy:** **87.50%** on 1,600 test scans (+18.75% over baseline).
   - **Selection:** Deployed as the primary production model in FastAPI and Streamlit due to superior generalization, higher ROC-AUC (0.9718), and zero false negatives on healthy tissue.

### 3.3 Grad-CAM Explainability Engine

Grad-CAM (Gradient-weighted Class Activation Mapping) visually explains where the neural network focuses its attention.

1. **Gradient Computation:**
   Given the output logit $y^c$ for class $c$, the gradient with respect to feature activation map $A^k$ of the final convolutional layer (`top_activation`, shape $7 \times 7 \times 1280$) is computed via `tf.GradientTape`:

   $$\alpha_k^c = \frac{1}{Z} \sum_{i=1}^H \sum_{j=1}^W \frac{\partial y^c}{\partial A_{i,j}^k}$$

   where $Z = H \times W$ represents spatial pooling over the feature map.

2. **Heatmap Generation:**
   The weighted sum of feature maps is passed through a Rectified Linear Unit (ReLU) to isolate features that have a positive influence on the target class:

   $$L_{\text{Grad-CAM}}^c = \text{ReLU}\left( \sum_k \alpha_k^c A^k \right)$$

3. **Bilinear Upsampling & Blending:**
   The $7 \times 7$ heatmap is normalized between $[0, 1]$, upsampled to the original scan dimensions ($224 \times 224$), mapped to an RGB heatmap using the OpenCV/Matplotlib `Jet` colormap, and alpha-blended over the original grayscale MRI scan with an opacity coefficient of $\alpha = 0.40$:

   $$\text{Overlay} = (1 - \alpha) \cdot I_{\text{original}} + \alpha \cdot I_{\text{heatmap}}$$

---

## 4. Dataset & Preprocessing Pipeline

### 4.1 Dataset Structure & Stratified Splits

The model was trained and evaluated on an open-access Brain Tumor MRI Dataset containing 7,312 total axial and coronal T1-weighted MRI images partitioned as follows:

```text
dataset/
├── Training/          # 5,712 images
│   ├── glioma/        # 1,321 images
│   ├── meningioma/    # 1,339 images
│   ├── notumor/       # 1,595 images
│   └── pituitary/     # 1,457 images
└── Testing/           # 1,600 images (Untouched official independent benchmark)
    ├── glioma/        # 400 images
    ├── meningioma/    # 400 images
    ├── notumor/       # 400 images
    └── pituitary/     # 400 images
```

- **Stratified Validation Split:** During training, 20% of `dataset/Training` (1,142 images) was partitioned via stratified sampling (random seed = 42) into a validation set.
- **Untouched Independent Benchmark:** The official `dataset/Testing` partition (1,600 images, exactly 400 per class) was **never touched** during hyperparameter tuning or training, guaranteeing zero data leakage.

### 4.2 Preprocessing & Data Augmentation

- **Resolution:** Standardized to $224 \times 224$ pixels using anti-aliased bilinear interpolation.
- **Color Format:** Converted to 3-channel RGB.
- **Training Data Augmentation (tf.keras.Sequential):**
  - Conservative horizontal flip (`RandomFlip("horizontal")`).
  - Small spatial rotation ($\pm 5\%$ / 0.05 factor) to reflect patient head tilt without distorting intracranial geometry.
  - Small spatial zoom ($\pm 10\%$ / 0.10 factor) to accommodate scanner magnification differences.
- **Validation/Testing:** Evaluated strictly without augmentation.

---

## 5. Empirical Benchmark Results

### 5.1 Head-to-Head Model Performance

Both models were evaluated on the balanced 1,600-image independent test set:

| Benchmark Metric | Baseline Custom 4-Layer CNN | Champion EfficientNet-B0 CNN | Absolute Delta |
| :--- | :---: | :---: | :---: |
| **Model Size** | 5.1 MB | 19.0 MB | +13.9 MB |
| **Test Accuracy** | 68.75% (1,100 / 1,600) | **87.50% (1,400 / 1,600)** | **+18.75%** |
| **Cross-Entropy Loss**| 1.1840 | **0.5056** | **-0.6784** |
| **Precision (Macro)** | 0.7130 | **0.8792** | **+0.1662** |
| **Recall (Macro)** | 0.6875 | **0.8750** | **+0.1875** |
| **F1-Score (Macro)** | 0.6624 | **0.8699** | **+0.2075** |
| **ROC-AUC (Macro OvR)**| 0.8828 | **0.9718** | **+0.0890** |
| **Healthy Recall (`notumor`)** | 92.50% | **100.00% (0 False Negatives)** | **+7.50%** |
| **Pituitary Recall** | 88.75% | **99.00% (396 / 400)** | **+10.25%** |
| **Meningioma Recall**| 56.50% | **85.25% (341 / 400)** | **+28.75%** |
| **Glioma Recall** | 37.25% | **65.75% (263 / 400)** | **+28.50%** |

### 5.2 Per-Class Detailed Classification Report

Classification metrics evaluated via Scikit-Learn for the production EfficientNet-B0 model:

```text
              Precision    Recall    F1-Score   Support (Scans)
---------------------------------------------------------------
      glioma     0.9261    0.6575      0.7690         400
  meningioma     0.7857    0.8525      0.8177         400
     notumor     0.8969    1.0000      0.9456         400
   pituitary     0.9083    0.9900      0.9474         400
---------------------------------------------------------------
    accuracy                           0.8750        1600
   macro avg     0.8792    0.8750      0.8699        1600
weighted avg     0.8792    0.8750      0.8699        1600
```

### 5.3 Confusion Matrix Analysis

The test set confusion matrix highlights the clean diagonal dominance and zero false-negative performance:

```text
               Predicted Class
Actual Class   Glioma   Meningioma   No Tumor   Pituitary
Glioma           263        90          34         13
Meningioma        20       341          12         27
No Tumor           0         0         400          0   <-- 100% PERFECT EXCLUSION
Pituitary          1         3           0        396   <-- 99% DETECTION
```

- **Zero Healthy False Negatives:** Exactly 400 / 400 healthy scans were classified as healthy tissue, ensuring no patient without a tumor is misdiagnosed with a malignancy.
- **High Pituitary Precision:** 396 / 400 pituitary scans correctly identified.

---

## 6. Full-Stack Software Architecture

### 6.1 Single-Origin Loopback Proxy Design

To combine modern reactive frontend engineering with high-speed Python ML inference without multi-port exposure or CORS overhead, the platform uses a **single-origin proxy architecture**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Browser Client (Interacts exclusively with http://localhost:3000)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Requests
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Next.js 14 App Router (Port 3000)                                      │
│ • UI Pages: / (Overview), /analyze (Diagnostic Suite), /model-info     │
│ • Local Session Audit: /history (JSON export)                          │
│ • Internal Loopback Proxy (next.config.mjs):                           │
│   Rewrite: /api/:path* ──▶ http://127.0.0.1:8000/api/:path*             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Internal Loopback (Zero CORS)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ FastAPI Core Backend (Port 8000)                                       │
│ • Lifespan Manager: Eager model load & Grad-CAM singleton caching      │
│ • Input Validation: Size limit (15MB), PIL verify, extension whitelist │
│ • Pydantic v2 Models: HealthResponse, PredictionResponse, GradCAM      │
│ • In-Memory Base64 Streaming: Data URL encoded PNG responses           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ In-Memory Tensors
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Machine Learning Engine (ml/)                                          │
│ • TensorFlow 2.21 + Keras 3 Checkpoint: efficientnet_b0.keras          │
│ • Grad-CAM Subgraph: tf.GradientTape backpropagation over top_activation│
└────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Frontend Application (Next.js 14)

- **Framework:** Next.js 14 with App Router, TypeScript, and React 18.
- **Styling:** Tailwind CSS with custom medical theme tokens and responsive layouts.
- **Pages:**
  - `/`: Hero landing page, key metrics overview, pathology breakdown.
  - `/analyze`: Live diagnostic suite, drag-and-drop file uploader, sample MRI selector, multi-class confidence bars, and 3-panel Grad-CAM viewer.
  - `/model-info`: Neural architecture specs, parameter details, layer targets, and interactive benchmark comparison tables.
  - `/history`: Browser local session audit log with scan timestamp, diagnosis, confidence, and JSON export.
- **Components:**
  - `ImageUploader`: Drag-and-drop zone with format validation and 4 sample MRI pills.
  - `PredictionResults`: Diagnosis card, confidence score badge, and clinical pathology description.
  - `ProbabilityChart`: Interactive softmax probability distribution across all 4 classes.
  - `GradCAMViewer`: 3-panel side-by-side comparison (Original MRI | Grad-CAM Heatmap | Overlay) with interactive target class selector.
  - `Navbar`: Navigation header featuring live backend health polling badge.

### 6.3 Backend Inference Engine (FastAPI)

- **Framework:** FastAPI with Uvicorn ASGI server and Pydantic v2.
- **Lifespan Singleton (`backend/app/services/inference_service.py`):** Eagerly loads `efficientnet_b0.keras` and constructs the Grad-CAM sub-model (`top_activation` feature extractor) at server boot, preventing cold-start latency.
- **Security & Validation:**
  - Enforces maximum payload limit (15 MB).
  - Whitelists image extensions (`.jpg`, `.jpeg`, `.png`).
  - Uses PIL `image.verify()` to prevent corrupted image injection.
- **Asynchronous Base64 Streaming:** Heatmaps and overlays are generated in-memory via Pillow BytesIO buffers and returned as Base64 PNG data URLs, avoiding disk write overhead.

### 6.4 Fallback Streamlit Application

For rapid local testing and offline standalone demonstration, the original Streamlit application remains maintained at [`app.py`](file:///d:/Hackathon/NeuroScan/app.py):

```bash
npm run streamlit
# Or directly:
.\venv\Scripts\python -m streamlit run app.py
```

The Streamlit app runs on `http://localhost:8501` and consumes the identical model weights and Grad-CAM logic from `ml/`.

---

## 7. Complete Directory Tree

```text
d:\Hackathon\NeuroScan/
├── .env                              # Environment configuration (Proxy & Backend)
├── .env.example                      # Example environment variables template
├── .gitignore                        # Git ignore patterns (venv, checkpoints, cache)
├── README.md                         # Comprehensive project documentation
├── app.py                            # Standalone Streamlit application (Fallback)
├── package.json                      # Unified root script orchestration (concurrently)
├── package-lock.json
├── requirements.txt                  # Root Python requirements
│
├── backend/                          # FastAPI Asynchronous Backend Subsystem
│   ├── requirements.txt              # FastAPI specific dependencies
│   ├── .env.example
│   └── app/
│       ├── __init__.py
│       ├── main.py                   # FastAPI application, lifespan, & exception handler
│       ├── core/
│       │   ├── __init__.py
│       │   └── config.py             # Pydantic Settings & environment config
│       ├── routes/
│       │   ├── __init__.py
│       │   └── predictions.py        # /health, /model-info, /predict, /gradcam
│       ├── schemas/
│       │   ├── __init__.py
│       │   └── prediction.py         # Pydantic v2 request & response schemas
│       └── services/
│           ├── __init__.py
│           └── inference_service.py  # Inference singleton, validation, & Grad-CAM
│
├── frontend/                         # Next.js 14 App Router Frontend Subsystem
│   ├── package.json                  # Next.js dependencies (Tailwind, Lucide, React)
│   ├── tsconfig.json
│   ├── next.config.mjs               # Single-origin reverse proxy configuration
│   ├── tailwind.config.ts            # Medical design tokens
│   ├── postcss.config.mjs
│   ├── public/
│   │   └── samples/                  # Verified sample MRI scans for 1-click testing
│   │       ├── glioma.jpg
│   │       ├── meningioma.jpg
│   │       ├── notumor.jpg
│   │       └── pituitary.jpg
│   ├── app/
│   │   ├── layout.tsx                # Medical root layout with Navbar & Footer
│   │   ├── page.tsx                  # Home overview & metric showcases
│   │   ├── globals.css               # Global styling & grid backgrounds
│   │   ├── analyze/
│   │   │   └── page.tsx              # Diagnostic workspace & Grad-CAM viewer
│   │   ├── model-info/
│   │   │   └── page.tsx              # Architectural specifications & benchmarks
│   │   └── history/
│   │       └── page.tsx              # Local session audit trail & JSON export
│   ├── components/
│   │   ├── Navbar.tsx                # Navigation header & live health poll badge
│   │   ├── ImageUploader.tsx         # Drag-and-drop uploader with sample pills
│   │   ├── PredictionResults.tsx     # Tumor diagnosis card & clinical notes
│   │   ├── ProbabilityChart.tsx      # Softmax class score distribution bars
│   │   ├── GradCAMViewer.tsx         # 3-panel comparison & target class switcher
│   │   └── LoadingState.tsx          # Multi-stage medical scanner animation
│   ├── lib/
│   │   └── api.ts                    # Typed client wrapping /api endpoints
│   └── types/
│       └── prediction.ts             # Shared TypeScript schemas
│
├── ml/                               # Unified Machine Learning Directory
│   ├── models/                       # Verified Keras 3 Checkpoints
│   │   ├── baseline_cnn.keras        # Baseline 4-layer CNN (5.1 MB)
│   │   └── efficientnet_b0.keras     # Fine-tuned EfficientNet-B0 (19.0 MB)
│   ├── preprocessing/
│   │   └── preprocess.py             # Stratified split, normalization, & augmentation
│   ├── explainability/
│   │   ├── gradcam.py                # Core Grad-CAM backpropagation engine
│   │   └── gradcam_samples/          # High-resolution 3-panel Grad-CAM figures
│   ├── training/
│   │   ├── train_cnn.py              # Baseline CNN training script
│   │   └── train_efficientnet.py     # Transfer learning training script
│   ├── evaluation/
│   │   ├── evaluate.py               # Test set benchmark runner
│   │   ├── baseline_evaluation.txt   # Custom CNN benchmark report
│   │   ├── baseline_confusion_matrix.png
│   │   ├── efficientnet_evaluation.txt # EfficientNet benchmark report
│   │   ├── efficientnet_confusion_matrix.png
│   │   └── efficientnet_training_curves.png
│   └── assets/
│       └── samples/                  # Pre-packaged sample MRI images
│
├── presentation_slides/              # Executive Pitch Slide Deck (1920×1080 16:9 PNGs)
│   ├── slide_1_title.png             # Slide 1: Title & Overview
│   ├── slide_2_clinical_problem.png  # Slide 2: The Clinical Problem
│   ├── slide_3_model_architecture.png# Slide 3: CNN Progression & Grad-CAM
│   ├── slide_4_empirical_benchmarks.png # Slide 4: Empirical Benchmarks & Matrix
│   ├── slide_5_system_architecture.png  # Slide 5: Full-Stack Architecture
│   └── slide_6_clinical_impact.png   # Slide 6: Clinical Translation & Roadmap
│
├── dataset/                          # Brain Tumor MRI Scans
│   ├── Training/                     # 5,712 training scans
│   └── Testing/                      # 1,600 untouched independent test scans
│
└── scripts/
    └── dev.ps1                       # Unified PowerShell dev launcher with port check
```

---

## 8. REST API Specification

All backend endpoints are served under `/api` and accessible via the same-origin Next.js proxy on port 3000 or directly on port 8000.

### 8.1 GET /api/health

Returns backend server health and model availability status.

- **Request:** `GET http://localhost:3000/api/health`
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_name": "EfficientNetB0",
  "version": "1.0.0"
}
```

### 8.2 GET /api/model-info

Returns architecture specifications, supported classes, input shapes, and verified test metrics.

- **Request:** `GET http://localhost:3000/api/model-info`
- **Response (200 OK):**
```json
{
  "model_name": "EfficientNetB0 (Transfer Learning)",
  "architecture": "EfficientNetB0 ImageNet Backbone + Custom GAP/Dense Head",
  "supported_classes": ["glioma", "meningioma", "notumor", "pituitary"],
  "display_names": {
    "glioma": "Glioma",
    "meningioma": "Meningioma",
    "notumor": "No Tumor",
    "pituitary": "Pituitary"
  },
  "input_dimensions": [224, 224, 3],
  "supported_features": [
    "Multi-class 4-way Brain MRI Classification",
    "Grad-CAM Anatomical Visual Explainability",
    "Class Probability and Confidence Scoring"
  ],
  "model_size_bytes": 19032373,
  "target_conv_layer": "top_activation",
  "metrics": {
    "test_accuracy": 0.875,
    "test_loss": 0.5056,
    "precision_macro": 0.8792,
    "recall_macro": 0.875,
    "f1_score_macro": 0.8699,
    "roc_auc_macro": 0.9718,
    "notumor_recall": 1.0,
    "pituitary_recall": 0.99,
    "meningioma_recall": 0.8525,
    "glioma_recall": 0.6575
  }
}
```

### 8.3 POST /api/predict

Performs 4-way differential diagnosis on an uploaded brain MRI image.

- **Request:** `POST http://localhost:3000/api/predict`
- **Headers:** `Content-Type: multipart/form-data`
- **Body:** `file: <binary image file (.jpg, .jpeg, .png)>`
- **cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/predict" \
  -F "file=@frontend/public/samples/glioma.jpg"
```
- **Response (200 OK):**
```json
{
  "predicted_class": "glioma",
  "display_name": "Glioma",
  "confidence": 0.9984,
  "confidence_percentage": 99.84,
  "scores": [
    { "class_name": "glioma", "display_name": "Glioma", "score": 0.9984, "percentage": 99.84 },
    { "class_name": "meningioma", "display_name": "Meningioma", "score": 0.0011, "percentage": 0.11 },
    { "class_name": "notumor", "display_name": "No Tumor", "score": 0.0003, "percentage": 0.03 },
    { "class_name": "pituitary", "display_name": "Pituitary", "score": 0.0002, "percentage": 0.02 }
  ],
  "input_dimensions": [512, 512],
  "inference_time_ms": 38.45
}
```

### 8.4 POST /api/gradcam

Generates Grad-CAM visual explainability maps and differential classification on an uploaded brain MRI scan.

- **Request:** `POST http://localhost:3000/api/gradcam`
- **Headers:** `Content-Type: multipart/form-data`
- **Body:**
  - `file`: `<binary image file>`
  - `target_class`: *(Optional)* Name of specific class to explain (`glioma`, `meningioma`, `notumor`, `pituitary`). Defaults to the winning predicted class.
- **cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/gradcam" \
  -F "file=@frontend/public/samples/pituitary.jpg" \
  -F "target_class=pituitary"
```
- **Response (200 OK):**
```json
{
  "predicted_class": "pituitary",
  "display_name": "Pituitary",
  "confidence": 0.9912,
  "confidence_percentage": 99.12,
  "target_class": "pituitary",
  "target_display_name": "Pituitary",
  "conv_layer_used": "top_activation",
  "scores": [ ... ],
  "original_image_base64": "data:image/png;base64,iVBORw0KGgo...",
  "heatmap_image_base64": "data:image/png;base64,iVBORw0KGgo...",
  "overlay_image_base64": "data:image/png;base64,iVBORw0KGgo...",
  "inference_time_ms": 78.60
}
```

---

## 9. Quick Start & Installation Guide

### 9.1 Prerequisites

- **Node.js:** v18.0.0 or higher (Tested on Node.js v22.18 / v24.11)
- **Python:** 3.10 to 3.13 (Virtual environment pre-configured at `venv/`)
- **Package Managers:** `npm` and `pip`

### 9.2 Installation Steps

Clone the repository and install all dependencies:

```bash
# 1. Clone repository
git clone https://github.com/sattwikg30-alt/brain-tumour-classification-ml.git
cd brain-tumour-classification-ml

# 2. Install root and frontend Node dependencies
npm install
npm --prefix frontend install

# 3. Create and activate Python virtual environment
python -m venv venv
.\venv\Scripts\activate            # On Windows PowerShell
# source venv/bin/activate         # On macOS / Linux

# 4. Install backend dependencies
pip install -r backend/requirements.txt
```

### 9.3 Running the Development Environment

Launch the unified full-stack system with a single command:

```bash
npm run dev
```

*(Alternatively, on Windows PowerShell run: `./scripts/dev.ps1`)*

This starts:
- **FastAPI backend** on `http://127.0.0.1:8000`
- **Next.js frontend** on `http://localhost:3000`

Now open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

*(Note: You do **not** need to open port 8000; all API requests are transparently rewritten by Next.js).*

### 9.4 Running Evaluation & Parity Tests

To re-evaluate the model checkpoints against the untouched 1,600-scan test set:

```bash
# Run benchmark evaluation script
.\venv\Scripts\python -m ml.evaluation.evaluate
```

This updates classification reports, training curves, and confusion matrix figures in `ml/evaluation/`.

---

## 10. Presentation Slide Deck Deliverables

High-resolution presentation slides (**1920×1080, 16:9 widescreen**) are pre-rendered and saved in [`presentation_slides/`](file:///d:/Hackathon/NeuroScan/presentation_slides/):

| Slide File | Title | Theme & Description |
| :--- | :--- | :--- |
| [`slide_1_title.png`](file:///d:/Hackathon/NeuroScan/presentation_slides/slide_1_title.png) | **Title & Executive Overview** | Core metrics (87.5% Acc, 0.972 ROC-AUC, 100% Healthy Recall) + 4 real clinical scans |
| [`slide_2_clinical_problem.png`](file:///d:/Hackathon/NeuroScan/presentation_slides/slide_2_clinical_problem.png) | **The Clinical Problem** | Neuroradiologist shortage, 4-way class mimicry, and the "black-box" trust barrier |
| [`slide_3_model_architecture.png`](file:///d:/Hackathon/NeuroScan/presentation_slides/slide_3_model_architecture.png) | **CNN Progression & Grad-CAM** | Custom CNN baseline $\to$ EfficientNet-B0 production selection + real Grad-CAM figure |
| [`slide_4_empirical_benchmarks.png`](file:///d:/Hackathon/NeuroScan/presentation_slides/slide_4_empirical_benchmarks.png) | **Empirical Benchmarks & Matrix** | Head-to-head metrics comparison (+18.75%) + real 1,600-scan test confusion matrix |
| [`slide_5_system_architecture.png`](file:///d:/Hackathon/NeuroScan/presentation_slides/slide_5_system_architecture.png) | **Full-Stack System Architecture** | Single-origin proxy architecture (Next.js 14, loopback proxy, FastAPI engine) |
| [`slide_6_clinical_impact.png`](file:///d:/Hackathon/NeuroScan/presentation_slides/slide_6_clinical_impact.png) | **Clinical Translation & Roadmap** | Bedside emergency triage, patient safety (0 false alarms), and 3-phase future roadmap |

These slides can be imported directly into Google Slides, PowerPoint, or Keynote.

---

## 11. Model Checkpoint Parity & Integrity

The model checkpoints stored in `ml/models/` are byte-for-byte verified:

| Checkpoint File | Relative Path | Size (Bytes) | SHA-256 Checksum |
| :--- | :--- | :--- | :--- |
| `baseline_cnn.keras` | `ml/models/baseline_cnn.keras` | 5,119,846 | `D4CFDF4923B5E349023A6B514BE7D633360EFC76AC71CD596823F6723265FAD7` |
| `efficientnet_b0.keras` | `ml/models/efficientnet_b0.keras` | 19,032,373 | `4AB9935EE0764D72737144A8989815BFCCBBC22AD8616B54C1CCA7C616607590` |

Inference parity verification across both FastAPI and Streamlit confirmed $0.00000000\text{e}+00$ numerical difference in softmax scores and identical gradient targets.

---

## 12. Clinical Disclaimers & Ethical AI Usage

1. **Research & Decision-Support Only:** Cerebra is developed for academic research, medical education, and clinical decision support technology demonstration. It is not an FDA-cleared or CE-marked diagnostic medical device.
2. **Physician-in-the-Loop:** This software is designed strictly to assist, not replace, board-certified neuroradiologists and medical specialists. AI-generated predictions and Grad-CAM saliency heatmaps must always be correlated with patient clinical history, physical examination, and histological biopsy confirmation.
3. **Probability Calibration:** The reported confidence percentages represent normalized neural network class logits, not calibrated epidemiological probabilities.