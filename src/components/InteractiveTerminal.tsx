import { useState, useRef, useEffect } from "react";
import { ask } from "../lib/ask";

interface CommandOutput {
  command: string;
  output: React.ReactNode;
  isAgent?: boolean;
}

export default function InteractiveTerminal() {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: "pavan --init",
      output: (
        <div className="space-y-1.5 font-mono">
          <p className="text-acc font-bold flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PAVAN KUMAR CLI /// NEURAL ENGINE v3.0</span>
          </p>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Interactive terminal with integrated Autonomous AI Agent. Type any command, query <span className="text-acc">agent [prompt]</span>, or select a quick action below.
          </p>
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Strictly scroll the terminal container div ONLY (never scrolls window/page!)
  const scrollToBottom = () => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isProcessing]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed || isProcessing) return;

    const lower = trimmed.toLowerCase();

    // 1. CLEAR COMMAND
    if (lower === "clear") {
      setHistory([]);
      return;
    }

    // 2. AGENT OR NATURAL LANGUAGE QUERY ROUTING
    const isExplicitAgent = lower.startsWith("agent") || lower.startsWith("ask");
    const isStandardCommand = ["help", "?", "skills", "stack", "projects", "stats", "contact", "hire"].includes(lower);

    if (isExplicitAgent || (!isStandardCommand && trimmed.length > 5)) {
      let userQuery = trimmed;
      if (lower.startsWith("agent")) {
        userQuery = trimmed.replace(/^agent\s*/i, "").trim() || "What are Pavan's core capabilities?";
      } else if (lower.startsWith("ask")) {
        userQuery = trimmed.replace(/^ask\s*/i, "").trim() || "Tell me about Pavan Kumar.";
      }

      // Add user input to terminal
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          isAgent: true,
          output: (
            <div className="space-y-1.5 py-1 text-xs font-mono">
              <div className="flex items-center gap-2 text-acc">
                <span className="animate-spin">✦</span>
                <span className="text-neutral-400 uppercase tracking-wider text-[11px]">
                  Agent Reasoning & Querying Knowledge Base...
                </span>
              </div>
            </div>
          ),
        },
      ]);

      setIsProcessing(true);

      try {
        const agentResponse = await ask(userQuery, [], undefined, 1);

        setHistory((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            command: trimmed,
            isAgent: true,
            output: (
              <div className="space-y-2 py-1.5 text-xs font-mono">
                <div className="flex items-center gap-2 text-acc font-semibold text-[11px] uppercase tracking-widest border-b border-white/10 pb-1">
                  <span>🤖 AGENT DISPATCH</span>
                  <span className="text-neutral-500">///</span>
                  <span className="text-emerald-400">COMPLETE (200 OK)</span>
                </div>
                <p className="text-neutral-200 leading-relaxed pl-2 border-l-2 border-acc/40 whitespace-pre-wrap">
                  {agentResponse}
                </p>
              </div>
            ),
          };
          return next;
        });
      } catch {
        setHistory((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            command: trimmed,
            isAgent: true,
            output: (
              <p className="text-xs text-red-400">
                Agent query execution interrupted. Please retry or contact directly at pavan.aidev@gmail.com
              </p>
            ),
          };
          return next;
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // 3. STANDARD SYSTEM COMMANDS
    let res: React.ReactNode;

    switch (lower) {
      case "help":
      case "?":
        res = (
          <div className="space-y-1.5 text-xs text-neutral-400 font-mono">
            <p className="text-white font-semibold uppercase tracking-wider text-[11px]">Available Commands:</p>
            <p><span className="text-acc font-bold">agent [query]</span> — Query autonomous AI agent with any question</p>
            <p><span className="text-acc font-bold">skills</span> — View core tech, APIs & automation stack</p>
            <p><span className="text-acc font-bold">projects</span> — Review production systems & business impact</p>
            <p><span className="text-acc font-bold">stats</span> — Inspect verified production milestones</p>
            <p><span className="text-acc font-bold">contact</span> — Get direct communication channels & SLA</p>
            <p><span className="text-acc font-bold">clear</span> — Wipe terminal output</p>
          </div>
        );
        break;

      case "skills":
      case "stack":
        res = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-1 font-mono">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-acc font-bold block">🧠 AI & Voice Engineering:</span>
              <span className="text-neutral-300">LLaMA 3.3, Groq Whisper, Pipecat, WebRTC, ElevenLabs, RAG, Prompt Engineering</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block">⚡ Data & Enterprise APIs:</span>
              <span className="text-neutral-300">Python, SQL, PostgreSQL, Microsoft Graph API, Google Workspace, LHDN e-Invoice</span>
            </div>
          </div>
        );
        break;

      case "projects":
        res = (
          <div className="space-y-2 text-xs py-1 font-mono">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-acc/30 space-y-1">
              <p className="text-white font-bold">01 /// Aria: Ultra-Low Latency Voice AI</p>
              <p className="text-neutral-400">Groq STT + LLaMA 3.1 + ElevenLabs TTS over WebRTC with mid-sentence interruption handling.</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-acc/30 space-y-1">
              <p className="text-white font-bold">02 /// Multi-Tenant e-Invoicing Platform</p>
              <p className="text-neutral-400">Automated 2,000+ monthly documents with Malaysian LHDN regulatory schema validation.</p>
            </div>
          </div>
        );
        break;

      case "stats":
        res = (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono py-1">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-acc font-bold block text-sm">2,000+</span>
              <span className="text-[10px] text-neutral-400">Docs / Month</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-emerald-400 font-bold block text-sm">100K+</span>
              <span className="text-[10px] text-neutral-400">ETL Records</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-sky-400 font-bold block text-sm">30 Days</span>
              <span className="text-[10px] text-neutral-400">Lead Pipeline</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-purple-400 font-bold block text-sm">4+</span>
              <span className="text-[10px] text-neutral-400">Prod Systems</span>
            </div>
          </div>
        );
        break;

      case "contact":
      case "hire":
        res = (
          <div className="text-xs space-y-1.5 text-neutral-200 font-mono py-1">
            <p>📧 Email: <a href="mailto:pavan.aidev@gmail.com" className="text-acc underline font-bold">pavan.aidev@gmail.com</a></p>
            <p>💼 LinkedIn: <a href="https://linkedin.com/in/u-pavankumar" target="_blank" rel="noreferrer" className="text-acc underline">linkedin.com/in/u-pavankumar</a></p>
            <p>🐙 GitHub: <a href="https://github.com/UPavankumar" target="_blank" rel="noreferrer" className="text-acc underline">github.com/UPavankumar</a></p>
            <p>⚡ Status: <span className="text-emerald-400 font-bold">🟢 Available for AI Automation & Engineering</span></p>
          </div>
        );
        break;

      default:
        res = (
          <p className="text-xs text-neutral-400 font-mono">
            Unrecognized input: "{cmd}". Type <span className="text-acc underline font-bold">help</span> or try <span className="text-acc underline font-bold">agent [query]</span> to ask the AI agent.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: cmd, output: res }]);
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="mb-8 text-center space-y-2">
        <span className="font-mono text-xs text-acc uppercase tracking-widest px-3 py-1 rounded-full border border-acc/30 bg-acc/10">
          ✦ Interactive CLI & Agent
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Terminal & Agent Console
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto">
          Query skills, trigger autonomous agent workflows, or inspect system architecture in real-time.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#05070f] shadow-2xl overflow-hidden font-mono text-sm">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#080d1a] border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500/80 inline-block" />
            <span className="size-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs text-neutral-400 ml-2 font-mono">pavan@neural-cli:~</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AGENT READY</span>
          </div>
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-[#070a14] border-b border-white/5 text-xs overflow-x-auto">
          <span className="text-neutral-500 text-[11px] shrink-0">Prompts:</span>
          {[
            'agent "What has Pavan built with Voice AI?"',
            'agent "Explain the e-invoicing pipeline"',
            "skills",
            "projects",
            "stats",
            "contact",
            "clear",
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleCommand(prompt)}
              className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] hover:border-acc/60 hover:text-acc transition-colors text-neutral-400 text-[11px] shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Output Window (Container scrolls internally — never touches window scroll!) */}
        <div
          ref={terminalContainerRef}
          className="p-4 sm:p-6 min-h-[240px] max-h-[380px] overflow-y-auto space-y-4 select-text"
        >
          {history.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center gap-2 text-acc text-xs">
                <span className="font-bold">&gt;</span>
                <span className="text-white font-semibold">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
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
          className="flex items-center gap-2 px-4 py-3 bg-[#080d1a] border-t border-white/10"
        >
          <span className="text-acc font-bold">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help', 'skills', or 'agent [ask anything]'..."
            disabled={isProcessing}
            className="flex-1 bg-transparent text-white outline-none placeholder:text-neutral-600 font-mono text-xs sm:text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="text-xs px-4 py-1.5 rounded-lg bg-acc text-black font-bold hover:bg-white transition-all disabled:opacity-40 cursor-pointer"
          >
            {isProcessing ? "Thinking..." : "Run ↵"}
          </button>
        </form>
      </div>
    </section>
  );
}
