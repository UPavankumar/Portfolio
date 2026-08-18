import { useState, useRef, useEffect } from "react";
import { ask } from "../lib/ask";

interface CommandOutput {
  id: string;
  command: string;
  isAgent?: boolean;
  reasoningSteps?: string[];
  outputText: string;
  isTyping?: boolean;
}

export default function InteractiveTerminal() {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: "init",
      command: "pavan --init",
      isAgent: false,
      outputText:
        "⚡ PAVAN KUMAR CLI /// AUTONOMOUS AGENT CONSOLE v3.2\nType any technical question, run 'agent [prompt]', or query 'skills', 'projects', 'contact'.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Strictly scroll the terminal container div ONLY (never scrolls window/page!)
  const scrollToBottom = () => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isBusy]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed || isBusy) return;

    const lower = trimmed.toLowerCase();

    // CLEAR COMMAND
    if (lower === "clear") {
      setHistory([]);
      return;
    }

    setIsBusy(true);

    const cmdId = "cmd_" + Math.random().toString(36).substring(2, 9);
    let queryForAgent = trimmed;

    if (lower.startsWith("agent")) {
      queryForAgent = trimmed.replace(/^agent\s*/i, "").trim() || "What are Pavan's primary AI skills and achievements?";
    } else if (lower.startsWith("ask")) {
      queryForAgent = trimmed.replace(/^ask\s*/i, "").trim() || "Tell me about Pavan's portfolio.";
    }

    // Step 1: Add command with live reasoning logs
    const initialSteps = [
      `[1/3] Parsing Intent: "${queryForAgent.slice(0, 35)}${queryForAgent.length > 35 ? "..." : ""}"`,
      `[2/3] Querying Knowledge Index & Pipeline Architectures...`,
    ];

    setHistory((prev) => [
      ...prev,
      {
        id: cmdId,
        command: trimmed,
        isAgent: true,
        reasoningSteps: initialSteps,
        outputText: "",
        isTyping: true,
      },
    ]);

    // Give a brief realistic pause for step 2
    await new Promise((r) => setTimeout(r, 220));

    // Fetch answer from Agent / Knowledge Engine
    let finalAnswer = "";
    try {
      finalAnswer = await ask(queryForAgent, [], undefined, 1);
    } catch {
      finalAnswer = `Mr. Pavan Kumar is a Business Analyst specializing in AI Automation, real-time Voice AI pipelines (Aria WebRTC), multi-tenant e-invoicing platforms (2,000+ docs/mo), and autonomous outbound/inbound sales agents with Python, SQL, PostgreSQL, and LLMs. Contact directly at pavan.aidev@gmail.com.`;
    }

    // Step 2: Add 3rd step log and begin character-by-character typewriter effect
    setHistory((prev) =>
      prev.map((item) =>
        item.id === cmdId
          ? {
              ...item,
              reasoningSteps: [
                ...initialSteps,
                `[3/3] Synthesizing response stream...`,
              ],
            }
          : item
      )
    );

    await new Promise((r) => setTimeout(r, 120));

    // Typewriter effect loop
    let currentText = "";
    const speed = Math.max(8, Math.min(22, Math.floor(1200 / finalAnswer.length)));

    for (let i = 0; i < finalAnswer.length; i++) {
      currentText += finalAnswer[i];

      // Update state in small batches or per character
      if (i % 2 === 0 || i === finalAnswer.length - 1) {
        const textSnapshot = currentText;
        setHistory((prev) =>
          prev.map((item) =>
            item.id === cmdId
              ? {
                  ...item,
                  outputText: textSnapshot,
                  isTyping: i < finalAnswer.length - 1,
                }
              : item
          )
        );
        scrollToBottom();
      }

      await new Promise((r) => setTimeout(r, speed));
    }

    // Finish typing
    setHistory((prev) =>
      prev.map((item) =>
        item.id === cmdId
          ? {
              ...item,
              outputText: finalAnswer,
              isTyping: false,
            }
          : item
      )
    );

    setIsBusy(false);
  };

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8 text-center space-y-2">
        <span className="font-mono text-[10px] sm:text-xs text-acc uppercase tracking-widest px-3 py-1 rounded-full border border-acc/30 bg-acc/10">
          ✦ Interactive CLI & Autonomous Agent
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Terminal & Agent Console
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto">
          Type any technical query or command to test Pavan's AI knowledge engine in real-time.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#05070f] shadow-2xl overflow-hidden font-mono text-sm">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#080d1a] border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <span className="size-2.5 sm:size-3 rounded-full bg-red-500/80 inline-block" />
            <span className="size-2.5 sm:size-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="size-2.5 sm:size-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-[11px] sm:text-xs text-neutral-400 ml-1.5 sm:ml-2 font-mono">pavan@neural-cli:~</span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono text-neutral-500 flex items-center gap-1.5 sm:gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* Quick Action Chips (Smooth horizontal scroll on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#070a14] border-b border-white/5 text-xs overflow-x-auto no-scrollbar sm:flex-wrap">
          <span className="text-neutral-500 text-[10px] sm:text-[11px] shrink-0">Prompts:</span>
          {[
            'agent "What has Pavan built with Voice AI?"',
            'agent "Explain the e-invoicing pipeline"',
            'agent "What is Pavan\'s full stack?"',
            'agent "How to contact Pavan?"',
            "clear",
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleCommand(prompt)}
              className="px-2.5 sm:px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] hover:border-acc/60 hover:text-acc transition-colors text-neutral-400 text-[10px] sm:text-[11px] shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Output Window (Container scrolls internally — never touches window scroll!) */}
        <div
          ref={terminalContainerRef}
          className="p-3.5 sm:p-6 min-h-[220px] sm:min-h-[260px] max-h-[380px] sm:max-h-[400px] overflow-y-auto space-y-4 select-text"
        >
          {history.map((item) => (
            <div key={item.id} className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 text-acc text-xs">
                <span className="font-bold">&gt;</span>
                <span className="text-white font-semibold break-all">{item.command}</span>
              </div>

              {/* Reasoning Steps (if Agent) */}
              {item.reasoningSteps && (
                <div className="pl-3 sm:pl-4 space-y-1 text-[10px] sm:text-[11px] font-mono text-neutral-500">
                  {item.reasoningSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-acc">✦</span>
                      <span className="break-words">{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Live Typed Output Content */}
              {item.outputText ? (
                <div className="pl-3 sm:pl-4 border-l-2 border-acc/40 py-1">
                  <p className="text-neutral-200 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                    {item.outputText}
                    {item.isTyping && (
                      <span className="inline-block w-1.5 sm:w-2 h-3.5 sm:h-4 bg-acc animate-pulse ml-1 align-middle" />
                    )}
                  </p>
                </div>
              ) : item.isTyping ? (
                <div className="pl-3 sm:pl-4 py-1 flex items-center gap-2 text-xs text-acc">
                  <span className="animate-spin">✦</span>
                  <span className="animate-pulse text-neutral-400 text-xs">Agent thinking...</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Input Line */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              handleCommand(input);
              setInput("");
            }
          }}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#080d1a] border-t border-white/10"
        >
          <span className="text-acc font-bold">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything or 'agent [question]'..."
            disabled={isBusy}
            className="flex-1 bg-transparent text-white outline-none placeholder:text-neutral-600 font-mono text-xs sm:text-sm disabled:opacity-50 min-w-0"
          />
          <button
            type="submit"
            disabled={isBusy || !input.trim()}
            className="text-xs px-3 sm:px-4 py-1.5 rounded-lg bg-acc text-black font-bold hover:bg-white transition-all disabled:opacity-40 cursor-pointer shrink-0"
          >
            {isBusy ? "..." : "Run ↵"}
          </button>
        </form>
      </div>
    </section>
  );
}
