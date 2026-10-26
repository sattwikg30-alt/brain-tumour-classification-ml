"use client";

import React from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  FileText,
  Info,
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

const TUMOR_DETAILS: Record<
  string,
  {
    badgeClass: string;
    borderClass: string;
    icon: typeof AlertTriangle;
    title: string;
    categoryBadge: string;
    line1: string;
    line2: string;
    clinicalGuidance: string;
  }
> = {
  glioma: {
    badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    borderClass: "border-indigo-500/30",
    icon: AlertTriangle,
    title: "Glioma Brain Tumor",
    categoryBadge: "Malignant / Infiltrative Neoplasm",
    line1:
      "Gliomas are primary central nervous system tumors that arise from supportive glial cells (astrocytes or oligodendrocytes) and infiltrate surrounding brain parenchyma.",
    line2:
      "On contrast MRI, they typically present with irregular non-demarcated margins, local mass effect, surrounding vasogenic edema, and variable ring-enhancement requiring surgical neuro-oncology staging.",
    clinicalGuidance:
      "Recommend multi-parametric MRI (DWI, perfusion, and spectroscopy) to evaluate high-grade versus low-grade features, alongside urgent stereotactic biopsy or neurosurgical planning.",
  },
  meningioma: {
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    borderClass: "border-amber-500/30",
    icon: AlertTriangle,
    title: "Meningioma Brain Tumor",
    categoryBadge: "Typically Extra-axial Dural Tumor",
    line1:
      "Meningiomas are slow-growing intracranial tumors originating from the arachnoid cap cells of the meninges covering the brain and spinal cord.",
    line2:
      "On contrast-enhanced MRI, they characteristically present as well-circumscribed, homogeneously enhancing lesions with a classic broad-based 'dural tail' sign attached to the dura mater.",
    clinicalGuidance:
      "Assess for bony hyperostosis and vascular encasement (e.g., sagittal sinus involvement). Asymptomatic small lesions may undergo serial surveillance, while mass-effect lesions warrant surgical resection.",
  },
  pituitary: {
    badgeClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    borderClass: "border-sky-500/30",
    icon: AlertTriangle,
    title: "Pituitary Tumor (Adenoma)",
    categoryBadge: "Sellar / Suprasellar Adenoma",
    line1:
      "Pituitary tumors are primarily benign neuroendocrine adenomas arising from glandular cells inside the sella turcica at the base of the skull below the hypothalamus.",
    line2:
      "On MRI scans, macroadenomas frequently exhibit upward suprasellar extension, which can compress the optic chiasm causing bitemporal hemianopsia or trigger systemic endocrine dysregulation.",
    clinicalGuidance:
      "Recommend formal visual field perimetry examination and comprehensive endocrine hormonal panel (prolactin, ACTH, GH, IGF-1, TSH). Transsphenoidal resection or medical management is indicated.",
  },
  notumor: {
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    borderClass: "border-emerald-500/30",
    icon: ShieldCheck,
    title: "Healthy Brain Tissue (No Tumor)",
    categoryBadge: "Normal Anatomical Baseline",
    line1:
      "The scan displays symmetric cerebral and cerebellar hemispheres with preserved gray-white matter differentiation and normal ventricular caliber.",
    line2:
      "No intracranial mass lesion, abnormal focal contrast enhancement, midline shift, or surrounding vasogenic edema is identified across evaluated slices.",
    clinicalGuidance:
      "Negative study for space-occupying intracranial mass. Correlate with patient's clinical presenting symptoms (headache, neurologic deficit) to consider non-oncological etiologies if symptoms persist.",
  },
};

export default function PredictionResults({
  prediction,
  onReset,
  onGenerateGradCAM,
  isGradCAMLoading,
  hasGradCAM,
}: PredictionResultsProps) {
  const details = TUMOR_DETAILS[prediction.predicted_class] || {
    badgeClass: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    borderClass: "border-slate-800",
    icon: Activity,
    title: prediction.display_name,
    categoryBadge: "Automated Differential",
    line1: `The neural network identified features characteristic of ${prediction.display_name}.`,
    line2: "Requires radiological correlation and clinical review.",
    clinicalGuidance: "Standard neuro-imaging follow-up protocol.",
  };

  const IconComponent = details.icon;

  return (
    <div className="space-y-6">
      {/* 2-Column Symmetrical Layout: Left = Diagnosis & 2-Line Tumor Info, Right = Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Diagnosis Card & Tumor Information (Span 7) */}
        <div
          className={`lg:col-span-7 rounded-2xl border ${details.borderClass} bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl`}
        >
          <div className="space-y-4">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${details.badgeClass}`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{details.categoryBadge}</span>
              </span>

              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                Inference: {prediction.inference_time_ms} ms
              </span>
            </div>

            {/* Diagnosis Title */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                Differential AI Diagnosis
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {details.title}
              </h2>
            </div>

            {/* Tumor Explanation: 2 Distinct Medically Sound Lines */}
            <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-4 space-y-2.5 text-left">
              <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wide">
                <Info className="w-3.5 h-3.5" />
                <span>About this Pathology</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {details.line1}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pt-1 border-t border-slate-800/60">
                {details.line2}
              </p>
            </div>

            {/* Clinical Recommendation Note */}
            <div className="rounded-xl bg-slate-900/50 border border-slate-800/60 p-3.5 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300 block mb-0.5">Radiological Recommendation:</span>
              <span>{details.clinicalGuidance}</span>
            </div>
          </div>

          {/* Action Buttons in Left Column */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {!hasGradCAM && (
              <button
                onClick={onGenerateGradCAM}
                disabled={isGradCAMLoading}
                className="flex-1 flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700 hover:from-sky-400 hover:to-indigo-600 text-white shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
              >
                {isGradCAMLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Computing Heatmaps...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Generate Grad-CAM Saliency</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onReset}
              className="flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Analyze Another Scan</span>
            </button>
          </div>
        </div>

        {/* Right Column: Symmetrical Confidence Gauge & Softmax Distribution (Span 5) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 flex flex-col justify-between space-y-5 shadow-xl">
          {/* Top Confidence Metric Banner */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Top Prediction Confidence
              </span>
              <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 font-mono">
                {prediction.confidence_percentage.toFixed(2)}%
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Input Resolution</span>
              <span className="text-xs font-mono font-semibold text-slate-300">
                {prediction.input_dimensions[0]}×{prediction.input_dimensions[1]} px
              </span>
            </div>
          </div>

          {/* Symmetrical Score Distribution Component */}
          <div className="flex-1">
            <ProbabilityChart
              scores={prediction.scores}
              predictedClass={prediction.predicted_class}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
