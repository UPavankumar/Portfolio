import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineGroup {
  /** company name — sticks for the whole group, however many roles it holds */
  title: string;
  items: React.ReactNode[];
}

export const Timeline = ({ data }: { data: TimelineGroup[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    // --tl-x is the rail's x position: the width of the sticky title column
    // plus its gap. The dots derive from the same value, so they always line up.
    <div
      className="w-full [--tl-x:0px] md:[--tl-x:264px] lg:[--tl-x:296px]"
      ref={containerRef}
    >
      <div ref={ref} className="relative pb-10">
        {data.map((group, gi) => (
          <div
            key={group.title + gi}
            className="flex flex-col pt-12 first:pt-0 md:flex-row md:gap-10 md:pt-20 md:first:pt-2"
          >
            {/* Company title — fixed/static on mobile, sticky on desktop */}
            <div className="mb-5 self-start md:sticky md:top-32 md:mb-0 md:h-fit md:w-56 md:shrink-0 lg:w-64">
              <h3 className="text-2xl font-bold text-mut md:text-4xl">{group.title}</h3>
            </div>

            <div className="relative flex-1 space-y-8 pl-10">
              {group.items.map((item, ii) => (
                <div key={ii} className="relative">
                  {/* Rich timeline dot — sticky top-32 on both mobile & desktop (z-20) */}
                  <div className="absolute top-7 -left-10 z-20 h-[calc(100%-1.75rem)] w-0">
                    <div className="sticky top-32 flex size-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-acc/90 bg-ink shadow-[0_0_14px_rgba(52,224,194,0.7)] backdrop-blur-sm sm:size-5">
                      <span className="size-1.5 rounded-full bg-acc shadow-[0_0_6px_#34e0c2] sm:size-2" />
                    </div>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Timeline vertical rail line (z-10, behind the dots) */}
        <div
          style={{ height: height + "px" }}
          className="absolute top-0 left-[var(--tl-x)] z-10 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-line to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-acc from-[0%] via-sky-400 via-[10%] to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
