import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { playClickSound, playHoverSound } from "../lib/sound";

const MODES = [
  { id: "ai", title: "AI Automation Architect", stat: "10M+ Workflows", desc: "Building autonomous AI pipelines that eliminate manual labor." },
  { id: "voice", title: "Voice AI & Speech Specialist", stat: "99.4% Transcribe Acc", desc: "Deploying Whisper & real-time conversational voice agents." },
  { id: "webgl", title: "3D & Web Architect", stat: "60 FPS Performance", desc: "Crafting immersive WebGL graphics & high-converting web apps." },
];

export default function PipelineHero() {
  const [activeMode, setActiveMode] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="top" className="relative overflow-hidden min-h-screen flex items-center justify-center pt-20 sm:pt-24 pb-14 sm:pb-16">
      <div className="dotgrid absolute inset-0 opacity-60" aria-hidden />

      <div className="relative z-20 text-center px-4 sm:px-6 max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* Live Cyber Telemetry Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#00f0ff]/40 bg-panel/90 text-[11px] sm:text-xs font-mono text-fg backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,255,0.25)]"
        >
          <span className="relative flex size-2 sm:size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 sm:size-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-bold text-[#00f0ff]">LIVE STATUS</span>
          <span className="text-mut/40">•</span>
          <span className="text-fg font-semibold">BANGALORE, IN</span>
          <span className="text-mut/40">•</span>
          <span className="text-emerald-400 font-bold">{currentTime || "18:12 IST"}</span>
        </motion.div>

        {/* Massive Kinetic Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 sm:mb-6 w-full"
        >
          <h1
            className="font-black leading-none tracking-tighter text-fg uppercase select-none flex flex-wrap items-center justify-center gap-[0.2em]"
            style={{ fontSize: "clamp(2.2rem, 9vw, 8rem)" }}
          >
            <span className="text-fg drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]">PAVAN</span>
            <span className="kinetic-gradient">KUMAR</span>
          </h1>
        </motion.div>

        {/* Dynamic Mode Switcher Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-3xl my-4 sm:my-6"
        >
          {MODES.map((mode, idx) => (
            <button
              key={mode.id}
              onMouseEnter={playHoverSound}
              onClick={() => {
                playClickSound();
                setActiveMode(idx);
              }}
              className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                activeMode === idx
                  ? "border-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_20px_rgba(0,240,255,0.3)] sm:scale-105"
                  : "border-line bg-panel-light/30 hover:border-white/30 text-mut opacity-70"
              }`}
            >
              <div className="font-mono text-xs font-bold text-fg flex items-center justify-between">
                <span>{mode.title}</span>
                {activeMode === idx && <span className="size-1.5 rounded-full bg-[#00f0ff] animate-pulse" />}
              </div>
              <div className="font-mono text-[10px] text-[#00f0ff] mt-1 font-semibold">{mode.stat}</div>
            </button>
          ))}
        </motion.div>

        {/* Mode Summary Description */}
        <motion.p
          key={activeMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl text-sm sm:text-base text-mut leading-relaxed my-3 sm:my-4 min-h-[40px] sm:min-h-[48px]"
        >
          {MODES[activeMode].desc}
        </motion.p>

        {/* High-Impact Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4 mb-6 sm:mb-8 w-full sm:w-auto"
        >
          <a
            href="#pipeline-simulator"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm text-ink bg-[#00f0ff] hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:scale-105 text-center"
          >
            <span className="flex items-center justify-center gap-2">
              ⚡ Test Interactive Simulator <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </a>

          <Link
            to="/projects"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm text-fg bg-panel/80 border border-line hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all duration-300 backdrop-blur-md hover:scale-105 text-center"
          >
            🚀 View All Engineering Projects
          </Link>
        </motion.div>

        {/* Carried Energy Stream / Morph Conduit into Concept section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col items-center gap-2 pt-2 sm:pt-4"
        >
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-[#00f0ff]/70 uppercase">
            CONTINUOUS ARCHITECTURE STREAM
          </span>
          <div className="relative w-px h-12 sm:h-16 bg-gradient-to-b from-[#00f0ff] via-[#00f0ff]/50 to-transparent flex items-center justify-center">
            <div className="absolute top-0 size-2 rounded-full bg-[#00f0ff] blur-[2px] animate-pulse" />
          </div>
        </motion.div>
      </div>
    </header>
  );
}
