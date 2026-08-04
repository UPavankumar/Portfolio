import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINKS = [
  { id: "work", label: "work", href: "#work" },
  { id: "experience", label: "experience", href: "#experience" },
  { id: "skills", label: "skills", href: "#skills" },
  { id: "contact", label: "contact", href: "#contact" },
] as const;

export default function Nav() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      // Clear highlight if scrolled up into top hero section
      if (window.scrollY < 120) {
        setActiveId("");
        return;
      }

      // Detect bottom of page so contact activates even if footer is short
      const isAtBottom =
        window.innerHeight + Math.ceil(window.scrollY) >=
        document.documentElement.scrollHeight - 60;

      if (isAtBottom) {
        setActiveId("contact");
      }
    };

    // Entry-trigger observer: activates a section as soon as its top enters upper 30% of screen
    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 120) {
          setActiveId("");
          return;
        }

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-1 px-3 py-2 font-mono text-[11px] sm:gap-3 sm:px-6 sm:py-2.5 sm:text-xs md:px-10 lg:text-sm">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-1 rounded px-1.5 py-1 text-fg transition-colors hover:text-acc"
        >
          <span className="text-acc">~/</span>
          <span className="hidden min-[400px]:inline font-semibold">pavan-kumar</span>
          <span className="min-[400px]:hidden font-semibold">pk</span>
        </a>
        <div className="flex items-center gap-0.5 min-[380px]:gap-1 sm:gap-2">
          {LINKS.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative rounded-md px-1.5 py-1 transition-colors min-[380px]:px-2.5 min-[380px]:py-1.5 sm:px-3 ${
                  isActive ? "text-acc font-semibold" : "text-mut hover:text-fg"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-md border border-acc/40 bg-panel/90 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
