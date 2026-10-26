"use client";

import React, { useEffect, useState } from "react";
import { Activity, Brain, Cpu, Sparkles } from "lucide-react";

interface LoadingStateProps {
  mode?: "predict" | "gradcam";
}

const STEPS = [
  { icon: Brain, label: "Preprocessing MRI scan to 224×224 RGB..." },
  { icon: Cpu, label: "Executing EfficientNetB0 neural forward pass..." },
  { icon: Activity, label: "Computing class logits & probability distribution..." },
  { icon: Sparkles, label: "Calculating convolutional gradients for Grad-CAM..." },
];

export default function LoadingState({ mode = "predict" }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(timer);
  }, []);

  const ActiveIcon = STEPS[currentStep].icon;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 text-center space-y-6">
      {/* Scanner graphic */}
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-indigo-500/30 animate-pulse" />
        <div className="relative w-full h-full rounded-full border border-sky-400/40 bg-slate-950 flex items-center justify-center shadow-xl shadow-sky-500/20">
          <ActiveIcon className="w-10 h-10 text-sky-400 animate-bounce" />
        </div>
      </div>

      {/* Progress Text */}
      <div className="space-y-2 max-w-md mx-auto">
        <h4 className="text-base font-bold text-slate-100">
          {mode === "gradcam" ? "Generating Visual Explainability..." : "Analyzing Brain MRI Scan..."}
        </h4>
        <p className="text-sm text-sky-400 font-medium transition-all">
          {STEPS[currentStep].label}
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center items-center space-x-2 pt-2">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentStep
                ? "w-8 bg-sky-400"
                : idx < currentStep
                ? "w-4 bg-emerald-400"
                : "w-2 bg-slate-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
