const LINKS = [
  ["work", "#work"],
  ["experience", "#experience"],
  ["skills", "#skills"],
  ["contact", "#contact"],
] as const;

export default function Nav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink/70 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 font-mono text-xs sm:px-6 sm:text-sm">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-1 rounded px-1 py-1.5 text-fg transition-colors hover:text-acc"
        >
          <span className="text-acc">~/</span>
          <span className="hidden min-[420px]:inline">pavan-kumar</span>
          <span className="min-[420px]:hidden">pk</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded px-2 py-1.5 text-mut transition-colors hover:text-fg sm:px-3"
            >
              {label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="ml-1 rounded-lg border border-line px-3 py-1.5 text-fg transition-colors hover:border-acc"
          >
            resume
          </a>
        </div>
      </div>
    </nav>
  );
}
