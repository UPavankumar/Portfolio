import { motion } from "framer-motion";

const SKILLS_LIST = [
  { name: "React 19", category: "Frontend", level: "Expert", color: "#38bdf8" },
  { name: "Three.js / WebGL", category: "3D Graphics", level: "Advanced", color: "#8b5cf6" },
  { name: "Python AI & LLMs", category: "AI Automation", level: "Expert", color: "#10b981" },
  { name: "OpenAI & LangChain", category: "Agentic Systems", level: "Expert", color: "#f59e0b" },
  { name: "Voice AI & Whisper", category: "Speech AI", level: "Advanced", color: "#ec4899" },
  { name: "FastAPI / Python", category: "Backend", level: "Expert", color: "#06b6d4" },
  { name: "Supabase & Postgres", category: "Database", level: "Expert", color: "#3b82f6" },
  { name: "Tailwind CSS v4", category: "Styling", level: "Master", color: "#6366f1" },
  { name: "GSAP & Framer Motion", category: "Animations", level: "Master", color: "#a855f7" },
  { name: "TypeScript", category: "Core", level: "Master", color: "#38bdf8" }
];

export default function TechMarquee() {
  // Duplicate array for seamless infinite marquee loop
  const doubleList = [...SKILLS_LIST, ...SKILLS_LIST];

  return (
    <div className="relative py-8 border-y border-line bg-panel/30 overflow-hidden select-none">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#030712] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#030712] to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
        {doubleList.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-line bg-panel/80 hover:border-acc/50 transition-all duration-300 backdrop-blur-md group"
          >
            <span
              className="size-2 rounded-full animate-pulse"
              style={{ backgroundColor: skill.color, boxShadow: `0 0 8px ${skill.color}` }}
            />
            <span className="font-mono text-xs font-semibold text-fg group-hover:text-acc transition-colors">
              {skill.name}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-line/50 text-mut">
              {skill.category}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
