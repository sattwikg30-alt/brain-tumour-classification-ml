"use client";

import React from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Layers,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PredictionResponse } from "@/types/prediction";
import ProbabilityChart from "./ProbabilityChart";

interface PredictionResultsProps {
  prediction: PredictionResponse;
  onReset: () => void;
  onGenerateGradCAM: () => void;
  isGradCAMLoading: boolean;
  hasGradCAM: boolean;
}

const TUMOR_DESCRIPTIONS: Record<
  string,
  {
    badgeClass: string;
    borderClass: string;
    icon: typeof AlertTriangle;
    title: string;
    summary: string;
    clinicalNote: string;
  }
> = {
  notumor: {
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    borderClass: "border-emerald-500/30",
    icon: ShieldCheck,
    title: "Healthy Brain Tissue (No Tumor Detected)",
    summary: "No abnormal focal mass lesions, edema, or mass effect identified by the model.",
    clinicalNote: "In verified testing on 400 independent test scans, EfficientNetB0 achieved 100.0% recall on healthy brain MRIs with 0 false negatives.",
  },
  glioma: {
    badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    borderClass: "border-indigo-500/30",
    icon: AlertTriangle,
    title: "Glioma Brain Tumor Detected",
    summary: "Primary central nervous system neoplasm arising from supportive glial cells.",
    clinicalNote: "Gliomas typically exhibit infiltrative borders and variable ring-enhancement. Requires multidisciplinary neurosurgical evaluation.",
  },
  meningioma: {
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    borderClass: "border-amber-500/30",
    icon: AlertTriangle,
    title: "Meningioma Tumor Detected",
    summary: "Typically extra-axial lesion arising from the arachnoid cap cells of the meninges.",
    clinicalNote: "Characterized by dural tails and broad-based dural attachment. The model achieved 85.25% recall on meningioma test samples.",
  },
  pituitary: {
    badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    borderClass: "border-sky-500/30",
    icon: AlertTriangle,
    title: "Pituitary Tumor Detected",
    summary: "Adenoma originating in the sella turcica / pituitary gland region.",
    clinicalNote: "Often presents with optic chiasm compression or hormonal dysregulation. The model achieved 99.0% recall on pituitary test scans.",
  },
};

export default function PredictionResults({
  prediction,
  onReset,
  onGenerateGradCAM,
  isGradCAMLoading,
  hasGradCAM,
}: PredictionResultsProps) {
  const details = TUMOR_DESCRIPTIONS[prediction.predicted_class] || {
    badgeClass: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    borderClass: "border-slate-800",
    icon: Activity,
    title: prediction.display_name,
    summary: "Classification completed successfully.",
    clinicalNote: "Automated deep learning prediction.",
  };

  const IconComponent = details.icon;

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className={`rounded-2xl border ${details.borderClass} bg-slate-900/80 p-6 space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${details.badgeClass}`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{prediction.display_name}</span>
            </span>
            <h3 className="text-xl font-bold text-slate-100">{details.title}</h3>
            <p className="text-sm text-slate-400">{details.summary}</p>
          </div>

          {/* Metric Pill */}
          <div className="sm:text-right shrink-0 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Model Confidence</span>
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
              {prediction.confidence_percentage.toFixed(2)}%
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-1 justify-start sm:justify-end">
              <Clock className="w-3 h-3" />
              <span>Inference: {prediction.inference_time_ms} ms</span>
            </div>
          </div>
        </div>

        {/* Clinical Note Alert */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
          <p className="font-semibold text-slate-200 mb-0.5">Clinical Decision Support Context:</p>
          <p className="text-slate-400 leading-relaxed">{details.clinicalNote}</p>
        </div>
      </div>

      {/* Probability Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <ProbabilityChart
          scores={prediction.scores}
          predictedClass={prediction.predicted_class}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {!hasGradCAM && (
          <button
            onClick={onGenerateGradCAM}
            disabled={isGradCAMLoading}
            className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
          >
            {isGradCAMLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Computing Grad-CAM Heatmaps...</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                <span>Generate Grad-CAM Visual Explainability</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={onReset}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Analyze Another Scan</span>
        </button>
      </div>
    </div>
  );
}
