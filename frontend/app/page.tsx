import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Layers,
  Microscope,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const verifiedStats = [
    { label: "Test Accuracy", value: "87.50%", note: "+18.75% vs baseline CNN", accent: "text-sky-400" },
    { label: "ROC-AUC Score", value: "0.9718", note: "Multi-class Macro OvR", accent: "text-emerald-400" },
    { label: "Healthy Recall", value: "100.0%", note: "400 / 400 with 0 false negatives", accent: "text-teal-400" },
    { label: "Pituitary Recall", value: "99.00%", note: "396 / 400 test scans correct", accent: "text-indigo-400" },
  ];

  const tumorClasses = [
    {
      name: "Glioma",
      type: "Malignant / Invasive",
      color: "border-indigo-500/30 bg-indigo-500/5 text-indigo-400",
      description: "Originates in glial cells supporting neurons. Often infiltrative with ill-defined margins requiring precise localization.",
      sampleFile: "glioma.jpg",
    },
    {
      name: "Meningioma",
      type: "Typically Extra-axial",
      color: "border-amber-500/30 bg-amber-500/5 text-amber-400",
      description: "Arises from arachnoid cap cells of the meninges. Characterized by dural attachment and dense focal massing.",
      sampleFile: "meningioma.jpg",
    },
    {
      name: "Pituitary Tumor",
      type: "Sellar Region Adenoma",
      color: "border-sky-500/30 bg-sky-500/5 text-sky-400",
      description: "Develops in the pituitary fossa. The model achieved 99.0% recall detecting pituitary gland adenomas.",
      sampleFile: "pituitary.jpg",
    },
    {
      name: "No Tumor",
      type: "Healthy Brain Tissue",
      color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
      description: "Unremarkable brain MRI without pathological mass effect, edema, or focal hyperintensity.",
      sampleFile: "notumor.jpg",
    },
  ];

  return (
    <div className="relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EfficientNet-B0 + Grad-CAM Visual Explainability</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Automated Brain Tumor MRI Classification &{" "}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Visual Explainability
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            A full-stack medical AI research dashboard for differential diagnosis of brain MRI scans into four categories, complete with Gradient-weighted Class Activation Mapping (Grad-CAM) to visualize regions of diagnostic interest.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/analyze"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700 hover:from-sky-400 hover:to-indigo-600 text-white shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.02]"
            >
              <Activity className="w-4 h-4" />
              <span>Start MRI Analysis</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/model-info"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
            >
              <Cpu className="w-4 h-4 text-slate-400" />
              <span>Model Intelligence & Metrics</span>
            </Link>
          </div>
        </div>

        {/* Verified Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 sm:mt-20">
          {verifiedStats.map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-1 hover:border-slate-700 transition-colors"
            >
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                {stat.label}
              </span>
              <span className={`text-3xl font-extrabold ${stat.accent} tracking-tight block`}>
                {stat.value}
              </span>
              <span className="text-[11px] text-slate-500 block">{stat.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Class Diagnostic Coverage Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="space-y-4 max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Differential Diagnosis</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Supported Brain MRI Classifications</h2>
          <p className="text-sm text-slate-400">
            Trained and benchmarked on 7,200 multi-institutional MRI scans across 3 major tumor pathologies and healthy control subjects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tumorClasses.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 hover:border-slate-700 hover:bg-slate-900/70 transition-all group"
            >
              {/* Sample preview image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-800 group-hover:border-slate-700 transition-colors">
                <img
                  src={`/samples/${item.sampleFile}`}
                  alt={`${item.name} MRI sample`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-slate-200 border border-white/10">
                  Sample {item.name}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-100">{item.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.color}`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grad-CAM Explainable AI Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Explainable AI (XAI)</span>
            </div>

            <h2 className="text-3xl font-bold text-white tracking-tight">
              Clinical Transparency through Grad-CAM Heatmaps
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Black-box deep neural networks can undermine clinical trust. NeuroScan AI integrates real-time Gradient-weighted Class Activation Mapping (Grad-CAM) directly from the backbone’s final convolutional layer (<code>top_activation</code>).
            </p>

            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Extracts activation gradients with respect to predicted tumor logits</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Overlays bicubic-interpolated thermal heatmaps onto the original scan</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Verifies whether model attention aligns with actual anatomical tumor locations</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/analyze"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>Upload a scan to test Grad-CAM</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Grad-CAM Visual Showcase Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-semibold text-slate-200">Grad-CAM Visualization Pipeline</span>
              <span className="text-emerald-400 font-mono">alpha = 0.40 Jet Colormap</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1 text-center">
                <div className="aspect-square rounded-lg bg-black border border-slate-800 overflow-hidden">
                  <img src="/samples/pituitary.jpg" alt="Original Scan" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] text-slate-400">Original MRI</span>
              </div>

              <div className="space-y-1 text-center">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-indigo-950 via-sky-900 to-amber-900 border border-slate-800 flex items-center justify-center p-2">
                  <div className="w-10 h-10 rounded-full bg-red-500/80 blur-sm shadow-lg shadow-red-500/50" />
                </div>
                <span className="text-[11px] text-sky-400 font-mono">Heatmap</span>
              </div>

              <div className="space-y-1 text-center">
                <div className="aspect-square rounded-lg bg-black border border-slate-800 overflow-hidden relative">
                  <img src="/samples/pituitary.jpg" alt="Overlay Scan" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/30 to-amber-500/20 mix-blend-screen" />
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">Overlay</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center pt-2">
              Demonstrating anatomical localization in the sellar / pituitary region.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
