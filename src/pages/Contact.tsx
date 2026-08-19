import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
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

      <main className="h-screen max-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between pt-16 sm:pt-20 pb-4 px-4 sm:px-6 md:px-10 overflow-hidden select-none">
        
        {/* Main Content Area: Centered, fits in one screen */}
        <div className="w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Direct Info & Quick Channels */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            
            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-[11px] font-mono text-zinc-300">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for AI Automation & Engineering</span>
            </div>

            {/* Headline */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Let's Build Something <span className="text-sky-400">Reliable.</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Have a manual workflow to automate, a voice agent to deploy, or a role to discuss? Reach out directly.
              </p>
            </div>

            {/* Direct Channel Cards / Copy Pills */}
            <div className="space-y-2 font-mono text-xs">
              
              {/* Email */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-sky-400">✉</span>
                  <a href={`mailto:${profile.email}`} className="text-zinc-200 hover:text-white font-medium truncate">
                    {profile.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(profile.email, "email")}
                  className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white cursor-pointer transition-colors shrink-0 ml-2"
                >
                  {copiedType === "email" ? "✓ Copied" : "Copy"}
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-emerald-400">📱</span>
                  <a href={`tel:${profile.phone}`} className="text-zinc-200 hover:text-white font-medium truncate">
                    {profile.phone}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(profile.phone, "phone")}
                  className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white cursor-pointer transition-colors shrink-0 ml-2"
                >
                  {copiedType === "phone" ? "✓ Copied" : "Copy"}
                </button>
              </div>

              {/* Social / Resume Links */}
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <a
                  href="/Pavan_Resume.pdf"
                  download="Pavan_Kumar_Resume.pdf"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                  className="flex-1 py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 text-zinc-300 hover:text-white text-center transition-colors"
                >
                  📜 Résumé PDF
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={playHoverSound}
                  className="flex-1 py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 text-zinc-300 hover:text-white text-center transition-colors"
                >
                  LinkedIn ↗
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={playHoverSound}
                  className="flex-1 py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 text-zinc-300 hover:text-white text-center transition-colors"
                >
                  GitHub ↗
                </a>
              </div>

            </div>

          </div>

          {/* Right Column: Compact Direct Message Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl p-4 sm:p-6 md:p-7 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-sky-400" />
                  <span className="text-xs sm:text-sm font-semibold text-white tracking-wide font-mono uppercase">
                    Direct Inquiry Form
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  ⚡ &lt;24h Response
                </span>
              </div>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-3 font-mono"
                >
                  <div className="size-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-xl text-emerald-400">
                    ✓
                  </div>
                  <h3 className="text-base font-bold text-white">Message Transmitted</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">
                    Thank you. Your message has been received. I will reply to your email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-semibold text-xs hover:bg-white transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full rounded-lg bg-zinc-900/80 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase">Your Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full rounded-lg bg-zinc-900/80 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase">Subject / Scope</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. AI Voice Assistant / Document Pipeline"
                      className="w-full rounded-lg bg-zinc-900/80 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase">Message</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe your project, timeline, or requirements..."
                      className="w-full rounded-lg bg-zinc-900/80 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400 transition-colors resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    onMouseEnter={playHoverSound}
                    className="w-full rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold py-2.5 px-4 font-mono text-xs transition-colors cursor-pointer text-center"
                  >
                    {status === "submitting" ? "Transmitting..." : "Send Message →"}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* Compact Footer Strip (1 Line, Zero Scroll) */}
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between pt-3 border-t border-zinc-800/80 font-mono text-[11px] text-zinc-500">
          <span>© {new Date().getFullYear()} {profile.name} · Bangalore, India</span>
          <span className="text-emerald-500 font-medium">● Verified Inbound Channel</span>
        </div>

      </main>
    </MotionConfig>
  );
}
