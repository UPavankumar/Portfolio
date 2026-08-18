import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { profile } from "../data/resume";
import { formatJourneyForEmail, getVisitorJourneyData } from "../lib/tracker";

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
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        return;
      } catch (err) {
        console.error("Webhook submission failed, falling back to mailto", err);
      }
    }

    // Fallback: open mail client with full visitor navigation path attached
    const enrichedMessage = `${formData.message}\n\n${journeyEmailText}`;
    const mailtoLink = `mailto:${profile.email}?subject=${encodeURIComponent(
      formData.subject || `Inquiry from ${formData.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${enrichedMessage}`
    )}`;
    window.location.href = mailtoLink;
    setStatus("success");
  };

  return (
    <MotionConfig reducedMotion="user">
      <Nav />

      <main className="min-h-screen bg-[#02040a] text-white pt-28 md:pt-36 pb-20 px-4 sm:px-6 md:px-[5vw] overflow-x-hidden">
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
          
          {/* Header */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for AI Automation & Enterprise Roles
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight">
              Let's Build Something <span className="text-[#38bdf8]">Extraordinary.</span>
            </h1>
            
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl">
              Have a manual workflow to automate, an enterprise voice agent to deploy, or an opportunity to discuss? Reach out directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Left: Contact Channels & Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                  Direct Channels
                </h2>

                {/* Email Card */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2 hover:border-[#38bdf8]/40 transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-400">EMAIL</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(profile.email, "email")}
                      className="text-xs font-mono text-[#38bdf8] hover:underline"
                    >
                      {copiedType === "email" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="block text-base sm:text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                </div>

                {/* Phone Card */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2 hover:border-[#38bdf8]/40 transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-400">PHONE</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(profile.phone, "phone")}
                      className="text-xs font-mono text-[#38bdf8] hover:underline"
                    >
                      {copiedType === "phone" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <a
                    href={`tel:${profile.phone}`}
                    className="block text-base sm:text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>

                {/* Location */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-1">
                  <span className="text-xs font-mono text-neutral-400">LOCATION</span>
                  <p className="text-base font-bold text-white flex items-center gap-2">
                    📍 {profile.location} <span className="text-xs font-normal text-neutral-400 font-mono">(IST / UTC+5:30)</span>
                  </p>
                </div>

                {/* Social Buttons */}
                <div className="pt-2 flex flex-wrap gap-3 font-mono text-xs">
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[120px] text-center rounded-xl border border-white/10 bg-white/5 py-3 px-4 hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all font-semibold"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[120px] text-center rounded-xl border border-white/10 bg-white/5 py-3 px-4 hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all font-semibold"
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>

              {/* Quick SLA info */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  ⚡
                </div>
                <div className="text-xs text-neutral-400 leading-relaxed">
                  <span className="font-bold text-neutral-200 block">Fast Response Guarantee</span>
                  Typical reply turnaround is under 24 hours on business days.
                </div>
              </div>
            </div>

            {/* Right: Message Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Send a Message
                </h2>

                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-2xl text-emerald-400">
                      ✓
                    </div>
                    <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                    <p className="text-sm text-neutral-300 max-w-md mx-auto">
                      Thank you for reaching out. I'll review your details and get back to you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-neutral-400 uppercase">Your Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8] transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-neutral-400 uppercase">Your Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-neutral-400 uppercase">Subject / Project</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Enterprise Voice AI Pipeline"
                        className="w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-neutral-400 uppercase">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project, timeline, or objectives..."
                        className="w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#38bdf8] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full rounded-xl bg-[#38bdf8] text-black font-bold py-3.5 px-6 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {status === "submitting" ? "Sending..." : "Send Message →"}
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
