import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data/resume";
import { playClickSound, playHoverSound } from "../lib/sound";

const PROJECT_ASSETS = {
  aria: {
    badge: "+340% Productivity",
    gradient: "from-blue-600/30 via-indigo-600/20 to-purple-600/30",
    border: "group-hover:border-[#00f0ff]",
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
  },
  "sales-agent": {
    badge: "99.4% Precision",
    gradient: "from-purple-600/30 via-pink-600/20 to-rose-600/30",
    border: "group-hover:border-purple-500",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
  einvoice: {
    badge: "0 Manual Errors",
    gradient: "from-emerald-600/30 via-teal-600/20 to-cyan-600/30",
    border: "group-hover:border-emerald-500",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
  },
  content: {
    badge: "10x Content Speed",
    gradient: "from-amber-600/30 via-orange-600/20 to-yellow-600/30",
    border: "group-hover:border-amber-500",
    img: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=800&auto=format&fit=crop",
  },
};

export default function CaseStudiesShowcase() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      {/* Header with Scroll Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4"
      >
        <div>
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10">
            Featured Case Studies
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-3 text-fg uppercase tracking-tight">
            High-ROI Engineering Builds
          </h2>
        </div>
        <p className="text-mut text-sm max-w-md">
          Explore real production AI systems, automated data architectures, and high-performance WebGL builds.
        </p>
      </motion.div>

      {/* 2x2 Grid of 3D Cards Flying In With Scroll */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((proj, idx) => {
          const styleAsset =
            PROJECT_ASSETS[proj.id as keyof typeof PROJECT_ASSETS] || PROJECT_ASSETS.aria;

          return (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 80, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: "-40px" }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              whileHover={{ y: -8, scale: 1.01 }}
              onMouseEnter={playHoverSound}
              onClick={() => {
                playClickSound();
                setSelectedProject(proj);
              }}
              className={`cyber-card rounded-2xl overflow-hidden cursor-pointer relative flex flex-col justify-between ${styleAsset.border}`}
            >
              {/* Top Banner Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={styleAsset.img}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-85"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${styleAsset.gradient} opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070c18] via-transparent to-transparent" />

                {/* Outcome Badge */}
                <div className="absolute top-4 right-4 font-mono text-xs font-bold px-3 py-1 rounded-full bg-black/80 border border-white/20 text-[#00f0ff] shadow-lg backdrop-blur-md">
                  ⚡ {styleAsset.badge}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-black text-fg hover:text-[#00f0ff] transition-colors">
                  {proj.title}
                </h3>
                <p className="text-mut text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {proj.problem}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.stack.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-md border border-line/60 bg-line/30 font-mono text-[10px] text-mut"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-line/50 text-xs font-mono text-[#00f0ff]">
                  <span>View Case Study →</span>
                  <span className="text-mut/40">CLICK TO EXPAND</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-panel p-6 sm:p-8 shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => {
                  playClickSound();
                  setSelectedProject(null);
                }}
                className="absolute top-4 right-4 size-9 rounded-full bg-line/50 text-fg hover:bg-[#00f0ff] hover:text-ink flex items-center justify-center font-bold text-sm transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div>
                <span className="font-mono text-xs text-[#00f0ff] uppercase">Detailed Case Study</span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-fg mt-1">
                  {selectedProject.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProject.stack.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-xs">
                    {t}
                  </span>
                ))}
              </div>

              <div className="space-y-4 text-sm leading-relaxed border-t border-line pt-4">
                <div>
                  <h4 className="font-mono text-xs text-mut uppercase tracking-wider mb-1">THE PROBLEM STATEMENT</h4>
                  <p className="text-fg/90">{selectedProject.problem}</p>
                </div>

                <div>
                  <h4 className="font-mono text-xs text-mut uppercase tracking-wider mb-1">THE ARCHITECTURE & BUILD</h4>
                  <p className="text-mut">{selectedProject.build}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30">
                  <h4 className="font-mono text-xs text-[#00f0ff] uppercase font-bold mb-1">OUTCOME & MEASURABLE BUSINESS IMPACT</h4>
                  <p className="text-fg font-semibold">{selectedProject.outcome}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
