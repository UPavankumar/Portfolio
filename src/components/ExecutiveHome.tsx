import { Link } from "react-router-dom";
import { profile } from "../data/resume";
import { playClickSound, playHoverSound } from "../lib/sound";
import AnimusHeroScene from "./AnimusHeroScene";

export default function ExecutiveHome() {
  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      
      {/* Assassin's Creed Animus 3D WebGL Background Scene */}
      <AnimusHeroScene />

      {/* Subtle Dark Vignette & Atmospheric Radial Mask */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(6,8,14,0.6)_70%,rgba(6,8,14,0.95)_100%] pointer-events-none z-10" />

      {/* Main Executive Content Overlay */}
      <section className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-20 sm:py-28 min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center text-center">
        
        {/* Top Status & Role Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl text-xs font-mono text-zinc-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="uppercase tracking-wider font-medium">{profile.role}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">{profile.location}</span>
        </div>

        {/* Main Core Hook & Technical Value Proposition */}
        <div className="my-auto space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-[0_0_35px_rgba(0,0,0,0.8)]">
              Autonomous AI Systems & Enterprise Data Architecture.
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-xl text-zinc-300 leading-relaxed font-normal drop-shadow-md">
              Designing and deploying production pipelines that automate complex data processing, real-time voice interactions, and mission-critical business workflows.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs sm:text-sm">
            <Link
              to="/projects"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="px-6 py-3.5 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-105"
            >
              Explore Production Work →
            </Link>

            <a
              href="/Pavan_Resume.pdf"
              download="Pavan_Kumar_Resume.pdf"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="px-6 py-3.5 rounded-lg border border-white/15 bg-black/50 text-zinc-200 hover:text-white hover:border-zinc-400 transition-all backdrop-blur-xl hover:scale-105"
            >
              Download Résumé (PDF)
            </a>

            <Link
              to="/contact"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="px-6 py-3.5 rounded-lg border border-white/15 bg-black/50 text-zinc-200 hover:text-white hover:border-zinc-400 transition-all backdrop-blur-xl hover:scale-105"
            >
              Contact & Consult
            </Link>
          </div>
        </div>

        {/* Bottom Proof Metrics Ribbon */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/10 font-mono text-xs text-left sm:text-center">
          <div className="p-3 rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl">
            <span className="text-xl font-bold text-white block">2,000+</span>
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Docs Processed/Mo</span>
          </div>

          <div className="p-3 rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl">
            <span className="text-xl font-bold text-zinc-200 block">99.4%</span>
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Schema Accuracy</span>
          </div>

          <div className="p-3 rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl">
            <span className="text-xl font-bold text-emerald-400 block">&lt;500ms</span>
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Voice AI Latency</span>
          </div>

          <div className="p-3 rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl">
            <span className="text-xl font-bold text-purple-300 block">2x Promo</span>
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider">In 4 Months</span>
          </div>
        </div>

      </section>

    </div>
  );
}
