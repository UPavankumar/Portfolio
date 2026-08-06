import { motion, MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import { projects } from "../data/resume";

function MiniPipeline({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-acc mt-6 mb-4">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-2">
          <span className="rounded border border-acc/30 bg-acc/10 px-2 py-1 shadow-[0_0_10px_rgba(56,189,248,0.15)]">{s}</span>
          {i < steps.length - 1 && <span className="text-acc/50">→</span>}
        </span>
      ))}
    </div>
  );
}

// Assign unique, highly thematic images and colors to Pavan's specific projects
const projectAssets = {
  "aria": {
    color: "bg-blue-500",
    imgL: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop", // Sound waves / abstract AI
    imgM: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=800&auto=format&fit=crop", // Robot head
    imgR: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", // Global data network
  },
  "sales-agent": {
    color: "bg-purple-500",
    imgL: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop", // Data dashboard
    imgM: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop", // Analytics papers
    imgR: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop", // Cyber / matrix
  },
  "einvoice": {
    color: "bg-emerald-500",
    imgL: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop", // Finance / numbers
    imgM: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=800&auto=format&fit=crop", // Corporate spreadsheet / analysis
    imgR: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?q=80&w=800&auto=format&fit=crop", // Abstract data flow
  },
  "content": {
    color: "bg-orange-500",
    imgL: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=800&auto=format&fit=crop", // Blog / Writing
    imgM: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=800&auto=format&fit=crop", // Creative desk
    imgR: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop", // Minimalist workspace
  }
};

export default function Projects() {
  return (
    <MotionConfig reducedMotion="user">
      <CustomCursor />
      <Nav />
      
      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-[5vw]">
        <div className="max-w-7xl mx-auto space-y-32">
          
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">My Projects</h1>
            <p className="text-neutral-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto">
              Production AI systems, data pipelines, and automation architectures that replace manual workflows.
            </p>
          </div>

          {projects.map((project, i) => {
            const isEven = i % 2 === 0;
            const assets = projectAssets[project.id as keyof typeof projectAssets] || projectAssets["aria"];
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-12 gap-8 md:gap-20 items-center"
              >
                {/* Text Content */}
                <div className={`col-span-12 lg:col-span-4 ${isEven ? "" : "lg:order-2"} space-y-6 md:space-y-8`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-12 md:w-16 h-[2px] ${assets.color} shadow-[0_0_20px_currentColor]`} />
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter italic text-white leading-none">
                      {project.title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.stack.map(tech => (
                      <span key={tech} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] md:text-[11px] text-neutral-400 bg-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-mono text-xs tracking-widest text-neutral-500 mb-2">THE PROBLEM</h4>
                      <p className="text-base md:text-lg text-neutral-300 font-medium leading-relaxed">
                        {project.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-mono text-xs tracking-widest text-neutral-500 mb-2">THE BUILD</h4>
                      <p className="text-base md:text-lg text-neutral-400 font-medium leading-relaxed">
                        {project.build}
                      </p>
                    </div>
                  </div>
                  
                  <MiniPipeline steps={project.pipeline} />
                  
                  <p className="text-sm md:text-base text-white/90 font-medium border-l-2 border-white/20 pl-4 py-1 italic">
                    <span className="font-bold not-italic tracking-widest text-[10px] text-neutral-500 block mb-1">OUTCOME</span>
                    {project.outcome}
                  </p>
                </div>

                {/* Images Grid */}
                <div className={`col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ${isEven ? "" : "lg:order-1"}`}>
                  <div className="hidden md:flex flex-col gap-6">
                    <div className="aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group relative">
                      <img className="absolute inset-0 w-full h-full object-cover scale-110 opacity-30 group-hover:opacity-60 group-hover:scale-125 transition-all duration-[2000ms]" src={assets.imgL} alt={project.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80 pointer-events-none" />
                    </div>
                    <div className="aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group relative">
                      <img className="absolute inset-0 w-full h-full object-cover scale-110 opacity-30 group-hover:opacity-60 group-hover:scale-125 transition-all duration-[2000ms]" src={assets.imgM} alt={project.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80 pointer-events-none" />
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2 aspect-video md:aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group self-center relative">
                    <img className="absolute inset-0 w-full h-full object-cover scale-110 opacity-30 group-hover:opacity-60 group-hover:scale-125 transition-all duration-[2000ms]" src={assets.imgR} alt={project.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80 pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
      
      <Footer />
    </MotionConfig>
  );
}
