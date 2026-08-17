import { motion, MotionConfig } from "framer-motion";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { profile, employment, education, certifications, stats } from "../data/resume";
import { playClickSound, playHoverSound } from "../lib/sound";

export default function About() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />

      <main className="min-h-screen bg-[#030712] text-white pt-28 md:pt-36 pb-20 px-4 sm:px-6 md:px-[5vw] overflow-x-hidden">
        <div className="max-w-6xl mx-auto space-y-20 md:space-y-28">
          
          {/* Top Availability Ticker */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between flex-wrap gap-4 py-3 px-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl font-mono text-xs text-neutral-400"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-white font-semibold">AVAILABLE FOR AI AUTOMATION & ENTERPRISE ROLES</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>📍 {profile.location}</span>
              <span>•</span>
              <span className="text-acc font-semibold">UTC+5:30</span>
            </div>
          </motion.div>

          {/* Hero Section: Bio + Headshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Bio & Statement */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-acc/30 bg-acc/10 text-acc text-xs font-mono">
                <span>✦</span> Business Analyst & AI Engineer
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
                I build what <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-acc via-teal-300 to-white">
                  companies do by hand.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-neutral-300 font-medium leading-relaxed">
                {profile.summary}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4 font-mono text-xs">
                <a
                  href="/Pavan_Resume.pdf"
                  download="Pavan_Kumar_Resume.pdf"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                  className="px-6 py-3.5 rounded-xl bg-acc text-black font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:bg-white hover:scale-105 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Full Resume (.PDF)
                </a>

                <Link
                  to="/contact"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                  className="px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:border-acc hover:bg-acc/10 text-white font-semibold transition-all hover:scale-105"
                >
                  Get in Touch →
                </Link>
              </div>
            </motion.div>

            {/* Right: Headshot & Identity Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-neutral-900/60 shadow-2xl p-3 group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                  <img
                    src="/HeadShot.jpg"
                    alt={profile.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Badge on Photo */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 border border-white/10 backdrop-blur-md">
                    <h3 className="text-base font-bold text-white">{profile.name}</h3>
                    <p className="text-xs text-acc font-mono">{profile.role} · {profile.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Key Metrics Strip (like befreaky stats) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-lg flex flex-col justify-between"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  <span className="text-acc">{stat.value}</span>
                  <span>{stat.suffix}</span>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-neutral-400 font-mono leading-snug">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Philosophy / What I Do */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl space-y-6"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-acc">
              Engineering Philosophy
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white max-w-3xl leading-snug">
              Replacing fragmented manual work with deterministic code & autonomous AI loops.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-sm text-neutral-300">
              <div className="space-y-2 p-5 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-acc font-mono text-xs font-bold">[01] Zero-Latency Voice</span>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Real-time WebRTC + Whisper voice loops engineered to respond under 600ms without walkie-talkie awkwardness.
                </p>
              </div>
              <div className="space-y-2 p-5 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-acc font-mono text-xs font-bold">[02] Enterprise Document ETL</span>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Robust schema-validated extraction from arbitrary PDFs and Excels directly into Postgres and regulatory gateways.
                </p>
              </div>
              <div className="space-y-2 p-5 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-acc font-mono text-xs font-bold">[03] Autonomous Inbound Agents</span>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Email-to-lead qualification loops that research target companies and create human-level responses within minutes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Career & Employment Timeline */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-acc">
                  Experience History
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mt-1">
                  Career & Roles
                </h2>
              </div>
              <span className="font-mono text-xs text-neutral-500">
                2024 — PRESENT
              </span>
            </div>

            <div className="space-y-6">
              {employment.map((job, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-neutral-900/40 hover:border-acc/40 transition-colors space-y-6"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-white">{job.role}</h3>
                        <span className="px-3 py-0.5 rounded-full bg-acc/10 border border-acc/30 text-acc font-mono text-[11px]">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-sm font-mono text-neutral-400 mt-1">
                        <span className="text-white font-semibold">{job.company}</span> · {job.place}
                      </p>
                    </div>

                    <span className="font-mono text-xs text-neutral-400 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 w-fit">
                      {job.period}
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-white/5 font-mono text-xs sm:text-sm text-neutral-300">
                    {job.points.map((point, pIdx) => (
                      <div key={pIdx} className="flex gap-3 items-start">
                        <span className="text-acc shrink-0 mt-0.5">✦</span>
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education & Certifications Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl border border-white/10 bg-neutral-900/40 space-y-6"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-acc">
                  Academic Background
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Education</h3>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-lg font-bold text-white">{education.school}</h4>
                <p className="text-sm text-acc font-mono">{education.degree}</p>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-2 border-t border-white/5">
                  <span>{education.period}</span>
                  <span className="px-2.5 py-1 rounded bg-white/5 text-white font-bold">{education.detail}</span>
                </div>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl border border-white/10 bg-neutral-900/40 space-y-6"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-acc">
                  Accreditations
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Certifications</h3>
              </div>

              <div className="space-y-4 pt-2">
                {certifications.map((cert, cIdx) => (
                  <div key={cIdx} className="p-4 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-white">{cert}</span>
                    <span className="text-xs text-acc font-mono shrink-0">✓ Verified</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Call to Action Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-3xl border border-acc/30 bg-gradient-to-r from-acc/10 via-neutral-900/80 to-transparent backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-8"
          >
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-white">Let's discuss an engineering build.</h3>
              <p className="text-sm text-neutral-400 max-w-md">
                Available for AI automation architecture, consulting, or full-time opportunities.
              </p>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs shrink-0">
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-acc text-black font-bold shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:bg-white transition-all hover:scale-105"
              >
                Send a Message →
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </MotionConfig>
  );
}
