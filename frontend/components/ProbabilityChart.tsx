"use client";

import React from "react";
import { ClassScore } from "@/types/prediction";

interface ProbabilityChartProps {
  scores: ClassScore[];
  predictedClass: string;
}

const CLASS_COLORS: Record<string, { bar: string; text: string; bg: string; dot: string }> = {
  glioma: {
    bar: "bg-gradient-to-r from-indigo-500 to-indigo-400",
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
    dot: "bg-indigo-400",
  },
  meningioma: {
    bar: "bg-gradient-to-r from-amber-500 to-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    dot: "bg-amber-400",
  },
  notumor: {
    bar: "bg-gradient-to-r from-emerald-500 to-teal-400",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
  pituitary: {
    bar: "bg-gradient-to-r from-sky-500 to-cyan-400",
    text: "text-sky-400",
    bg: "bg-sky-500/10",
    dot: "bg-sky-400",
  },
};

export default function ProbabilityChart({ scores, predictedClass }: ProbabilityChartProps) {
  // Sort classes by score descending
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Softmax Score Distribution
          </h4>
          <span className="text-[11px] text-slate-500">4-way differential probabilities</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          Σ = 1.00
        </span>
      </div>

      <div className="space-y-2.5">
        {sortedScores.map((item) => {
          const isTop = item.class_name === predictedClass;
          const styling = CLASS_COLORS[item.class_name] || {
            bar: "bg-slate-500",
            text: "text-slate-400",
            bg: "bg-slate-800",
            dot: "bg-slate-400",
          };

          return (
            <div
              key={item.class_name}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                isTop
                  ? "bg-slate-900/95 border-sky-500/30 shadow-md shadow-sky-500/5 ring-1 ring-sky-500/20"
                  : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700/80"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${styling.dot} ${
                      isTop ? "ring-2 ring-white/20 animate-pulse" : "opacity-70"
                    }`}
                  />
                  <span className={`font-semibold ${isTop ? "text-white" : "text-slate-300"}`}>
                    {item.display_name}
                  </span>
                  {isTop && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 uppercase tracking-wider border border-sky-500/30">
                      Top Match
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <span className="text-slate-500 text-[11px] hidden sm:inline">
                    ({item.score.toFixed(4)})
                  </span>
                  <span className={`font-bold font-mono ${isTop ? styling.text : "text-slate-300"}`}>
                    {item.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Symmetrical, clean progress bar track */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-[0.5px] border border-slate-800/90">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${styling.bar} ${
                    isTop ? "shadow-sm shadow-current" : "opacity-75"
                  }`}
                  style={{ width: `${Math.max(item.percentage, 1)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
        * Normalized output logits from EfficientNet-B0. Used for differential triage alongside clinical correlation.
      </p>
    </div>
  );
}
