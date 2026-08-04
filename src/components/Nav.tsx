import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINKS = [
  { id: "work", label: "work", href: "#work", hideBelow: "" },
  { id: "experience", label: "experience", href: "#experience", hideBelow: "hidden md:inline-block" },
  { id: "skills", label: "skills", href: "#skills", hideBelow: "hidden sm:inline-block" },
  { id: "contact", label: "contact", href: "#contact", hideBelow: "" },
] as const;

export default function Nav() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -45% 0px",
        threshold: 0.1,
      }
    );

    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2.5 font-mono text-[11px] sm:gap-3 sm:px-6 sm:text-xs md:px-10 lg:text-sm">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-1 rounded px-1.5 py-1 text-fg transition-colors hover:text-acc"
        >
          <span className="text-acc">~/</span>
          <span className="hidden min-[420px]:inline font-semibold">pavan-kumar</span>
          <span className="min-[420px]:hidden font-semibold">pk</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative rounded-md px-2.5 py-1.5 transition-colors ${
                  isActive ? "text-acc font-semibold" : "text-mut hover:text-fg"
                } ${l.hideBelow}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-md border border-acc/40 bg-panel/80 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
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
