"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Calendar,
  Clock,
  Download,
  History,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { HistoryItem } from "@/types/prediction";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem("cerebra_history") || localStorage.getItem("neuroscan_history");
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your local session history?")) {
      localStorage.removeItem("cerebra_history");
      localStorage.removeItem("neuroscan_history");
      setHistory([]);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cerebra_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Local Session Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            MRI Scan History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Auditable log of scans analyzed during this browser session. Data is stored securely in local browser storage.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center space-x-2 self-start sm:self-center">
            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* History List or Empty State */}
      {!isLoaded ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Loading session history...
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">No MRI scans analyzed yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Scans analyzed in the diagnostic suite will automatically appear here with their prediction scores.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/analyze"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 transition-all"
            >
              <Activity className="w-4 h-4" />
              <span>Analyze Your First Scan</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/80 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      item.predicted_class === "notumor"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-sky-500/10 text-sky-400 border-sky-500/30"
                    }`}
                  >
                    {item.display_name}
                  </span>
                  <span className="text-sm font-semibold text-slate-200">{item.filename}</span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span className="text-sm font-extrabold text-sky-400">
                    {item.confidence_percentage.toFixed(2)}%
                  </span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.inference_time_ms} ms</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </div>

              {/* Class Probability Breakdown Pills */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/60">
                {item.scores.map((sc) => (
                  <span
                    key={sc.class_name}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800/80 text-slate-300"
                  >
                    <strong className="text-slate-400 font-medium">{sc.display_name}:</strong>{" "}
                    {sc.percentage.toFixed(1)}%
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
