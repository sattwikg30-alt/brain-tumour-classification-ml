# Dataset Analysis, Exploration & Preprocessing Pipeline

---

## 1. Dataset Overview & Class Distribution

The dataset comprises axial and coronal T1-weighted brain Magnetic Resonance Imaging (MRI) scans collected across clinical centers. The dataset is organized into an official **Training** split and an untouched **Testing** benchmark:

```text
dataset/
├── Training/          # 5,712 images (Used for Model Optimization)
│   ├── glioma/        # 1,321 scans
│   ├── meningioma/    # 1,339 scans
│   ├── notumor/       # 1,595 scans
│   └── pituitary/     # 1,457 scans
└── Testing/           # 1,600 images (Independent Evaluation Benchmark)
    ├── glioma/        # 400 scans
    ├── meningioma/    # 400 scans
    ├── notumor/       # 400 scans
    └── pituitary/     # 400 scans
```

### Total Dataset Scale:
- **Total Images:** 7,312 MRI scans
- **Test Set Balance:** Exactly 400 scans per class (balanced 25.0% split across all 4 categories)

---

## 2. Exploratory Data Analysis (EDA) Findings

The script `ml/exploration/explore_data.py` performed automated diagnostic screening across the entire corpus, generating `ml/exploration/exploration_report.txt`:

### A. Image Formats & Dimensions
- **File Encapsulation:** 7,308 JPEG files (99.95%) and 4 PNG files (0.05%).
- **Integrity Check:** Zero corrupt or unreadable image files detected (`image.verify()` passed on 100% of images).
- **Spatial Dimensionality:** 447 unique native image resolutions:
  - `512 × 512`: 5,014 images (68.6%)
  - `225 × 225`: 338 images (4.6%)
  - `630 × 630`: 90 images (1.2%)
  - Others: Ranging from `150 × 198` to `800 × 800`.
- **Pixel Statistics (0–255 scale across 64×64 thumbnail sampling):**
  - **Mean Intensity:** Red: `47.57`, Green: `47.57`, Blue: `47.58` (Standard grayscale representation mapped to 3 channels).
  - **Standard Deviation:** `49.08` across all channels.

### B. Duplicate Analysis & Perceptual Hashing (dHash)
Medical imaging datasets scraped from public repositories frequently suffer from data leakage between splits. To detect this, a difference hash (**dHash**) algorithm was implemented:

1. **dHash Computation:**
   - Downsamples image to $9 \times 8$ grayscale pixels.
   - Calculates boolean relative gradients: $P_{i,j+1} > P_{i,j}$ yielding a 64-bit integer hash.
   - Computes candidate pairs via 16-bit block partitioning to evaluate Hamming distances without $O(N^2)$ brute-force comparisons.

2. **EDA Findings on Leakage:**
   - **Exact Duplicate Files:** 153 duplicate groups found *within* the training set.
   - **Exact Duplicates Crossing Train/Test:** **0** (Zero byte-for-byte exact leakage).
   - **Near-Duplicate Screening (Hamming Distance $\le 4$):** Identified visual similarities crossing splits due to contiguous slice series of identical patients.
   - **Key Clinical Conclusion:** Because public datasets do not provide patient de-identification IDs (UIDs), retaining the official `dataset/Testing` partition untouched is mandatory to establish an uncompromised evaluation standard.

---

## 3. Data Preprocessing Pipeline

All preprocessing logic is consolidated in `ml/preprocessing/preprocess.py`. The pipeline uses `tf.data.Dataset` lazy streaming to eliminate disk write overhead and memory bottlenecks.

```text
Raw MRI File on Disk (.jpg / .png)
                │
                ▼ [tf.io.read_file]
Binary Byte Stream
                │
                ▼ [tf.io.decode_image(channels=3)]
Uncompressed RGB Tensor (H × W × 3)
                │
                ▼ [tf.image.resize(224, 224, antialias=True)]
Standardized Tensor (224 × 224 × 3, float32)
                │
                ├───────────────────────────────────────┐
                ▼ (If Training = True)                  ▼ (If Validation / Testing)
[Data Augmentation Layer]                     [Skip Augmentation]
• Horizontal Flip                             (Strict Deterministic Input)
• Random Rotation (±5%)                                 │
• Random Zoom (±10%)                                    │
                │                                       │
                ├───────────────────────────────────────┘
                ▼
[Normalization Layer]
• Custom CNN: Scaled [0, 1] via `x / 255.0`
• EfficientNet-B0: `tf.keras.applications.efficientnet.preprocess_input`
                │
                ▼
Batched Prefetched Pipeline (Batch Size: 32, num_parallel_calls=AUTOTUNE)
```

### Why Standardize to 224×224 RGB?
1. **Pretrained ImageNet Alignment:** EfficientNet-B0 was architected for optimal receptive field coverage on $224 \times 224$ inputs.
2. **Computational Efficiency:** Reduces floating-point operations (FLOPs) while preserving focal pathological microstructures (calcifications, dural tails, and edema boundaries).
3. **Anti-Aliasing:** High-quality bilinear resampling with anti-aliasing prevents jagged artifacts along thin skull boundaries.

---

## 4. Normalization Strategies: Why They Differ

The repository uses two distinct normalization algorithms depending on the model architecture:

### 1. Custom 4-Layer Baseline CNN (`normalize_for_cnn`)
```python
def normalize_for_cnn(images: tf.Tensor, labels: tf.Tensor):
    return images / 255.0, labels
```
- Linearly projects pixel values from $[0, 255]$ to the range $[0.0, 1.0]$.
- Standard practice for custom convolutional layers using default He/Glorot uniform weight initializations.

### 2. EfficientNet-B0 (`normalize_for_efficientnet`)
```python
def normalize_for_efficientnet(images: tf.Tensor, labels: tf.Tensor):
    return tf.keras.applications.efficientnet.preprocess_input(images), labels
```
- EfficientNet architectures in modern Keras internally integrate a `Rescaling(1./255)` layer.
- `preprocess_input` performs channel-wise zero-centering using ImageNet dataset statistics:
  - Subtracts mean: `[123.675, 116.28, 103.53]`
  - Divides by std: `[58.395, 57.12, 57.375]`
- Keeping this exact preprocessing guarantees that transfer-learning features learned from ImageNet remain semantically aligned.

---

## 5. Medical Data Augmentation

Medical images cannot be augmented using arbitrary transformations commonly applied to natural photos (e.g., heavy color jitter, extreme cropping, or upside-down flipping). 

```python
TRAIN_AUGMENTATION = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal", seed=42),
    tf.keras.layers.RandomRotation(0.05, seed=42),
    tf.keras.layers.RandomZoom(0.10, seed=42),
], name="training_augmentation")
```

| Transformation | Parameter | Medical Justification |
| :--- | :--- | :--- |
| **Horizontal Flip** | Random left-to-right | **Clinically valid.** The human brain exhibits bilateral cerebral hemisphere symmetry. A tumor occurring in the left hemisphere can biologically manifest in the right hemisphere. |
| **Vertical Flip** | **Strictly Prohibited** | **Clinically invalid.** Flipping a brain scan vertically inverts ventral/dorsal and superior/inferior orientations (placing the cerebellum at the top of the skull), which violates human neuroanatomy. |
| **Random Rotation** | $\pm 5\%$ ($\approx \pm 18^\circ$) | **Clinically valid.** Models slight patient head tilt inside the MRI radiofrequency head coil. |
| **Random Zoom** | $\pm 10\%$ factor | **Clinically valid.** Replicates small variations in Field-of-View (FOV) calibration across different MRI manufacturer consoles (Siemens, GE, Philips). |

---

## 6. Reproducible Stratified Splitting

To optimize hyperparameters without touching the independent test set, `make_stratified_split()` extracts a 20% validation split from `dataset/Training`:

- **Split Ratio:** 80% Train (4,570 scans) / 20% Validation (1,142 scans).
- **Stratification:** Fixed proportional allocation per class:
  - **Glioma:** 1,057 Train / 264 Val
  - **Meningioma:** 1,071 Train / 268 Val
  - **No Tumor:** 1,276 Train / 319 Val
  - **Pituitary:** 1,166 Train / 291 Val
- **Seed:** Fixed `seed = 42` guarantees exact dataset reproducibility across independent training runs.
- **Untouched Test Benchmark:** The 1,600 test scans in `dataset/Testing` were isolated and evaluated only after checkpoint freezing.
