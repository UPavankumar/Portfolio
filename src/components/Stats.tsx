import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { stats } from "../data/resume";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) {
      setN(0);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span
      ref={ref}
      className="font-mono text-3xl font-semibold text-acc sm:text-4xl lg:text-5xl"
    >
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="border-y border-line bg-panel/50">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 px-6 py-12 sm:gap-10 md:grid-cols-4 md:px-10 md:py-14">
        {stats.map((s) => (
          <div key={s.label}>
            <Counter to={s.value} suffix={s.suffix} />
            <p className="mt-2 text-xs leading-snug text-mut sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
