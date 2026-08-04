import { createRef, useMemo, useRef } from "react";
import { motion } from "framer-motion";
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
  return (
    <header id="top" className="relative overflow-hidden">
      <div className="dotgrid absolute inset-0 opacity-60" aria-hidden />
      <InteractiveNeuralVortex />
      <div className="relative mx-auto flex min-h-[92svh] max-w-5xl flex-col justify-center px-6 py-24 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <img
            src="/IMG.png"
            alt="Portrait of Pavan Kumar"
            width={56}
            height={56}
            className="border-line size-12 rounded-full border object-cover sm:size-14"
          />
          <div className="font-mono text-xs text-mut sm:text-sm">
            <span className="text-acc">~/</span>pavan-kumar · {profile.location}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8"
        >
          {/* Name is the anchor now — big enough to fill the space the smaller
              rotating role would otherwise leave empty next to the portrait. */}
          <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl">
            {profile.name}
          </h1>
          {/* Rotating role — a size down from the name. Canvas stays a bit
              taller/wider than the text so vaporized particles can drift past
              the glyphs instead of being clipped. */}
          <div className="mt-3 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem]">
            <TypingTextCycle
              texts={ROLES}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            />
          </div>
          <p className="mt-1 text-2xl font-bold tracking-tight text-balance text-mut min-[420px]:text-3xl md:text-4xl lg:text-5xl">
            {profile.tagline}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-mut sm:text-lg"
        >
          {profile.summary}
        </motion.p>

        <div className="mt-10 sm:mt-14">
          <div className="mb-5 font-mono text-[10px] tracking-widest text-mut sm:text-xs">
            // WHAT MY SYSTEMS DO ALL DAY
          </div>
          <Pipeline />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap gap-4 font-mono text-sm"
        >
          <a
            href="#work"
            className="rounded-lg bg-acc px-5 py-2.5 font-semibold text-ink transition-transform hover:scale-105"
          >
            see the work ↓
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-line px-5 py-2.5 text-fg transition-colors hover:border-acc"
          >
            github
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-line px-5 py-2.5 text-fg transition-colors hover:border-acc"
          >
            linkedin
          </a>
        </motion.div>
      </div>
    </header>
  );
}
