import { skills } from "../data/resume";
import SectionLabel from "./SectionLabel";
import IntegrationsHub from "./IntegrationsHub";
import { Marquee } from "./ui/marquee";

const allTools = skills.flatMap((s) => s.items);

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-24">
      <SectionLabel n="03">Toolbox</SectionLabel>
      <div className="space-y-5">
        {skills.map((row) => (
          <div key={row.group} className="flex flex-col gap-2 sm:flex-row sm:items-baseline">
            <div className="w-44 shrink-0 font-mono text-xs tracking-widest text-mut">
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
