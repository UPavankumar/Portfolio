import { createRef, useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AnimatedBeam } from "./ui/animated-beam";
import TypingTextCycle from "./ui/typing-text-effect";
import InteractiveNeuralVortex from "./ui/interactive-neural-vortex-background";
import { profile } from "../data/resume";

const ROLES = ["Business Analyst.", "AI Automation Builder.", "Voice AI Builder.", "Data Analyst."];

const NODES = [
  { id: "inbox", label: "INBOX", sub: "email · pdf · voice" },
  { id: "extract", label: "EXTRACT", sub: "whisper · llm" },
  { id: "validate", label: "VALIDATE", sub: "schema · rules" },
  { id: "act", label: "ACT", sub: "crm · draft · submit" },
  { id: "done", label: "DONE", sub: "no humans harmed" },
];

function Pipeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useMemo(() => NODES.map(() => createRef<HTMLDivElement>()), []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-4xl py-4"
      role="img"
      aria-label="Animated diagram of an automation pipeline: inbox, extract, validate, act, done"
    >
      {NODES.slice(0, -1).map((_, i) => (
        <AnimatedBeam
          key={i}
          containerRef={containerRef}
          fromRef={nodeRefs[i]}
          toRef={nodeRefs[i + 1]}
          pathColor="#1e293b"
          pathWidth={2}
          pathOpacity={0.9}
          gradientStartColor="#38bdf8"
          gradientStopColor="#60a5fa"
          curvature={0}
          duration={6}
          delay={i * 1.1}
        />
      ))}

      {/* 2-up serpentine on phones, single row from sm up */}
      <div className="grid grid-cols-2 items-center gap-x-4 gap-y-6 sm:flex sm:justify-between sm:gap-x-3">
        {NODES.map((n, i) => (
          <motion.div
            key={n.id}
            ref={nodeRefs[i]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 * i + 0.3, duration: 0.5 }}
            className="z-10 rounded-xl border border-line bg-panel px-3 py-2.5 text-center shadow-[0_0_28px_-6px_rgba(56,189,248,0.35)] transition-colors last:col-span-2 last:justify-self-center hover:border-acc/60 sm:px-4 sm:py-3 sm:last:col-span-1 md:px-5 md:py-3.5"
          >
            <div className="font-mono text-[11px] font-semibold tracking-wider text-fg sm:text-xs md:text-sm">
              {n.label}
            </div>
            <div className="mt-0.5 font-mono text-[9px] text-mut sm:text-[10px] md:text-[11px]">
              {n.sub}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function PipelineHero() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX - window.innerWidth / 2);
      setMouseY(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Simple tilt physics based on mouse
  const rotateX = `${-(mouseY / 300) * 4}deg`;
  const rotateY = `${(mouseX / 300) * 4}deg`;

  return (
    <header id="top" className="relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="dotgrid absolute inset-0 opacity-60" aria-hidden />
      <InteractiveNeuralVortex />

      {/* Light beams */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-[55vh] opacity-20"
          style={{ background: "linear-gradient(to bottom, var(--color-acc), transparent)" }} />
        <div className="absolute top-0 right-1/3 w-px h-[38vh] opacity-10"
          style={{ background: "linear-gradient(to bottom, var(--color-acc), transparent)" }} />
      </div>

      <motion.div
        className="relative z-20 text-center px-6 max-w-5xl mx-auto w-full flex flex-col items-center"
        style={{ transform: `perspective(1200px) rotateX(${rotateX}) rotateY(${rotateY})`, transition: 'transform 0.1s ease-out' }}
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-line bg-panel/50 text-xs font-mono text-mut backdrop-blur-sm"
        >
          <span className="size-1.5 rounded-full bg-acc animate-pulse shadow-[0_0_8px_var(--color-acc)]" />
          {profile.location} · {profile.tagline.toLowerCase()}
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1
            className="font-extrabold leading-[0.85] tracking-tighter text-fg"
            style={{ fontSize: "clamp(3.5rem, 14vw, 12rem)" }}
          >
            <span className="block">PAVAN</span>
            <span className="block text-mut/50">KUMAR</span>
          </h1>
        </motion.div>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="font-mono text-xl md:text-3xl text-mut mb-10 h-10 flex items-center justify-center gap-3"
        >
          <span className="text-acc/50">&gt;</span>
          <div className="text-fg/80">
            <TypingTextCycle texts={ROLES} className="text-xl md:text-3xl" />
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="max-w-2xl text-base leading-relaxed text-mut sm:text-lg mb-12"
        >
          {profile.summary}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-5"
        >
          <Link
            to="/projects"
            className="group px-8 py-4 rounded-xl font-semibold text-sm text-ink bg-fg transition-all duration-300 relative overflow-hidden shadow-[0_0_25px_rgba(255,255,255,0.1)]"
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-xl font-semibold text-sm text-fg bg-panel/30 border border-line hover:border-acc hover:bg-acc/10 transition-all duration-300 backdrop-blur-sm"
          >
            Contact Me
          </a>
        </motion.div>
      </motion.div>

      {/* Optional Pipeline (moved to the bottom, subtly) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl hidden lg:block opacity-40 hover:opacity-100 transition-opacity"
      >
         <Pipeline />
      </motion.div>

    </header>
  );
}
