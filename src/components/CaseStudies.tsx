import { motion } from "framer-motion";
import { projects, type Project } from "../data/resume";
import SectionLabel from "./SectionLabel";
import { GlowingEffect } from "./ui/glowing-effect";

function MiniPipeline({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-mut">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-2">
          <span className="rounded border border-line bg-ink px-2 py-1">{s}</span>
          {i < steps.length - 1 && <span className="text-acc">→</span>}
        </span>
      ))}
    </div>
  );
}

function Study({ p }: { p: Project }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className="relative rounded-2xl border border-line bg-panel/60 p-7 sm:p-9"
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={72}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-xl font-semibold sm:text-2xl">
          <span className="mr-3 font-mono text-sm text-acc">{p.index}</span>
          {p.title}
        </h3>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {p.stack.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-mut"
          >
            {t}
          </span>
        ))}
      </div>

      <dl className="mt-6 space-y-4 text-[15px] leading-relaxed">
        <div>
          <dt className="font-mono text-xs tracking-widest text-mut">PROBLEM</dt>
          <dd className="mt-1 text-fg/90">{p.problem}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs tracking-widest text-mut">BUILD</dt>
          <dd className="mt-1 text-fg/90">{p.build}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs tracking-widest text-mut">OUTCOME</dt>
          <dd className="mt-1 font-medium text-acc">{p.outcome}</dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-line pt-5">
        <MiniPipeline steps={p.pipeline} />
      </div>
    </motion.article>
  );
}

export default function CaseStudies() {
  return (
    <section id="work" className="mx-auto max-w-5xl px-6 py-24">
      <SectionLabel n="01">Case studies</SectionLabel>
      <div className="space-y-8">
        {projects.map((p) => (
          <Study key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
