import { motion } from "framer-motion";
import { employment, internships, education, certifications } from "../data/resume";
import SectionLabel from "./SectionLabel";
import { GlowingEffect } from "./ui/glowing-effect";
import { Timeline } from "./ui/timeline";

const cardGlow = (
  <GlowingEffect
    spread={36}
    glow={true}
    disabled={false}
    proximity={64}
    inactiveZone={0.05}
    borderWidth={2}
  />
);

const timelineData = employment.map((job) => ({
  title: job.company,
  content: (
    <div className="relative rounded-2xl border border-line bg-panel/60 p-5 sm:p-6 lg:p-7">
      {cardGlow}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h4 className="text-base font-semibold sm:text-lg">{job.role}</h4>
        <span className="rounded-full border border-acc/40 bg-acc/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-acc">
          {job.type.toUpperCase()}
        </span>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-mut sm:text-xs">
        <span>{job.period}</span>
        <span className="text-line">|</span>
        <span>{job.place}</span>
      </div>

      {job.badge && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-acc/25 bg-acc/[0.06] px-3 py-2">
          <span className="text-sm leading-none text-acc">▲</span>
          <span className="font-mono text-[11px] leading-snug text-acc/90">{job.badge}</span>
        </div>
      )}

      <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-mut sm:text-[15px]">
        {job.points.map((pt) => (
          <li key={pt} className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-acc">▸</span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  ),
}));

function Internships() {
  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center gap-4">
        <h3 className="font-mono text-xs tracking-widest text-mut">INTERNSHIPS</h3>
        <div className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {internships.map((it, i) => (
          <motion.div
            key={it.company + it.role}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="relative flex flex-col rounded-2xl border border-line/70 bg-panel/40 p-5 sm:p-6"
          >
            {cardGlow}
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="text-[15px] font-semibold sm:text-base">{it.company}</h4>
              <span className="shrink-0 font-mono text-[10px] text-mut sm:text-[11px]">
                {it.period}
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-acc/80">{it.role}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-mut">{it.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {it.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-mut"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="border-t border-line bg-panel/30">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20 md:px-10 lg:py-24">
        <SectionLabel n="02">Experience</SectionLabel>

        <Timeline data={timelineData} />

        <Internships />

        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6">
          <div className="relative rounded-2xl border border-line bg-panel/60 p-6">
            {cardGlow}
            <div className="font-mono text-xs tracking-widest text-mut">EDUCATION</div>
            <p className="mt-3 font-medium">{education.school}</p>
            <p className="mt-1 text-sm text-mut">
              {education.degree} · {education.period} · {education.detail}
            </p>
          </div>
          <div className="relative rounded-2xl border border-line bg-panel/60 p-6">
            {cardGlow}
            <div className="font-mono text-xs tracking-widest text-mut">CERTIFICATIONS</div>
            <ul className="mt-3 space-y-1 text-sm text-mut">
              {certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
