import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { playClickSound, playHoverSound, playPopSound } from "../lib/sound";

const QUICK_ROUTES = [
  { label: "Home Base", path: "/", icon: "⚡" },
  { label: "Case Studies", path: "/projects", icon: "🚀" },
  { label: "About & Story", path: "/about", icon: "👤" },
  { label: "Skills Matrix", path: "/skills", icon: "⚙️" },
  { label: "Contact Channel", path: "/contact", icon: "📬" },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    playPopSound();

    if (query.includes("about") || query.includes("bio") || query.includes("story") || query.includes("resume")) {
      navigate("/about");
    } else if (query.includes("project") || query.includes("work") || query.includes("case") || query.includes("voice") || query.includes("invoice")) {
      navigate("/projects");
    } else if (query.includes("skill") || query.includes("tool") || query.includes("stack") || query.includes("tech")) {
      navigate("/skills");
    } else if (query.includes("contact") || query.includes("hire") || query.includes("email") || query.includes("message")) {
      navigate("/contact");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between font-sans relative overflow-hidden select-none">
      
      {/* Subtle Cyber Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient Radial Cyan Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#00f0ff]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-xl z-20">
        <Link
          to="/"
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
          className="flex items-center gap-3 group"
        >
          <div className="size-9 rounded-full bg-white text-black flex items-center justify-center font-black text-xs group-hover:rotate-12 transition-all shadow-xl">
            P.
          </div>
          <span className="font-mono text-xs font-black tracking-[0.2em] uppercase text-white">
            PAVAN KUMAR
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-[#00f0ff] hover:text-[#00f0ff] font-mono text-xs text-neutral-300 transition-all"
          >
            ← Return Home
          </Link>
        </div>
      </header>

      {/* Center 404 Main Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 max-w-3xl mx-auto w-full">
        
        {/* Status Tag */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        >
          <span className="size-2 rounded-full bg-red-500 animate-pulse" />
          <span>ERROR 404 /// ROUTE LOST IN LATENT SPACE</span>
        </motion.div>

        {/* Large Glowing 404 Typography */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-7xl sm:text-9xl md:text-[11rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-600 drop-shadow-[0_0_50px_rgba(0,240,255,0.25)]"
        >
          404
        </motion.h1>

        {/* Descriptive Text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-2 mt-4 max-w-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
            The endpoint you requested does not exist in production. Use the quick reroute gateway below to jump straight to what you're looking for.
          </p>
        </motion.div>

        {/* Interactive Quick Route Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onSubmit={handleSearchSubmit}
          className="mt-8 w-full max-w-md flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-900/90 border border-white/15 backdrop-blur-xl shadow-2xl focus-within:border-[#00f0ff] transition-colors"
        >
          <span className="text-neutral-500 pl-3 font-mono text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type 'voice AI', 'projects', 'resume'..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-neutral-500 outline-none font-mono py-2"
          />
          <button
            type="submit"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-white text-black font-mono font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            Reroute ↵
          </button>
        </motion.form>

        {/* Direct Navigation Action Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full"
        >
          {QUICK_ROUTES.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] transition-all font-mono text-xs text-neutral-300 shadow-md group cursor-pointer"
            >
              <span>{route.icon}</span>
              <span className="font-semibold">{route.label}</span>
              <span className="text-neutral-500 group-hover:text-[#00f0ff] transition-colors">→</span>
            </Link>
          ))}
        </motion.div>

      </main>

      {/* Footer Info */}
      <footer className="p-4 sm:p-6 border-t border-white/5 bg-black/20 text-center font-mono text-[10px] sm:text-xs text-neutral-500">
        <span>PAVAN KUMAR /// BUSINESS ANALYST & AI AUTOMATION ARCHITECT</span>
      </footer>

    </div>
  );
}
