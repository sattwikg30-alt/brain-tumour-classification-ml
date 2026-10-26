# NeuroScan AI — Master Documentation Index

Welcome to the comprehensive technical documentation suite for **NeuroScan AI**.

---

## Documentation Modules

| Document | Focus & Contents |
| :--- | :--- |
| **[01. Project Overview & Tech Stack](file:///d:/Hackathon/NeuroScan/docs/01_PROJECT_OVERVIEW_AND_TECH_STACK.md)** | Executive mission, 4 tumor categories, high-level architecture, technology stack breakdown with technical rationales, and the single-origin reverse proxy design. |
| **[02. Dataset Analysis & Preprocessing](file:///d:/Hackathon/NeuroScan/docs/02_DATASET_ANALYSIS_AND_PREPROCESSING.md)** | Dataset distribution (7,312 scans), exploratory data analysis (EDA), dHash perceptual hashing, duplicate screening, dynamic `tf.data` pipeline, normalizations, and medical data augmentation. |
| **[03. Machine Learning & Explainability](file:///d:/Hackathon/NeuroScan/docs/03_MACHINE_LEARNING_AND_EXPLAINABILITY.md)** | Two-model progression (Baseline 4-Layer CNN vs. Champion EfficientNet-B0), MBConv blocks, Grad-CAM mathematical formulation, `top_activation` target layer, confusion matrix, and 100% healthy recall. |
| **[04. Full-Stack System & Workflow](file:///d:/Hackathon/NeuroScan/docs/04_FULL_STACK_SYSTEM_AND_WORKFLOW.md)** | Step-by-step end-to-end request lifecycle (upload $\to$ proxy $\to$ validation $\to$ inference $\to$ Grad-CAM $\to$ Base64 $\to$ UI state), component breakdown, lifespan singleton pattern, and fallback Streamlit app. |
| **[05. USPs & Technical Defense Guide](file:///d:/Hackathon/NeuroScan/docs/05_USPS_AND_VIVA_PITCH_GUIDE.md)** | Unique Selling Propositions (USPs) vs. typical projects, anticipated viva/judge questions & script answers ("Is EfficientNet a CNN?", "Why Grad-CAM over SHAP?", "How did you prevent leakage?"), and 3-phase future roadmap. |

---

## Key Project Facts at a Glance

- **Primary Checkpoint:** `ml/models/efficientnet_b0.keras` (19.0 MB, 4.2M parameters)
- **Baseline Checkpoint:** `ml/models/baseline_cnn.keras` (5.1 MB, 1.3M parameters)
- **Independent Test Accuracy:** **87.50%** (1,400 / 1,600 correct)
- **ROC-AUC (Macro OvR):** **0.9718**
- **Healthy Brain Recall:** **100.00%** (400 / 400 scans, zero false alarms)
- **Explainability Target:** Final convolutional layer (`top_activation`, shape $7 \times 7 \times 1280$)
- **Frontend URL:** `http://localhost:3000` (Next.js 14 App Router)
- **Internal Backend:** `http://127.0.0.1:8000` (FastAPI behind Next.js reverse proxy)
- **Unified Dev Launch:** `npm run dev`
