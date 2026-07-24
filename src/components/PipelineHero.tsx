import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedBeam } from "./ui/animated-beam";
import VaporizeTextCycle, { Tag } from "./ui/vapour-text-effect";
import { profile } from "../data/resume";

const ROLES = ["Business Analyst.", "AI Automation Builder.", "Voice AI Builder.", "Data Analyst."];

function useIsWide() {
  const [wide, setWide] = useState(() => window.innerWidth >= 640);
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return wide;
}

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
      className="relative w-full max-w-4xl py-4"
      role="img"
      aria-label="Animated diagram of an automation pipeline: inbox, extract, validate, act, done"
    >
      {NODES.slice(0, -1).map((_, i) => (
        <AnimatedBeam
          key={i}
          containerRef={containerRef}
          fromRef={nodeRefs[i]}
          toRef={nodeRefs[i + 1]}
          pathColor="#1a2233"
          pathWidth={2}
          pathOpacity={0.9}
          gradientStartColor="#34e0c2"
          gradientStopColor="#38bdf8"
          duration={2.4}
          delay={i * 0.55}
        />
      ))}

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-8">
        {NODES.map((n, i) => (
          <motion.div
            key={n.id}
            ref={nodeRefs[i]}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i + 0.3, duration: 0.5 }}
            className="z-10 rounded-xl border border-line bg-panel px-3 py-2.5 text-center shadow-[0_0_28px_-6px_#34e0c240] transition-colors hover:border-acc/60 sm:px-5 sm:py-3.5"
          >
            <div className="font-mono text-[11px] font-semibold tracking-wider text-fg sm:text-sm">
              {n.label}
            </div>
            <div className="mt-0.5 hidden font-mono text-[10px] text-mut sm:block">{n.sub}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function PipelineHero() {
  const wide = useIsWide();
  return (
    <header id="top" className="relative overflow-hidden">
      <div className="dotgrid absolute inset-0" aria-hidden />
      <div className="relative mx-auto flex min-h-[92svh] max-w-5xl flex-col justify-center px-6 py-24">
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
            className="border-line size-14 rounded-full border object-cover"
          />
          <div className="font-mono text-sm text-mut">
            <span className="text-acc">~/</span>pavan-kumar · {profile.location}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8"
        >
          <div className="h-14 sm:h-24" aria-hidden={false}>
            <VaporizeTextCycle
              texts={ROLES}
              font={{
                fontFamily: "Inter, sans-serif",
                fontSize: wide ? "72px" : "38px",
                fontWeight: 700,
              }}
              color="rgb(231, 235, 242)"
              spread={5}
              density={5}
              animation={{ vaporizeDuration: 2, fadeInDuration: 1, waitDuration: 2 }}
              direction="left-to-right"
              alignment="left"
              tag={Tag.H1}
            />
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight text-balance text-mut sm:text-5xl">
            {profile.tagline}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-mut"
        >
          {profile.summary}
        </motion.p>

        <div className="mt-14">
          <div className="mb-5 font-mono text-xs tracking-widest text-mut">
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
