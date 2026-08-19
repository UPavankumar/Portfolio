import { useState } from "react";
import { Link } from "react-router-dom";
import { playClickSound, playHoverSound } from "../../lib/sound";

interface BentoCardProps {
  title: string;
  category: string;
  metric: string;
  metricLabel: string;
  description: string;
  tags: string[];
  accentColor: string;
  children?: React.ReactNode;
}

function SpotlightBentoCard({
  title,
  category,
  metric,
  metricLabel,
  description,
  tags,
  accentColor,
  children,
}: BentoCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={playHoverSound}
      className="relative p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-neutral-950/70 backdrop-blur-2xl overflow-hidden flex flex-col justify-between space-y-6 group transition-all duration-300 hover:border-white/20"
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.12), transparent 80%)`,
        }}
      />

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs">
          <span className={`font-bold tracking-widest uppercase ${accentColor}`}>
            {category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-400">
            PRODUCTION
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#38bdf8] transition-colors leading-snug">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed font-normal">
          {description}
        </p>

        {children}
      </div>

      <div className="relative z-10 pt-4 border-t border-white/[0.08] space-y-3 font-mono">
        <div className="flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-black text-white">{metric}</span>
          <span className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider">{metricLabel}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((t) => (
            <span
              key={t}
              className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-neutral-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LinearBentoGrid() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto overflow-hidden">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
        <div>
          <span className="font-mono text-xs text-[#38bdf8] uppercase tracking-[0.25em] block mb-2">
            CORE COMPETENCIES & ARCHITECTURES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Engineered For Scale.
          </h2>
        </div>

        <Link
          to="/projects"
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.03] text-xs font-mono text-white hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all backdrop-blur-xl"
        >
          <span>Explore All 4 Case Studies →</span>
        </Link>
      </div>

      {/* 4-Card Spotlight Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Card 1: Real-Time Voice AI */}
        <SpotlightBentoCard
          title="Real-Time Voice AI & Speech Synthesis"
          category="VOICE & WEBRTC"
          metric="<500ms"
          metricLabel="Full-Duplex Latency"
          description="Autonomous conversational voice agents with sub-second STT/TTS roundtrips, silence detection, and semantic RAG grounding."
          tags={["WebRTC", "Groq Whisper", "ElevenLabs", "FastAPI", "Python"]}
          accentColor="text-[#38bdf8]"
        >
          {/* Animated Waveform Simulator */}
          <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] flex items-center justify-between gap-1.5 h-12">
            {[40, 75, 30, 90, 60, 100, 45, 80, 25, 95, 50, 85, 35, 70, 45].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-[#38bdf8]/40 to-[#38bdf8] rounded-full animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        </SpotlightBentoCard>

        {/* Card 2: Multi-Tenant e-Invoice ETL */}
        <SpotlightBentoCard
          title="Enterprise e-Invoice & Tax ETL Engine"
          category="DATA PIPELINES & ETL"
          metric="2,000+"
          metricLabel="Monthly Invoices Filed"
          description="High-volume invoice extraction and validation engine compliant with strict Malaysian LHDN e-Invoicing tax standards."
          tags={["Pydantic v2", "Zod", "PostgreSQL", "Docling", "OCR"]}
          accentColor="text-emerald-400"
        >
          <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] font-mono text-[11px] text-emerald-300 space-y-1">
            <div className="text-neutral-400">SCHEMA VALIDATOR:</div>
            <div className="text-white">✓ LHDN Tax ID Verified</div>
            <div className="text-emerald-400">✓ 99.4% Extraction Precision</div>
          </div>
        </SpotlightBentoCard>

        {/* Card 3: Autonomous CRM & Inbound Lead Agent */}
        <SpotlightBentoCard
          title="Autonomous Lead Intelligence & CRM Sync"
          category="AI AGENTS & WORKFLOWS"
          metric="98.7%"
          metricLabel="Autonomous Routing"
          description="Inbound enterprise lead triage that parses intent, pulls corporate context, and auto-drafts tailored quotes directly into Outlook."
          tags={["Microsoft Graph", "LLaMA 3.1", "Vector DB", "Redis"]}
          accentColor="text-purple-400"
        >
          <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] font-mono text-[11px] text-purple-300 space-y-1">
            <div className="text-neutral-400">GRAPH API DISPATCH:</div>
            <div className="text-white">✓ Inbound Lead Enriched</div>
            <div className="text-purple-400">✓ Quote Auto-Drafted in Outlook</div>
          </div>
        </SpotlightBentoCard>

        {/* Card 4: High-Throughput Infrastructure */}
        <SpotlightBentoCard
          title="High-Throughput ACID Lakehouse Sync"
          category="SYSTEM ARCHITECTURE"
          metric="0ms"
          metricLabel="Data Inconsistency"
          description="Distributed event-driven architecture utilizing asynchronous message queues and ACID transactional guarantees."
          tags={["PostgreSQL 16", "Redis", "Celery", "Docker", "TypeScript"]}
          accentColor="text-amber-400"
        >
          <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] font-mono text-[11px] text-amber-300 space-y-1">
            <div className="text-neutral-400">TRANSACTION METRICS:</div>
            <div className="text-white">✓ 14,000 ops/s Normalizer</div>
            <div className="text-amber-400">✓ Zero Packet Loss (Redis Queue)</div>
          </div>
        </SpotlightBentoCard>

      </div>
    </section>
  );
}
