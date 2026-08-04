import { motion } from "framer-motion";
import { employment, education, certifications } from "../data/resume";
import SectionLabel from "./SectionLabel";
import { GlowingEffect } from "./ui/glowing-effect";
import { Timeline, type TimelineGroup } from "./ui/timeline";

const cardGlow = (
  <GlowingEffect
    spread={36}
    glow={true}
    disabled={false}
    proximity={150}
    inactiveZone={0.01}
    borderWidth={2}
  />
);

const jobCard = (job: (typeof employment)[number]) => (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl border border-line bg-panel/60 p-5 sm:p-6 lg:p-7"
    >
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

      <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-mut sm:text-[15px]">
        {job.points.map((pt) => (
          <li key={pt} className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-acc">▸</span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </motion.div>
);

// Consecutive roles at one company become a single group, so the company name
// stays pinned across all of them and only hands off at the next employer.
const timelineData: TimelineGroup[] = employment.reduce<TimelineGroup[]>((groups, job) => {
  const card = jobCard(job);
  const last = groups[groups.length - 1];
  if (last && last.title === job.company) last.items.push(card);
  else groups.push({ title: job.company, items: [card] });
  return groups;
}, []);

export default function Experience() {
  return (
    <section id="experience" className="border-t border-line bg-panel/30">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20 md:px-10 lg:py-24">
        <SectionLabel n="02">Experience</SectionLabel>

        <Timeline data={timelineData} />

        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-line bg-panel/60 p-6"
          >
            {cardGlow}
            <div className="font-mono text-xs tracking-widest text-mut">EDUCATION</div>
            <p className="mt-3 font-medium">{education.school}</p>
            <p className="mt-1 text-sm text-mut">
              {education.degree} · {education.period} · {education.detail}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-line bg-panel/60 p-6"
          >
            {cardGlow}
            <div className="font-mono text-xs tracking-widest text-mut">CERTIFICATIONS</div>
            <ul className="mt-3 space-y-1 text-sm text-mut">
              {certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
