"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { AlertCircle, FileUp, Image as ImageIcon, Sparkles, UploadCloud, X } from "lucide-react";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

const SAMPLE_OPTIONS = [
  { label: "Glioma Sample", file: "glioma.jpg", classType: "glioma" },
  { label: "Meningioma Sample", file: "meningioma.jpg", classType: "meningioma" },
  { label: "Healthy (No Tumor)", file: "notumor.jpg", classType: "notumor" },
  { label: "Pituitary Tumor", file: "pituitary.jpg", classType: "pituitary" },
];

export default function ImageUploader({
  onFileSelect,
  selectedFile,
  onClear,
  disabled = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; sizeKb: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setErrorMsg(null);
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png)$/i)) {
      setErrorMsg("Please upload a valid MRI scan in JPEG or PNG format.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("MRI image exceeds the 15 MB maximum size limit.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const img = new window.Image();
    img.onload = () => {
      setImageMeta({
        width: img.naturalWidth,
        height: img.naturalHeight,
        sizeKb: Math.round(file.size / 1024),
      });
    };
    img.src = objectUrl;

    onFileSelect(file);
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSampleSelect = async (sampleFile: string, label: string) => {
    try {
      setLoadingSample(sampleFile);
      setErrorMsg(null);
      const res = await fetch(`/samples/${sampleFile}`);
      if (!res.ok) throw new Error("Could not load sample MRI scan");
      const blob = await res.blob();
      const file = new File([blob], sampleFile, { type: "image/jpeg" });
      processFile(file);
    } catch (err: any) {
      setErrorMsg(`Failed to load sample: ${err.message}`);
    } finally {
      setLoadingSample(null);
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setImageMeta(null);
    setErrorMsg(null);
    onClear();
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      {!selectedFile || !previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10 scale-[1.01]"
              : "border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60"
          }`}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileInput}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8 text-sky-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-100">
                Drag and drop your Brain MRI scan here
              </h3>
              <p className="text-sm text-slate-400">
                or <span className="text-sky-400 font-medium underline">browse files</span> from your computer
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">JPEG, JPG, PNG</span>
              <span>•</span>
              <span>Max 15 MB</span>
              <span>•</span>
              <span>Auto-normalized to 224x224 RGB</span>
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Area */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-sky-400" />
              <span className="font-semibold text-sm text-slate-200">Loaded MRI Scan</span>
            </div>
            <button
              onClick={handleClear}
              disabled={disabled}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Image Thumbnail */}
            <div className="relative aspect-square max-w-[260px] mx-auto w-full rounded-xl overflow-hidden border border-slate-700/80 bg-black shadow-lg">
              <img
                src={previewUrl}
                alt="Brain MRI preview"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Metadata and details */}
            <div className="md:col-span-2 space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">File Name</p>
                <p className="text-sm font-semibold text-slate-100 break-all">{selectedFile.name}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Resolution</span>
                  <span className="text-sm font-semibold text-slate-200">
                    {imageMeta ? `${imageMeta.width} × ${imageMeta.height} px` : "Reading..."}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">File Size</span>
                  <span className="text-sm font-semibold text-slate-200">
                    {imageMeta ? `${imageMeta.sizeKb} KB` : "Reading..."}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-400 block">Channels</span>
                  <span className="text-sm font-semibold text-emerald-400">RGB (3-channel)</span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                The image will be resized to 224×224 and preprocessed using EfficientNetB0 scaling before running inference.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Verified Sample Images Selector */}
      <div className="pt-2">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Or test instantly with a verified MRI sample:
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_OPTIONS.map((sample) => (
            <button
              key={sample.file}
              onClick={() => handleSampleSelect(sample.file, sample.label)}
              disabled={disabled || loadingSample === sample.file}
              className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                loadingSample === sample.file
                  ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                  : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              <span>{sample.label}</span>
              {loadingSample === sample.file && (
                <span className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
