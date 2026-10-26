import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroScan AI — Brain Tumor MRI Classification & Grad-CAM",
  description:
    "Full-stack medical imaging AI platform for multi-class brain tumor classification (Glioma, Meningioma, Pituitary, No Tumor) and Grad-CAM visual explainability using EfficientNetB0.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
        <Navbar />
        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-400">NeuroScan AI</span>
              <span>•</span>
              <span>EfficientNetB0 Transfer Learning + Grad-CAM</span>
            </div>
            <div className="text-center sm:text-right text-slate-500 max-w-md">
              Research & educational medical AI demonstrator. Not a substitute for formal board-certified radiological diagnosis.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
