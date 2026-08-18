import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playHoverSound, playPopSound } from "../lib/sound";

interface Payload {
  id: string;
  name: string;
  type: "email" | "audio" | "pdf";
  icon: string;
  sampleText: string;
}

const SAMPLE_PAYLOADS: Payload[] = [
  {
    id: "p1",
    name: "Customer Inquiry Email",
    type: "email",
    icon: "✉️",
    sampleText: "Hi Pavan, we need an urgent AI voice assistant for our enterprise CRM.",
  },
  {
    id: "p2",
    name: "Voice Memo Recording",
    type: "audio",
    icon: "🎙️",
    sampleText: "Audio Stream: 16kHz WAV · Whisper Model Transcribing...",
  },
  {
    id: "p3",
    name: "E-Invoice Document",
    type: "pdf",
    icon: "📄",
    sampleText: "Invoice #9842 · Amount: $14,500 · GSTIN Verified",
  },
];

const STAGES = [
  { id: 0, label: "1. INGEST", desc: "Webhook / API" },
  { id: 1, label: "2. PARSE", desc: "Whisper & LLM" },
  { id: 2, label: "3. VALIDATE", desc: "Schema Check" },
  { id: 3, label: "4. EXECUTE", desc: "CRM / DB" },
  { id: 4, label: "5. COMPLETE", desc: "0 Errors" },
];

export default function PipelineSimulator() {
  const [selectedPayload, setSelectedPayload] = useState<Payload>(SAMPLE_PAYLOADS[0]);
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const runSimulation = (payload: Payload) => {
    playClickSound();
    setSelectedPayload(payload);
    setIsRunning(true);
    setActiveStage(0);
    setLog([`[${new Date().toLocaleTimeString()}] Triggering pipeline with ${payload.name}...`]);
    setExecutionTime(null);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < STAGES.length) {
        setActiveStage(current);
        playPopSound();
        setLog((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Stage ${current + 1}: ${STAGES[current].label} (${STAGES[current].desc}) - OK`,
        ]);
      } else {
        clearInterval(interval);
        setActiveStage(4);
        setIsRunning(false);
        setExecutionTime(142);
        playPopSound();
        setLog((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] 🎉 Pipeline finished in 142ms! 0 Humans Needed.`,
        ]);
      }
    }, 450);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation(SAMPLE_PAYLOADS[0]);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="pipeline-simulator" className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto border-t border-line">
      <div className="text-center mb-8 sm:mb-10">
        <span className="font-mono text-xs text-acc uppercase tracking-widest px-3 py-1 rounded-full border border-acc/30 bg-acc/10">
          Live Interactive Simulator
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mt-3 text-fg uppercase tracking-tight">
          Test The Automation Pipeline Live
        </h2>
        <p className="text-mut text-xs sm:text-base mt-2 max-w-xl mx-auto">
          Click any payload below to fire live simulated data packets through Pavan's AI workflow architecture.
        </p>
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-line bg-panel/90 p-4 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 sm:space-y-8">
        {/* Payload Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {SAMPLE_PAYLOADS.map((p) => (
            <button
              key={p.id}
              onMouseEnter={playHoverSound}
              onClick={() => runSimulation(p)}
              disabled={isRunning}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                selectedPayload.id === p.id
                  ? "border-acc bg-acc/10 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                  : "border-line bg-panel-light/40 hover:border-acc/50 hover:bg-panel-light"
              }`}
            >
              <span className="text-2xl shrink-0">{p.icon}</span>
              <div>
                <div className="font-bold text-xs sm:text-sm text-fg leading-snug">{p.name}</div>
                <div className="font-mono text-[10px] text-mut uppercase mt-0.5">{p.type} payload</div>
              </div>
            </button>
          ))}
        </div>

        {/* 5-Stage Animated Pipeline Visualizer */}
        <div className="relative py-2 sm:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3 relative z-10">
            {STAGES.map((s, idx) => {
              const isActive = activeStage >= idx;
              const isCurrent = activeStage === idx;

              return (
                <div
                  key={s.id}
                  className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-300 relative flex sm:flex-col items-center justify-between sm:justify-center gap-2 ${
                    isCurrent
                      ? "border-acc bg-acc/20 scale-[1.02] sm:scale-105 shadow-[0_0_25px_rgba(56,189,248,0.5)]"
                      : isActive
                      ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                      : "border-line bg-panel-light/30 opacity-60"
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-left sm:text-center">{s.label}</div>
                  <div className="font-mono text-[10px] text-mut text-right sm:text-center">{s.desc}</div>

                  {/* Pulsing dot indicator */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-acc animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Payload Preview & Real-Time Output Console */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 font-mono text-xs">
          {/* Payload Data */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-line bg-[#040814] space-y-2">
            <div className="text-acc font-bold flex justify-between items-center text-xs">
              <span>Input Data Stream</span>
              <span className="text-[10px] text-mut">{selectedPayload.type.toUpperCase()}</span>
            </div>
            <p className="text-mut text-xs leading-relaxed italic bg-panel/60 p-2.5 rounded border border-line/40 break-words">
              "{selectedPayload.sampleText}"
            </p>
          </div>

          {/* Real-time Logs */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-line bg-[#040814] space-y-2 flex flex-col justify-between">
            <div className="text-emerald-400 font-bold flex justify-between items-center text-xs">
              <span>Execution Logs</span>
              {executionTime && (
                <span className="text-acc text-[10px] font-bold animate-pulse">
                  ⚡ {executionTime}ms Total
                </span>
              )}
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
              <AnimatePresence>
                {log.map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] sm:text-[11px] text-fg/80 break-words"
                  >
                    {l}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
