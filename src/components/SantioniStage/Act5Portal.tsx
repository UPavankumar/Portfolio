import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { profile } from "../../data/resume";
import { playClickSound, playHoverSound, playPopSound } from "../../lib/sound";

interface ActProps {
  isActive: boolean;
  onReset: () => void;
}

export default function Act5Portal({ onReset }: ActProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    playPopSound();
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-12 md:p-16 text-white select-none overflow-hidden">
      
      {/* Top Telemetry Strip */}
      <div className="flex items-center justify-between z-20 font-mono text-[10px] sm:text-xs text-neutral-400">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-[#00f0ff] animate-pulse" />
          <span className="text-white font-bold tracking-widest uppercase">ACT V /// DIRECT TRANSMISSION</span>
        </div>
        <span className="text-[#00f0ff] font-mono text-[10px] font-bold">STAGE COMPLETE</span>
      </div>

      {/* Centerpiece: Executive Consultation Portal */}
      <div className="relative z-20 my-auto w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8">
        
        {/* Luminous Core Ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="size-16 sm:size-24 rounded-full border-2 border-[#00f0ff]/50 bg-[#00f0ff]/10 backdrop-blur-2xl flex items-center justify-center text-2xl sm:text-4xl shadow-[0_0_60px_rgba(0,240,255,0.4)]"
        >
          ⚡
        </motion.div>

        {/* Headline */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Let's Build Something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-teal-300 to-white">
              Extraordinary Together.
            </span>
          </h2>
          <p className="text-xs sm:text-base text-neutral-300 max-w-xl mx-auto font-sans leading-relaxed">
            Ready to automate manual workflows, deploy real-time voice agents, or discuss an engineering role?
          </p>
        </div>

        {/* 1-Tap Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 font-mono text-xs">
          {/* Email Pill */}
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

          {/* Phone Pill */}
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

          {/* Resume PDF */}
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

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 font-mono text-xs">
          <Link
            to="/contact"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-8 py-4 rounded-full bg-[#00f0ff] text-black font-bold hover:bg-white transition-all shadow-[0_0_35px_rgba(0,240,255,0.45)] hover:scale-105"
          >
            Open Direct Message Form →
          </Link>

          <Link
            to="/projects"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-8 py-4 rounded-full bg-white/5 border border-white/15 text-white font-bold hover:border-[#00f0ff] hover:text-[#00f0ff] transition-all backdrop-blur-xl hover:scale-105"
          >
            Explore 4 Case Studies 🚀
          </Link>
        </div>

      </div>

      {/* Bottom Frame Reset / Loop Trigger */}
      <div className="z-20 flex items-center justify-between border-t border-white/10 pt-4 sm:pt-6 font-mono text-xs">
        <span className="text-neutral-500">PAVAN KUMAR /// PORTFOLIO {new Date().getFullYear()}</span>
        <button
          type="button"
          onMouseEnter={playHoverSound}
          onClick={() => {
            playClickSound();
            onReset();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white text-neutral-300 hover:text-black font-bold transition-all cursor-pointer text-[11px]"
        >
          <span>↑ Replay Journey from Act I</span>
        </button>
      </div>

    </div>
  );
}
