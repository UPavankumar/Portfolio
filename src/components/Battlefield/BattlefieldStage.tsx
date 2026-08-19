import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";
import { Link } from "react-router-dom";
import { profile } from "../../data/resume";
import { playClickSound, playHoverSound, playPopSound } from "../../lib/sound";

// ==========================================
// DATA OBJECTS FOR THE BEAST COLOSSUS
// ==========================================

const BEAST_FRAGMENTS = [
  // Head / Screaming Inboxes
  { id: "b1", icon: "✉️", title: "INBOX OVERFLOW (9,999+)", type: "Email", x: 0, y: -220, rot: -4, color: "border-rose-500 bg-rose-950/40 text-rose-300" },
  // Torso / Invoice Storm & Broken Sheets
  { id: "b2", icon: "📄", title: "UNPARSED_INVOICES_500.pdf", type: "PDF", x: -220, y: -100, rot: -12, color: "border-amber-500 bg-amber-950/40 text-amber-300" },
  { id: "b3", icon: "📊", title: "#REF! TAX_CALC_FINAL.xlsx", type: "Excel", x: 220, y: -110, rot: 14, color: "border-rose-500 bg-rose-950/40 text-rose-300" },
  // Limbs / Ringing Phones & Failed Shards
  { id: "b4", icon: "📞", title: "HOLD_QUEUE (45 MINS)", type: "Voice PBX", x: -300, y: 80, rot: -8, color: "border-amber-500 bg-amber-950/40 text-amber-300" },
  { id: "b5", icon: "🗄️", title: "SQL_COLLISION_ERR", type: "Database", x: 300, y: 90, rot: 10, color: "border-rose-500 bg-rose-950/40 text-rose-300" },
  { id: "b6", icon: "⚡", title: "HTTP 504 GATEWAY TIMEOUT", type: "Webhook", x: 0, y: 140, rot: 2, color: "border-amber-500 bg-amber-950/40 text-amber-300" },
];

const BATTLE_COMBOS = [
  {
    phase: "COMBO 01",
    target: "INVOICE STORM",
    action: "EXTRACT & VALIDATE",
    result: "2,000+ e-Invoices Auto-Filed (LHDN Tax Compliant)",
    tag: "99.4% PRECISION",
    color: "text-[#00f0ff] border-[#00f0ff]/50 bg-[#00f0ff]/10",
  },
  {
    phase: "COMBO 02",
    target: "PHONE SWARM",
    action: "WEBRTC REAL-TIME AI",
    result: "<500ms Conversational Voice Bot Deployed",
    tag: "0 DROP RATE",
    color: "text-purple-400 border-purple-500/50 bg-purple-500/10",
  },
  {
    phase: "COMBO 03",
    target: "DATA CHAOS",
    action: "ACID SYNCHRONIZATION",
    result: "PostgreSQL & Microsoft Graph Real-Time Lakehouse",
    tag: "ZERO ERRORS",
    color: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10",
  },
];

export default function BattlefieldStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Global Continuous Scroll Hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scroll Velocity for Game Combat Intensity
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 300, damping: 30 });

  // Spring physics for buttery smooth continuous camera & animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  // Track mouse coordinates for physical object deflection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX - innerWidth / 2) / (innerWidth / 2),
        y: (e.clientY - innerHeight / 2) / (innerHeight / 2),
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ==========================================
  // CONTINUOUS CINEMATIC CAMERA & COMBAT PHASES
  // ==========================================

  // Phase 1: Beast Towering Reveal (0.00 -> 0.22)
  const beastScale = useTransform(smoothProgress, [0, 0.18, 0.35], [1.1, 1, 0.6]);
  const beastOpacity = useTransform(smoothProgress, [0, 0.22, 0.35], [1, 1, 0]);
  const beastShatter = useTransform(smoothProgress, [0.15, 0.35], [1, 2.8]);

  // Phase 2: Warrior Hero Landing & Stance (0.18 -> 0.45)
  const warriorDropY = useTransform(smoothProgress, [0.15, 0.28], [-400, 0]);
  const warriorOpacity = useTransform(smoothProgress, [0.15, 0.22, 0.55, 0.65], [0, 1, 1, 0]);
  const warriorScale = useTransform(smoothProgress, [0.18, 0.32, 0.55], [0.8, 1.05, 1.2]);

  // Phase 3: Triple Slash Combos (0.30 -> 0.68)
  const combo1Opacity = useTransform(smoothProgress, [0.28, 0.36, 0.44], [0, 1, 0]);
  const combo2Opacity = useTransform(smoothProgress, [0.42, 0.50, 0.58], [0, 1, 0]);
  const combo3Opacity = useTransform(smoothProgress, [0.56, 0.64, 0.72], [0, 1, 0]);

  // Phase 4: Transformed Architecture Rails (0.62 -> 0.86)
  const archOpacity = useTransform(smoothProgress, [0.62, 0.70, 0.84, 0.90], [0, 1, 1, 0]);
  const archScale = useTransform(smoothProgress, [0.62, 0.74, 0.88], [0.8, 1, 1.05]);

  // Phase 5: Mission Control Room Victory (0.84 -> 1.00)
  const controlOpacity = useTransform(smoothProgress, [0.84, 0.92, 1], [0, 1, 1]);
  const controlScale = useTransform(smoothProgress, [0.84, 0.94, 1], [0.92, 1, 1]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    playPopSound();
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-[#020409] text-white">
      
      {/* ==========================================
          STICKY FULL-SCREEN BATTLEFIELD CANVAS
      =========================================== */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between p-4 sm:p-8 select-none">
        
        {/* Dark Cyber Industrial Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#09101f_1px,transparent_1px),linear-gradient(to_bottom,#09101f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70 pointer-events-none" />
        
        {/* Dynamic Combat Lighting Flashes based on Velocity */}
        <motion.div
          style={{
            opacity: useTransform(smoothVelocity, [-1, 0, 1], [0.4, 0.05, 0.4]),
          }}
          className="absolute inset-0 bg-radial-gradient from-[#00f0ff]/15 via-transparent to-transparent pointer-events-none"
        />

        {/* Persistent Tactical HUD Header */}
        <header className="relative z-50 flex items-center justify-between font-mono text-xs border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded bg-white text-black font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-widest text-white uppercase text-[11px] sm:text-xs">
                PAVAN KUMAR <span className="text-[#00f0ff]">/// AUTOMATION WARRIOR</span>
              </span>
              <span className="text-[9px] text-neutral-500 hidden sm:block">
                SLAYING MANUAL ENTERPRISE HARD WORK
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>COMBAT ARENA ACTIVE</span>
            </div>
            <Link to="/projects" className="text-neutral-400 hover:text-white transition-colors hidden md:inline">
              Battle Record (Projects) ↗
            </Link>
          </div>
        </header>

        {/* ==========================================
            CENTER BATTLE ARENA (CONTINUOUS SPACE)
        =========================================== */}
        <div className="relative z-20 my-auto w-full max-w-6xl mx-auto h-[72vh] flex items-center justify-center">
          
          {/* ------------------------------------------
              1. THE ENORMOUS BEAST OF HARD WORK
          ------------------------------------------- */}
          <motion.div
            style={{ opacity: beastOpacity, scale: beastScale }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Beast Header Banner */}
            <div className="text-center space-y-2 mb-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-rose-400 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 animate-pulse">
                <span>⚠ THREAT DETECTED: THE BEAST OF HARD WORK</span>
              </div>
              <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                Drowning In Chaos.
              </h1>
              <p className="text-xs sm:text-sm font-mono text-neutral-400">
                Scroll fast to unleash the Automation Warrior and slash this monster ↓
              </p>
            </div>

            {/* Beast Colossus Cluster built from real enterprise items */}
            <div className="relative w-full max-w-2xl h-80 flex items-center justify-center">
              {BEAST_FRAGMENTS.map((frag) => (
                <motion.div
                  key={frag.id}
                  style={{
                    x: useTransform(beastShatter, (s) => (frag.x + mousePos.x * 25) * s),
                    y: useTransform(beastShatter, (s) => (frag.y + mousePos.y * 25) * s),
                    rotate: frag.rot + mousePos.x * 10,
                  }}
                  className={`absolute p-3 sm:p-4 rounded-2xl border ${frag.color} backdrop-blur-xl shadow-2xl flex items-center gap-3 w-56 sm:w-64 pointer-events-auto hover:scale-110 transition-transform`}
                >
                  <span className="text-2xl sm:text-3xl">{frag.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-bold text-white truncate">{frag.title}</div>
                    <div className="font-mono text-[9px] font-semibold opacity-90">{frag.type}</div>
                  </div>
                </motion.div>
              ))}

              {/* Beast Core Roar Symbol */}
              <div className="size-20 rounded-full border-2 border-rose-500/50 bg-rose-950/40 backdrop-blur-2xl flex items-center justify-center font-black text-2xl text-rose-400 animate-ping">
                👹
              </div>
            </div>
          </motion.div>

          {/* ------------------------------------------
              2. THE WARRIOR HERO (PAVAN KUMAR)
          ------------------------------------------- */}
          <motion.div
            style={{
              opacity: warriorOpacity,
              y: warriorDropY,
              scale: warriorScale,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
          >
            {/* Warrior Stance Visual */}
            <div className="relative flex flex-col items-center">
              
              {/* Dual Glowing Laser Katanas */}
              <div className="relative w-48 h-32 flex items-center justify-center">
                {/* Left Katana: Python Async */}
                <motion.div
                  animate={{ rotate: [-25, -20, -25], y: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-4 w-40 h-2 bg-gradient-to-r from-transparent via-[#00f0ff] to-white rounded-full shadow-[0_0_25px_rgba(0,240,255,0.9)] origin-right"
                >
                  <span className="absolute -top-5 right-2 font-mono text-[9px] font-bold text-[#00f0ff] tracking-widest">
                    PYTHON_ASYNC
                  </span>
                </motion.div>

                {/* Right Katana: LLaMA 3.1 70B */}
                <motion.div
                  animate={{ rotate: [25, 20, 25], y: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="absolute -right-4 w-40 h-2 bg-gradient-to-l from-transparent via-purple-400 to-white rounded-full shadow-[0_0_25px_rgba(168,85,247,0.9)] origin-left"
                >
                  <span className="absolute -top-5 left-2 font-mono text-[9px] font-bold text-purple-300 tracking-widest">
                    LLAMA_70B
                  </span>
                </motion.div>

                {/* Warrior Silhouette Head / Visor */}
                <div className="size-16 rounded-full border-2 border-white/40 bg-neutral-950 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.6)]">
                  <div className="w-10 h-1.5 bg-[#00f0ff] rounded-full shadow-[0_0_15px_#00f0ff] animate-pulse" />
                </div>
              </div>

              {/* Action Banner */}
              <div className="mt-4 text-center">
                <span className="font-mono text-[10px] text-[#00f0ff] tracking-widest uppercase block font-bold">
                  THE AUTOMATION WARRIOR ENGAGED
                </span>
                <div className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  "Stand Back. I Slay Manual Labor."
                </div>
              </div>
            </div>
          </motion.div>

          {/* ------------------------------------------
              3. TRIPLE SLASH COMBOS (KINETIC TYPOGRAPHY)
          ------------------------------------------- */}
          
          {/* Combo 1: Invoice Storm Slashed */}
          <motion.div
            style={{ opacity: combo1Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40 text-center space-y-4"
          >
            <div className="font-mono text-xl sm:text-2xl text-[#00f0ff] tracking-[0.3em] font-black">
              SLASH /// 01
            </div>
            <div className="text-4xl sm:text-8xl font-black uppercase text-white tracking-tighter drop-shadow-[0_0_40px_rgba(0,240,255,0.8)]">
              INVOICE STORM
            </div>
            <div className="p-4 sm:p-6 rounded-3xl border-2 border-[#00f0ff] bg-black/80 backdrop-blur-2xl max-w-lg mx-auto shadow-[0_0_50px_rgba(0,240,255,0.4)]">
              <div className="font-mono text-sm text-[#00f0ff] font-bold">EXTRACT → VALIDATE → AUTOMATE</div>
              <div className="text-base sm:text-xl font-bold text-white mt-1">2,000+ Monthly Records Auto-Filed (LHDN Tax Compliant)</div>
            </div>
          </motion.div>

          {/* Combo 2: Phone Swarm Slashed */}
          <motion.div
            style={{ opacity: combo2Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40 text-center space-y-4"
          >
            <div className="font-mono text-xl sm:text-2xl text-purple-400 tracking-[0.3em] font-black">
              SLASH /// 02
            </div>
            <div className="text-4xl sm:text-8xl font-black uppercase text-white tracking-tighter drop-shadow-[0_0_40px_rgba(168,85,247,0.8)]">
              PHONE SWARM
            </div>
            <div className="p-4 sm:p-6 rounded-3xl border-2 border-purple-500 bg-black/80 backdrop-blur-2xl max-w-lg mx-auto shadow-[0_0_50px_rgba(168,85,247,0.4)]">
              <div className="font-mono text-sm text-purple-300 font-bold">TRANSCRIBE → REASON → CONVERSE</div>
              <div className="text-base sm:text-xl font-bold text-white mt-1">&lt;500ms Real-Time WebRTC Conversational Voice Bot</div>
            </div>
          </motion.div>

          {/* Combo 3: Data Chaos Slashed */}
          <motion.div
            style={{ opacity: combo3Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40 text-center space-y-4"
          >
            <div className="font-mono text-xl sm:text-2xl text-emerald-400 tracking-[0.3em] font-black">
              SLASH /// 03
            </div>
            <div className="text-4xl sm:text-8xl font-black uppercase text-white tracking-tighter drop-shadow-[0_0_40px_rgba(16,185,129,0.8)]">
              DATA CHAOS
            </div>
            <div className="p-4 sm:p-6 rounded-3xl border-2 border-emerald-500 bg-black/80 backdrop-blur-2xl max-w-lg mx-auto shadow-[0_0_50px_rgba(16,185,129,0.4)]">
              <div className="font-mono text-sm text-emerald-300 font-bold">NORMALIZE → COMMIT → DISPATCH</div>
              <div className="text-base sm:text-xl font-bold text-white mt-1">PostgreSQL 16 ACID Lakehouse + Microsoft Graph Auto-Drafts</div>
            </div>
          </motion.div>

          {/* ------------------------------------------
              4. TRANSFORMED ARCHITECTURE CRYSTALLIZATION
          ------------------------------------------- */}
          <motion.div
            style={{ opacity: archOpacity, scale: archScale }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40"
          >
            <div className="text-center space-y-2 mb-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <span>✓ BEAST SLAIN /// ARCHITECTURE CRYSTALLIZED</span>
              </div>
              <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white">
                Chaos Becomes Infrastructure.
              </h2>
            </div>

            {/* 3 Unified Pipeline Systems */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl pointer-events-auto font-mono text-xs">
              {BATTLE_COMBOS.map((c) => (
                <div
                  key={c.phase}
                  className={`p-5 rounded-3xl border ${c.color} backdrop-blur-2xl space-y-3 shadow-xl hover:scale-105 transition-transform`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold">{c.phase}</span>
                    <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 font-bold">{c.tag}</span>
                  </div>
                  <div className="text-base font-black text-white">{c.target}</div>
                  <div className="text-xs text-neutral-300 font-sans leading-relaxed">{c.result}</div>
                  <div className="text-[10px] text-emerald-400 font-bold pt-2 border-t border-white/10 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span>OPERATING 24/7 IN PRODUCTION</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ------------------------------------------
              5. MISSION CONTROL ROOM (MAXIMUM CHILL & HIRE)
          ------------------------------------------- */}
          <motion.div
            style={{ opacity: controlOpacity, scale: controlScale }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40"
          >
            <div className="text-center space-y-3 max-w-2xl pointer-events-auto">
              
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[#00f0ff] px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10">
                <span className="size-2 rounded-full bg-[#00f0ff] animate-ping" />
                <span>VICTORY /// MAXIMUM LAZINESS UNLOCKED 🌴</span>
              </div>

              <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                Put The Warrior On <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-teal-300 to-white">
                  Your Payroll.
                </span>
              </h2>

              <p className="text-xs sm:text-base text-neutral-300 font-sans leading-relaxed">
                I do the heavy engineering so your team can sit back and watch workflows run themselves.
              </p>

              {/* Concrete Outcomes Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 py-2 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg sm:text-xl font-black text-white">42,381+</div>
                  <div className="text-[9px] text-neutral-400">Docs Automated</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg sm:text-xl font-black text-[#00f0ff]">98.7%</div>
                  <div className="text-[9px] text-neutral-400">Autonomous</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg sm:text-xl font-black text-emerald-400">3.2h → 11m</div>
                  <div className="text-[9px] text-neutral-400">Execution Speed</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg sm:text-xl font-black text-purple-400">2x Promo</div>
                  <div className="text-[9px] text-neutral-400">In 4 Months</div>
                </div>
              </div>

              {/* 1-Tap Action Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 font-mono text-xs pt-1">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#00f0ff] transition-colors">
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

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400 transition-colors">
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

                <a
                  href="/Pavan_Resume.pdf"
                  download="Pavan_Kumar_Resume.pdf"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neutral-200 hover:text-white hover:border-[#00f0ff] transition-colors"
                >
                  <span>📜 Download Résumé PDF</span>
                </a>
              </div>

              {/* Primary Direct CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
                <Link
                  to="/contact"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                  className="px-8 py-3.5 rounded-full bg-[#00f0ff] text-black font-bold hover:bg-white transition-all shadow-[0_0_35px_rgba(0,240,255,0.45)] hover:scale-105"
                >
                  ⚔️ Hire Pavan To Slay Your Work →
                </Link>

                <Link
                  to="/projects"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                  className="px-8 py-3.5 rounded-full bg-white/5 border border-white/15 text-white font-bold hover:border-[#00f0ff] hover:text-[#00f0ff] transition-all backdrop-blur-xl hover:scale-105"
                >
                  Inspect 4 Case Studies 🚀
                </Link>
              </div>

            </div>
          </motion.div>

        </div>

        {/* ==========================================
            BOTTOM CONTINUOUS PROGRESS RIBBON
        =========================================== */}
        <footer className="relative z-50 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="text-[#00f0ff] font-bold">
              BATTLE ARENA: CONTINUOUS PHYSICAL SCROLL
            </span>
            <span className="text-neutral-500 hidden sm:inline">• SCROLL VELOCITY = COMBAT POWER</span>
          </div>

          <div className="w-32 sm:w-48 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#00f0ff] via-purple-500 to-emerald-400 h-full"
              style={{ width: useTransform(smoothProgress, (p) => `${p * 100}%`) }}
            />
          </div>
        </footer>

      </div>
    </div>
  );
}
