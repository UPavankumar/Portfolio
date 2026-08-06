import React, { useRef } from "react";

export interface TimelineGroup {
  /** company name — sticks for the whole group, however many roles it holds */
  title: string;
  items: React.ReactNode[];
}

export const Timeline = ({ data }: { data: TimelineGroup[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
            {/* Company title — padded pl-10 on mobile so line at left: 0 stays clear of text */}
            <div className="mb-5 pl-10 self-start md:sticky md:top-32 md:mb-0 md:h-fit md:w-56 md:shrink-0 md:pl-0 lg:w-64">
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

      </div>
    </div>
  );
};
