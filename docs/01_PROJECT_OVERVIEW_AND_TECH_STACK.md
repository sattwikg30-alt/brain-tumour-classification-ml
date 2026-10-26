# NeuroScan AI — System Architecture & Technology Stack

---

## 1. Executive Summary & Clinical Mission

**NeuroScan AI** is an end-to-end clinical medical AI platform engineered for automated differential diagnosis and visual explainability of brain Magnetic Resonance Imaging (MRI) scans. It classifies scans into four distinct diagnostic categories:
1. **Glioma:** Infiltrative, malignant primary brain tumors originating in glial cells, often characterized by irregular, diffuse boundaries.
2. **Meningioma:** Typically slow-growing, extra-axial dural masses originating from arachnoid cap cells.
3. **Pituitary Tumor:** Sellar region adenomas that frequently compress the optic chiasm, leading to endocrine dysfunction or visual field deficits.
4. **No Tumor (Healthy Tissue):** Unremarkable brain MRI devoid of focal lesions, mass effect, edema, or midline shift.

### The Core Problem Solved
Traditional medical AI deployments in radiology suffer from the **"Black-Box" dilemma**: deep learning models output a scalar confidence percentage without spatial localization. Radiologists and tumor boards cannot legally or ethically base surgical resection or biopsy decisions on unverified confidence numbers. 

NeuroScan AI bridges this trust barrier by coupling an **87.50% test accuracy (0.9718 ROC-AUC)** transfer-learning **EfficientNet-B0** convolutional neural network with **Grad-CAM (Gradient-weighted Class Activation Mapping)**. Every classification provides an anatomical heat-map overlay that visually grounds the prediction to the exact pathological tissue in the scan.

---

## 2. High-Level System Architecture

The application is structured into three decoupled, high-performance layers operating behind a **single user-facing origin**:

```text
+-----------------------------------------------------------------------------------------+
|                                    BROWSER CLIENT                                       |
|                       (Interacts exclusively via http://localhost:3000)                 |
+--------------------------------------------+--------------------------------------------+
                                             |
                                             | HTTP Requests (Pages & API)
                                             v
+-----------------------------------------------------------------------------------------+
|                             NEXT.JS 14 FRONTEND (PORT 3000)                             |
|  * App Router: / (Home), /analyze (Diagnostic Workspace), /model-info, /history          |
|  * Components: ImageUploader, PredictionResults, ProbabilityChart, GradCAMViewer        |
|  * Session Audit: Browser localStorage audit trail with one-click JSON export           |
|  * Reverse Proxy (next.config.mjs):                                                     |
|      Rewrite: /api/:path*  ───>  http://127.0.0.1:8000/api/:path*                       |
+--------------------------------------------+--------------------------------------------+
                                             |
                                             | Internal Loopback (Zero CORS Latency)
                                             v
+-----------------------------------------------------------------------------------------+
|                              FASTAPI BACKEND (PORT 8000)                                |
|  * Lifespan Manager: Eager model load & Grad-CAM singleton memory caching               |
|  * Validation Pipeline: 15MB file size limit, PIL verify, extension whitelist (.jpg/.png)|
|  * Strict Schemas: Pydantic v2 schemas for input validation and output serialization     |
|  * Asynchronous Streaming: In-memory Base64 Data URL PNG generation (Zero disk I/O)    |
+--------------------------------------------+--------------------------------------------+
                                             |
                                             | In-Memory Numpy Tensors
                                             v
+-----------------------------------------------------------------------------------------+
|                                 MACHINE LEARNING SUBSYSTEM                              |
|  * Checkpoints: efficientnet_b0.keras (19.0 MB), baseline_cnn.keras (5.1 MB)            |
|  * Saliency Extraction: tf.GradientTape backpropagation on 'top_activation' layer        |
|  * Colormap Engine: Matplotlib Jet colormap normalization & alpha-blending (alpha=0.40) |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Technology Stack & Rationale

| Layer | Technology | Version | Architectural Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | `14.2.15` | Server-side rendering (SSR), optimized bundle splitting, server-side route rewrites for proxying API calls, and instant client-side page transitions. |
| **Frontend Language** | **TypeScript** | `5.6.3` | Type safety across API response structures, prediction schemas, and component prop validation, preventing runtime UI exceptions. |
| **Styling & UI** | **Tailwind CSS** | `3.4.14` | Utility-first CSS providing consistent spacing, responsive medical grid layouts, dark/light theme tokens, and minimal footprint. |
| **Iconography** | **Lucide React** | `0.453.0` | Crisp, scalable SVG medical and operational icons (`Activity`, `Brain`, `Cpu`, `History`, `Download`). |
| **Backend Framework** | **FastAPI** | `0.110+` | Asynchronous ASGI request handling, native async/await for I/O operations, automatic OpenAPI documentation (`/docs`), and minimal latency. |
| **ASGI Web Server** | **Uvicorn** | `0.28+` | High-throughput asynchronous server implementation built on `uvloop` and `httptools`. |
| **Data Validation** | **Pydantic v2** | `2.6+` | Ultra-fast Rust-based data parsing and schema validation for request payloads and JSON serialization. |
| **Deep Learning** | **TensorFlow / Keras 3**| `2.21.0` | Industrial-grade computer vision framework supporting native transfer learning backbones, custom gradient tapes, and `.keras` zip-format serialization. |
| **Scientific Computing** | **NumPy** | `1.26+` | Fast multi-dimensional array operations, tensor reshaping, and vectorized softmax calculations. |
| **Image Processing** | **Pillow (PIL)** | `10.0+` | Secure file verification (`image.verify()`), EXIF stripping, bilinear resizing, and in-memory byte buffer manipulation. |
| **Evaluation Metrics**| **Scikit-Learn** | `1.4+` | Stratified dataset splitting, multi-class confusion matrices, macro/weighted precision-recall, and One-vs-Rest ROC-AUC calculation. |
| **Visual Rendering** | **Matplotlib** | `3.8+` | Color mapping (Jet colormap interpolation), confusion matrix plotting, and training curve visualization. |
| **Fallback UI** | **Streamlit** | `1.30+` | Secondary educational UI for rapid offline experimentation and model inspection. |
| **Orchestration** | **Concurrently** | `8.2.2` | Single-command root execution (`npm run dev`) that spawns both FastAPI and Next.js processes concurrently. |

---

## 4. Single-Origin Reverse Proxy Design

A common flaw in hackathon and prototype full-stack AI projects is running the frontend on port 3000 and exposing the Python backend directly on port 8000. This introduces:
1. **Cross-Origin Resource Sharing (CORS) Overhead:** Every POST request incurs an additional `OPTIONS` pre-flight network roundtrip.
2. **Security Vulnerabilities:** Direct public exposure of internal Python endpoints without gateway rate-limiting or header sanitation.
3. **Complex Deployment Configurations:** Hardcoding separate backend URLs across staging and production environments.

### NeuroScan AI's Architectural Solution
In `frontend/next.config.mjs`, Next.js rewrites all incoming `/api/*` traffic to the internal loopback address:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

**Result:** The browser client only ever connects to `http://localhost:3000`. Next.js acts as an air-gapped reverse proxy, dispatching calls to FastAPI on `127.0.0.1:8000` via loopback with zero CORS latency and absolute isolation.
