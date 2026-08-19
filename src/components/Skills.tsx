import { skills } from "../data/resume";
import SectionLabel from "./SectionLabel";
import IntegrationsHub from "./IntegrationsHub";
import { Marquee } from "./ui/marquee";

const allTools = skills.flatMap((s) => s.items);

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-16 sm:py-20 md:px-10 lg:py-24">
      <div className="flex items-center justify-between mb-6">
        <SectionLabel n="03">Toolbox</SectionLabel>
      </div>
      <div className="space-y-5">
        {skills.map((row) => (
          <div key={row.group} className="flex flex-col gap-2 sm:flex-row sm:items-baseline">
            <div className="w-40 shrink-0 font-mono text-[10px] tracking-widest text-mut sm:text-xs lg:w-44">
              {row.group.toUpperCase()}
            </div>
            <div className="flex flex-wrap gap-2">
              {row.items.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-line bg-panel/60 px-3 py-1 text-sm text-fg/90 transition-colors hover:border-acc/60"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Marquee pauseOnHover speed={35} className="mt-10">
        {allTools.map((t) => (
          <span
            key={t}
            className="mx-2.5 rounded-full border border-line bg-panel/60 px-4 py-1.5 font-mono text-xs whitespace-nowrap text-mut"
          >
            {t}
          </span>
        ))}
      </Marquee>

      <IntegrationsHub />
    </section>
  );
}
