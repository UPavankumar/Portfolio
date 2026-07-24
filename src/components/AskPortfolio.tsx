import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ask, type ChatMsg } from "../lib/ask";

type Msg = { from: "you" | "bot"; text: string };

const SUGGESTIONS = ["What has he built with voice AI?", "What's his stack?", "How do I contact him?"];

const GREETING =
  "Good day! I'm Alfred, Mr. Pavan Kumar's personal assistant. How may I be of service?";

export default function AskPortfolio() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    const history: ChatMsg[] = msgs.map((m) => ({
      role: m.from === "you" ? "user" : "assistant",
      content: m.text,
    }));
    setMsgs((m) => [...m, { from: "you", text: q }]);
    setBusy(true);
    const a = await ask(q, history);
    setMsgs((m) => [...m, { from: "bot", text: a }]);
    setBusy(false);
  }

  return (
    <>
      {/* launcher hides while the panel is open — the panel has its own close */}
      <AnimatePresence>
        {!open && (
          <motion.button
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full bg-acc px-5 py-3 font-mono text-sm font-semibold text-ink shadow-lg shadow-acc/20"
            aria-expanded={open}
          >
            ask alfred
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-ink/60" />
              <span className="relative inline-flex size-2 rounded-full bg-ink" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed right-5 bottom-5 z-50 flex h-[26rem] max-h-[70svh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl"
            role="dialog"
            aria-label="Alfred, the portfolio assistant"
          >
            <div className="flex items-center justify-between gap-2 border-b border-line py-2 pr-2 pl-4">
              <span className="truncate font-mono text-[11px] tracking-widest text-mut">
                ALFRED <span className="text-acc">● online</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-mut transition-colors hover:bg-ink hover:text-fg"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="size-4"
                  aria-hidden
                >
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.from === "you"
                      ? "ml-auto bg-acc text-ink"
                      : "border border-line bg-ink text-fg/90"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {busy && (
                <div className="w-fit rounded-xl border border-line bg-ink px-3.5 py-2.5 font-mono text-sm text-mut">
                  thinking…
                </div>
              )}
              {msgs.length === 1 && (
                <div className="flex flex-col items-start gap-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="min-h-10 rounded-full border border-line px-4 py-2 text-xs text-mut transition-colors hover:border-acc hover:text-fg"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t border-line p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Ask a question about Pavan's work"
                placeholder="your message to Alfred…"
                className="min-w-0 flex-1 rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none placeholder:text-mut/60 focus:border-acc"
              />
              <button
                type="submit"
                disabled={busy}
                aria-label="Send question"
                className="min-w-11 rounded-lg bg-acc px-4 font-mono text-sm font-semibold text-ink disabled:opacity-50"
              >
                →
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
