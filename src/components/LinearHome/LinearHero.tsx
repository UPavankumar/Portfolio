import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { profile } from "../../data/resume";
import { playClickSound, playHoverSound } from "../../lib/sound";

export default function LinearHero() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " IST"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 px-4 sm:px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
      
      {/* Linear Ambient Background Spotlight Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(56,189,248,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(168,85,247,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-6 sm:space-y-8">
        
        {/* Availability & Telemetry Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-2xl text-[11px] sm:text-xs font-mono text-neutral-300 shadow-[0_0_25px_rgba(56,189,248,0.15)] hover:border-white/20 transition-colors"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-white font-semibold">AVAILABLE FOR AI AUTOMATION & ARCHITECTURE</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400 font-mono hidden sm:inline">{profile.location}</span>
          <span className="text-neutral-500 hidden sm:inline">•</span>
          <span className="text-[#38bdf8] font-mono font-bold hidden sm:inline">{time || "18:30 IST"}</span>
        </motion.div>

        {/* Master Headline with Linear Subtle Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[1.02]">
            Architecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500">
              Autonomous Systems.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl text-neutral-300 font-sans font-normal leading-relaxed pt-2">
            I build fault-tolerant AI automation pipelines, real-time voice agents, and enterprise data infrastructure that turn manual friction into autonomous scale.
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 font-mono text-xs sm:text-sm"
        >
          <a
            href="#architecture-conduit"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-white text-black font-bold hover:bg-[#38bdf8] transition-all duration-300 shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-105 cursor-pointer"
          >
            Explore Live Architecture ↓
          </a>

          <Link
            to="/contact"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-white/[0.04] border border-white/15 text-white font-bold hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all duration-300 backdrop-blur-xl hover:scale-105"
          >
            Direct Inquiry →
          </Link>
        </motion.div>

        {/* Linear Key ROI Metric Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl pt-8 sm:pt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs"
        >
          <div className="p-4 rounded-2xl border border-white/[0.08] bg-neutral-950/60 backdrop-blur-2xl text-center space-y-1">
            <span className="text-xl sm:text-2xl font-black text-white block">2,000+</span>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider">Docs Processed/Mo</span>
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.08] bg-neutral-950/60 backdrop-blur-2xl text-center space-y-1">
            <span className="text-xl sm:text-2xl font-black text-[#38bdf8] block">99.4%</span>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider">Extraction Precision</span>
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.08] bg-neutral-950/60 backdrop-blur-2xl text-center space-y-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 block">&lt;500ms</span>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider">Voice AI Latency</span>
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.08] bg-neutral-950/60 backdrop-blur-2xl text-center space-y-1">
            <span className="text-xl sm:text-2xl font-black text-purple-400 block">2x Promo</span>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider">In 4 Months</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
