import { Link } from "react-router-dom";
import { profile } from "../data/resume";
import SectionLabel from "./SectionLabel";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-panel/30 overflow-x-hidden">
      <div className="mx-auto flex min-h-[85vh] max-w-5xl flex-col justify-between px-4 sm:px-6 py-16 sm:min-h-[75vh] sm:py-20 md:px-10 lg:py-24">
        <div>
          <SectionLabel n="04">Contact</SectionLabel>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Have a workflow that still needs humans? <span className="text-acc">Let's fix that.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-mut sm:text-base">
            Whether you need a custom voice assistant, document processing pipeline, or LLM agent automation — reach out directly.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs sm:gap-4 sm:text-sm">
            <Link
              to="/contact"
              className="rounded-lg bg-acc px-6 py-3 font-semibold text-ink shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-transform hover:scale-105"
            >
              Open Contact Form →
            </Link>
            <a
              href={`mailto:${profile.email}`}
              className="rounded-lg border border-line bg-panel/60 px-5 py-3 transition-colors hover:border-acc text-neutral-300 hover:text-white"
            >
              {profile.email}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-line bg-panel/60 px-5 py-3 transition-colors hover:border-acc text-neutral-300 hover:text-white"
            >
              LinkedIn ↗
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-line bg-panel/60 px-5 py-3 transition-colors hover:border-acc text-neutral-300 hover:text-white"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-mut">
          <p>
            © {new Date().getFullYear()} {profile.name} · built with React + Motion
          </p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>·</span>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <span>·</span>
            <Link to="/projects" className="hover:text-white transition-colors">Work</Link>
            <span>·</span>
            <Link to="/skills" className="hover:text-white transition-colors">Skills</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
