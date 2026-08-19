import { useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "../../data/resume";
import { playClickSound, playHoverSound, playPopSound } from "../../lib/sound";

export default function LinearCTA() {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    playPopSound();
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto overflow-hidden text-center">
      
      <div className="relative p-8 sm:p-14 md:p-20 rounded-3xl border border-white/15 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(56,189,248,0.12),rgba(255,255,255,0.02))] backdrop-blur-3xl shadow-2xl space-y-6 sm:space-y-8">
        
        {/* Luminous Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-xs font-mono text-[#38bdf8] uppercase tracking-widest shadow-[0_0_20px_rgba(56,189,248,0.2)]">
          <span className="size-2 rounded-full bg-[#38bdf8] animate-pulse" />
          <span>DIRECT EXECUTIVE CHANNEL</span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Have a Workflow That Still <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-teal-300 to-white">
              Needs Humans? Let's Fix That.
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
            Whether you need a custom voice AI agent, document processing pipeline, or LLM agent automation — reach out directly.
          </p>
        </div>

        {/* 1-Tap Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 font-mono text-xs pt-2">
          {/* Email */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#38bdf8] transition-colors">
            <span className="text-[#38bdf8]">✉</span>
            <a href={`mailto:${profile.email}`} className="text-white font-bold hover:text-[#38bdf8]">{profile.email}</a>
            <button
              type="button"
              onClick={() => copyToClipboard(profile.email, "email")}
              className="text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-black/50 border border-white/10 cursor-pointer ml-1"
            >
              {copiedType === "email" ? "✓ Copied" : "Copy"}
            </button>
          </div>

          {/* Phone */}
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
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-200 hover:text-white hover:border-[#38bdf8] transition-colors"
          >
            <span>📜 Download Résumé PDF</span>
          </a>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 font-mono text-xs sm:text-sm">
          <Link
            to="/contact"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-8 sm:px-10 py-4 rounded-full bg-white text-black font-bold hover:bg-[#38bdf8] transition-all duration-300 shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-105"
          >
            Open Contact Form →
          </Link>

          <Link
            to="/projects"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-8 sm:px-10 py-4 rounded-full bg-white/[0.04] border border-white/15 text-white font-bold hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all duration-300 backdrop-blur-xl hover:scale-105"
          >
            Inspect Case Studies 🚀
          </Link>
        </div>

      </div>

      {/* Footer Copyright & Links */}
      <footer className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} {profile.name} · All Architectures Operating 24/7</p>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>·</span>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <span>·</span>
          <Link to="/projects" className="hover:text-white transition-colors">Work</Link>
          <span>·</span>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </footer>

    </section>
  );
}
