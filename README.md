# NeuroScan AI — Brain Tumor MRI Classification & Explainability (Grad-CAM)

An end-to-end full-stack medical AI research dashboard for differential classification of brain magnetic resonance imaging (MRI) scans into four categories: **Glioma**, **Meningioma**, **Pituitary Tumor**, and **Healthy Brain Tissue (No Tumor)**. The platform combines a transfer-learning **EfficientNet-B0** model achieving **87.50% test accuracy (0.9718 ROC-AUC)**, **Grad-CAM visual explainability**, a high-performance **FastAPI** backend, and a modern **Next.js 14 App Router** frontend.

---

## Architecture Overview

The system runs as an integrated full-stack application behind a **single user-facing URL**:

```text
Browser Client
     │  (Interacts exclusively via http://localhost:3000)
     ▼
Next.js 14 Frontend  (Port 3000)
  ├── App Router (TypeScript, Tailwind CSS)
  ├── Medical Research Dashboard (/analyze, /model-info, /history)
  └── Next.js Internal Reverse Proxy (/api/* rewritten to internal backend)
     │
     ▼  (Internal communication: http://127.0.0.1:8000)
FastAPI Backend  (Port 8000)
  ├── Lifespan Model Management & Eager Checkpoint Loading
  ├── Image Validation & Preprocessing Pipeline
  ├── Inference Service (/api/predict)
  └── Grad-CAM Gradient Backpropagation Engine (/api/gradcam)
     │
     ▼
ML Subsystem (`ml/`)
  ├── Models (`ml/models/efficientnet_b0.keras`, `ml/models/baseline_cnn.keras`)
  ├── Preprocessing (`ml/preprocessing/preprocess.py`)
  ├── Explainability (`ml/explainability/gradcam.py`)
  └── Evaluation Benchmarks (`ml/evaluation/`)
```

> **Single-Origin Port Architecture:** The browser never directly contacts port 8000. All API traffic passes through Next.js server-side rewrites configured via `BACKEND_INTERNAL_URL=http://127.0.0.1:8000`.

---

## Directory Structure

```text
brain-tumor-mri-classification/
├── frontend/                       # Next.js App Router Web Application
│   ├── app/
│   │   ├── layout.tsx              # Root medical layout with Navbar & Footer
│   │   ├── page.tsx                # Home overview & metric showcases
│   │   ├── globals.css             # Tailwind design tokens & medical grid theme
│   │   ├── analyze/
│   │   │   └── page.tsx            # MRI scan upload, prediction, & Grad-CAM
│   │   ├── model-info/
│   │   │   └── page.tsx            # Architecture comparison & verified benchmarks
│   │   └── history/
│   │       └── page.tsx            # Local session audit & JSON export
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation & live backend health badge
│   │   ├── ImageUploader.tsx       # Drag-and-drop uploader & 4 sample scan pills
│   │   ├── PredictionResults.tsx   # Tumor diagnosis, confidence & clinical notes
│   │   ├── ProbabilityChart.tsx    # Interactive softmax score distribution bars
│   │   ├── GradCAMViewer.tsx       # 3-panel Grad-CAM comparison & class selector
│   │   └── LoadingState.tsx        # Multi-stage medical scanner animation
│   ├── lib/
│   │   └── api.ts                  # Typed client for /api endpoints
│   ├── types/
│   │   └── prediction.ts           # Shared TypeScript schemas
│   ├── public/
│   │   └── samples/                # Verified MRI scans for one-click testing
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs             # Same-origin API reverse proxy config
│   └── .env.local.example
├── backend/                        # Python FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application, lifespan, & CORS
│   │   ├── core/
│   │   │   └── config.py           # Pydantic Settings & environment config
│   │   ├── schemas/
│   │   │   └── prediction.py       # Pydantic request/response schemas
│   │   ├── services/
│   │   │   └── inference_service.py# Shared inference & Grad-CAM singleton
│   │   └── routes/
│   │       └── predictions.py      # /api/health, /api/model-info, /api/predict, /api/gradcam
│   ├── requirements.txt
│   └── .env.example
├── ml/                             # Unified Machine Learning Directory
│   ├── models/
│   │   ├── baseline_cnn.keras      # 4-layer custom CNN checkpoint (5.1 MB)
│   │   └── efficientnet_b0.keras   # Fine-tuned EfficientNetB0 checkpoint (19.0 MB)
│   ├── preprocessing/
│   │   └── preprocess.py           # Normalization, resizing, augmentation
│   ├── explainability/
│   │   ├── gradcam.py              # Gradient-weighted Class Activation Mapping
│   │   └── gradcam_samples/        # 3-panel Grad-CAM visualization figures
│   ├── training/
│   │   ├── train_cnn.py            # Baseline CNN training script
│   │   └── train_efficientnet.py   # Transfer learning training script
│   ├── evaluation/
│   │   ├── evaluate.py             # Evaluation benchmark runner
│   │   ├── baseline_evaluation.txt
│   │   ├── baseline_confusion_matrix.png
│   │   ├── cnn_history.json
│   │   ├── efficientnet_evaluation.txt
│   │   ├── efficientnet_confusion_matrix.png
│   │   ├── efficientnet_history.json
│   │   └── efficientnet_training_curves.png
│   ├── exploration/
│   │   ├── explore_data.py         # Dataset inspection & duplicate detection
│   │   └── exploration_report.txt
│   ├── assets/
│   │   ├── sample_images.png       # Dataset class/split image grid
│   │   └── samples/                # Verified MRI sample scans
│   └── README.md                   # ML subsystem documentation
├── scripts/
│   └── dev.ps1                     # PowerShell development launcher
├── app.py                          # Original Streamlit application (Fallback)
├── requirements.txt                # Root requirements (Streamlit compatible)
├── package.json                    # Root scripts: dev, dev:api, dev:web, build
├── README.md                       # Project documentation
├── .gitignore
└── .env.example
```

---

## Quick Start (Single Startup Command)

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on v24.11.0)
- **Python**: 3.10 to 3.14 (Virtual environment at `venv/`)

### 1. One-Time Setup

If you have not installed the dependencies yet:

```bash
# 1. Install root & frontend dependencies
npm install
npm --prefix frontend install

# 2. Install Python backend dependencies into venv
.env\Scripts\pip install -r backend/requirements.txt
```

### 2. Launch Development Environment

Run the single unified development command:

```bash
npm run dev
```

*(Alternatively, run the PowerShell launcher: `./scripts/dev.ps1`)*

### 3. Open in Browser

Open your browser and navigate to:

👉 **[http://localhost:3000](http://localhost:3000)**

You do **not** need to open port 8000. All API requests are proxied automatically.

---

## Fallback: Original Streamlit Application

The original Streamlit application remains fully functional and verified:

```bash
npm run streamlit
# Or directly:
.env\Scripts\python -m streamlit run app.py
```

Streamlit opens at `http://localhost:8501` and consumes the same underlying model and inference logic from `ml/models/efficientnet_b0.keras`.

---

## API Endpoints Reference

All endpoints are hosted on the backend and mapped via Next.js rewrites under `/api/*`:

| Method | Endpoint | Description | Sample Request |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & model loading health | Returns `{ status: "healthy", model_loaded: true, ... }` |
| `GET` | `/api/model-info` | Architecture specs, supported classes, & benchmark metrics | Returns active model metadata & verified metrics |
| `POST` | `/api/predict` | Multipart MRI image classification | Form-data: `file: <binary image>` |
| `POST` | `/api/gradcam` | Generate Grad-CAM heatmaps & visual overlay | Form-data: `file: <binary>`, optional `target_class` |

---

## Model Integrity & Parity Verification

The model files are **byte-for-byte identical** to the pre-migration repository checkpoints:

| Model Checkpoint | Location | Size (Bytes) | SHA-256 Checksum |
| :--- | :--- | :--- | :--- |
| `baseline_cnn.keras` | `ml/models/baseline_cnn.keras` | `5,119,846` | `D4CFDF4923B5E349023A6B514BE7D633360EFC76AC71CD596823F6723265FAD7` |
| `efficientnet_b0.keras` | `ml/models/efficientnet_b0.keras` | `19,032,373` | `4AB9935EE0764D72737144A8989815BFCCBBC22AD8616B54C1CCA7C616607590` |

### Inference Parity Test Results
Automated comparative testing across all 4 sample MRI categories (`glioma.jpg`, `meningioma.jpg`, `notumor.jpg`, `pituitary.jpg`) confirmed:
- **Predicted Class Agreement:** 100% exact match between Streamlit and FastAPI.
- **Confidence Score Delta:** `0.00000000e+00` (identical floating-point values).
- **Softmax Score Delta:** `0.00000000e+00` across all 4 class probabilities.
- **Grad-CAM Layer Target:** `top_activation` (100% match).

---

## Empirical Benchmark Performance

Both models were trained on normalized $224 	imes 224$ images and benchmarked on an independent, balanced test set of 1,600 scans (400 per class):

| Metric | Custom Baseline CNN | EfficientNet-B0 (Transfer Learning) | Difference |
| :--- | :---: | :---: | :---: |
| **Model Size** | 5.1 MB | 19.0 MB | +13.9 MB |
| **Test Accuracy** | 68.75% | **87.50%** | **+18.75%** |
| **Test Loss** | 1.1840 | **0.5056** | **-0.6784** |
| **Precision (Macro)** | 0.7130 | **0.8792** | **+0.1662** |
| **Recall (Macro)** | 0.6875 | **0.8750** | **+0.1875** |
| **F1-Score (Macro)** | 0.6624 | **0.8699** | **+0.2075** |
| **ROC-AUC (Macro OvR)** | 0.8828 | **0.9718** | **+0.0890** |

### Per-Class Detailed Performance (EfficientNet-B0)

```text
              Precision    Recall    F1-Score   Support
      glioma     0.9261    0.6575      0.7690       400
  meningioma     0.7857    0.8525      0.8177       400
     notumor     0.8969    1.0000      0.9456       400
   pituitary     0.9083    0.9900      0.9474       400

    accuracy                           0.8750      1600
   macro avg     0.8792    0.8750      0.8699      1600
weighted avg     0.8792    0.8750      0.8699      1600
```

- **Healthy Brains (`notumor`):** **100.0% Recall** (400/400 correct, zero false negatives).
- **Pituitary Adenomas:** **99.0% Recall** (396/400 correct).

---

## Clinical Disclaimers & Ethical AI Usage

1. **Research & Decision-Support Only:** This application is developed for educational, clinical decision support research, and technological demonstration purposes. It is not an FDA-cleared medical device.
2. **Softmax Output Interpretation:** The reported confidence scores represent normalized neural network class logits, not calibrated epidemiological probabilities.
3. **Multi-Disciplinary Review:** Always corroborate AI predictions with board-certified radiologist assessment, patient clinical history, and histopathological biopsy.