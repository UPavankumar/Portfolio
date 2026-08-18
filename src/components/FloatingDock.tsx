import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "../data/resume";
import { playClickSound, playHoverSound } from "../lib/sound";

export default function FloatingDock() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    playClickSound();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] pointer-events-none">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.3 }}
        className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full border border-white/15 bg-black/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-xs font-mono select-none"
      >
        {/* About Me Link */}
        <Link
          to="/about"
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            location.pathname === "/about"
              ? "bg-white text-black font-bold shadow-lg"
              : "text-neutral-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-acc opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-acc" />
          </span>
          <span>About Me</span>
        </Link>

        <div className="h-4 w-px bg-white/10" />

        {/* Email Quick Action */}
        <button
          type="button"
          onClick={copyEmail}
          onMouseEnter={playHoverSound}
          title="Click to copy email address"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer relative"
        >
          <svg className="w-3.5 h-3.5 text-acc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span className="text-[11px]">{profile.email}</span>

          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -28 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-acc text-black font-bold text-[10px] shadow-lg whitespace-nowrap"
              >
                Copied to clipboard!
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="h-4 w-px bg-white/10" />

        {/* Social Icons */}
        <div className="flex items-center gap-1 pr-1">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={playHoverSound}
            aria-label="LinkedIn Profile"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22c-.93 0-1.68.75-1.68 1.68s.75 1.68 1.68 1.68 1.68-.75 1.68-1.68-.75-1.68-1.68-1.68Z" />
            </svg>
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={playHoverSound}
            aria-label="GitHub Profile"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
