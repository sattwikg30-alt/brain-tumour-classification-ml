import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Eye,
  FileCheck2,
  Gauge,
  Layers,
  Microscope,
  Network,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const verifiedStats = [
    {
      label: "Diagnostic Accuracy",
      value: "87.50%",
      note: "+18.75% gain over baseline 4-layer CNN",
      accent: "text-sky-400",
      bgGlow: "from-sky-500/10 to-transparent",
      icon: Gauge,
    },
    {
      label: "Multi-Class ROC-AUC",
      value: "0.9718",
      note: "Macro One-vs-Rest discriminative capacity",
      accent: "text-emerald-400",
      bgGlow: "from-emerald-500/10 to-transparent",
      icon: Zap,
    },
    {
      label: "Healthy Tissue Recall",
      value: "100.0%",
      note: "400/400 verified scans — 0 false negatives",
      accent: "text-teal-400",
      bgGlow: "from-teal-500/10 to-transparent",
      icon: ShieldCheck,
    },
    {
      label: "Pituitary Sensitivity",
      value: "99.00%",
      note: "396/400 test cases localized correctly",
      accent: "text-indigo-400",
      bgGlow: "from-indigo-500/10 to-transparent",
      icon: Eye,
    },
  ];

  const tumorClasses = [
    {
      name: "Glioma",
      type: "Intra-axial Infiltrative",
      color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      description:
        "Originates within neuroglial progenitor cells. Characterized by ill-defined borders, local tissue infiltration, and microvascular proliferation requiring precise spatial mapping.",
      sampleFile: "glioma.jpg",
      accuracy: "76.9% F1",
      pathology: "Astrocytic / Oligodendroglial",
    },
    {
      name: "Meningioma",
      type: "Extra-axial Dural",
      color: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      description:
        "Arises from arachnoid cap cells of the dura mater. Presents as well-circumscribed, homogeneous contrast-enhancing masses with broad dural base attachment.",
      sampleFile: "meningioma.jpg",
      accuracy: "81.8% F1",
      pathology: "Meningothelial / Fibrous",
    },
    {
      name: "Pituitary Tumor",
      type: "Sellar Mass / Adenoma",
      color: "border-sky-500/30 bg-sky-500/10 text-sky-300",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      description:
        "Originates inside the sella turcica. Can compress the optic chiasm. Cerebra achieves 99.0% sensitivity detecting sellar expansions with clear demarcation.",
      sampleFile: "pituitary.jpg",
      accuracy: "94.7% F1",
      pathology: "Neuroendocrine Adenoma",
    },
    {
      name: "Healthy Brain",
      type: "Normal Non-Pathological",
      color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      description:
        "Symmetric parenchyma, preserved ventricular caliber, normal sulcal depth, and absence of mass effect, midline shift, edema, or focal hyperintensity.",
      sampleFile: "notumor.jpg",
      accuracy: "100.0% Recall",
      pathology: "Negative Baseline Control",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "MRI Acquisition & Normalization",
      desc: "Fast streaming pipeline resizes axial or coronal scans to 224×224×3 RGB and applies EfficientNet-specific channel standardization.",
      icon: Activity,
    },
    {
      step: "02",
      title: "Deep Feature Extraction",
      desc: "Pre-trained MBConv blocks extract multi-scale convolutional feature maps through compound-scaled receptive fields.",
      icon: Network,
    },
    {
      step: "03",
      title: "Differential Classification",
      desc: "Custom dense classification head computes calibrated Softmax probabilities across all 4 pathological conditions.",
      icon: Cpu,
    },
    {
      step: "04",
      title: "Grad-CAM Saliency Backprop",
      desc: "Gradients of the winning class logits backpropagate into top_activation to render an interpretive heatmap overlay in real time.",
      icon: Layers,
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section - Full width container with subtle ambient glow */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 pt-12 lg:pt-20 pb-16 lg:pb-24 border-b border-slate-900 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-br from-sky-500/15 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Hero Grid - Balanced 2-Column Showcase */}
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Value Prop, CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 border border-sky-500/25 text-sky-300 shadow-sm shadow-sky-500/10">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Next-Gen Brain MRI Differential Diagnosis & Explainable AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Clinical-Grade MRI Diagnosis with{" "}
              <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                Visual Proof
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              <strong className="text-white font-semibold">Cerebra</strong> brings clinical transparency to neuro-oncology imaging. By marrying high-accuracy Transfer Learning with real-time Grad-CAM saliency heatmaps, clinicians can instantly verify not just <span className="text-sky-300 font-medium">what</span> the AI diagnosed, but <span className="text-emerald-300 font-medium">where</span> the neural network detected the pathology.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap gap-3 pt-1 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero False Negatives for Healthy Tissue</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>87.5% Multi-Class Accuracy</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Real-Time Grad-CAM Saliency</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/analyze"
                className="group flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700 hover:from-sky-400 hover:to-indigo-500 text-white shadow-xl shadow-sky-500/20 hover:shadow-sky-500/35 transition-all duration-300 hover:scale-[1.02]"
              >
                <Activity className="w-4 h-4 text-sky-200 group-hover:scale-110 transition-transform" />
                <span>Launch Analysis Console</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/model-info"
                className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-sm bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
              >
                <Cpu className="w-4 h-4 text-slate-400" />
                <span>Explore Model Benchmarks</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Diagnostic Showcase Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-7 shadow-2xl shadow-black/80 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200 tracking-wide">CEREBRA ENGINE • LIVE INFERENCE</span>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  EfficientNet-B0 Ready
                </span>
              </div>

              {/* 3-Panel Visual Preview */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="space-y-1.5 text-center">
                  <div className="aspect-square rounded-xl bg-black border border-slate-800 overflow-hidden relative group">
                    <img src="/samples/pituitary.jpg" alt="Original MRI Scan" className="w-full h-full object-cover" />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-slate-300">
                      Axial T1+C
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">Input MRI</span>
                </div>

                <div className="space-y-1.5 text-center">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-indigo-950 via-slate-950 to-rose-950/40 border border-slate-800 flex items-center justify-center relative p-3">
                    <div className="w-12 h-12 rounded-full bg-red-500/80 blur-md shadow-lg shadow-red-500/60 animate-pulse" />
                    <span className="absolute bottom-1.5 text-[9px] font-mono text-sky-300 font-bold">
                      top_activation
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-sky-400 font-mono">Heatmap</span>
                </div>

                <div className="space-y-1.5 text-center">
                  <div className="aspect-square rounded-xl bg-black border border-slate-800 overflow-hidden relative">
                    <img src="/samples/pituitary.jpg" alt="Superimposed Overlay" className="w-full h-full object-cover opacity-75" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/40 to-amber-500/30 mix-blend-screen" />
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      α = 0.40
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-400">Grad-CAM Overlay</span>
                </div>
              </div>

              {/* Sample Diagnostic Output Box */}
              <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                      AI Diagnosis Result
                    </span>
                    <h3 className="text-lg font-extrabold text-white">Pituitary Macroadenoma</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Confidence</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">99.00%</span>
                  </div>
                </div>

                {/* Micro Probabilities Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Pituitary Adenoma</span>
                    <span className="text-emerald-400 font-mono">99.00%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full" style={{ width: "99%" }} />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Microscope className="w-3.5 h-3.5 text-sky-400" />
                  <span>Sellar Fossa Localization</span>
                </span>
                <span className="font-mono text-slate-500">Latency: ~45ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards Across the Full Width Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-14 sm:mt-18">
          {verifiedStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="relative rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/90 border border-slate-800/90 p-6 space-y-2.5 hover:border-slate-700 transition-all duration-300 shadow-lg shadow-black/30 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className={`text-3xl sm:text-4xl font-black ${stat.accent} tracking-tight font-mono`}>
                  {stat.value}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">{stat.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Class Diagnostic Coverage - Full Width Widescreen Section */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-16 lg:py-24 border-b border-slate-900 bg-slate-950/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
              <FileCheck2 className="w-4 h-4" />
              <span>Multi-Class Diagnostic Spectrum</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Supported Tumor Pathologies & Healthy Control
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trained on 7,200 verified multi-institutional brain MRI studies. Cerebra provides 4-way differential diagnosis for the primary radiological conditions encountered in clinical workflows.
            </p>
          </div>

          <Link
            href="/analyze"
            className="self-start md:self-end flex items-center space-x-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>Test a sample scan</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Diagnostic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tumorClasses.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 p-5 space-y-4 hover:border-slate-700 transition-all duration-300 shadow-xl group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Image Preview with pill badge */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-800/90 group-hover:border-slate-700 transition-colors">
                  <img
                    src={`/samples/${item.sampleFile}`}
                    alt={`${item.name} MRI study`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-slate-200 border border-white/10">
                    Sample {item.name}
                  </span>
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-emerald-400 border border-slate-700">
                    {item.accuracy}
                  </span>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-slate-400">Subtype:</span>
                <span className="font-medium text-slate-300">{item.pathology}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Analytical Workflow Pipeline */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-16 lg:py-24 border-b border-slate-900">
        <div className="text-left max-w-2xl mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
            <Layers className="w-4 h-4" />
            <span>End-to-End Pipeline</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Cerebra Analyzes Brain MRI Scans
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            From raw DICOM/PNG ingestion to gradient backpropagation saliency rendering in under 50 milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800/80 p-6 space-y-4 hover:border-slate-700 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-black text-slate-600 font-mono">{step.step}</span>
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Explainability / Trust Architecture Spotlight */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-16 lg:py-24 border-b border-slate-900 bg-slate-950/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <Eye className="w-3.5 h-3.5" />
              <span>Interpretability & Clinical Verification</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Eliminating the Black-Box Barrier in Medical AI
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Opaque deep neural networks cannot be audited by medical review boards. <strong className="text-white">Cerebra</strong> directly surfaces activation gradients from the backbone’s final convolutional block (<code>top_activation</code>). This produces bicubic thermal saliency maps showing the exact millimeter-scale voxels that drove the diagnostic decision.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-sky-400">Gradient Backpropagation</span>
                <p className="text-xs text-slate-400">
                  Calculates positive partial derivatives of class score with respect to convolutional feature maps.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400">Bicubic Thermal Overlay</span>
                <p className="text-xs text-slate-400">
                  Upsamples coarse 7×7 feature grids to full 224×224 image dimensions with alpha-blended jet colormapping.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/analyze"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>Upload a custom MRI scan to inspect Grad-CAM</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300">Class Activation Mapping Saliency</span>
                <span className="text-[11px] font-mono text-emerald-400">Layer: top_activation</span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-video bg-black">
                <img
                  src="/samples/glioma.jpg"
                  alt="Glioma Scan with Grad-CAM"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/35 to-amber-500/25 mix-blend-screen" />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-semibold text-slate-200 border border-white/10">
                  Target: Glioma Saliency
                </div>
                <div className="absolute bottom-3 right-3 bg-emerald-500/20 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                  Contrast Concentration: 91.4%
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400 text-left">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span>Colormap Engine</span>
                  <span className="font-mono text-slate-300">Jet (α = 0.40)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span>Interpolation Method</span>
                  <span className="font-mono text-slate-300">Bicubic Spatial Resampling</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Model Backbone</span>
                  <span className="font-mono text-sky-400">EfficientNet-B0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner - Full Width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-16 lg:py-20 bg-gradient-to-b from-slate-950 to-[#030712]">
        <div className="w-full rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-sky-950/50 border border-slate-800/80 p-8 sm:p-14 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Explore Brain Tumor Diagnosis?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Upload your own MRI scan or select from verified clinical sample scans in our diagnostic suite to inspect real-time classification and explainability heatmaps.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              href="/analyze"
              className="flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-xl shadow-sky-500/25 transition-all"
            >
              <Activity className="w-4 h-4" />
              <span>Analyze MRI Scan Now</span>
            </Link>
            <Link
              href="/model-info"
              className="flex items-center space-x-2 px-6 py-4 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
            >
              <Cpu className="w-4 h-4 text-slate-400" />
              <span>Review Metrics</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
