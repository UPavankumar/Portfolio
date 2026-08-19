import { motion } from "framer-motion";
import { playClickSound, playHoverSound } from "../../lib/sound";

interface ActProps {
  isActive: boolean;
  onNext: () => void;
}

const PHILOSOPHIES = [
  {
    tag: "01 / PRINCIPLE",
    title: "Determinism First",
    desc: "AI is only as good as the guardrails that constrain it. I build strict schema validation and deterministic failovers so hallucinations never touch production databases.",
    accent: "text-[#00f0ff]",
    border: "border-[#00f0ff]/30",
  },
  {
    tag: "02 / SPEED",
    title: "Sub-Second Latency",
    desc: "From WebRTC voice audio streaming to asynchronous ETL batching, every millisecond of overhead is engineered away for seamless human-computer interaction.",
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  {
    tag: "03 / IMPACT",
    title: "High-ROI Autonomy",
    desc: "I don't build tech for novelty. I engineer systems that eliminate thousands of hours of manual labor, reduce operational risk to zero, and compound business value.",
    accent: "text-purple-400",
    border: "border-purple-500/30",
  },
];

export default function Act2Philosophy({ onNext }: ActProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-12 md:p-16 text-white select-none overflow-hidden">
      
      {/* Top Telemetry Strip */}
      <div className="flex items-center justify-between z-20 font-mono text-[10px] sm:text-xs text-neutral-400">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-[#00f0ff] animate-pulse" />
          <span className="text-white font-bold tracking-widest uppercase">ACT II /// CORE CREED</span>
        </div>
        <span className="text-neutral-500 font-mono text-[10px]">SCENE INDEX: 02/05</span>
      </div>

      {/* Center Section: Editorial Headline & 3-Panel 2.5D Gallery */}
      <div className="relative z-20 my-auto w-full max-w-6xl mx-auto space-y-6 sm:space-y-10">
        
        {/* Massive Editorial Header */}
        <div className="space-y-2 text-center sm:text-left">
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-[0.25em] block">
            ENGINEERING PHILOSOPHY
          </span>
          <h2 className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95]">
            I Build What <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-teal-300 to-white">
              Companies Do By Hand.
            </span>
          </h2>
        </div>

        {/* 3 Comic-Book Style 2.5D Glass Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {PHILOSOPHIES.map((p, i) => (
            <motion.div
              key={p.tag}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onMouseEnter={playHoverSound}
              className={`p-6 sm:p-8 rounded-3xl bg-neutral-950/70 border ${p.border} backdrop-blur-2xl shadow-2xl flex flex-col justify-between space-y-6 group relative overflow-hidden`}
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 size-32 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00f0ff]/10 transition-colors" />

              <div className="space-y-3 relative z-10">
                <span className={`font-mono text-[10px] sm:text-xs font-bold tracking-widest ${p.accent}`}>
                  {p.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#00f0ff] transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed font-normal">
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-neutral-500">
                <span>VERIFIED DIRECTIVE</span>
                <span className="text-white group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Bottom Act Navigation */}
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
          <span>Act III: The Autonomous Engine</span>
          <span>↓</span>
        </button>
      </div>

    </div>
  );
}
