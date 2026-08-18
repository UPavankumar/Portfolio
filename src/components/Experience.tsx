import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
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

    // Use MatchMedia to ONLY enable GSAP horizontal pinning on desktop (min-width: 1024px)
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const itemsCount = employment.length;
      const xPercentVal = -100 * ((itemsCount - 1) / itemsCount);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSection,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          end: () => `+=${track.offsetWidth + window.innerHeight}`,
        },
      });

      tl.to({}, { duration: 0.1 })
        .to(track, {
          xPercent: xPercentVal,
          ease: "none",
          duration: 0.8,
        })
        .to({}, { duration: 0.1 });

      const stages = document.querySelectorAll(".exhibit-preview-stage");
      stages.forEach((stage) => {
        const el = stage as HTMLElement;
        const onMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = `perspective(1000px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg) scale(1.02)`;
        };
        const onMouseLeave = () => {
          el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
        };
        el.addEventListener("mousemove", onMouseMove);
        el.addEventListener("mouseleave", onMouseLeave);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={pinSectionRef}
      id="experience"
      className="section-projects-pin lg:h-screen lg:overflow-hidden bg-panel/30 border-t border-line relative py-16 lg:py-0 px-4 sm:px-6 lg:px-0"
    >
      {/* Title overlay */}
      <div className="lg:absolute top-8 left-6 md:top-16 md:left-24 z-10 flex items-center justify-between lg:justify-start gap-4 mb-8 lg:mb-0">
        <SectionLabel n="02">Experience</SectionLabel>
        <Link
          to="/about"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-black/60 text-xs font-mono text-neutral-300 hover:text-white hover:border-acc/40 transition-colors backdrop-blur-md"
        >
          <span>Full Bio & Resume →</span>
        </Link>
      </div>

      {/* Desktop Horizontal Track / Mobile Vertical Stack */}
      <div
        ref={trackRef}
        className="projects-track flex flex-col lg:flex-row lg:h-full gap-8 lg:gap-0"
        style={{ width: "100%" }}
      >
        {employment.map((job, index) => (
          <div
            key={index}
            className="project-exhibit w-full lg:w-screen lg:h-full flex items-center justify-center p-0 sm:p-4 lg:p-24 lg:shrink-0"
          >
            <div className="exhibit-grid w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-24 items-center rounded-3xl lg:rounded-none border border-white/10 lg:border-none p-6 sm:p-8 lg:p-0 bg-panel/50 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none">
              
              {/* Exhibit Info */}
              <div className="exhibit-info flex flex-col justify-center space-y-4">
                <div className="exhibit-num font-mono text-xs sm:text-sm tracking-[0.2em] text-acc">
                  EXHIBIT /// {String(index + 1).padStart(2, "0")}
                </div>
                <h2 className="exhibit-title text-2xl sm:text-3xl lg:text-5xl font-black text-fg leading-tight">
                  {job.role}
                </h2>
                <p className="exhibit-desc text-sm sm:text-base lg:text-lg text-mut leading-relaxed">
                  {job.points[0]}
                </p>

                <div className="exhibit-stats-row flex flex-wrap gap-6 sm:gap-10 border-t border-line pt-4 sm:pt-6">
                  <div className="exhibit-stat-item flex flex-col">
                    <span className="exhibit-stat-val text-xl sm:text-2xl font-bold text-fg">{job.type}</span>
                    <span className="exhibit-stat-lbl font-mono text-[10px] sm:text-xs text-mut uppercase tracking-wider">Engagement</span>
                  </div>
                  <div className="exhibit-stat-item flex flex-col">
                    <span className="exhibit-stat-val text-xl sm:text-2xl font-bold text-fg">{job.place}</span>
                    <span className="exhibit-stat-lbl font-mono text-[10px] sm:text-xs text-mut uppercase tracking-wider">Location</span>
                  </div>
                  <div className="exhibit-stat-item flex flex-col">
                    <span className="exhibit-stat-val text-lg sm:text-xl font-bold text-acc">{job.company}</span>
                    <span className="exhibit-stat-lbl font-mono text-[10px] sm:text-xs text-mut uppercase tracking-wider">{job.period}</span>
                  </div>
                </div>
              </div>

              {/* Exhibit Stage Card */}
              <div
                className="exhibit-preview-stage relative rounded-2xl border border-line bg-ink/90 p-5 sm:p-8 shadow-2xl transition-transform duration-200 ease-out will-change-transform flex flex-col min-h-[260px] sm:min-h-[340px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="exhibit-mockup-screen flex-1 flex flex-col">
                  <div className="exhibit-screen-badge inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono text-acc mb-4 sm:mb-6 bg-acc/10 w-fit px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-acc/20">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Action & Scope
                  </div>
                  <div className="exhibit-screen-content font-mono text-xs sm:text-sm text-mut/90 leading-relaxed space-y-3 flex-1">
                    {job.points.slice(1).map((pt, i) => (
                      <div key={i} className="flex gap-2 sm:gap-3">
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
