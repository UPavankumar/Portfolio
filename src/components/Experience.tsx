import { employment, education, certifications } from "../data/resume";
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

const timelineData = employment.map((job, i) => ({
  // consecutive roles at the same company share one heading — only the dot repeats
  title: i > 0 && employment[i - 1].company === job.company ? "" : job.company,
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

export default function Experience() {
  return (
    <section id="experience" className="border-t border-line bg-panel/30">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20 md:px-10 lg:py-24">
        <SectionLabel n="02">Experience</SectionLabel>

        <Timeline data={timelineData} />

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
