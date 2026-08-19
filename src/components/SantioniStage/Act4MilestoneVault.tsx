import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { playClickSound, playHoverSound } from "../../lib/sound";

interface ActProps {
  isActive: boolean;
  onNext: () => void;
}

const MILESTONES = [
  {
    role: "AI Developer / Automation Engineer",
    company: "Datamarketeers",
    period: "2024 — Present",
    tag: "DOUBLE PROMOTION",
    highlight: "Promoted twice in under 4 months for exceptional enterprise pipeline delivery.",
    impact: "Built multi-tenant e-invoice ETL processing 2,000+ monthly tax records, and deployed autonomous voice AI.",
    accent: "text-[#00f0ff]",
    border: "border-[#00f0ff]/40",
  },
  {
    role: "Associate AI Developer",
    company: "Datamarketeers",
    period: "2024",
    tag: "PROMOTION 01",
    highlight: "Engineered autonomous lead-generation agent with Microsoft Graph API & PostgreSQL.",
    impact: "Eliminated 100% of manual inbox sorting and automated personalized corporate outreach drafting.",
    accent: "text-purple-400",
    border: "border-purple-500/30",
  },
  {
    role: "AI Automation Intern",
    company: "Datamarketeers",
    period: "2024",
    tag: "INITIAL TENURE",
    highlight: "Designed multi-channel SEO & Google Workspace document generation platforms.",
    impact: "Automated content assembly with python-docx and synchronized live Google Sheets pipelines.",
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
  },
];

export default function Act4MilestoneVault({ onNext }: ActProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-12 md:p-16 text-white select-none overflow-hidden">
      
      {/* Top Telemetry Strip */}
      <div className="flex items-center justify-between z-20 font-mono text-[10px] sm:text-xs text-neutral-400">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-white font-bold tracking-widest uppercase">ACT IV /// THE TRACK RECORD</span>
        </div>
        <span className="text-neutral-500 font-mono text-[10px]">SCENE INDEX: 04/05</span>
      </div>

      {/* Center Section: 3-Card Holographic Career Deck */}
      <div className="relative z-20 my-auto w-full max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-[0.25em] block">
              ENTERPRISE TRAJECTORY
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight mt-1">
              Proven Execution.
            </h2>
          </div>

          <Link
            to="/about"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:border-[#00f0ff] hover:text-[#00f0ff] font-mono text-xs text-white transition-all backdrop-blur-xl"
          >
            <span>Full Résumé & Background →</span>
          </Link>
        </div>

        {/* 3 Holographic Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.tag}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onMouseEnter={playHoverSound}
              className={`p-6 sm:p-8 rounded-3xl bg-neutral-950/80 border ${m.border} backdrop-blur-2xl shadow-2xl flex flex-col justify-between space-y-4 group relative overflow-hidden`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className={`font-bold tracking-widest ${m.accent}`}>{m.tag}</span>
                  <span className="text-neutral-500">{m.period}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-[#00f0ff] transition-colors leading-snug">
                  {m.role}
                </h3>
                <span className="text-xs font-mono text-neutral-400 block">{m.company}</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 font-sans text-xs text-neutral-300 leading-relaxed font-normal">
                <p className="font-semibold text-white">{m.highlight}</p>
                <p className="text-neutral-400">{m.impact}</p>
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
          <span>Act V: Direct Transmission</span>
          <span>↓</span>
        </button>
      </div>

    </div>
  );
}
