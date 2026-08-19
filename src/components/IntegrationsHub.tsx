import { createRef, useMemo, useRef, forwardRef, type ReactNode } from "react";
import { AnimatedBeam } from "./ui/animated-beam";
import { cn } from "../lib/utils";

const SOURCES = ["MS GRAPH API", "WORKSPACE", "PDF / XLSX", "WEBRTC VOICE"];
const SINKS = ["POSTGRESQL", "ODOO CRM", "POWER BI", "LHDN REST"];

const Chip = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-10 rounded-full border border-line bg-panel px-2 sm:px-3 py-1.5 sm:py-2 text-center font-mono text-[8px] sm:text-[10px] lg:text-[11px] leading-tight tracking-wider text-fg/90 shadow-[0_0_20px_-8px_#34e0c230] whitespace-nowrap",
        className
      )}
    >
      {children}
    </div>
  )
);
Chip.displayName = "Chip";

export default function IntegrationsHub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sourceRefs = useMemo(() => SOURCES.map(() => createRef<HTMLDivElement>()), []);
  const sinkRefs = useMemo(() => SINKS.map(() => createRef<HTMLDivElement>()), []);
  const hubRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mt-10 sm:mt-16 w-full max-w-3xl px-1 sm:px-4"
      role="img"
      aria-label="Diagram of enterprise systems flowing through an LLM core into databases and dashboards"
    >
      {sourceRefs.map((r, i) => (
        <AnimatedBeam
          key={`in-${i}`}
          containerRef={containerRef}
          fromRef={r}
          toRef={hubRef}
          curvature={i % 2 === 0 ? -24 : 24}
          pathColor="#1e293b"
          pathOpacity={0.9}
          gradientStartColor="#38bdf8"
          gradientStopColor="#60a5fa"
          duration={5.5}
          delay={i * 0.45}
        />
      ))}
      {sinkRefs.map((r, i) => (
        <AnimatedBeam
          key={`out-${i}`}
          containerRef={containerRef}
          fromRef={hubRef}
          toRef={r}
          curvature={i % 2 === 0 ? 24 : -24}
          pathColor="#1e293b"
          pathOpacity={0.9}
          gradientStartColor="#38bdf8"
          gradientStopColor="#60a5fa"
          duration={5.5}
          delay={i * 0.45 + 0.9}
        />
      ))}

      <div className="flex items-center justify-between gap-1 sm:gap-4 py-4">
        <div className="flex flex-col gap-3 sm:gap-5">
          {SOURCES.map((s, i) => (
            <Chip key={s} ref={sourceRefs[i]}>
              {s}
            </Chip>
          ))}
        </div>

        <div
          ref={hubRef}
          className="z-10 flex size-14 sm:size-24 lg:size-28 shrink-0 flex-col items-center justify-center rounded-full border-2 border-acc/60 bg-panel text-center shadow-[0_0_50px_-10px_rgba(56,189,248,0.4)]"
        >
          <span className="font-mono text-[9px] sm:text-xs font-bold text-acc">AI CORE</span>
          <span className="hidden font-mono text-[9px] text-mut sm:block">agents · loops</span>
        </div>

        <div className="flex flex-col gap-3 sm:gap-5">
          {SINKS.map((s, i) => (
            <Chip key={s} ref={sinkRefs[i]}>
              {s}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
