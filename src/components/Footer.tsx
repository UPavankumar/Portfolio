import { profile } from "../data/resume";
import SectionLabel from "./SectionLabel";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-panel/30">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <SectionLabel n="04">Contact</SectionLabel>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Have a workflow that still needs humans? <span className="text-acc">Let's fix that.</span>
        </h2>
        <div className="mt-8 flex flex-wrap gap-4 font-mono text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-lg bg-acc px-5 py-2.5 font-semibold text-ink transition-transform hover:scale-105"
          >
            {profile.email}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-line px-5 py-2.5 transition-colors hover:border-acc"
          >
            linkedin
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-line px-5 py-2.5 transition-colors hover:border-acc"
          >
            github
          </a>
        </div>
        <p className="mt-16 font-mono text-xs text-mut">
          © {new Date().getFullYear()} {profile.name} · built with React + Motion · no template was
          harmed
        </p>
      </div>
    </footer>
  );
}
