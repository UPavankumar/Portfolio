import { motion, MotionConfig } from "framer-motion";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { projects, type Project } from "../data/resume";
import { playClickSound, playHoverSound } from "../lib/sound";

function MiniPipeline({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] text-acc mt-4 sm:mt-6 mb-3 sm:mb-4">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-1.5 sm:gap-2">
          <span className="rounded-lg border border-acc/30 bg-acc/10 px-2 sm:px-2.5 py-0.5 sm:py-1 shadow-[0_0_10px_rgba(56,189,248,0.15)] font-semibold">{s}</span>
          {i < steps.length - 1 && <span className="text-acc/50 font-bold">→</span>}
        </span>
      ))}
    </div>
  );
}

const RAW_BASE = "https://raw.githubusercontent.com/UPavankumar/Portfolio/main/public/projects/";

const projectMeta: Record<string, { year: string; domain: string; type: string; color: string; imgL: string; imgM: string; imgR: string }> = {
  aria: {
    year: "2025",
    domain: "Voice AI & WebRTC",
    type: "Production Assistant",
    color: "bg-blue-500",
    imgL: `${RAW_BASE}aria-1.svg`,
    imgM: `${RAW_BASE}aria-2.svg`,
    imgR: `${RAW_BASE}aria-3.svg`,
  },
  "sales-agent": {
    year: "2025",
    domain: "Autonomous Agents",
    type: "Inbound Pipeline",
    color: "bg-purple-500",
    imgL: `${RAW_BASE}sales-agent-1.svg`,
    imgM: `${RAW_BASE}sales-agent-2.svg`,
    imgR: `${RAW_BASE}sales-agent-3.svg`,
  },
  einvoice: {
    year: "2024 — 2025",
    domain: "Enterprise ETL",
    type: "LHDN Compliance",
    color: "bg-emerald-500",
    imgL: `${RAW_BASE}einvoice-1.svg`,
    imgM: `${RAW_BASE}einvoice-2.svg`,
    imgR: `${RAW_BASE}einvoice-3.svg`,
  },
  content: {
    year: "2024",
    domain: "SEO Automation",
    type: "Multi-Channel Publishing",
    color: "bg-orange-500",
    imgL: `${RAW_BASE}content-1.svg`,
    imgM: `${RAW_BASE}content-2.svg`,
    imgR: `${RAW_BASE}content-3.svg`,
  },
};

export default function Projects() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      
      <main className="min-h-screen bg-[#09090b] text-zinc-100 pt-24 sm:pt-28 md:pt-36 pb-24 px-4 sm:px-6 md:px-[5vw] overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24 md:space-y-32">
          
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-acc/30 bg-acc/10 text-acc text-xs font-mono">
              <span>✦</span> Selected Case Studies & Systems
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight">
              Production <span className="text-acc">Architectures</span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-base md:text-lg leading-relaxed">
              Real-world AI implementations, automated data pipelines, and deterministic agent loops that eliminate manual human tasks in enterprise environments.
            </p>
          </div>

          {/* Projects List */}
          <div className="space-y-12 sm:space-y-20 lg:space-y-32">
            {projects.map((project: Project, i: number) => {
              const isEven = i % 2 === 0;
              const meta = projectMeta[project.id] || projectMeta.aria;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="grid grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-center p-4 sm:p-8 lg:p-12 rounded-3xl lg:rounded-[2.5rem] border border-white/10 bg-neutral-900/30 backdrop-blur-xl"
                >
                  {/* Left Info Column */}
                  <div className={`col-span-12 lg:col-span-5 ${isEven ? "" : "lg:order-2"} space-y-4 sm:space-y-6`}>
                    
                    {/* Index & Meta */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 font-mono text-xs text-neutral-400">
                      <div className="flex items-center gap-2">
                        <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-acc animate-pulse" />
                        <span className="text-acc font-bold text-[11px] sm:text-xs">PROJECT /// {project.index}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px]">
                        <span>{meta.domain}</span>
                        <span>•</span>
                        <span>{meta.year}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                      {project.title}
                    </h2>
                    
                    {/* Stack Pills */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-0.5 sm:pt-1">
                      {project.stack.map(tech => (
                        <span key={tech} className="rounded-full border border-white/10 px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono text-[9px] sm:text-[10px] md:text-[11px] text-neutral-300 bg-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Problem / Solution Breakdown */}
                    <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                        <h4 className="font-mono text-[10px] sm:text-[11px] tracking-widest text-acc uppercase font-bold">THE PROBLEM</h4>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                          {project.problem}
                        </p>
                      </div>

                      <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                        <h4 className="font-mono text-[10px] sm:text-[11px] tracking-widest text-neutral-400 uppercase font-bold">THE BUILD & ARCHITECTURE</h4>
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                          {project.build}
                        </p>
                      </div>
                    </div>
                    
                    {/* Pipeline Sequence */}
                    <MiniPipeline steps={project.pipeline} />
                    
                    {/* Outcome / Impact */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-acc/10 border border-acc/30 flex items-start gap-2.5 sm:gap-3">
                      <span className="text-acc font-bold text-sm sm:text-base">⚡</span>
                      <div>
                        <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-acc block uppercase font-bold">OUTCOME & MEASURABLE IMPACT</span>
                        <p className="text-xs sm:text-sm text-white font-medium mt-0.5">
                          {project.outcome}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Right Image Collage Column */}
                  <div className={`col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 ${isEven ? "" : "lg:order-1"}`}>
                    <div className="hidden md:flex flex-col gap-4">
                      <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group relative bg-black">
                        <img className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 opacity-60 group-hover:grayscale-25 group-hover:opacity-85 group-hover:scale-110 transition-all duration-700" src={meta.imgL} alt={project.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                      </div>
                      <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl group relative bg-black">
                        <img className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 opacity-60 group-hover:grayscale-25 group-hover:opacity-85 group-hover:scale-110 transition-all duration-700" src={meta.imgM} alt={project.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 aspect-video md:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl group self-center relative bg-black">
                      <img className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 opacity-70 group-hover:grayscale-25 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" src={meta.imgR} alt={project.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between font-mono text-xs">
                        <span className="px-2.5 sm:px-3 py-1 rounded-full bg-black/80 border border-white/15 text-white backdrop-blur-md text-[10px] sm:text-xs">
                          {meta.type}
                        </span>
                        <Link
                          to="/contact"
                          onMouseEnter={playHoverSound}
                          onClick={playClickSound}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-acc text-black font-bold flex items-center gap-1.5 shadow-lg hover:bg-white transition-all text-[10px] sm:text-xs"
                        >
                          Deploy →
                        </Link>
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </MotionConfig>
  );
}
