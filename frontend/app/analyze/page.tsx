"use client";

import React, { useState } from "react";
import { Activity, AlertCircle, ArrowLeft, Brain, Layers, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";
import PredictionResults from "@/components/PredictionResults";
import GradCAMViewer from "@/components/GradCAMViewer";
import LoadingState from "@/components/LoadingState";
import { generateGradCAM, predictTumor } from "@/lib/api";
import { GradCAMResponse, HistoryItem, PredictionResponse } from "@/types/prediction";

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [gradcam, setGradcam] = useState<GradCAMResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [isGradCAMLoading, setIsGradCAMLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const saveToHistory = (pred: PredictionResponse, file: File) => {
    try {
      const historyJson = localStorage.getItem("cerebra_history") || localStorage.getItem("neuroscan_history");
      const currentHistory: HistoryItem[] = historyJson ? JSON.parse(historyJson) : [];

      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        filename: file.name,
        predicted_class: pred.predicted_class,
        display_name: pred.display_name,
        confidence_percentage: pred.confidence_percentage,
        scores: pred.scores,
        inference_time_ms: pred.inference_time_ms,
      };

      // Keep recent 20 scans
      const updated = [newItem, ...currentHistory].slice(0, 20);
      localStorage.setItem("cerebra_history", JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save session history to localStorage", e);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPrediction(null);
    setGradcam(null);
    setErrorMsg(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPrediction(null);
    setGradcam(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setIsPredicting(true);
      setErrorMsg(null);
      const res = await predictTumor(selectedFile);
      setPrediction(res);
      saveToHistory(res, selectedFile);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during MRI inference.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleGenerateGradCAM = async () => {
    if (!selectedFile) return;

    try {
      setIsGradCAMLoading(true);
      setErrorMsg(null);
      const res = await generateGradCAM(selectedFile);
      setGradcam(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to generate Grad-CAM explainability heatmap.");
    } finally {
      setIsGradCAMLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Diagnostic Suite</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Live AI Inference</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Brain MRI Analysis & Classification
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload an axial or coronal brain MRI scan to detect tumors and generate visual explainability maps.
          </p>
        </div>

        {prediction && (
          <button
            onClick={handleClear}
            className="self-start sm:self-center flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        )}
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-200">Analysis Error</p>
            <p className="text-rose-300 text-xs">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Main Workflow Area */}
      {!prediction ? (
        <div className="space-y-6">
          <ImageUploader
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onClear={handleClear}
            disabled={isPredicting}
          />

          {selectedFile && !isPredicting && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleAnalyze}
                disabled={isPredicting}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700 hover:from-sky-400 hover:to-indigo-600 text-white shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                <Activity className="w-4 h-4" />
                <span>Run Diagnostic Analysis</span>
              </button>
            </div>
          )}

          {isPredicting && <LoadingState mode="predict" />}
        </div>
      ) : (
        /* Results View */
        <div className="space-y-8 animate-in fade-in duration-300">
          <PredictionResults
            prediction={prediction}
            onReset={handleClear}
            onGenerateGradCAM={handleGenerateGradCAM}
            isGradCAMLoading={isGradCAMLoading}
            hasGradCAM={!!gradcam}
          />

          {isGradCAMLoading && <LoadingState mode="gradcam" />}

          {gradcam && selectedFile && (
            <div className="pt-2">
              <GradCAMViewer
                initialGradCAM={gradcam}
                originalFile={selectedFile}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
