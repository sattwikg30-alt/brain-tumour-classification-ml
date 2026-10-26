# Full-Stack System Architecture & End-to-End Workflow

---

## 1. End-to-End Request & Data Lifecycle

The diagram below traces an uploaded MRI image through every layer of the system:

```text
[Radiologist / User]
       │
       │ 1. Uploads MRI scan (.jpg/.png) or selects a sample pill
       ▼
[Next.js Client: /analyze]
       │
       │ 2. Validates client-side file type & displays instant preview
       │ 3. Appends file to FormData: { file: <binary>, target_class?: "glioma" }
       │ 4. Sends POST request to http://localhost:3000/api/gradcam
       ▼
[Next.js Server Reverse Proxy (next.config.mjs)]
       │
       │ 5. Intercepts /api/gradcam route rewrite
       │ 6. Dispatches request over internal loopback to http://127.0.0.1:8000/api/gradcam
       ▼
[FastAPI Backend: routes/predictions.py]
       │
       │ 7. Receives multipart/form-data payload
       ▼
[Validation Pipeline: InferenceService.validate_and_load_image]
       │
       │ 8. Enforces file size limit: len(bytes) <= 15 MB
       │ 9. Checks extension whitelist: .jpg, .jpeg, .png
       │ 10. Integrity check: Image.open(bytes).verify() prevents corrupted file injection
       │ 11. Re-opens and converts image to 3-channel RGB PIL Image
       ▼
[Inference Pipeline: InferenceService.generate_gradcam]
       │
       │ 12. Preprocessing: Resizes to (224, 224), applies official EfficientNet normalization
       │ 13. Forward Inference: full_model.predict(tensor) -> Softmax probabilities (4 classes)
       │ 14. Target Logit Selection: Selected by argmax or user-specified target_class
       │ 15. tf.GradientTape: Computes gradients of target logit w.r.t. 'top_activation' (7×7×1280)
       │ 16. Heatmap Generation: Spatial pooling (alpha) -> linear sum -> ReLU -> Min-Max normalize
       │ 17. Jet Colormap Mapping: Interpolates normalized values to 3-channel Jet colormap
       │ 18. Alpha Blending: (0.60 * Original_RGB) + (0.40 * Heatmap_RGB)
       │ 19. In-Memory Encoding: Converts Original, Heatmap, and Overlay to Base64 Data URL PNGs
       ▼
[Serialization: Pydantic v2 GradCAMResponse]
       │
       │ 20. Constructs typed JSON payload with scores, timings, Base64 strings, and labels
       ▼
[Next.js Client: State Updates]
       │
       │ 21. Renders PredictionResults: Diagnosis badge, confidence percentage, clinical notes
       │ 22. Renders ProbabilityChart: Softmax distribution bars across all 4 classes
       │ 23. Renders GradCAMViewer: 3-panel comparative viewer with target class switcher
       │ 24. Session Audit: Appends scan metadata to browser localStorage (neuroscan_history)
```

---

## 2. Frontend Component Architecture (Next.js 14)

The frontend is built using **Next.js 14 App Router** in `frontend/`:

### 1. Medical App Pages (`frontend/app/`)
- **`app/page.tsx` (Executive Dashboard):**
  - Hero banner with headline value propositions.
  - Verified benchmark cards (**87.50% accuracy**, **0.9718 ROC-AUC**, **100% healthy recall**).
  - Pathology breakdown describing Glioma, Meningioma, Pituitary Adenoma, and Healthy tissue.
- **`app/analyze/page.tsx` (Diagnostic Workspace):**
  - Primary clinical interaction interface.
  - Manages asynchronous states: upload progress, inference execution, and Grad-CAM generation.
  - Saves completed analyses to browser session history.
- **`app/model-info/page.tsx` (Model Specifications):**
  - Fetches runtime metadata from `GET /api/model-info`.
  - Side-by-side technical comparison table (Baseline CNN vs. EfficientNet-B0).
  - Displays per-class confusion matrix and precision/recall statistics.
- **`app/history/page.tsx` (Session Audit Trail):**
  - Renders auditable log of scans analyzed during the active browser session.
  - Includes timestamp, scan filename, predicted diagnosis, confidence, and inference latency.
  - Provides a one-click **"Export JSON"** audit download.

### 2. Specialized Diagnostic Components (`frontend/components/`)
- **`ImageUploader.tsx`:**
  - Drag-and-drop file upload target supporting JPEG and PNG images up to 15 MB.
  - Integrated with **4 One-Click Verified Sample Pills** (`Glioma`, `Meningioma`, `Pituitary`, `No Tumor`) that load pre-verified scans directly from `frontend/public/samples/`.
- **`PredictionResults.tsx`:**
  - Displays the primary diagnostic class with color-coded severity badges (Indigo for Glioma, Amber for Meningioma, Sky for Pituitary, Emerald for Healthy).
  - Presents clinical descriptions detailing the biological origin and typical anatomical location of the detected lesion.
- **`ProbabilityChart.tsx`:**
  - Visualizes softmax posterior probability distribution across all 4 categories.
  - Highlights winning class bar with animated CSS width transitions.
- **`GradCAMViewer.tsx`:**
  - 3-panel side-by-side comparative inspection:
    1. **Original MRI:** Unprocessed patient scan.
    2. **Grad-CAM Heatmap:** Isolated jet colormap saliency map.
    3. **Anatomical Overlay:** Alpha-blended composite overlay ($\alpha = 0.40$).
  - **Interactive Class Selector:** Allows clinicians to query what regions the network associates with *alternative* classes, confirming diagnostic divergence.
- **`LoadingState.tsx`:**
  - Multi-stage clinical scanning animation with animated progress messages ("Preprocessing scan...", "Computing convolutional gradients...", "Generating Grad-CAM overlay...").
- **`Navbar.tsx`:**
  - Header navigation bar featuring an active **Live Backend Health Badge** that periodically queries `GET /api/health` and displays green ("Healthy") or red ("Disconnected") server status.

---

## 3. Backend Service Architecture (FastAPI)

The backend is built using **FastAPI** in `backend/app/`:

### 1. Lifespan Singleton Pattern (`main.py` & `services/inference_service.py`)
Model loading in deep learning applications is computationally expensive ($3\text{--}8$ seconds). Loading the model per request would induce catastrophic latency.

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Eagerly load model and Grad-CAM graph on startup
    service = InferenceService.get_instance()
    yield
    # Clean shutdown
```

- **Singleton Pattern:** `InferenceService.get_instance()` ensures only **one** instance of the Keras model exists in memory across the entire process lifetime.
- **Grad-CAM Subgraph Construction:** During startup, `load_and_prepare_model()` extracts the final convolutional layer (`top_activation`), instantiates the feature extractor sub-model, and caches the head layers.

### 2. Strict Pydantic v2 Schemas (`schemas/prediction.py`)
Every input and output data structure is validated by Pydantic:
- `HealthResponse`: Server status, model loaded flag, version.
- `ClassScore`: Category name, human-readable display name, raw score, formatted percentage.
- `ModelInfoResponse`: Full architecture parameters, layer targets, and verified test metrics.
- `PredictionResponse`: Predicted class, confidence, all class scores, original dimensions, inference latency.
- `GradCAMResponse`: All prediction fields plus Base64 PNG strings for original, heatmap, and overlay images.

### 3. Asynchronous Base64 Data URL Image Streaming
To deliver real-time visual explainability without writing temporary files to disk:
1. Matplotlib interpolates the 2D gradient heatmap array into an RGB numpy array.
2. Pillow converts the array into a PNG binary buffer in RAM using `io.BytesIO()`.
3. Standard `base64.b64encode()` serializes the buffer into a standard Data URL string:
   ```text
   data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...
   ```
4. The client browser renders the image instantly via standard `<img src="...">` tags with zero disk latency.

---

## 4. Fallback Streamlit Application (`app.py`)

In addition to the Next.js/FastAPI production dashboard, the repository includes a standalone Streamlit application at `app.py`:

- **Execution Command:**
  ```bash
  npm run streamlit
  # Or:
  .\venv\Scripts\python -m streamlit run app.py
  ```
- **Caching:** Uses `@st.cache_resource` to cache model checkpoints in memory.
- **Parity:** Consumes the exact same underlying `ml/models/efficientnet_b0.keras` checkpoint and `ml/explainability/gradcam.py` module, guaranteeing identical classification scores.
