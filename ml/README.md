# Machine Learning Subsystem (`ml/`)

This directory houses all machine learning models, preprocessing logic, explainability tools, training scripts, evaluation benchmarks, and visual assets for the Brain Tumor MRI Classification project.

---

## Directory Structure

```text
ml/
├── models/
│   ├── baseline_cnn.keras          # Custom 4-layer CNN model checkpoint (5.1 MB)
│   └── efficientnet_b0.keras       # Fine-tuned EfficientNetB0 checkpoint (19.0 MB)
├── preprocessing/
│   ├── __init__.py
│   └── preprocess.py               # Shared image normalization, resizing, dataset utilities
├── explainability/
│   ├── __init__.py
│   ├── gradcam.py                  # Gradient-weighted Class Activation Mapping (Grad-CAM)
│   └── gradcam_samples/            # 3-panel Grad-CAM visualizations for each tumor class
├── training/
│   ├── __init__.py
│   ├── train_cnn.py                # Training script for the baseline CNN
│   └── train_efficientnet.py       # Fine-tuning script for EfficientNetB0
├── evaluation/
│   ├── __init__.py
│   ├── evaluate.py                 # Evaluation benchmark script against independent test set
│   ├── baseline_confusion_matrix.png
│   ├── baseline_evaluation.txt     # Test report: 68.75% accuracy, 0.8828 ROC-AUC
│   ├── cnn_history.json            # CNN training/validation history
│   ├── efficientnet_confusion_matrix.png
│   ├── efficientnet_evaluation.txt # Test report: 87.50% accuracy, 0.9718 ROC-AUC
│   ├── efficientnet_history.json   # EfficientNet training/validation history
│   └── efficientnet_training_curves.png
├── exploration/
│   ├── __init__.py
│   ├── explore_data.py             # Data exploration, dHash duplicate detection, class balance
│   └── exploration_report.txt      # Summary report of the MRI dataset
├── assets/
│   ├── sample_images.png           # Grid showing sample scans from all classes
│   └── samples/                    # Verified MRI scans for quick testing (glioma, meningioma, notumor, pituitary)
└── README.md                       # This file
```

---

## Model Specifications

### 1. Primary Model: `efficientnet_b0.keras`
- **Architecture**: EfficientNetB0 backbone (pretrained on ImageNet) + Custom Classification Head
  - GlobalAveragePooling2D
  - Dropout (0.3)
  - Dense(128, ReLU)
  - Dropout (0.2)
  - Dense(4, Softmax)
- **Input Dimensions**: $224 \times 224 \times 3$ (RGB)
- **Preprocessing**: `tf.keras.applications.efficientnet.preprocess_input`
- **Classes**: `['glioma', 'meningioma', 'notumor', 'pituitary']`
- **Performance**:
  - Test Accuracy: **87.50%**
  - Macro ROC-AUC: **0.9718**
  - Healthy (`notumor`) Recall: **100.00%**
  - Pituitary Recall: **99.00%**
  - File Size: `19,032,373` bytes
  - SHA-256: `4AB9935EE0764D72737144A8989815BFCCBBC22AD8616B54C1CCA7C616607590`

### 2. Baseline Model: `baseline_cnn.keras`
- **Architecture**: 4-layer custom CNN (Conv2D + MaxPool2D + Dense)
- **Input Dimensions**: $224 \times 224 \times 3$ (RGB)
- **Preprocessing**: Normalized to $[0, 1]$ via `images / 255.0`
- **Performance**:
  - Test Accuracy: **68.75%**
  - Macro ROC-AUC: **0.8828**
  - File Size: `5,119,846` bytes
  - SHA-256: `D4CFDF4923B5E349023A6B514BE7D633360EFC76AC71CD596823F6723265FAD7`

---

## Explainability (Grad-CAM)

The `ml/explainability/gradcam.py` module extracts activation maps from the backbone's final convolutional layer (`top_activation` or fallback `top_conv`), computes gradients against target class logits, and produces a 2D activation heatmap interpolated to original image dimensions with a `jet` colormap overlay ($\alpha = 0.40$).
