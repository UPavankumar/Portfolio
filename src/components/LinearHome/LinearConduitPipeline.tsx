import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playHoverSound } from "../../lib/sound";

interface PipelineStep {
  id: string;
  name: string;
  badge: string;
  input: string;
  process: string;
  output: string;
  latency: string;
  color: string;
}

const STEPS: PipelineStep[] = [
  {
    id: "ingest",
    name: "01 /// Multi-Modal Ingestion",
    badge: "STAGE 1",
    input: "Raw Streams: PDF/XLSX Invoices + WebRTC 16kHz PCM Audio",
    process: "Stream buffering, header validation, OCR tokenization & silence suppression",
    output: "Clean Normalized Byte Buffer & Spectrogram Payload",
    latency: "14ms",
    color: "from-blue-500 to-[#38bdf8]",
  },
  {
    id: "transform",
    name: "02 /// Transformer AI Core",
    badge: "STAGE 2",
    input: "Clean Normalized Byte Buffer & Dynamic RAG Context",
    process: "LLaMA 3.1 70B & Groq Whisper token inference, schema extraction & Zod validation",
    output: "Deterministic LHDN e-Invoice Tax JSON & Intent Action Payload",
    latency: "185ms",
    color: "from-[#38bdf8] to-purple-500",
  },
  {
    id: "dispatch",
    name: "03 /// Enterprise ACID Dispatch",
    badge: "STAGE 3",
    input: "Deterministic LHDN e-Invoice Tax JSON & Intent Action Payload",
    process: "PostgreSQL 16 ACID transaction, Microsoft Graph automated draft, ElevenLabs synthesis",
    output: "2,000+ Docs Filed · CRM Updated · Real-Time Audio Transmitted",
    latency: "42ms",
    color: "from-purple-500 to-emerald-400",
  },
];

export default function LinearConduitPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const current = STEPS[activeStep];

  return (
    <section id="architecture-conduit" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto overflow-hidden">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-[#38bdf8] uppercase tracking-widest">
          <span className="size-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
          <span>PRODUCTION ARCHITECTURE PIPELINE</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
          How Data Moves <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-teal-300 to-white">
            Through The Machine.
          </span>
        </h2>

        <p className="max-w-xl text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
          Interactive telemetry inspection across the end-to-end data transformation lifecycle.
        </p>
      </div>

      {/* 3 Step Selector Rails */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {STEPS.map((step, i) => {
          const isSelected = activeStep === i;

          return (
            <button
              key={step.id}
              type="button"
              onMouseEnter={playHoverSound}
              onClick={() => {
                playClickSound();
                setActiveStep(i);
              }}
              className={`p-5 rounded-2xl sm:rounded-3xl border text-left transition-all duration-300 relative overflow-hidden backdrop-blur-2xl cursor-pointer ${
                isSelected
                  ? "border-[#38bdf8] bg-neutral-900/90 shadow-[0_0_30px_rgba(56,189,248,0.2)]"
                  : "border-white/[0.08] bg-neutral-950/60 hover:border-white/20 text-neutral-400"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="linear-pipeline-glow"
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#38bdf8] to-emerald-400"
                />
              )}

              <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs mb-2">
                <span className={isSelected ? "text-[#38bdf8] font-bold" : "text-neutral-500"}>
                  {step.badge}
                </span>
                <span className="text-emerald-400 font-bold">⚡ {step.latency}</span>
              </div>

              <div className="text-sm sm:text-base font-black text-white">{step.name.split("///")[1]?.trim() || step.name}</div>
            </button>
          );
        })}
      </div>

      {/* Live Pipeline Inspection Deck */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-neutral-950/80 backdrop-blur-3xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-bold tracking-wider uppercase">{current.name}</span>
          </div>
          <span className="text-[#38bdf8] font-bold">STATUS: OPERATING IN PRODUCTION</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs"
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">Ingested Stream</span>
              <p className="text-white font-sans text-xs sm:text-sm font-medium leading-relaxed">{current.input}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#38bdf8]/5 border border-[#38bdf8]/20 space-y-2">
              <span className="text-[10px] text-[#38bdf8] uppercase tracking-widest block font-bold">Core Transformation</span>
              <p className="text-neutral-200 font-sans text-xs sm:text-sm font-medium leading-relaxed">{current.process}</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest block font-bold">Guaranteed Outcome</span>
              <p className="text-white font-sans text-xs sm:text-sm font-bold leading-relaxed">{current.output}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
}
