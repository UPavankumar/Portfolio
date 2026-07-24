import { experience, education, certifications } from "../data/resume";
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

const timelineData = experience.map((job) => ({
  title: job.company,
  content: (
    <div className="relative rounded-2xl border border-line bg-panel/60 p-5 sm:p-6 lg:p-7">
      {cardGlow}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-base font-semibold sm:text-lg">{job.role}</span>
        <span className="font-mono text-[11px] text-mut sm:text-xs">
          {job.place} · {job.period}
        </span>
      </div>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-mut sm:text-[15px]">
        {job.points.map((pt) => (
          <li key={pt} className="flex gap-3">
            <span className="mt-0.5 text-acc">▸</span>
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
