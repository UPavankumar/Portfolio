import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { profile } from "../data/resume";
import { formatJourneyForEmail, getVisitorJourneyData } from "../lib/tracker";
import { playClickSound, playHoverSound, playPopSound } from "../lib/sound";

export default function Contact() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    playPopSound();
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setStatus("submitting");

    const journeyData = getVisitorJourneyData();
    const journeyEmailText = formatJourneyForEmail();

    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            source: "Contact Page Form",
            timestamp: new Date().toISOString(),
            visitorJourney: journeyData,
            navigationPath: journeyData.pathSummary,
            timeOnSite: journeyData.durationFormatted,
          }),
        });
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        playPopSound();
        return;
      } catch (err) {
        console.error("Webhook submission failed, falling back to mailto", err);
      }
    }

    // Fallback: open mail client
    const enrichedMessage = `${formData.message}\n\n${journeyEmailText}`;
    const mailtoLink = `mailto:${profile.email}?subject=${encodeURIComponent(
      formData.subject || `Inquiry from ${formData.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${enrichedMessage}`
    )}`;
    window.location.href = mailtoLink;
    setStatus("success");
    playPopSound();
  };

  return (
    <MotionConfig reducedMotion="user">
      <Nav />

      <main className="min-h-screen bg-[#02040a] text-white pt-24 sm:pt-28 md:pt-36 pb-24 px-4 sm:px-6 md:px-[5vw] overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          
          {/* Main 2-Column Desktop Grid / 1-Column Mobile Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Headline, Bio & Direct Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Header */}
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available for AI Automation & Enterprise Roles</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                  Let's Build Something <span className="text-[#38bdf8]">Extraordinary.</span>
                </h1>
                
                <p className="text-neutral-400 text-xs sm:text-sm lg:text-base leading-relaxed">
                  Have a manual enterprise workflow to automate, a low-latency voice pipeline to deploy, or a project to consult on? Let's connect directly.
                </p>
              </div>

              {/* Mobile Quick Action Pills (< 1024px) */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs lg:hidden">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-200">
                  <span className="text-[#38bdf8]">✉</span>
                  <a href={`mailto:${profile.email}`} className="font-bold hover:text-[#38bdf8]">{profile.email}</a>
                  <button onClick={() => copyToClipboard(profile.email, "email")} className="text-[10px] text-neutral-400 hover:text-white px-1.5 py-0.5 rounded bg-black/40 border border-white/10 ml-1">
                    {copiedType === "email" ? "✓" : "Copy"}
                  </button>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-200">
                  <span className="text-emerald-400">📱</span>
                  <a href={`tel:${profile.phone}`} className="font-bold hover:text-emerald-400">{profile.phone}</a>
                  <button onClick={() => copyToClipboard(profile.phone, "phone")} className="text-[10px] text-neutral-400 hover:text-white px-1.5 py-0.5 rounded bg-black/40 border border-white/10 ml-1">
                    {copiedType === "phone" ? "✓" : "Copy"}
                  </button>
                </div>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white">LinkedIn ↗</a>
                <a href={profile.github} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white">GitHub ↗</a>
              </div>

              {/* Desktop Direct Channel Cards (≥ 1024px) */}
              <div className="hidden lg:flex flex-col gap-3 font-mono">
                {/* Email Card */}
                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-[#38bdf8]/40 transition-colors flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Direct Email</span>
                    <a
                      href={`mailto:${profile.email}`}
                      onMouseEnter={playHoverSound}
                      onClick={playClickSound}
                      className="text-sm font-bold text-white hover:text-[#38bdf8] transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(profile.email, "email")}
                    className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[#38bdf8] border border-white/10 transition-colors cursor-pointer"
                  >
                    {copiedType === "email" ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                {/* Phone Card */}
                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-emerald-500/40 transition-colors flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Phone / WhatsApp</span>
                    <a
                      href={`tel:${profile.phone}`}
                      onMouseEnter={playHoverSound}
                      onClick={playClickSound}
                      className="text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                    >
                      {profile.phone}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(profile.phone, "phone")}
                    className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-emerald-400 border border-white/10 transition-colors cursor-pointer"
                  >
                    {copiedType === "phone" ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                {/* Location & Social Row */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-neutral-900/40 border border-white/10 space-y-0.5">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Location</span>
                    <span className="text-white font-bold block">{profile.location} <span className="text-neutral-500 font-normal text-[10px]">(IST)</span></span>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={playHoverSound}
                      onClick={playClickSound}
                      className="flex-1 p-3.5 rounded-2xl bg-neutral-900/40 border border-white/10 hover:border-[#38bdf8] text-center text-white font-bold flex items-center justify-center transition-colors"
                    >
                      LinkedIn ↗
                    </a>
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={playHoverSound}
                      onClick={playClickSound}
                      className="flex-1 p-3.5 rounded-2xl bg-neutral-900/40 border border-white/10 hover:border-[#38bdf8] text-center text-white font-bold flex items-center justify-center transition-colors"
                    >
                      GitHub ↗
                    </a>
                  </div>
                </div>

                {/* SLA Guarantee */}
                <div className="p-3.5 rounded-2xl bg-[#00f0ff]/5 border border-[#00f0ff]/20 flex items-center gap-3">
                  <span className="text-[#00f0ff] text-base">⚡</span>
                  <span className="text-xs text-neutral-300">
                    <strong className="text-white">Fast Response Guarantee:</strong> Typical reply turnaround is under 24 hours.
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: High-End Glassmorphic Message Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-2xl p-5 sm:p-8 md:p-10 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#38bdf8] animate-pulse" />
                    <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider font-mono">
                      Send Direct Message
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                    ⚡ Direct Inquiry Channel
                  </span>
                </div>

                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4 font-mono"
                  >
                    <div className="size-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-2xl text-emerald-400 shadow-lg">
                      ✓
                    </div>
                    <h3 className="text-lg font-bold text-white">Message Transmitted!</h3>
                    <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-sans leading-relaxed">
                      Thank you for reaching out. Your message and visitor telemetry have been logged. I will get back to you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Send Another Note
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Your Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8] transition-colors font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Your Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8] transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Subject / Workflow Scope</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Enterprise Voice AI Assistant / ETL Automation"
                        className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8] transition-colors font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your requirements, project scope, or opportunity..."
                        className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8] transition-colors resize-none font-sans leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      onMouseEnter={playHoverSound}
                      className="w-full rounded-xl bg-[#38bdf8] hover:bg-white text-black font-bold py-3.5 px-6 font-mono text-xs sm:text-sm shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer text-center"
                    >
                      {status === "submitting" ? "Transmitting..." : "Transmit Message →"}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </MotionConfig>
  );
}
