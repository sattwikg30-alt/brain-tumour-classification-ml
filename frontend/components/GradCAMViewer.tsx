"use client";

import React, { useState } from "react";
import { AlertCircle, Eye, Info, Layers, RefreshCw, Sparkles } from "lucide-react";
import { GradCAMResponse } from "@/types/prediction";
import { generateGradCAM } from "@/lib/api";

interface GradCAMViewerProps {
  initialGradCAM: GradCAMResponse;
  originalFile: File;
}

const CLASS_OPTIONS = [
  { id: "glioma", name: "Glioma" },
  { id: "meningioma", name: "Meningioma" },
  { id: "notumor", name: "No Tumor" },
  { id: "pituitary", name: "Pituitary" },
];

export default function GradCAMViewer({ initialGradCAM, originalFile }: GradCAMViewerProps) {
  const [gradcamData, setGradcamData] = useState<GradCAMResponse>(initialGradCAM);
  const [selectedClass, setSelectedClass] = useState<string>(initialGradCAM.target_class);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClassChange = async (targetClass: string) => {
    if (targetClass === selectedClass) return;
    try {
      setIsRegenerating(true);
      setErrorMsg(null);
      setSelectedClass(targetClass);
      const res = await generateGradCAM(originalFile, targetClass);
      setGradcamData(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to generate Grad-CAM for selected class");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-slate-100">
              Grad-CAM Visual Explainability
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Layer: {gradcamData.conv_layer_used}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gradient-weighted Class Activation Mapping displays anatomical regions influencing model logits.
          </p>
        </div>

        {/* Explain target class selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Explain Class:</span>
          <div className="flex flex-wrap gap-1">
            {CLASS_OPTIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleClassChange(c.id)}
                disabled={isRegenerating}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedClass === c.id
                    ? "bg-sky-500 text-white shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                } disabled:opacity-50`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3-Panel Visual Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {isRegenerating && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 space-x-2">
            <RefreshCw className="w-5 h-5 text-sky-400 animate-spin" />
            <span className="text-sm font-semibold text-sky-300">
              Recalculating gradients for {selectedClass}...
            </span>
          </div>
        )}

        {/* Panel 1: Original MRI */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">1. Original Brain MRI</span>
            <span className="text-slate-500 font-mono">RGB Input</span>
          </div>
          <div className="aspect-square rounded-xl overflow-hidden border border-slate-800 bg-black shadow-md flex items-center justify-center">
            <img
              src={gradcamData.original_image_base64}
              alt="Original MRI"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[11px] text-slate-500 text-center">Standard anatomical brain MRI scan</p>
        </div>

        {/* Panel 2: Heatmap */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">2. Activation Heatmap</span>
            <span className="text-sky-400 font-mono text-[11px]">top_activation (7x7)</span>
          </div>
          <div className="aspect-square rounded-xl overflow-hidden border border-slate-800 bg-black shadow-md flex items-center justify-center">
            <img
              src={gradcamData.heatmap_image_base64}
              alt="Grad-CAM Heatmap"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[11px] text-slate-500 text-center">Bicubic interpolated activation gradient map</p>
        </div>

        {/* Panel 3: Overlay */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">3. Diagnostic Overlay</span>
            <span className="text-emerald-400 font-mono text-[11px]">α = 0.40 blend</span>
          </div>
          <div className="aspect-square rounded-xl overflow-hidden border border-slate-800 bg-black shadow-md flex items-center justify-center">
            <img
              src={gradcamData.overlay_image_base64}
              alt="Grad-CAM Overlay"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Explaining <span className="text-sky-400 font-semibold">{gradcamData.target_display_name}</span> evidence
          </p>
        </div>
      </div>

      {/* Anatomical Region Insight Callout */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-100">
            How to interpret this visualization:
          </p>
          <p className="text-slate-400 leading-relaxed">
            Warm colors (red, orange, yellow) indicate regions where convolutional feature maps had the highest positive gradients towards the score for <strong className="text-slate-200">{gradcamData.target_display_name}</strong>. Cool colors (blue) had minimal impact on the prediction. For healthy scans, activations are typically diffuse or focus on general structural symmetry.
          </p>
        </div>
      </div>
    </div>
  );
}
