import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playHoverSound, playPopSound } from "../lib/sound";

interface Stage {
  id: string;
  name: string;
  badge: string;
  input: string;
  process: string;
  output: string;
  latency: string;
  status: string;
}

const STAGES: Stage[] = [
  {
    id: "ingestion",
    name: "01 /// Multi-Modal Ingestion",
    badge: "STAGE 1",
    input: "RAW STREAM: PDF/XLSX Invoices + WebRTC Real-Time Audio (16kHz PCM)",
    process: "Stream buffering, header validation, OCR tokenization & silence suppression",
    output: "Clean Byte Buffer & Spectrogram Payload",
    latency: "14ms",
    status: "INGESTING",
  },
  {
    id: "transformation",
    name: "02 /// Transformer AI Core",
    badge: "STAGE 2",
    input: "Clean Byte Buffer Payload",
    process: "LLaMA 3.1 70B & Groq Whisper token inference, schema extraction & semantic RAG lookup",
    output: "Structured JSON Schema (LHDN Tax Compliant / Intent Action)",
    latency: "185ms",
    status: "INFERENCE",
  },
  {
    id: "execution",
    name: "03 /// Enterprise Action & Dispatch",
    badge: "STAGE 3",
    input: "Structured JSON Schema",
    process: "PostgreSQL ACID transaction, Microsoft Graph automated draft, ElevenLabs voice synthesis",
    output: "2,000+ Docs Filed · CRM Updated · Audio Transmitted",
    latency: "42ms",
    status: "DISPATCHED",
  },
];

export default function ScrollPipelineLab() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-step pulse cycle
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isRunning]);

  const activeStage = STAGES[activeStageIndex];

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-zinc-100 px-4 sm:px-6 lg:px-12 py-20 select-none overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] bg-white/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center space-y-8 lg:space-y-12">
        
        {/* Section Telemetry Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/5 text-zinc-200 font-mono text-xs tracking-widest uppercase">
            <span className="size-2 rounded-full bg-zinc-300 animate-pulse" />
            <span>INTERACTIVE ARCHITECTURE LAB</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
            The Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">Pipeline Core</span>
          </h2>

          <p className="text-xs sm:text-base text-neutral-400 max-w-xl leading-relaxed font-sans">
            Scrub through the end-to-end data transformation cycle powering production enterprise workloads.
          </p>
        </div>

        {/* 3-Stage Interactive Stepper Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
          {STAGES.map((stg, i) => {
            const isActive = activeStageIndex === i;

            return (
              <button
                key={stg.id}
                type="button"
                onMouseEnter={playHoverSound}
                onClick={() => {
                  playClickSound();
                  setIsRunning(false);
                  setActiveStageIndex(i);
                }}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 text-left cursor-pointer relative overflow-hidden backdrop-blur-xl ${
                  isActive
                    ? "bg-neutral-900/90 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                    : "bg-neutral-950/50 border-white/10 hover:border-white/20 text-neutral-400"
                }`}
              >
                {/* Active Progress Line */}
                {isActive && (
                  <motion.div
                    layoutId="stage-active-line"
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white via-zinc-400 to-zinc-600"
                  />
                )}

                <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs mb-2">
                  <span className={isActive ? "text-zinc-200 font-bold" : "text-neutral-500"}>
                    {stg.badge}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
                    <span className="text-[9px] uppercase tracking-wider">{stg.status}</span>
                  </span>
                </div>

                <h3 className={`text-sm sm:text-base font-black tracking-tight ${isActive ? "text-white" : "text-neutral-300"}`}>
                  {stg.name.split("///")[1]?.trim() || stg.name}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Real-Time Stage Visualizer Deck */}
        <div className="w-full rounded-3xl border border-white/15 bg-neutral-950/80 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6 sm:space-y-8 relative overflow-hidden">
          
          {/* Deck Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="size-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white font-bold tracking-wider uppercase">{activeStage.name}</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-neutral-500 hidden sm:inline">PROCESSING TIME:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-200 font-bold">
                ⚡ {activeStage.latency}
              </span>
            </div>
          </div>

          {/* Interactive Payload Transformation Flow */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 font-mono text-xs"
            >
              {/* Input Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Input Payload</span>
                <p className="text-white font-sans text-xs sm:text-sm font-medium leading-relaxed">
                  {activeStage.input}
                </p>
              </div>

              {/* Transformation Logic */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/15 space-y-2">
                <span className="text-[10px] text-zinc-300 uppercase tracking-widest block font-bold">Core Processing Logic</span>
                <p className="text-neutral-200 font-sans text-xs sm:text-sm font-medium leading-relaxed">
                  {activeStage.process}
                </p>
              </div>

              {/* Output Result */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest block font-bold">Guaranteed Outcome</span>
                <p className="text-white font-sans text-xs sm:text-sm font-bold leading-relaxed">
                  {activeStage.output}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Live Diagnostic Console */}
          <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-[11px] text-neutral-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-zinc-200 font-bold">EXECUTION LOG:</span>
              <span className="text-neutral-300 truncate">
                Payload validated · schema matches strict enterprise compliance · zero dropped frames
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  setIsRunning((prev) => !prev);
                }}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer text-[10px]"
              >
                {isRunning ? "⏸ Pause Cycle" : "▶ Resume Auto-Cycle"}
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
