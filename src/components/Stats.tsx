import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { stats } from "../data/resume";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="font-mono text-4xl font-semibold text-acc sm:text-5xl">
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="border-y border-line bg-panel/50">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 px-6 py-14 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <Counter to={s.value} suffix={s.suffix} />
            <p className="mt-2 text-sm leading-snug text-mut">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
