import { useScroll, useTransform, motion } from "framer-motion";
import React, { useRef } from "react";
import SectionLabel from "../SectionLabel";

export interface TimelineGroup {
  title: string;
  items: React.ReactNode[];
}

export const HorizontalTimeline = ({ 
  data, 
  educationAndCerts 
}: { 
  data: TimelineGroup[],
  educationAndCerts: React.ReactNode
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Multi-speed parallax layers
  // The huge background text moves very slowly
  const xBg = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  // The main track moves the fastest
  const xTrack = useTransform(scrollYProgress, [0, 1], ["0%", "-90%"]);
  // The glowing progress line fills up as you scroll
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={targetRef} className="relative h-[500vh] bg-panel/30">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Giant Parallax Background Typography */}
        <motion.div 
           style={{ x: xBg }} 
           className="absolute top-1/3 left-10 md:left-32 z-0 opacity-10 pointer-events-none whitespace-nowrap"
        >
           <h1 
             className="text-[12rem] md:text-[20rem] font-bold text-transparent tracking-tighter" 
             style={{ WebkitTextStroke: "2px var(--color-mut)" }}
           >
             EXPERIENCE
           </h1>
        </motion.div>

        {/* Foreground scrolling track */}
        <motion.div style={{ x: xTrack }} className="flex px-10 md:px-32 w-max z-10 items-center">
          
          <div className="flex flex-col justify-center min-w-[300px] shrink-0 pr-20">
            <SectionLabel n="02">Experience</SectionLabel>
            <p className="mt-4 text-mut max-w-sm text-lg">
              My professional journey across software engineering and design.
            </p>
          </div>

          <div className="relative flex items-center gap-16 md:gap-32 pr-32">
            {/* The horizontal connecting rail (Base line) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-line/50 -z-10 rounded-full" />
            
            {/* The animated glowing progress line */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] -z-10 rounded-full overflow-hidden">
               <motion.div 
                 style={{ scaleX, transformOrigin: "left" }} 
                 className="h-full bg-gradient-to-r from-acc/20 via-sky-400 to-acc shadow-[0_0_15px_#34e0c2]"
               />
            </div>

            {data.map((group, gi) => (
              <div key={group.title + gi} className="flex gap-16 md:gap-32 items-center shrink-0">
                
                {/* Company title anchored to the rail */}
                <div className="relative flex flex-col min-w-[200px] shrink-0 items-center justify-center">
                  <div className="absolute top-1/2 -translate-y-1/2 z-20 size-3 rounded-full border border-mut bg-panel" />
                  <h3 className="absolute -top-16 text-3xl font-bold text-mut tracking-wide">{group.title}</h3>
                </div>
                
                <div className="flex gap-12 md:gap-24">
                  {group.items.map((item, ii) => (
                    <div key={ii} className="relative w-[350px] sm:w-[450px] md:w-[500px] shrink-0">
                      
                      {/* Elegant glowing dot exactly on the rail line */}
                      <div className="absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 z-20">
                        <div className="flex size-5 items-center justify-center rounded-full border-2 border-acc/90 bg-ink shadow-[0_0_14px_rgba(52,224,194,0.7)] backdrop-blur-sm">
                          <span className="size-2 rounded-full bg-acc shadow-[0_0_6px_#34e0c2]" />
                        </div>
                      </div>
                      
                      {/* Staggered layout: even items float slightly above the line, odd items float below */}
                      <motion.div 
                        className="transition-transform duration-500 hover:-translate-y-2"
                        style={{ marginTop: ii % 2 === 0 ? '-150px' : '150px' }}
                      >
                        {item}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center min-w-[800px] shrink-0 pl-16">
             {educationAndCerts}
          </div>

        </motion.div>
      </div>
    </div>
  );
};
