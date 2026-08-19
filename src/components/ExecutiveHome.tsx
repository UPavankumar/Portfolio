import { Link } from "react-router-dom";
import { profile } from "../data/resume";
import { playClickSound, playHoverSound } from "../lib/sound";

export default function ExecutiveHome() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center text-center px-4 sm:px-6 md:px-8 py-24 sm:py-32 max-w-4xl mx-auto overflow-hidden">
      
      {/* Top Status & Role Pill */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur-md text-xs font-mono text-zinc-300">
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="uppercase tracking-wider font-medium">{profile.role}</span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-400">{profile.location}</span>
      </div>

      {/* Main Core Hook & Technical Value Proposition */}
      <div className="my-auto space-y-6 sm:space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            Autonomous AI Systems & Enterprise Data Architecture.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-zinc-400 leading-relaxed font-normal">
            Designing and deploying production pipelines that automate complex data processing, real-time voice interactions, and mission-critical business workflows.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs sm:text-sm">
          <Link
            to="/projects"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-6 py-3.5 rounded-lg bg-zinc-100 text-zinc-950 font-semibold hover:bg-white transition-colors"
          >
            Explore Production Work →
          </Link>

          <a
            href="/Pavan_Resume.pdf"
            download="Pavan_Kumar_Resume.pdf"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-6 py-3.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            Download Résumé (PDF)
          </a>

          <Link
            to="/contact"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-6 py-3.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            Contact & Consult
          </Link>
        </div>
      </div>

      {/* Bottom Proof Metrics Ribbon */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-8 border-t border-zinc-800/80 font-mono text-xs text-left sm:text-center">
        <div className="p-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40">
          <span className="text-xl font-bold text-white block">2,000+</span>
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Docs Processed/Mo</span>
        </div>

        <div className="p-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40">
          <span className="text-xl font-bold text-sky-400 block">99.4%</span>
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Schema Accuracy</span>
        </div>

        <div className="p-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40">
          <span className="text-xl font-bold text-emerald-400 block">&lt;500ms</span>
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Voice AI Latency</span>
        </div>

        <div className="p-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40">
          <span className="text-xl font-bold text-zinc-200 block">2x Promo</span>
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider">In 4 Months</span>
        </div>
      </div>

    </section>
  );
}
