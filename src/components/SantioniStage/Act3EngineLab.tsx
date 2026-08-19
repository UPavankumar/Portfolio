import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playHoverSound } from "../../lib/sound";

interface ActProps {
  isActive: boolean;
  onNext: () => void;
}

const PIPELINE_NODES = [
  {
    id: "ingest",
    phase: "PHASE 01",
    title: "Multi-Modal Ingestion",
    payload: "PDF/XLSX Invoices + WebRTC 16kHz Audio Stream",
    engine: "OCR tokenization, buffer alignment, audio silence suppression",
    result: "Normalized Binary Buffer & Spectrogram",
    time: "14ms",
    status: "ACTIVE",
    glow: "border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]",
  },
  {
    id: "reason",
    phase: "PHASE 02",
    title: "Transformer AI Core",
    payload: "Normalized Binary Buffer & Dynamic RAG Context",
    engine: "LLaMA 3.1 70B + Groq Whisper inference with strict JSON schema validator",
    result: "Deterministic LHDN e-Invoice & Intent JSON",
    time: "185ms",
    status: "PROCESSING",
    glow: "border-purple-500 bg-purple-500/10 text-purple-400",
  },
  {
    id: "dispatch",
    phase: "PHASE 03",
    title: "Enterprise Execution",
    payload: "Deterministic LHDN e-Invoice & Intent JSON",
    engine: "PostgreSQL ACID transaction, Microsoft Graph automated draft, ElevenLabs synthesis",
    result: "2,000+ Docs Filed · CRM Updated · Audio Out",
    time: "42ms",
    status: "TRANSMITTED",
    glow: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
  },
];

export default function Act3EngineLab({ onNext }: ActProps) {
  const [activeNode, setActiveNode] = useState(0);
  const current = PIPELINE_NODES[activeNode];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-12 md:p-16 text-white select-none overflow-hidden">
      
      {/* Top Telemetry Strip */}
      <div className="flex items-center justify-between z-20 font-mono text-[10px] sm:text-xs text-neutral-400">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold tracking-widest uppercase">ACT III /// THE AUTONOMOUS ENGINE</span>
        </div>
        <span className="text-neutral-500 font-mono text-[10px]">SCENE INDEX: 03/05</span>
      </div>

      {/* Main Engine Stage */}
      <div className="relative z-20 my-auto w-full max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-[0.25em] block">
            INTERACTIVE SYSTEM SCHEMATIC
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            How The Machine Operates.
          </h2>
        </div>

        {/* 3 Pipeline Step Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {PIPELINE_NODES.map((node, i) => {
            const isSel = activeNode === i;

            return (
              <button
                key={node.id}
                type="button"
                onMouseEnter={playHoverSound}
                onClick={() => {
                  playClickSound();
                  setActiveNode(i);
                }}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 backdrop-blur-xl relative cursor-pointer ${
                  isSel
                    ? `${node.glow} shadow-[0_0_30px_rgba(0,240,255,0.25)] scale-[1.02]`
                    : "border-white/10 bg-neutral-950/60 text-neutral-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs mb-2">
                  <span className="font-bold">{node.phase}</span>
                  <span className="text-[9px] uppercase tracking-wider">{node.status}</span>
                </div>
                <div className="text-sm sm:text-base font-black text-white">{node.title}</div>
              </button>
            );
          })}
        </div>

        {/* Large Blueprint Inspection Deck */}
        <div className="p-6 sm:p-8 rounded-3xl border border-white/15 bg-neutral-950/90 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs">
            <span className="text-white font-bold tracking-wider">{current.title} — SPECIFICATION</span>
            <span className="text-[#00f0ff] font-bold">LATENCY: {current.time}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs"
            >
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Input Payload</span>
                <p className="text-white font-sans text-xs sm:text-sm font-medium leading-relaxed">{current.payload}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#00f0ff]/5 border border-[#00f0ff]/20 space-y-1.5">
                <span className="text-[10px] text-[#00f0ff] uppercase tracking-widest block font-bold">Transformation Core</span>
                <p className="text-neutral-200 font-sans text-xs sm:text-sm font-medium leading-relaxed">{current.engine}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest block font-bold">Production Output</span>
                <p className="text-white font-sans text-xs sm:text-sm font-bold leading-relaxed">{current.result}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="z-20 flex items-center justify-between border-t border-white/10 pt-4 sm:pt-6 font-mono text-xs">
        <span className="text-neutral-500 hidden sm:inline">SWIPE OR SCROLL TO PROGRESS STORY</span>
        <button
          type="button"
          onMouseEnter={playHoverSound}
          onClick={() => {
            playClickSound();
            onNext();
          }}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-[#00f0ff] hover:text-black font-bold text-white transition-all cursor-pointer"
        >
          <span>Act IV: The Track Record</span>
          <span>↓</span>
        </button>
      </div>

    </div>
  );
}
