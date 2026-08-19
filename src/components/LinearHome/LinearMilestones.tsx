import { Link } from "react-router-dom";
import { employment } from "../../data/resume";
import { playClickSound, playHoverSound } from "../../lib/sound";

export default function LinearMilestones() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto overflow-hidden">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
        <div>
          <span className="font-mono text-xs text-emerald-400 uppercase tracking-[0.25em] block mb-2">
            PROVEN TRACK RECORD
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Career Milestones.
          </h2>
        </div>

        <Link
          to="/about"
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.03] text-xs font-mono text-white hover:border-emerald-400 hover:text-emerald-400 transition-all backdrop-blur-xl"
        >
          <span>Full Biography & Résumé →</span>
        </Link>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-4 sm:space-y-6">
        {employment.map((job, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-neutral-950/60 backdrop-blur-2xl transition-all duration-300 hover:border-white/20 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#38bdf8] font-bold mb-1">
                  <span>EXHIBIT /// 0{idx + 1}</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400">{job.period}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{job.role}</h3>
              </div>

              <div className="font-mono text-xs text-right">
                <span className="text-emerald-400 font-bold block">{job.company}</span>
                <span className="text-neutral-500 text-[11px]">{job.place} ({job.type})</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
              {job.points[0]}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {job.points.slice(1).map((pt, pIdx) => (
                <span
                  key={pIdx}
                  className="text-[11px] font-mono px-3 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-neutral-400 flex items-center gap-1.5"
                >
                  <span className="text-[#38bdf8]">✓</span>
                  <span>{pt}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
