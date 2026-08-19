import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const glowBeamRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const words = wordsRef.current;
      const glowBeam = glowBeamRef.current;

      if (!section || !words) return;

      const mm = gsap.matchMedia();

      // Desktop: Pinned horizontal depth animation
      mm.add("(min-width: 1024px)", () => {
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

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            start: "top top",
            end: () => "+=" + window.innerWidth * 1.2,
            invalidateOnRefresh: true,
          },
        });

        tl.to(words, {
          x: () => -(words.scrollWidth - window.innerWidth + window.innerWidth * 0.15),
          ease: "none",
        });

        const wordElements = words.querySelectorAll(".reveal-word");
        wordElements.forEach((word) => {
          gsap.fromTo(
            word,
            {
              opacity: 0.15,
              filter: "blur(10px)",
              y: 40,
              scale: 0.92,
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
      });

      // Mobile: Clean fade-in without locking vertical touch scroll
      mm.add("(max-width: 1023px)", () => {
        const wordElements = words.querySelectorAll(".reveal-word");
        wordElements.forEach((word) => {
          gsap.fromTo(
            word,
            { opacity: 0.2, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              scrollTrigger: {
                trigger: word,
                start: "top 85%",
                end: "top 60%",
                scrub: 0.5,
              },
            }
          );
        });
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
      className="relative z-10 w-full min-h-[50vh] lg:h-screen flex flex-col items-center justify-center overflow-hidden bg-background py-14 lg:py-0 border-t border-line"
    >
      {/* Background Energy Conduit */}
      <div
        ref={glowBeamRef}
        className="absolute top-0 w-px h-full bg-gradient-to-b from-[#00f0ff] via-[#00f0ff]/30 to-transparent pointer-events-none hidden lg:block"
        style={{ transformOrigin: "top center" }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center">
        
        {/* Kinetic Header */}
        <div
          ref={wordsRef}
          className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-2.5 sm:gap-4 lg:gap-8 font-black uppercase tracking-tight text-center lg:text-left select-none text-2xl sm:text-4xl lg:text-7xl"
        >
          {phrases.map((phrase, idx) => (
            <span
              key={idx}
              className={`reveal-word inline-block transition-colors will-change-transform ${
                phrase.accent
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-teal-300 to-white drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                  : "text-fg"
              }`}
            >
              {phrase.text}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <p className="mt-6 sm:mt-8 max-w-xl text-center text-xs sm:text-base text-mut leading-relaxed px-4">
          Architecting autonomous systems that bridge raw enterprise data into production AI actions.
        </p>

      </div>
    </section>
  );
}
