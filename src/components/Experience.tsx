import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { employment } from "../data/resume";
import SectionLabel from "./SectionLabel";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const pinSectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pinSection = pinSectionRef.current;
    const track = trackRef.current;

    if (!pinSection || !track) return;

    // Calculate how much we need to scroll. 
    // The exact JS from inspiration:
    // xPercent: -66.666, end: () => `+=${track.offsetWidth}`
    // Since we map dynamically, we calculate based on the number of items.
    const itemsCount = employment.length;
    // We want to translate such that the last item is in view
    const xPercentVal = -100 * ((itemsCount - 1) / itemsCount);

    const ctx = gsap.context(() => {
      // Create a timeline so we can add "empty" pauses before and after the movement
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSection,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          // We add window.innerHeight to the total scroll distance to account for the pauses
          end: () => `+=${track.offsetWidth + window.innerHeight}`,
        },
      });

      // Let it sit still for a moment (10% of the total scroll)
      tl.to({}, { duration: 0.1 })
        // Perform the actual horizontal scroll
        .to(track, {
          xPercent: xPercentVal,
          ease: "none",
          duration: 0.8,
        })
        // Let it sit still at the end for a moment (10% of the total scroll)
        .to({}, { duration: 0.1 });

      // 3D Perspective Tilt on Mouse Move (Exact JS logic)
      const stages = document.querySelectorAll(".exhibit-preview-stage");
      stages.forEach((stage) => {
        const el = stage as HTMLElement;
        el.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = `perspective(1000px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg) scale(1.02)`;
        });

        el.addEventListener("mouseleave", () => {
          el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
      });
    }, pinSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={pinSectionRef} id="experience" className="section-projects-pin h-screen overflow-hidden bg-panel/30 border-t border-line relative">
      {/* Title overlay floating above the track */}
      <div className="absolute top-10 left-10 md:top-16 md:left-24 z-10">
        <SectionLabel n="02">Experience</SectionLabel>
      </div>

      <div 
        ref={trackRef} 
        className="projects-track flex h-full"
        style={{ width: `${employment.length * 100}vw` }}
      >
        {employment.map((job, index) => (
          <div key={index} className="project-exhibit w-screen h-full flex items-center justify-center p-6 md:p-24 shrink-0">
            <div className="exhibit-grid w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              
              <div className="exhibit-info flex flex-col justify-center">
                <div className="exhibit-num font-mono text-sm tracking-[0.2em] text-acc mb-4">
                  EXHIBIT /// {String(index + 1).padStart(2, "0")}
                </div>
                <h2 className="exhibit-title text-4xl lg:text-5xl font-bold text-fg mb-6 leading-tight">
                  {job.role}
                </h2>
                <p className="exhibit-desc text-lg text-mut leading-relaxed mb-10">
                  {job.points[0]}
                </p>

                <div className="exhibit-stats-row flex gap-12 border-t border-line pt-6">
                  <div className="exhibit-stat-item flex flex-col">
                    <span className="exhibit-stat-val text-3xl font-bold text-fg mb-1">{job.type}</span>
                    <span className="exhibit-stat-lbl font-mono text-xs text-mut uppercase tracking-wider">Engagement</span>
                  </div>
                  <div className="exhibit-stat-item flex flex-col">
                    <span className="exhibit-stat-val text-3xl font-bold text-fg mb-1">{job.place}</span>
                    <span className="exhibit-stat-lbl font-mono text-xs text-mut uppercase tracking-wider">Location</span>
                  </div>
                  <div className="exhibit-stat-item flex flex-col">
                    <span className="exhibit-stat-val text-xl font-bold text-acc mb-1 mt-2">{job.company}</span>
                    <span className="exhibit-stat-lbl font-mono text-xs text-mut uppercase tracking-wider">{job.period}</span>
                  </div>
                </div>
              </div>

              <div 
                className="exhibit-preview-stage relative rounded-xl border border-line bg-ink/80 p-8 shadow-2xl transition-transform duration-200 ease-out will-change-transform flex flex-col min-h-[400px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="exhibit-mockup-screen flex-1 flex flex-col">
                  <div className="exhibit-screen-badge inline-flex items-center gap-3 text-sm font-mono text-acc mb-8 bg-acc/10 w-fit px-4 py-2 rounded-full border border-acc/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Action & Scope
                  </div>
                  <div className="exhibit-screen-content font-mono text-sm text-mut/90 leading-loose space-y-4 flex-1">
                    {job.points.slice(1).map((pt, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-acc shrink-0">[{i + 1}]</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
