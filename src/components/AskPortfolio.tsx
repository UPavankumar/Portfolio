import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ask, extractName, type ChatMsg } from "../lib/ask";

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL as string | undefined;

// Join all messages into a readable transcript
function buildTranscript(msgs: { from: string; text: string }[]): string {
  return msgs
    .filter((m) => m.text && m.text.trim())
    .map((m) => `${m.from === "you" ? "User" : "Alfred"}: ${m.text.trim()}`)
    .join("\n\n");
}

// First user message — used as the "topic"
function firstQuestion(msgs: { from: string; text: string }[]): string {
  const userMsgs = msgs.filter((m) => m.from === "you" && m.text && m.text.trim());
  return userMsgs[0]?.text.trim().slice(0, 300) || "(no question)";
}

// Extract visitor details from their messages — no AI, just regex/pattern matching
function extractVisitorDetails(msgs: { from: string; text: string }[]): {
  email: string;
  phone: string;
  company: string;
  role: string;
} {
  const allUserText = msgs
    .filter((m) => m.from === "you" && m.text)
    .map((m) => m.text)
    .join(" ");

  // Email — standard regex
  const emailMatch = allUserText.match(
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
  );

  // Phone — 7+ digit sequences with optional +, -, spaces, parens
  const phoneMatch = allUserText.match(
    /(?:\+?\d{1,3}[\s\-]?)?\(?\d{2,5}\)?[\s\-]?\d{3,5}[\s\-]?\d{3,5}/
  );

  // Company — patterns like "work at X", "from X", "company is X", "at X company"
  const companyPatterns = [
    /(?:work(?:ing)?\s+(?:at|for|with)|from|company\s+(?:is|called)|at)\s+([A-Z][A-Za-z0-9\s&.\-]{1,40}?)(?:\s*[.,;!?]|\s+(?:and|as|where|i |we |my |for |since|in ))/i,
    /(?:represent(?:ing)?|belong\s+to|part\s+of|joined)\s+([A-Z][A-Za-z0-9\s&.\-]{1,40}?)(?:\s*[.,;!?]|\s+(?:and|as|where|i |we |my ))/i,
  ];
  let company = "";
  for (const p of companyPatterns) {
    const m = allUserText.match(p);
    if (m?.[1]) {
      company = m[1].trim();
      break;
    }
  }

  // Role/title — patterns like "I'm a developer", "I work as a PM", "my role is"
  const rolePatterns = [
    /(?:i'?m\s+a(?:n)?\s+|i\s+am\s+a(?:n)?\s+|work\s+as\s+a(?:n)?\s+|my\s+(?:role|title|position|designation)\s+is\s+)([A-Za-z\s]{2,40}?)(?:\s*[.,;!?]|\s+(?:at|in|from|and|with|for|here|who|looking))/i,
  ];
  let role = "";
  for (const p of rolePatterns) {
    const m = allUserText.match(p);
    if (m?.[1]) {
      role = m[1].trim();
      break;
    }
  }

  return {
    email: emailMatch?.[0] || "",
    phone: phoneMatch?.[0] || "",
    company,
    role,
  };
}

// Fire-and-forget lead capture — no AI, just raw data + pattern extraction
function sendLead(
  msgs: { from: string; text: string }[],
  userName: string | null
): void {
  const userMsgs = msgs.filter((m) => m.from === "you" && m.text.trim());
  if (!WEBHOOK_URL || userMsgs.length < 1) return;

  const details = extractVisitorDetails(msgs);

  const payload = JSON.stringify({
    name: userName || "Unknown Visitor",
    email: details.email,
    phone: details.phone,
    company: details.company,
    role: details.role,
    topic: firstQuestion(msgs),
    transcript: buildTranscript(msgs),
    timestamp: new Date().toISOString(),
    referrer: document.referrer || "direct",
  });

  // sendBeacon is designed for fire-and-forget — handles GAS redirects,
  // works even when the page/tab is closing, never blocks the UI
  const blob = new Blob([payload], { type: "text/plain;charset=UTF-8" });
  const sent = navigator.sendBeacon(WEBHOOK_URL, blob);

  // Fallback for older browsers where sendBeacon fails
  if (!sent) {
    fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      body: payload,
    }).catch(() => {});
  }
}

type Msg = { from: "you" | "bot"; text: string };

const SUGGESTIONS = [
  "What has he built with voice AI?",
  "What's his stack?",
  "How do I contact him?",
];

const GREETING =
  "Good day! I'm Alfred, Mr. Pavan Kumar's personal assistant. May I have the pleasure of knowing your name?";

export default function AskPortfolio() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, streaming]);

  // Escape to close — fire lead capture first
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sendLead(msgs, userName);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, msgs, userName]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // Reset conversation — capture lead from the old session first
  const handleNewChat = useCallback(() => {
    sendLead(msgs, userName);
    setMsgs([{ from: "bot", text: GREETING }]);
    setInput("");
    setBusy(false);
    setStreaming(false);
    setUserName(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs, userName]);

  const userMsgCount = msgs.filter((m) => m.from === "you").length;

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");

    // Extract name from input (mirrors Streamlit logic)
    const detectedName = extractName(q);
    if (detectedName) setUserName(detectedName);

    const history: ChatMsg[] = msgs.map((m) => ({
      role: m.from === "you" ? "user" : "assistant",
      content: m.text,
    }));

    setMsgs((m) => [...m, { from: "you", text: q }]);
    setBusy(true);
    setStreaming(true);

    // Add a placeholder bot message that we'll stream into
    setMsgs((m) => [...m, { from: "bot", text: "" }]);

    try {
      const ans = await ask(
        q,
        history,
        // onChunk: append each token to the last (bot) message
        (chunk) => {
          setMsgs((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = {
              from: "bot",
              text: copy[copy.length - 1].text + chunk,
            };
            return copy;
          });
        },
        userMsgCount + 1 // +1 because we just added one
      );

      // Fallback: If streaming didn't produce text (e.g. fallback to local answer or API error), fill in the complete answer
      setMsgs((prev) => {
        const copy = [...prev];
        const lastIndex = copy.length - 1;
        if (lastIndex >= 0 && copy[lastIndex].from === "bot" && !copy[lastIndex].text) {
          copy[lastIndex] = { from: "bot", text: ans };
        }
        return copy;
      });
    } finally {
      setBusy(false);
      setStreaming(false);
    }
  }

  return (
    <>
      {/* Launcher button */}
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

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed right-5 bottom-5 z-50 flex h-[28rem] max-h-[75svh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl"
            role="dialog"
            aria-label="Alfred, the portfolio assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-line py-2 pr-2 pl-4">
              <div className="flex items-center gap-2 min-w-0">
                <span className="truncate font-mono text-[11px] tracking-widest text-mut">
                  ALFRED{" "}
                  {userName && (
                    <span className="text-fg/60 normal-case tracking-normal">
                      · {userName}
                    </span>
                  )}
                  {" "}
                  <span className="text-acc">● online</span>
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {/* New Chat button */}
                <button
                  onClick={handleNewChat}
                  aria-label="Start new chat"
                  title="New Chat"
                  className="flex size-9 items-center justify-center rounded-lg text-mut transition-colors hover:bg-ink hover:text-fg"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                    aria-hidden
                  >
                    <path d="M4 10h12M10 4v12" />
                  </svg>
                </button>
                {/* Close button — fires lead capture before closing */}
                <button
                  onClick={() => { sendLead(msgs, userName); setOpen(false); }}
                  aria-label="Close chat"
                  className="flex size-9 items-center justify-center rounded-lg text-mut transition-colors hover:bg-ink hover:text-fg"
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
            </div>

            {/* Messages */}
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
                  {m.text ||
                    // show a blinking cursor while the placeholder is empty
                    (streaming && i === msgs.length - 1 ? (
                      <span className="inline-block w-1.5 h-3.5 bg-acc/70 animate-pulse rounded-sm" />
                    ) : null)}
                  {/* blinking cursor while streaming this message */}
                  {streaming && i === msgs.length - 1 && m.text && (
                    <span className="ml-0.5 inline-block w-1.5 h-3.5 bg-acc/70 animate-pulse rounded-sm align-middle" />
                  )}
                </div>
              ))}

              {/* Suggestion chips — only on fresh chat */}
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

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t border-line p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Ask a question about Pavan's work"
                placeholder={
                  userName
                    ? `Your message, ${userName}…`
                    : "Your message to Alfred…"
                }
                disabled={busy}
                className="min-w-0 flex-1 rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none placeholder:text-mut/60 focus:border-acc disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send question"
                className="min-w-11 rounded-lg bg-acc px-4 font-mono text-sm font-semibold text-ink disabled:opacity-50 transition-opacity"
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
