"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Brain, CheckCircle2, ChevronRight, Cpu, History, Sparkles } from "lucide-react";
import { checkHealth } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkHealth()
      .then((data) => setBackendOnline(data.model_loaded))
      .catch(() => setBackendOnline(false));

    const interval = setInterval(() => {
      checkHealth()
        .then((data) => setBackendOnline(data.model_loaded))
        .catch(() => setBackendOnline(false));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: "Overview", href: "/", icon: Brain },
    { name: "MRI Analysis", href: "/analyze", icon: Activity },
    { name: "Model Intelligence", href: "/model-info", icon: Cpu },
    { name: "Session History", href: "/history", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 p-[1px] shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                NeuroScan<span className="text-sky-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Brain Tumor MRI Classification & Grad-CAM</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800/80 text-sky-400 border border-slate-700/60 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Status & Action */}
        <div className="flex items-center space-x-3">
          {/* Health Badge */}
          <div
            className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              backendOnline === true
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : backendOnline === false
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
            title={
              backendOnline === true
                ? "FastAPI ML Backend Connected (EfficientNetB0 Ready)"
                : "Connecting to internal inference server..."
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline === true
                  ? "bg-emerald-400 animate-pulse"
                  : backendOnline === false
                  ? "bg-rose-400"
                  : "bg-slate-400"
              }`}
            />
            <span>
              {backendOnline === true
                ? "Model Online"
                : backendOnline === false
                ? "Backend Offline"
                : "Checking..."}
            </span>
          </div>

          <Link
            href="/analyze"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/25 transition-all hover:shadow-sky-500/40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze MRI</span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </Link>
        </div>
      </div>
    </header>
  );
}
