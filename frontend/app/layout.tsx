import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cerebra — Brain Tumor MRI Classification & Visual Explainability",
  description:
    "Next-generation medical imaging AI platform for multi-class brain tumor classification (Glioma, Meningioma, Pituitary, No Tumor) and Grad-CAM visual explainability using EfficientNetB0.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-sky-500/30 selection:text-sky-200 antialiased">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>

        <footer className="border-t border-slate-900/80 bg-slate-950/95 py-8 text-xs text-slate-500">
          <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-300">Cerebra.ai</span>
              <span>•</span>
              <span>EfficientNet-B0 + Grad-CAM Visual Explainability</span>
            </div>
            <div className="text-center sm:text-right text-slate-500 max-w-lg">
              Medical intelligence research platform. For clinical decision-support and educational demonstration only.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
