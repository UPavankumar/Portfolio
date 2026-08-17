import { useState, useRef, useEffect } from "react";

interface CommandOutput {
  command: string;
  output: React.ReactNode;
}

export default function InteractiveTerminal() {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: "pavan --welcome",
      output: (
        <div className="space-y-1">
          <p className="text-acc font-bold">⚡ Pavan Kumar CLI v2.5.0 (Interactive Playground)</p>
          <p className="text-mut text-xs">Type a command or click a quick action below to explore profile details.</p>
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    let res: React.ReactNode;

    switch (cleanCmd) {
      case "help":
      case "?":
        res = (
          <div className="space-y-1 text-xs text-mut">
            <p className="text-fg font-semibold">Available Commands:</p>
            <p><span className="text-acc">skills</span> — View core technology & automation stack</p>
            <p><span className="text-acc">projects</span> — View top high-impact projects & ROI</p>
            <p><span className="text-acc">stats</span> — View key metrics & numbers</p>
            <p><span className="text-acc">contact</span> — Get direct contact & meeting link</p>
            <p><span className="text-acc">clear</span> — Clear terminal output</p>
          </div>
        );
        break;

      case "skills":
      case "stack":
        res = (
          <div className="grid grid-cols-2 gap-2 text-xs py-1">
            <div className="p-2 rounded bg-line/30 border border-line">
              <span className="text-acc font-semibold">AI & Automation:</span> Python, LangChain, OpenAI API, Whisper Voice AI, n8n, Zapier
            </div>
            <div className="p-2 rounded bg-line/30 border border-line">
              <span className="text-acc-emerald font-semibold">Frontend & 3D:</span> React 19, TypeScript, Three.js, Tailwind CSS, Framer Motion, GSAP
            </div>
          </div>
        );
        break;

      case "projects":
        res = (
          <div className="space-y-2 text-xs py-1">
            <div className="p-2 rounded bg-line/30 border border-acc/30">
              <p className="text-fg font-bold">🚀 AI-Powered Voice & Email Automation Pipeline</p>
              <p className="text-mut">Automated multi-channel customer intake with 99.4% precision.</p>
            </div>
            <div className="p-2 rounded bg-line/30 border border-acc/30">
              <p className="text-fg font-bold">🌐 Interactive 3D WebGL Portfolio Experience</p>
              <p className="text-mut">High-performance 60FPS 3D shader canvas & real-time analytics.</p>
            </div>
          </div>
        );
        break;

      case "stats":
        res = (
          <div className="flex gap-4 text-xs font-mono py-1">
            <span className="text-acc font-bold">10M+ Operations</span>
            <span className="text-acc-emerald font-bold">99+ Lighthouse Score</span>
            <span className="text-acc-violet font-bold">100% On-Time Delivery</span>
          </div>
        );
        break;

      case "contact":
      case "hire":
        res = (
          <div className="text-xs space-y-1 text-fg">
            <p>📧 Email: <a href="mailto:pavankumar.official@example.com" className="text-acc underline">Contact Pavan</a></p>
            <p>💼 LinkedIn: <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-acc underline">linkedin.com/in/pavankumar</a></p>
            <p>⚡ Availability: <span className="text-acc-emerald font-bold">🟢 Open for high-impact contracts & roles</span></p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        return;

      default:
        res = (
          <p className="text-xs text-red-400">
            Command not recognized: "{cmd}". Type <span className="text-acc underline">help</span> for a list of available commands.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: cmd, output: res }]);
  };

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <span className="font-mono text-xs text-acc uppercase tracking-widest px-3 py-1 rounded-full border border-acc/30 bg-acc/10">
          Interactive Terminal Playground
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-fg">
          Test Drive The Code Yourself
        </h2>
        <p className="text-mut text-sm mt-2 max-w-xl mx-auto">
          Type terminal commands below to instantly query skills, project performance, or hiring status.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-[#080d1a] shadow-2xl overflow-hidden font-mono text-sm">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d1527] border-b border-line">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500/80 inline-block" />
            <span className="size-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="size-3 rounded-full bg-green-500/80 inline-block" />
            <span className="text-xs text-mut ml-2">pavan@interactive-cli:~</span>
          </div>
          <div className="text-[11px] text-mut/60">zsh -- 80x24</div>
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap gap-2 px-4 py-2 bg-[#0a1020] border-b border-line/50 text-xs">
          <span className="text-mut self-center mr-1 text-[11px]">Quick Prompts:</span>
          {["help", "skills", "projects", "stats", "contact", "clear"].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleCommand(prompt)}
              className="px-2.5 py-1 rounded border border-line bg-panel hover:border-acc hover:text-acc transition-colors text-mut text-[11px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Output Window */}
        <div className="p-4 min-h-[220px] max-h-[360px] overflow-y-auto space-y-3">
          {history.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2 text-acc">
                <span>&gt;</span>
                <span className="text-fg font-semibold">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={terminalEndRef} />
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
          className="flex items-center gap-2 px-4 py-3 bg-[#0a1020] border-t border-line"
        >
          <span className="text-acc font-bold">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help' or 'projects'..."
            className="flex-1 bg-transparent text-fg outline-none placeholder:text-mut/40 font-mono text-sm"
          />
          <button
            type="submit"
            className="text-xs px-3 py-1 rounded bg-acc/20 border border-acc/40 text-acc hover:bg-acc hover:text-ink font-semibold transition-colors"
          >
            Run
          </button>
        </form>
      </div>
    </section>
  );
}
