import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { playClickSound, playHoverSound } from "../lib/sound";

export default function HeroMinimal() {
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
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center text-center px-4 sm:px-6 md:px-12 py-24 sm:py-28 overflow-hidden">
      
      {/* Ambient Silicon Valley Radial Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(56,189,248,0.14),rgba(255,255,255,0))] pointer-events-none blur-3xl" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[250px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(168,85,247,0.1),rgba(255,255,255,0))] pointer-events-none blur-2xl" />

      {/* Top Spacer for Nav clearance */}
      <div className="w-full h-4" />

      {/* Center Hook & Core Message */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6 sm:space-y-8 my-auto">
        
        {/* Availability Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-2xl text-[11px] sm:text-xs font-mono text-neutral-300 shadow-[0_0_25px_rgba(56,189,248,0.12)] hover:border-white/20 transition-colors"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-white font-semibold">AVAILABLE FOR AI AUTOMATION & ARCHITECTURE</span>
          <span className="text-neutral-500 hidden sm:inline">•</span>
          <span className="text-[#38bdf8] font-mono font-semibold hidden sm:inline">{time || "18:45 IST"}</span>
        </motion.div>

        {/* The Magnetic Hook Headline (No Giant Name) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-3 sm:space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[1.05]">
            I Build What <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-teal-200 to-white">
              Companies Do By Hand.
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-lg text-neutral-300 font-sans font-normal leading-relaxed">
            Architecting autonomous AI pipelines, real-time voice agents, and high-throughput data systems that eliminate manual enterprise friction.
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 font-mono text-xs sm:text-sm"
        >
          <Link
            to="/projects"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-black font-bold hover:bg-[#38bdf8] transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105"
          >
            Explore Case Studies 🚀
          </Link>

          <Link
            to="/contact"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/[0.04] border border-white/15 text-white font-bold hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all duration-300 backdrop-blur-xl hover:scale-105"
          >
            Direct Inquiry →
          </Link>
        </motion.div>

      </div>

      {/* Bottom Proof Metrics Ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative z-10 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 font-mono text-xs pt-8 border-t border-white/[0.08]"
      >
        <div className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-neutral-950/60 backdrop-blur-2xl space-y-0.5">
          <span className="text-lg sm:text-2xl font-black text-white block">2,000+</span>
          <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider">Docs Processed/Mo</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-neutral-950/60 backdrop-blur-2xl space-y-0.5">
          <span className="text-lg sm:text-2xl font-black text-[#38bdf8] block">99.4%</span>
          <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider">Extraction Accuracy</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-neutral-950/60 backdrop-blur-2xl space-y-0.5">
          <span className="text-lg sm:text-2xl font-black text-emerald-400 block">&lt;500ms</span>
          <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider">Voice AI Latency</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-neutral-950/60 backdrop-blur-2xl space-y-0.5">
          <span className="text-lg sm:text-2xl font-black text-purple-400 block">2x Promo</span>
          <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider">In 4 Months</span>
        </div>
      </motion.div>

    </section>
  );
}
