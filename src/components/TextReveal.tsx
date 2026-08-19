import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const glowBeamRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const container = containerRef.current;
      const words = wordsRef.current;
      const glowBeam = glowBeamRef.current;

      if (!section || !container || !words) return;

      // 1. Smoothly expand and merge the carried energy conduit into the section
      if (glowBeam) {
        gsap.fromTo(
          glowBeam,
          { scaleY: 0, opacity: 0 },
          {
            scaleY: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 30%",
              scrub: true,
            },
          }
        );
      }

      // 2. Main Horizontal & Depth Emerge Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          start: "top top",
          end: () => "+=" + Math.max(window.innerWidth * 1.2, 800),
          invalidateOnRefresh: true,
        },
      });

      // Smooth horizontal translate
      tl.to(words, {
        x: () => -(words.scrollWidth - window.innerWidth + window.innerWidth * 0.2),
        ease: "none",
      });

      // 3. Smooth word-by-word luminous reveal
      const wordElements = words.querySelectorAll(".reveal-word");
      wordElements.forEach((word) => {
        gsap.fromTo(
          word,
          {
            opacity: 0.15,
            filter: "blur(8px)",
            y: 30,
            scale: 0.94,
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: word,
              containerAnimation: tl,
              start: "left 90%",
              end: "left 40%",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const phrases = [
    { text: "FROM CONCEPT", accent: false },
    { text: "TO REALITY", accent: true },
    { text: "—", accent: false },
    { text: "I BUILD", accent: false },
    { text: "WHAT MATTERS.", accent: true },
  ];

  return (
    <section
      ref={sectionRef}
      className="h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-b from-[#030712] via-[#050914] to-[#030712] relative z-10 text-white select-none"
    >
      {/* Top Merging Energy Conduit connecting directly from Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
        <div
          ref={glowBeamRef}
          className="w-[2px] h-32 bg-gradient-to-b from-[#00f0ff] via-[#00f0ff]/60 to-transparent shadow-[0_0_20px_#00f0ff] origin-top"
        />
      </div>

      {/* Ambient background glow backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(0,240,255,0.06),transparent_100%)] pointer-events-none" />

      {/* Section Sub-Telemetry */}
      <div className="absolute top-10 sm:top-12 left-6 sm:left-16 font-mono text-[10px] sm:text-xs text-neutral-500 tracking-[0.25em] uppercase flex items-center gap-3">
        <span className="size-2 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]" />
        <span>CORE MOTTO /// SEAMLESS EXECUTION</span>
      </div>

      {/* Continuous Typography Track */}
      <div ref={containerRef} className="w-full flex items-center">
        <div
          ref={wordsRef}
          className="flex items-center gap-[4vw] sm:gap-[5vw] whitespace-nowrap pl-[10vw] pr-[20vw]"
        >
          {phrases.map((phrase, i) => (
            <div
              key={i}
              className="reveal-word flex items-center font-black tracking-tighter uppercase text-[clamp(2.8rem,9vw,11rem)] leading-none will-change-transform"
            >
              {phrase.accent ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-teal-300 to-white drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
                  {phrase.text}
                </span>
              ) : (
                <span className="text-white/90 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                  {phrase.text}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sub-Indicator */}
      <div className="absolute bottom-10 sm:bottom-12 right-6 sm:right-16 font-mono text-[10px] text-neutral-500 tracking-widest uppercase flex items-center gap-2">
        <span>SCROLL TO ADVANCE PIPELINE</span>
        <span className="text-[#00f0ff]">→</span>
      </div>
    </section>
  );
}
