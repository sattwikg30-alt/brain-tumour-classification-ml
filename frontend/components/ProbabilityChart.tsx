"use client";

import React from "react";
import { ClassScore } from "@/types/prediction";

interface ProbabilityChartProps {
  scores: ClassScore[];
  predictedClass: string;
}

const CLASS_COLORS: Record<string, { bar: string; text: string; bg: string }> = {
  glioma: {
    bar: "bg-indigo-500",
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  meningioma: {
    bar: "bg-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  notumor: {
    bar: "bg-emerald-500",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  pituitary: {
    bar: "bg-sky-500",
    text: "text-sky-400",
    bg: "bg-sky-500/10",
  },
};

export default function ProbabilityChart({ scores, predictedClass }: ProbabilityChartProps) {
  // Sort classes by score descending
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Softmax Score Distribution
        </h4>
        <span className="text-xs text-slate-500">4 Classes Evaluated</span>
      </div>

      <div className="space-y-3">
        {sortedScores.map((item) => {
          const isTop = item.class_name === predictedClass;
          const styling = CLASS_COLORS[item.class_name] || {
            bar: "bg-slate-500",
            text: "text-slate-400",
            bg: "bg-slate-800",
          };

          return (
            <div
              key={item.class_name}
              className={`p-3 rounded-xl border transition-all ${
                isTop
                  ? "bg-slate-900/90 border-slate-700 shadow-md shadow-sky-500/5 ring-1 ring-sky-500/20"
                  : "bg-slate-900/40 border-slate-800/80"
              }`}
            >
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${styling.bar} ${
                      isTop ? "ring-2 ring-white/20" : ""
                    }`}
                  />
                  <span className={`font-semibold ${isTop ? "text-slate-100" : "text-slate-300"}`}>
                    {item.display_name}
                  </span>
                  {isTop && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 uppercase tracking-wider">
                      Predicted
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <span className="text-slate-500 hidden sm:inline">
                    ({item.score.toFixed(4)})
                  </span>
                  <span className={`font-bold text-sm ${isTop ? styling.text : "text-slate-300"}`}>
                    {item.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Progress bar track */}
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${styling.bar} ${
                    isTop ? "shadow-sm shadow-current" : "opacity-80"
                  }`}
                  style={{ width: `${Math.max(item.percentage, 0.5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 italic">
        * Note: Model scores represent raw softmax probability distributions across the 4 trained classes. In clinical workflows, scores are decision-support indicators rather than calibrated medical diagnoses.
      </p>
    </div>
  );
}
