"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  FileText,
  Info,
  Layers,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { getModelInfo } from "@/lib/api";
import { ModelInfoResponse } from "@/types/prediction";

export default function ModelInfoPage() {
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getModelInfo()
      .then((data) => setModelInfo(data))
      .catch((err) => console.error("Could not fetch model info", err))
      .finally(() => setIsLoading(false));
  }, []);

  const comparisonData = [
    { metric: "Architecture", baseline: "Custom 4-layer CNN", effnet: "EfficientNet-B0 (Transfer)", highlight: true },
    { metric: "Model Size", baseline: "5.1 MB", effnet: "19.0 MB", highlight: false },
    { metric: "Test Accuracy", baseline: "68.75%", effnet: "87.50%", highlight: true, delta: "+18.75%" },
    { metric: "Test Loss", baseline: "1.1840", effnet: "0.5056", highlight: true, delta: "-0.6784" },
    { metric: "Precision (Macro)", baseline: "0.7130", effnet: "0.8792", highlight: false },
    { metric: "Recall (Macro)", baseline: "0.6875", effnet: "0.8750", highlight: false },
    { metric: "F1-Score (Macro)", baseline: "0.6624", effnet: "0.8699", highlight: false },
    { metric: "ROC-AUC (Macro OvR)", baseline: "0.8828", effnet: "0.9718", highlight: true, delta: "+0.0890" },
  ];

  const perClassData = [
    { name: "Glioma", precision: "92.61%", recall: "65.75%", f1: "0.7690", support: 400, correct: "263 / 400" },
    { name: "Meningioma", precision: "78.57%", recall: "85.25%", f1: "0.8177", support: 400, correct: "341 / 400" },
    { name: "No Tumor", precision: "89.69%", recall: "100.00%", f1: "0.9456", support: 400, correct: "400 / 400" },
    { name: "Pituitary", precision: "90.83%", recall: "99.00%", f1: "0.9474", support: 400, correct: "396 / 400" },
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10 space-y-10">
      {/* Page Title */}
      <div className="border-b border-slate-900 pb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Model Specifications & Benchmarks
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Neural Architecture & Empirical Verification
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Detailed breakdown of model checkpoints, transfer learning configuration, stratified test set performance, and explainability mechanisms.
        </p>
      </div>

      {/* Model Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Active Checkpoint
          </span>
          <h3 className="text-lg font-bold text-slate-100">
            {modelInfo ? modelInfo.model_name : "EfficientNetB0"}
          </h3>
          <p className="text-xs text-slate-400">
            Fine-tuned on 224×224 normalized brain MRI scans with frozen ImageNet backbone and custom dense head.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Independent Test Accuracy
          </span>
          <h3 className="text-2xl font-extrabold text-emerald-400">87.50%</h3>
          <p className="text-xs text-slate-400">
            Evaluated on 1,600 untouched independent test scans (400 per class) with 0.9718 ROC-AUC.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Explainability Target
          </span>
          <h3 className="text-lg font-bold text-sky-400">top_activation</h3>
          <p className="text-xs text-slate-400">
            Final convolutional feature maps in the EfficientNet backbone used for Grad-CAM gradient backpropagation.
          </p>
        </div>
      </div>

      {/* Architecture Comparison Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-slate-100">Architecture Performance Comparison</h2>
          </div>
          <span className="text-xs text-slate-500">Evaluated on 1,600 Test Scans</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                <th className="py-3 px-4">Performance Metric</th>
                <th className="py-3 px-4">Custom CNN Baseline</th>
                <th className="py-3 px-4 text-sky-400">EfficientNet-B0 (Transfer)</th>
                <th className="py-3 px-4 text-emerald-400">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {comparisonData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-300">{row.metric}</td>
                  <td className="py-3 px-4 text-slate-400">{row.baseline}</td>
                  <td className="py-3 px-4 font-bold text-slate-100">{row.effnet}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{row.delta || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Class Classification Report */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-slate-100">Per-Class Benchmark Breakdown (EfficientNet-B0)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                <th className="py-3 px-4">Pathology Class</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1-Score</th>
                <th className="py-3 px-4">Correct / Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {perClassData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-200">{row.name}</td>
                  <td className="py-3 px-4 text-slate-300">{row.precision}</td>
                  <td className={`py-3 px-4 font-bold ${row.recall === "100.00%" ? "text-emerald-400" : "text-slate-200"}`}>
                    {row.recall}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{row.f1}</td>
                  <td className="py-3 px-4 text-slate-400">{row.correct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-emerald-400">Zero False Negatives on Healthy Scans:</p>
          <p className="text-slate-400">
            The model correctly classified <strong>400 out of 400</strong> healthy brain MRI scans (100.0% recall), ensuring non-tumorous cases are not misdiagnosed as malignant neoplasms.
          </p>
        </div>
      </div>

      {/* Preprocessing and Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-sky-400">
            <Database className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Image Preprocessing</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
              <span><strong>Resolution:</strong> Resized to 224×224 pixels with bilinear anti-aliasing interpolation.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
              <span><strong>Color Channels:</strong> Standardized to 3-channel RGB.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
              <span><strong>Normalization:</strong> EfficientNet official scaling via <code>tf.keras.applications.efficientnet.preprocess_input</code>.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Layers className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Classification Head</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <span><strong>Feature Pooling:</strong> GlobalAveragePooling2D from 7×7×1280 maps.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <span><strong>Regularization:</strong> Dropout (0.30) → Dense(128, ReLU) → Dropout (0.20).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <span><strong>Output Layer:</strong> Dense(4, Softmax) across glioma, meningioma, notumor, pituitary.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Limitations & Safeguards */}
      <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Clinical Limitations & Safe Usage</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          1. <strong>Glioma-Meningioma Confounding:</strong> In empirical testing, 90 glioma test cases were classified as meningioma, and 20 meningioma cases as glioma due to visual similarity in axial T1/T2 imaging. Always utilize Grad-CAM heatmaps to inspect whether attention maps focus on extra-axial vs intra-axial tissue.
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          2. <strong>Regulatory Notice:</strong> This platform is designed strictly for research, educational demonstration, and clinical decision support evaluation. It does not constitute FDA/CE-cleared diagnostic medical software.
        </p>
      </div>
    </div>
  );
}
