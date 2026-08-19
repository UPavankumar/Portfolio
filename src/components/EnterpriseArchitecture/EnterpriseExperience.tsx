import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { profile } from "../../data/resume";
import { playClickSound, playHoverSound, playPopSound } from "../../lib/sound";

// ==========================================
// TYPES & DATA DEFINITIONS
// ==========================================

export interface DataObject {
  id: string;
  type: "pdf" | "email" | "xlsx" | "api" | "sql" | "audio" | "json";
  name: string;
  source: string;
  status: "error" | "duplicate" | "missing_fields" | "valid" | "processing";
  errorMsg?: string;
  fields?: Record<string, string>;
  latency?: string;
  throughput?: string;
}

export const CHAOS_OBJECTS: DataObject[] = [
  {
    id: "doc-01",
    type: "pdf",
    name: "INV_2025_48102.pdf",
    source: "Vendor Email Attachment",
    status: "missing_fields",
    errorMsg: "Tax ID & Line Item Subtotals Missing",
    fields: { vendor: "Apex Cloud Ltd", amount: "$14,820.00", taxId: "NULL (PARSE ERROR)" },
  },
  {
    id: "email-02",
    type: "email",
    name: "Urgent: Enterprise SLA Quote",
    source: "sales@enterprise-client.com",
    status: "error",
    errorMsg: "Unassigned Inbound Lead (14h in queue)",
    fields: { intent: "Procurement Quote", tier: "Enterprise Tier 1", assignedTo: "UNASSIGNED" },
  },
  {
    id: "sql-03",
    type: "sql",
    name: "orders_sync_shard_04",
    source: "Legacy PostgreSQL 11",
    status: "duplicate",
    errorMsg: "Duplicate UUID Primary Key Collision",
    fields: { records: "14,200", status: "ROLLBACK REQUIRED", collisionRate: "4.2%" },
  },
  {
    id: "audio-04",
    type: "audio",
    name: "Call_Rec_20250818_142.wav",
    source: "Support PBX (WebRTC 16kHz)",
    status: "processing",
    fields: { caller: "+1 (415) 892-XXXX", duration: "04:18", transcription: "PENDING STT" },
  },
  {
    id: "xlsx-05",
    type: "xlsx",
    name: "payroll_tax_august_v3_final.xlsx",
    source: "HR Shared Drive",
    status: "missing_fields",
    errorMsg: "Schema Mismatch: 3 extra unmapped columns",
    fields: { rows: "412", compliance: "LHDN Non-Compliant", format: "Excel 97-2003" },
  },
  {
    id: "api-06",
    type: "api",
    name: "POST /v1/webhooks/payment",
    source: "Stripe Webhook Gateway",
    status: "error",
    errorMsg: "HTTP 504 Gateway Timeout (Backpressure)",
    fields: { retries: "3/3 FAILED", latency: "30,000ms", destination: "ERP Middleware" },
  },
];

export const PIPELINE_STAGES = [
  { step: "01", name: "RAW INGESTION", tech: "WebRTC · PDF Parser · Webhooks", latency: "8ms", throughput: "2.4 GB/s", status: "HEALTHY" },
  { step: "02", name: "SCHEMA NORMALIZER", tech: "FastAPI · Pydantic V2 · Rust-Py", latency: "12ms", throughput: "14,000 ops/s", status: "HEALTHY" },
  { step: "03", name: "TRANSFORMER AI CORE", tech: "LLaMA 3.1 70B · Groq Whisper", latency: "180ms", throughput: "850 req/s", status: "HEALTHY" },
  { step: "04", name: "DETERMINISTIC VALIDATOR", tech: "Zod · LHDN Strict Tax Rules", latency: "6ms", throughput: "22,000 ops/s", status: "HEALTHY" },
  { step: "05", name: "TRANSACTION COMMIT", tech: "PostgreSQL 16 · Prisma · Redis", latency: "14ms", throughput: "9,500 tps", status: "HEALTHY" },
  { step: "06", name: "ENTERPRISE DISPATCH", tech: "Microsoft Graph · ERP · Webhooks", latency: "24ms", throughput: "1,200 req/s", status: "HEALTHY" },
];

const CHAPTERS = [
  { id: "chaos", num: "01", title: "ENTERPRISE CHAOS", subtitle: "The Reality of Manual Friction" },
  { id: "signal", num: "02", title: "FINDING SIGNAL", subtitle: "Autonomous Classification & Parsing" },
  { id: "architecture", num: "03", title: "INFRASTRUCTURE EMERGES", subtitle: "Living End-to-End Pipeline" },
  { id: "scale", num: "04", title: "THE SCALE STRESS TEST", subtitle: "Handling 100,000+ Concurrent Ops" },
  { id: "impact", num: "05", title: "AUDITED BUSINESS IMPACT", subtitle: "Measurable Enterprise ROI" },
  { id: "control", num: "06", title: "THE ARCHITECT'S CONTROL ROOM", subtitle: "Operating Systems That Scale" },
];

// ==========================================
// MASTER CONTAINER COMPONENT
// ==========================================

export default function EnterpriseExperience() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [hoveredObject, setHoveredObject] = useState<DataObject | null>(null);
  const [selectedPipelineStep, setSelectedPipelineStep] = useState<number | null>(null);
  const [scaleWorkload, setScaleWorkload] = useState(1000);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const isTransitioningRef = useRef(false);

  const goToChapter = useCallback((index: number) => {
    if (index < 0 || index >= CHAPTERS.length || index === currentChapter) return;
    setCurrentChapter(index);
    playClickSound();

    isTransitioningRef.current = true;
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 600);
  }, [currentChapter]);

  // Wheel & Keyboard progression
  useEffect(() => {
    let accumulatedDelta = 0;
    let timer: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      if (isTransitioningRef.current) return;
      accumulatedDelta += e.deltaY;
      clearTimeout(timer);
      timer = setTimeout(() => { accumulatedDelta = 0; }, 180);

      if (accumulatedDelta > 45) {
        accumulatedDelta = 0;
        if (currentChapter < CHAPTERS.length - 1) goToChapter(currentChapter + 1);
      } else if (accumulatedDelta < -45) {
        accumulatedDelta = 0;
        if (currentChapter > 0) goToChapter(currentChapter - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        if (currentChapter < CHAPTERS.length - 1) goToChapter(currentChapter + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (currentChapter > 0) goToChapter(currentChapter - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [currentChapter, goToChapter]);

  // Auto-step simulation for scale test
  useEffect(() => {
    if (currentChapter === 3) {
      const interval = setInterval(() => {
        setScaleWorkload((prev) => (prev >= 100000 ? 1000 : prev * 10));
      }, 2400);
      return () => clearInterval(interval);
    }
  }, [currentChapter]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    playPopSound();
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050811] text-white overflow-hidden select-none font-sans">
      
      {/* Industrial Grid & Ambient Conduit Backdrops */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Persistent System Header HUD */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/10 bg-[#050811]/90 backdrop-blur-xl font-mono text-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => goToChapter(0)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="size-6 rounded-md bg-white text-black font-black flex items-center justify-center text-xs">
              P
            </div>
            <span className="font-bold tracking-wider text-white uppercase text-[11px] sm:text-xs">
              PAVAN KUMAR <span className="text-neutral-500 hidden sm:inline">/// AUTOMATION ARCHITECTURE ENGINE</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ENGINE LIVE · {CHAPTERS[currentChapter].title}</span>
          </div>

          <Link
            to="/projects"
            className="hidden md:inline-flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
          >
            <span>Case Studies ↗</span>
          </Link>
        </div>
      </header>

      {/* Main Chapter Canvas Area */}
      <main className="relative w-full h-full pt-14 pb-12 overflow-hidden flex flex-col items-center justify-center px-4 sm:px-8 lg:px-14">
        <AnimatePresence mode="wait">
          
          {/* ==========================================
              CHAPTER 01: ENTERPRISE CHAOS
          =========================================== */}
          {currentChapter === 0 && (
            <motion.section
              key="chapter-chaos"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-6xl mx-auto flex flex-col justify-between h-full py-4 space-y-4"
            >
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#f59e0b] px-3 py-1 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10">
                  <span className="size-2 rounded-full bg-[#f59e0b] animate-ping" />
                  <span>CHAPTER 01 /// UNSTRUCTURED ENTERPRISE DEBRIS</span>
                </div>
                <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                  Give The Machine Chaos. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] via-rose-400 to-white">
                    Watch It Become Infrastructure.
                  </span>
                </h1>
                <p className="text-xs sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
                  Every enterprise begins here: unparsed PDFs, unassigned lead emails, duplicate SQL shards, and timeout webhooks. Hover to inspect failure payloads.
                </p>
              </div>

              {/* Chaos Objects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 my-auto">
                {CHAOS_OBJECTS.map((obj) => (
                  <motion.div
                    key={obj.id}
                    onMouseEnter={() => {
                      playHoverSound();
                      setHoveredObject(obj);
                    }}
                    onMouseLeave={() => setHoveredObject(null)}
                    whileHover={{ y: -4, borderColor: "#f59e0b" }}
                    className={`p-4 rounded-2xl border bg-neutral-950/80 backdrop-blur-xl shadow-xl transition-all cursor-crosshair relative overflow-hidden ${
                      obj.status === "error"
                        ? "border-rose-500/40 bg-rose-950/10"
                        : obj.status === "missing_fields"
                        ? "border-amber-500/40 bg-amber-950/10"
                        : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] mb-2">
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-neutral-400 uppercase">
                        {obj.type}
                      </span>
                      <span className={`font-bold uppercase ${obj.status === "error" ? "text-rose-400" : "text-amber-400"}`}>
                        ● {obj.status.replace("_", " ")}
                      </span>
                    </div>

                    <h2 className="text-xs sm:text-sm font-bold text-white truncate mb-1">{obj.name}</h2>
                    <span className="text-[10px] font-mono text-neutral-400 block mb-2">{obj.source}</span>

                    {obj.errorMsg && (
                      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono text-rose-300">
                        ⚠ {obj.errorMsg}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Live Hovered Payload Inspector */}
              {hoveredObject && hoveredObject.fields && (
                <div className="p-3 rounded-xl bg-neutral-950/90 border border-amber-500/40 font-mono text-[11px] flex flex-wrap items-center justify-between gap-3 text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">INSPECTING PAYLOAD:</span>
                    <span className="text-white font-bold">{hoveredObject.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-neutral-400 text-[10px]">
                    {Object.entries(hoveredObject.fields).map(([k, v]) => (
                      <span key={k}><strong className="text-neutral-200">{k}:</strong> {v}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Prompt */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                <span className="text-neutral-500">6 UNRESOLVED BOTTLENECKS DETECTED</span>
                <button
                  type="button"
                  onMouseEnter={playHoverSound}
                  onClick={() => goToChapter(1)}
                  className="px-6 py-2.5 rounded-full bg-[#f59e0b] hover:bg-white text-black font-bold transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer"
                >
                  Initiate System Analysis →
                </button>
              </div>
            </motion.section>
          )}

          {/* ==========================================
              CHAPTER 02: THE SYSTEM FINDS SIGNAL
          =========================================== */}
          {currentChapter === 1 && (
            <motion.section
              key="chapter-signal"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-6xl mx-auto flex flex-col justify-between h-full py-4 space-y-4"
            >
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#00f0ff] px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10">
                  <span className="size-2 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span>CHAPTER 02 /// RECOGNITION & CLASSIFICATION</span>
                </div>
                <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                  The System Finds Signal.
                </h1>
                <p className="text-xs sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
                  Every unparsed artifact is automatically routed to an extraction node: PDF $\rightarrow$ LHDN Tax Parser, Email $\rightarrow$ Intent Vector Classifier, Audio $\rightarrow$ Real-time STT Tokenizer.
                </p>
              </div>

              {/* Signal Extraction Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto font-mono text-xs">
                
                {/* PDF Stream */}
                <div className="p-5 rounded-2xl border border-[#00f0ff]/40 bg-neutral-950/80 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#00f0ff] font-bold">OCR PARSER NODE</span>
                    <span className="text-emerald-400">99.4% CONFIDENCE</span>
                  </div>
                  <div className="text-sm font-bold text-white">INV_2025_48102.pdf</div>
                  <div className="space-y-1 text-[11px] text-neutral-300 bg-black/60 p-3 rounded-xl border border-white/10">
                    <div>EXTRACT: <span className="text-[#00f0ff]">Total: $14,820.00</span></div>
                    <div>SCHEMA: <span className="text-emerald-400">LHDN e-Invoice v1.0</span></div>
                    <div>STATUS: <span className="text-emerald-400">VALIDATED ✓</span></div>
                  </div>
                </div>

                {/* Email Lead Stream */}
                <div className="p-5 rounded-2xl border border-purple-500/40 bg-neutral-950/80 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-purple-400 font-bold">INTENT CLASSIFIER</span>
                    <span className="text-emerald-400">AUTO-CLASSIFIED</span>
                  </div>
                  <div className="text-sm font-bold text-white">Inbound Lead: SLA Quote</div>
                  <div className="space-y-1 text-[11px] text-neutral-300 bg-black/60 p-3 rounded-xl border border-white/10">
                    <div>INTENT: <span className="text-purple-400">Enterprise Procurement</span></div>
                    <div>ACTION: <span className="text-[#00f0ff]">Draft CRM Quote</span></div>
                    <div>ROUTED: <span className="text-emerald-400">Executive Queue ✓</span></div>
                  </div>
                </div>

                {/* Audio Stream */}
                <div className="p-5 rounded-2xl border border-emerald-500/40 bg-neutral-950/80 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-bold">WEBRTC VOICE AGENT</span>
                    <span className="text-[#00f0ff]">&lt;500ms LATENCY</span>
                  </div>
                  <div className="text-sm font-bold text-white">Call_Rec_20250818.wav</div>
                  <div className="space-y-1 text-[11px] text-neutral-300 bg-black/60 p-3 rounded-xl border border-white/10">
                    <div>AUDIO: <span className="text-emerald-400">16kHz PCM Stream</span></div>
                    <div>WHISPER: <span className="text-white">"Need quote confirmation..."</span></div>
                    <div>SYNTHESIS: <span className="text-emerald-400">Real-Time Output ✓</span></div>
                  </div>
                </div>

              </div>

              {/* Action Prompt */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                <span className="text-[#00f0ff]">3/3 PROTOCOLS CONVERTED TO STRUCTURED JSON</span>
                <button
                  type="button"
                  onMouseEnter={playHoverSound}
                  onClick={() => goToChapter(2)}
                  className="px-6 py-2.5 rounded-full bg-[#00f0ff] hover:bg-white text-black font-bold transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
                >
                  Build Automation Pipeline →
                </button>
              </div>
            </motion.section>
          )}

          {/* ==========================================
              CHAPTER 03: AUTOMATION ARCHITECTURE EMERGES
          =========================================== */}
          {currentChapter === 2 && (
            <motion.section
              key="chapter-architecture"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-6xl mx-auto flex flex-col justify-between h-full py-4 space-y-4"
            >
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CHAPTER 03 /// END-TO-END PIPELINE ARCHITECTURE</span>
                </div>
                <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                  Architecture Emerges.
                </h1>
                <p className="text-xs sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
                  The discovered connections physically lock into a live 6-stage industrial automation engine. Click any node to inspect execution telemetry.
                </p>
              </div>

              {/* 6-Stage Pipeline Rail */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 my-auto font-mono text-xs">
                {PIPELINE_STAGES.map((stg, i) => {
                  const isSelected = selectedPipelineStep === i;

                  return (
                    <button
                      key={stg.step}
                      type="button"
                      onMouseEnter={playHoverSound}
                      onClick={() => {
                        playClickSound();
                        setSelectedPipelineStep(isSelected ? null : i);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[140px] cursor-pointer backdrop-blur-xl relative overflow-hidden ${
                        isSelected
                          ? "border-[#00f0ff] bg-[#00f0ff]/15 shadow-[0_0_25px_rgba(0,240,255,0.4)] scale-105"
                          : "border-white/15 bg-neutral-950/70 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#00f0ff] font-bold">{stg.step}</span>
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                      </div>

                      <div className="space-y-1 my-auto">
                        <div className="font-bold text-white text-xs leading-snug">{stg.name}</div>
                        <div className="text-[9px] text-neutral-400 truncate">{stg.tech}</div>
                      </div>

                      <div className="text-[10px] text-emerald-400 font-bold border-t border-white/10 pt-1.5 flex items-center justify-between">
                        <span>{stg.latency}</span>
                        <span className="text-neutral-500 text-[9px]">ACTIVE</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Node Inspector Drawer */}
              {selectedPipelineStep !== null && (
                <div className="p-4 rounded-2xl bg-neutral-950/90 border border-[#00f0ff]/40 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-[#00f0ff] text-black font-bold text-[10px]">
                      STAGE {PIPELINE_STAGES[selectedPipelineStep].step}
                    </span>
                    <span className="text-white font-bold">{PIPELINE_STAGES[selectedPipelineStep].name}</span>
                    <span className="text-neutral-400 hidden sm:inline">({PIPELINE_STAGES[selectedPipelineStep].tech})</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-emerald-400 font-bold">
                    <span>LATENCY: {PIPELINE_STAGES[selectedPipelineStep].latency}</span>
                    <span>THROUGHPUT: {PIPELINE_STAGES[selectedPipelineStep].throughput}</span>
                  </div>
                </div>
              )}

              {/* Action Prompt */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                <span className="text-emerald-400">ALL 6 NODES SYNCHRONIZED & READY</span>
                <button
                  type="button"
                  onMouseEnter={playHoverSound}
                  onClick={() => goToChapter(3)}
                  className="px-6 py-2.5 rounded-full bg-emerald-400 hover:bg-white text-black font-bold transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer"
                >
                  Run Scale Stress Test →
                </button>
              </div>
            </motion.section>
          )}

          {/* ==========================================
              CHAPTER 04: SCALE STRESS TEST
          =========================================== */}
          {currentChapter === 3 && (
            <motion.section
              key="chapter-scale"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-6xl mx-auto flex flex-col justify-between h-full py-4 space-y-4"
            >
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10">
                  <span className="size-2 rounded-full bg-purple-400 animate-ping" />
                  <span>CHAPTER 04 /// CONCURRENT WORKLOAD STRESS TEST</span>
                </div>
                <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                  The Scale Test.
                </h1>
                <p className="text-xs sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
                  Automation is not just making one task work. It is making the architecture survive scale. Watch dynamic worker threads scale effortlessly.
                </p>
              </div>

              {/* Stress Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto font-mono text-xs">
                
                {/* Current Throughput */}
                <div className="p-6 rounded-2xl border border-purple-500/40 bg-neutral-950/80 backdrop-blur-xl space-y-3">
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">CURRENT WORKLOAD</span>
                  <div className="text-3xl sm:text-4xl font-black text-white">{scaleWorkload.toLocaleString()} <span className="text-sm font-normal text-neutral-400">ops/sec</span></div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-[#00f0ff] h-full"
                      animate={{ width: `${Math.min(100, (scaleWorkload / 100000) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Queue Health */}
                <div className="p-6 rounded-2xl border border-emerald-500/40 bg-neutral-950/80 backdrop-blur-xl space-y-3">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">QUEUE HEALTH & RETRIES</span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400">0 ERRORS</div>
                  <p className="text-[11px] text-neutral-300">Exponential backoff active · Zero packet drops across Redis queue</p>
                </div>

                {/* Parallel Capacity */}
                <div className="p-6 rounded-2xl border border-[#00f0ff]/40 bg-neutral-950/80 backdrop-blur-xl space-y-3">
                  <span className="text-[10px] text-[#00f0ff] font-bold uppercase tracking-wider block">WORKER THREADS</span>
                  <div className="text-3xl sm:text-4xl font-black text-white">64 THREADS</div>
                  <p className="text-[11px] text-neutral-300">Autoscaled via async asyncio & background Celery workers</p>
                </div>

              </div>

              {/* Action Prompt */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                <span className="text-purple-400">100,000+ OPS EXECUTED WITH ZERO SYSTEM BOTTLENECKS</span>
                <button
                  type="button"
                  onMouseEnter={playHoverSound}
                  onClick={() => goToChapter(4)}
                  className="px-6 py-2.5 rounded-full bg-purple-500 hover:bg-white text-black font-bold transition-all shadow-[0_0_25px_rgba(168,85,247,0.4)] cursor-pointer"
                >
                  View Audited Outcomes →
                </button>
              </div>
            </motion.section>
          )}

          {/* ==========================================
              CHAPTER 05: BUSINESS IMPACT
          =========================================== */}
          {currentChapter === 4 && (
            <motion.section
              key="chapter-impact"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-6xl mx-auto flex flex-col justify-between h-full py-4 space-y-4"
            >
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CHAPTER 05 /// AUDITED ENTERPRISE ROI</span>
                </div>
                <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                  Business Impact.
                </h1>
                <p className="text-xs sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
                  Real numbers emerging directly from production engineering deployments at Datamarketeers and client architectures.
                </p>
              </div>

              {/* 4 Core Impact Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-auto font-mono text-xs">
                
                <div className="p-5 rounded-2xl border border-white/15 bg-neutral-950/80 space-y-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">VOLUME PROCESSED</span>
                  <div className="text-2xl sm:text-4xl font-black text-white">42,381+</div>
                  <p className="text-[11px] text-neutral-400 font-sans">Monthly e-invoice & lead documents</p>
                </div>

                <div className="p-5 rounded-2xl border border-[#00f0ff]/30 bg-neutral-950/80 space-y-2">
                  <span className="text-[10px] text-[#00f0ff] uppercase tracking-widest block">AUTOMATION RATE</span>
                  <div className="text-2xl sm:text-4xl font-black text-[#00f0ff]">98.7%</div>
                  <p className="text-[11px] text-neutral-400 font-sans">End-to-end autonomous execution</p>
                </div>

                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-neutral-950/80 space-y-2">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest block">LATENCY REDUCTION</span>
                  <div className="text-2xl sm:text-4xl font-black text-emerald-400">3.2h → 11m</div>
                  <p className="text-[11px] text-neutral-400 font-sans">94% reduction in turnaround time</p>
                </div>

                <div className="p-5 rounded-2xl border border-purple-500/30 bg-neutral-950/80 space-y-2">
                  <span className="text-[10px] text-purple-400 uppercase tracking-widest block">CAREER RECOGNITION</span>
                  <div className="text-2xl sm:text-4xl font-black text-purple-400">2x Promo</div>
                  <p className="text-[11px] text-neutral-400 font-sans">Double promotion in 4 months</p>
                </div>

              </div>

              {/* Action Prompt */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                <span className="text-emerald-400">PROVEN TRACK RECORD ACROSS ALL PRODUCTION WORKLOADS</span>
                <button
                  type="button"
                  onMouseEnter={playHoverSound}
                  onClick={() => goToChapter(5)}
                  className="px-6 py-2.5 rounded-full bg-emerald-400 hover:bg-white text-black font-bold transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer"
                >
                  Enter Control Room →
                </button>
              </div>
            </motion.section>
          )}

          {/* ==========================================
              CHAPTER 06: THE ARCHITECT'S CONTROL ROOM
          =========================================== */}
          {currentChapter === 5 && (
            <motion.section
              key="chapter-control"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-5xl mx-auto flex flex-col justify-between h-full py-4 space-y-4 text-center items-center"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#00f0ff] px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10">
                  <span className="size-2 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span>CHAPTER 06 /// OPERATIONAL MISSION CONTROL</span>
                </div>
                <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                  The Architect Designs <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-teal-300 to-white">
                    Systems That Operate.
                  </span>
                </h1>
                <p className="text-xs sm:text-base text-neutral-300 max-w-xl mx-auto font-normal leading-relaxed">
                  Ready to deploy autonomous architectures, real-time voice agents, or discuss an engineering role?
                </p>
              </div>

              {/* 1-Tap Action Center */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 font-mono text-xs my-auto">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#00f0ff] transition-colors">
                  <span className="text-[#00f0ff]">✉</span>
                  <a href={`mailto:${profile.email}`} className="text-white font-bold hover:text-[#00f0ff]">{profile.email}</a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(profile.email, "email")}
                    className="text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-black/50 border border-white/10 cursor-pointer ml-1"
                  >
                    {copiedType === "email" ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400 transition-colors">
                  <span className="text-emerald-400">📱</span>
                  <a href={`tel:${profile.phone}`} className="text-white font-bold hover:text-emerald-400">{profile.phone}</a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(profile.phone, "phone")}
                    className="text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-black/50 border border-white/10 cursor-pointer ml-1"
                  >
                    {copiedType === "phone" ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                <a
                  href="/Pavan_Resume.pdf"
                  download="Pavan_Kumar_Resume.pdf"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-200 hover:text-white hover:border-[#00f0ff] transition-colors"
                >
                  <span>📜 Download Résumé PDF</span>
                </a>
              </div>

              {/* Primary Direct CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-mono text-xs">
                <Link
                  to="/contact"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                  className="px-8 py-3.5 rounded-full bg-[#00f0ff] text-black font-bold hover:bg-white transition-all shadow-[0_0_35px_rgba(0,240,255,0.45)] hover:scale-105"
                >
                  Direct Message Channel →
                </Link>

                <Link
                  to="/projects"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                  className="px-8 py-3.5 rounded-full bg-white/5 border border-white/15 text-white font-bold hover:border-[#00f0ff] hover:text-[#00f0ff] transition-all backdrop-blur-xl hover:scale-105"
                >
                  Deep-Dive 4 Case Studies 🚀
                </Link>
              </div>

              {/* Reset to Chapter 1 */}
              <div className="pt-3 border-t border-white/10 w-full flex items-center justify-between font-mono text-xs">
                <span className="text-neutral-500">PAVAN KUMAR /// AUTOMATION ARCHITECT {new Date().getFullYear()}</span>
                <button
                  type="button"
                  onMouseEnter={playHoverSound}
                  onClick={() => goToChapter(0)}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-[11px]"
                >
                  ↑ Replay From Chapter 01
                </button>
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </main>

      {/* Floating Tactical Timeline Scrubber (Right on Desktop, Bottom on Mobile) */}
      <nav className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-2.5 pointer-events-auto">
        {CHAPTERS.map((chap, idx) => {
          const isActive = currentChapter === idx;

          return (
            <button
              key={chap.id}
              type="button"
              onMouseEnter={playHoverSound}
              onClick={() => goToChapter(idx)}
              className="group flex items-center gap-3 p-1 cursor-pointer"
            >
              <span
                className={`font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${
                  isActive ? "text-[#00f0ff] font-bold opacity-100" : "text-neutral-500 opacity-0 group-hover:opacity-100"
                }`}
              >
                {chap.num} {chap.title.split(" ")[0]}
              </span>
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-8 h-1.5 bg-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.8)]"
                    : "w-2 h-1.5 bg-white/20 group-hover:bg-white/50 group-hover:w-4"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Chapter Dots */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex md:hidden items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/90 border border-white/15 backdrop-blur-xl pointer-events-auto">
        {CHAPTERS.map((chap, idx) => {
          const isActive = currentChapter === idx;

          return (
            <button
              key={chap.id}
              type="button"
              onClick={() => goToChapter(idx)}
              aria-label={`Jump to ${chap.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive ? "w-6 bg-[#00f0ff]" : "w-1.5 bg-white/30"
              }`}
            />
          );
        })}
      </div>

    </div>
  );
}
