const LINKS = [
  // `hideBelow` keeps the phone nav from overflowing; full set returns at sm/md.
  { label: "work", href: "#work", hideBelow: "" },
  { label: "experience", href: "#experience", hideBelow: "hidden md:inline-block" },
  { label: "skills", href: "#skills", hideBelow: "hidden sm:inline-block" },
  { label: "contact", href: "#contact", hideBelow: "" },
] as const;

export default function Nav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink/70 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2.5 font-mono text-[11px] sm:gap-3 sm:px-6 sm:text-xs md:px-10 lg:text-sm">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-1 rounded px-1 py-1.5 text-fg transition-colors hover:text-acc"
        >
          <span className="text-acc">~/</span>
          <span className="hidden min-[420px]:inline">pavan-kumar</span>
          <span className="min-[420px]:hidden">pk</span>
        </a>
        <div className="flex items-center gap-0.5 sm:gap-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded px-1.5 py-1.5 text-mut transition-colors hover:text-fg sm:px-2.5 lg:px-3 ${l.hideBelow}`}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
