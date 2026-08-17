import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import IntegrationsHub from "../components/IntegrationsHub";
import TechMarquee from "../components/TechMarquee";
import { playClickSound, playHoverSound } from "../lib/sound";

const SKILL_CATEGORIES = [
  {
    id: "ai",
    title: "AI & Voice Engineering",
    icon: "🧠",
    desc: "Autonomous LLM loops, speech recognition & real-time conversational agents.",
    tools: [
      { name: "LLaMA 3.1 / 3.3", level: "Production", desc: "Agent reasoning & prompt orchestration" },
      { name: "Pipecat & WebRTC", level: "Low-latency", desc: "Sub-second voice input/output pipelines" },
      { name: "Whisper & Groq", level: "Real-time", desc: "High-speed audio transcription & STT" },
      { name: "ElevenLabs TTS", level: "Production", desc: "Ultra-realistic natural voice synthesis" },
      { name: "RAG & Vector Search", level: "Enterprise", desc: "Context retrieval & document grounding" },
      { name: "Prompt Engineering", level: "Master", desc: "Deterministic JSON schema enforcement" },
    ],
  },
  {
    id: "data",
    title: "Data Engineering & Cloud",
    icon: "⚡",
    desc: "Robust ETL pipelines, relational databases, and multi-tenant architectures.",
    tools: [
      { name: "Python", level: "Core", desc: "Automation scripts, data pipelines & microservices" },
      { name: "PostgreSQL", level: "Enterprise", desc: "Relational modeling, indexing & systems of record" },
      { name: "SQL & Query Tuning", level: "Advanced", desc: "Complex joins, CTEs & data transformations" },
      { name: "MongoDB", level: "NoSQL", desc: "Document storage & high-volume ingestion" },
      { name: "AWS S3 / EC2", level: "Cloud", desc: "Server deployment & object storage pipelines" },
      { name: "Pandas & NumPy", level: "Analytics", desc: "In-memory data wrangling & validation" },
    ],
  },
  {
    id: "apis",
    title: "Enterprise APIs & Integrations",
    icon: "🔌",
    desc: "Seamless synchronization across enterprise suites, email servers, and CRMs.",
    tools: [
      { name: "Microsoft Graph API", level: "Enterprise", desc: "Inbox ingestion, calendar & draft dispatch" },
      { name: "Google Workspace APIs", level: "Production", desc: "Drive publishing, Docs & Sheets synchronization" },
      { name: "OAuth 2.0 & JWT", level: "Security", desc: "Tenant isolation & delegated authentication" },
      { name: "REST APIs & Webhooks", level: "Architecture", desc: "Event-driven microservice orchestration" },
      { name: "Odoo CRM & ERP", level: "Integration", desc: "Lead routing & contact database sync" },
      { name: "LHDN e-Invoicing", level: "Compliance", desc: "Malaysian regulatory schema validation" },
    ],
  },
  {
    id: "bi",
    title: "Analytics & Business Intelligence",
    icon: "📊",
    desc: "Actionable KPI tracking, automated reports, and operational dashboards.",
    tools: [
      { name: "Power BI", level: "Expert", desc: "DAX formulas, SQL backend sync & executive dashboards" },
      { name: "Tableau", level: "Advanced", desc: "Exploratory visual analytics & cohort reporting" },
      { name: "Excel & OpenPyXL", level: "Automated", desc: "Programmatic spreadsheet parsing & assembly" },
      { name: "python-docx", level: "Publishing", desc: "Automated executive report generation" },
      { name: "Git & GitHub CI", level: "DevOps", desc: "Version control, code reviews & quality protocols" },
      { name: "FastAPI / Node", level: "Backend", desc: "Lightweight API gateway & webhook receivers" },
    ],
  },
];

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCategories =
    activeTab === "all"
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((cat) => cat.id === activeTab);

  return (
    <MotionConfig reducedMotion="user">
      <Nav />

      <main className="min-h-screen bg-[#030712] text-white pt-28 md:pt-36 pb-20 px-4 sm:px-6 md:px-[5vw] overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-28">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-acc/30 bg-acc/10 text-acc text-xs font-mono"
            >
              <span>✦</span> Engineering Matrix & Tech Stack
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight"
            >
              Tools & <span className="text-acc">Architectures</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-neutral-400 text-base sm:text-lg leading-relaxed"
            >
              The models, enterprise APIs, ETL libraries, and database systems I use daily to build autonomous production workflows.
            </motion.p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab("all");
              }}
              onMouseEnter={playHoverSound}
              className={`px-5 py-2.5 rounded-full border transition-all ${
                activeTab === "all"
                  ? "bg-white text-black font-bold border-white shadow-lg"
                  : "border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-white/30"
              }`}
            >
              All Categories (24+)
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playClickSound();
                  setActiveTab(cat.id);
                }}
                onMouseEnter={playHoverSound}
                className={`px-5 py-2.5 rounded-full border transition-all ${
                  activeTab === cat.id
                    ? "bg-white text-black font-bold border-white shadow-lg"
                    : "border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-white/30"
                }`}
              >
                {cat.icon} {cat.title}
              </button>
            ))}
          </div>

          {/* Infinite Marquee Strip */}
          <TechMarquee />

          {/* Skill Grid Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-8 sm:p-10 rounded-[2.5rem] border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {cat.title}
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-acc uppercase font-semibold">
                      [{String(idx + 1).padStart(2, "0")}]
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    {cat.tools.map((t) => (
                      <div
                        key={t.name}
                        className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1 hover:border-acc/40 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold text-white group-hover:text-acc transition-colors">
                            {t.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-acc border border-white/5">
                            {t.level}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-tight">
                          {t.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-500">PROVEN IN PRODUCTION</span>
                  <Link
                    to="/projects"
                    className="text-acc hover:underline flex items-center gap-1 font-semibold"
                  >
                    View Builds →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Live Integration Beam Hub */}
          <div className="p-8 sm:p-12 rounded-[2.5rem] border border-white/10 bg-neutral-900/30 backdrop-blur-xl space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-acc">
                Live Data & Protocol Hub
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Interconnected Enterprise Pipeline
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Visualizing how inputs from mailboxes, documents, and voice streams get parsed, routed through LLMs, and committed to SQL databases.
              </p>
            </div>

            <IntegrationsHub />
          </div>

          {/* CTA Banner */}
          <div className="p-8 sm:p-12 rounded-[2.5rem] border border-acc/30 bg-gradient-to-r from-acc/10 via-neutral-900/80 to-transparent backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-white">Need a custom AI stack for your team?</h3>
              <p className="text-sm text-neutral-400 max-w-md">
                Let's architect an automated voice loop, ETL pipeline, or LLM agent tailored to your workflow.
              </p>
            </div>
            <Link
              to="/contact"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="px-6 py-3.5 rounded-xl bg-acc text-black font-bold shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:bg-white transition-all hover:scale-105 font-mono text-xs shrink-0"
            >
              Discuss Architecture →
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </MotionConfig>
  );
}
