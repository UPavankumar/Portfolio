import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const section = sectionRef.current;
      const textContainer = textContainerRef.current;

      if (!section || !textContainer) return;

      const horizontalTween = gsap.to(textContainer, {
        x: () => -(textContainer.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          start: "top top",
          end: () => "+=" + textContainer.scrollWidth * 0.6,
          invalidateOnRefresh: true
        }
      });

      const chars = textContainer.querySelectorAll('.char');
      chars.forEach((char) => {
        gsap.from(char, {
          y: () => gsap.utils.random(-250, 250),
          rotation: () => gsap.utils.random(-30, 30),
          opacity: 0,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: char,
            containerAnimation: horizontalTween,
            start: "left 95%",
            end: "left 45%",
            scrub: true
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const text = "From concept to reality — I build what matters.";

  return (
    <section 
      ref={sectionRef} 
      className="h-[40vh] md:h-[60vh] lg:h-[80vh] flex items-center overflow-hidden bg-[#050505] border-t border-white/5 relative z-10 text-white"
    >
      <div 
        ref={textContainerRef} 
        className="flex whitespace-nowrap px-[12vw] md:px-[20vw] gap-[4vw]"
      >
        <h3 className="text-[clamp(2.5rem,12vw,14rem)] font-black tracking-tighter leading-[1.1] flex items-center uppercase">
          {text.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="flex mr-[0.4em]">
              {word.split("").map((char, charIndex) => (
                <span key={charIndex} className="char inline-block">
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h3>
      </div>
    </section>
  );
}
