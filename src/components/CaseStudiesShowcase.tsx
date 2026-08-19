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
    <section className="py-14 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header with Scroll Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-3 sm:gap-4"
      >
        <div>
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10">
            Featured Case Studies
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mt-2 sm:mt-3 text-fg uppercase tracking-tight">
            High-ROI Engineering Builds
          </h2>
        </div>
        <p className="text-mut text-xs sm:text-sm max-w-md">
          Explore real production AI systems, automated data architectures, and high-performance WebGL builds.
        </p>
      </motion.div>

      {/* 2x2 Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        {projects.map((proj, idx) => {
          const styleAsset =
            PROJECT_ASSETS[proj.id as keyof typeof PROJECT_ASSETS] || PROJECT_ASSETS.aria;

          return (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: "-40px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              onMouseEnter={playHoverSound}
              onClick={() => {
                playClickSound();
                setSelectedProject(proj);
              }}
              className={`cyber-card rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer relative flex flex-col justify-between ${styleAsset.border}`}
            >
              {/* Top Banner Image */}
              <div className="relative h-44 sm:h-56 overflow-hidden">
                <img
                  src={styleAsset.img}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-85"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${styleAsset.gradient} opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070c18] via-transparent to-transparent" />

                {/* Outcome Badge */}
                <div className="absolute top-3.5 right-3.5 font-mono text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full bg-black/80 border border-white/20 text-[#00f0ff] shadow-lg backdrop-blur-md">
                  ⚡ {styleAsset.badge}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-fg hover:text-[#00f0ff] transition-colors leading-snug">
                  {proj.title}
                </h3>
                <p className="text-mut text-xs sm:text-sm line-clamp-2 leading-relaxed font-sans">
                  {proj.problem}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1 sm:pt-2">
                  {proj.stack.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-md border border-line/60 bg-line/30 font-mono text-[9px] sm:text-[10px] text-mut"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Row */}
                <div className="pt-2 sm:pt-4 border-t border-line/40 flex items-center justify-between font-mono text-xs text-[#00f0ff]">
                  <span className="font-bold">Inspect Architecture</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-panel border border-line rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 sm:space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-wider">
                    CASE STUDY #{selectedProject.index}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-black text-fg mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="size-8 rounded-full bg-panel-light flex items-center justify-center text-mut hover:text-fg text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm text-fg/80 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-ink/60 border border-line/40 space-y-1">
                  <span className="font-mono text-[10px] sm:text-xs text-[#00f0ff] font-bold block uppercase">
                    Challenge & Bottleneck
                  </span>
                  <p>{selectedProject.problem}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-ink/60 border border-line/40 space-y-1">
                  <span className="font-mono text-[10px] sm:text-xs text-mut font-bold block uppercase">
                    Engineering Solution
                  </span>
                  <p>{selectedProject.build}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 space-y-1">
                  <span className="font-mono text-[10px] sm:text-xs text-[#00f0ff] font-bold block uppercase">
                    Measurable Result
                  </span>
                  <p className="font-semibold text-fg">{selectedProject.outcome}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-full py-3 rounded-xl bg-white text-black font-bold font-mono text-xs hover:bg-[#00f0ff] transition-colors cursor-pointer"
              >
                Close Case Study
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
