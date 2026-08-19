import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { profile } from "../../data/resume";
import { playClickSound, playHoverSound } from "../../lib/sound";

interface ActProps {
  isActive: boolean;
  onNext: () => void;
}

export default function Act1Genesis({ onNext }: ActProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-12 md:p-16 text-white select-none overflow-hidden">
      
      {/* Top Telemetry Strip */}
      <div className="flex items-center justify-between z-20 font-mono text-[10px] sm:text-xs text-neutral-400">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-white font-bold tracking-widest uppercase">ACT I /// GENESIS</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-[10px]">
          <span className="hidden sm:inline">LOC: {profile.location} (IST)</span>
          <span className="text-[#00f0ff] font-semibold">STATUS: AVAILABLE</span>
        </div>
      </div>

      {/* Centerpiece: Massive Editorial Graphic Title & Kinetic Sub-layer */}
      <div className="relative z-20 my-auto flex flex-col items-center text-center max-w-5xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Monogram Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="size-14 sm:size-20 rounded-full border border-white/20 bg-neutral-950/80 backdrop-blur-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-[0_0_50px_rgba(0,240,255,0.3)] group hover:scale-105 transition-transform"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-[#00f0ff]">
            P.
          </span>
        </motion.div>

        {/* Grand Headline */}
        <div className="space-y-1 sm:space-y-2">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-black uppercase tracking-tighter text-4xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
          >
            PAVAN KUMAR
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-mono text-xs sm:text-sm md:text-base tracking-[0.3em] text-[#00f0ff] uppercase font-bold"
          >
            AI AUTOMATION ARCHITECT & ANALYST
          </motion.div>
        </div>

        {/* Narrative Prose */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs sm:text-base md:text-lg text-neutral-300 max-w-2xl font-sans font-normal leading-relaxed drop-shadow-md px-4"
        >
          I architect autonomous intelligence systems that transform manual enterprise bottlenecks into real-time, fault-tolerant production workflows.
        </motion.p>

        {/* 1-Click Action Hub */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 font-mono text-xs"
        >
          <button
            type="button"
            onMouseEnter={playHoverSound}
            onClick={() => {
              playClickSound();
              onNext();
            }}
            className="px-6 sm:px-8 py-3.5 rounded-full bg-[#00f0ff] text-black font-bold hover:bg-white transition-all shadow-[0_0_30px_rgba(0,240,255,0.45)] hover:scale-105 cursor-pointer"
          >
            Enter Cinematic Journey ↓
          </button>

          <Link
            to="/projects"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-6 sm:px-8 py-3.5 rounded-full bg-white/5 border border-white/15 hover:border-[#00f0ff] hover:text-[#00f0ff] text-white font-bold transition-all backdrop-blur-xl hover:scale-105"
          >
            Case Studies Archive ↗
          </Link>
        </motion.div>

      </div>

      {/* Bottom Frame Metric Ribbon */}
      <div className="z-20 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 border-t border-white/10 pt-4 sm:pt-6 font-mono text-xs">
        <div className="flex flex-col">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">PRODUCTION SCALE</span>
          <span className="text-sm sm:text-base font-bold text-white">2,000+ Docs/Mo</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">EXTRACTION PRECISION</span>
          <span className="text-sm sm:text-base font-bold text-[#00f0ff]">99.4% Accuracy</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">VOICE AI LATENCY</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400">&lt;500ms WebRTC</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">TRACK RECORD</span>
          <span className="text-sm sm:text-base font-bold text-purple-400">2x Promotion / 4mo</span>
        </div>
      </div>

    </div>
  );
}
