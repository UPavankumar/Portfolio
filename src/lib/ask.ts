import knowledgeBase from "../data/knowledge_base.md?raw";
import { profile } from "../data/resume";

// Ported from github.com/UPavankumar/Portfolio_Assistant (Streamlit "Alfred" bot).
// Set VITE_GROQ_API_KEY in .env for direct Groq calls (key visible in bundle).
// Set VITE_WORKER_URL to route through the Cloudflare Worker instead (key hidden server-side).
const GROQ_KEY   = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
const WORKER_URL = import.meta.env.VITE_WORKER_URL   as string | undefined;

// Resolved endpoint: Worker takes priority over direct Groq
const API_ENDPOINT = WORKER_URL ?? "https://api.groq.com/openai/v1/chat/completions";
const AUTH_HEADER  = WORKER_URL ? undefined : GROQ_KEY; // Worker handles auth server-side

export type ChatMsg = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Alfred Pennyworth, Mr. Pavan Kumar's professional AI assistant — analytical, articulate, and composed.
Speak like a seasoned British advisor: concise (2–4 sentences), insightful, and respectful.

Rules:
1. Address the user by name if they have provided one.
2. Never exceed 4 sentences unless the user asks for detail.
3. Maintain warm professionalism and authority.
4. Answer questions about Mr. Kumar grounded ONLY in the knowledge base below; if asked something unrelated, steer back politely.
5. Use résumé context only when relevant.

Résumé Summary Context:
Mr. Pavan Kumar — Business Analyst specialising in AI automation, skilled in Python, SQL, LLMs, AI agents, Voice AI (Groq LLaMA, Whisper), Power BI, RPA, and enterprise automation.
Business Analyst at Envision Beyond since Oct 2025 (double-promoted from trainee), where he built a multi-tenant e-Invoicing platform processing 2,000+ documents/month and real-time Voice AI systems.

Full Knowledge Base:
${knowledgeBase}`;

// --- Name extraction (mirrors Streamlit logic) ---
const NAME_INDICATORS = ["my name is", "i'm ", "i am ", "call me", "this is", "name's", "it's"];

export function extractName(input: string): string | null {
  const lower = input.toLowerCase();
  for (const ind of NAME_INDICATORS) {
    if (lower.includes(ind)) {
      const after = lower.split(ind)[1]?.trim().split(/\s+/)[0] ?? "";
      const name = after.replace(/[^a-z]/gi, "");
      if (name.length > 1) return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
  return null;
}

// --- Fallback keyword-matching (no API key) ---
function localAnswer(q: string): string {
  const s = q.toLowerCase();
  if (/(voice|aria|speech|whisper|call)/.test(s))
    return "Ah, Aria — one of Mr. Kumar's finest works. A real-time Voice AI assistant built on Pipecat and WebRTC, with Groq Whisper for speech recognition, LLaMA 3.1 for reasoning and ElevenLabs for speech. It handles interruptions mid-sentence and fails over gracefully between providers.";
  if (/(invoice|einvoice|e-invoice|lhdn|document|etl)/.test(s))
    return "His multi-tenant e-Invoicing platform processes upwards of 2,000 financial documents monthly — automated PDF and Excel extraction, JSON transformation, schema validation and Malaysian LHDN regulatory submission, each tenant kept properly isolated.";
  if (/(lead|sales|email|outreach|crm|agent)/.test(s))
    return "Mr. Kumar built an AI sales agent that reads inbound email via Microsoft Graph, researches the sender's company, drafts a personalised reply into Outlook and tracks responses — PostgreSQL and Odoo CRM keeping the books, as it were.";
  if (/(skill|stack|tech|tool|language|python|sql)/.test(s))
    return "His principal instruments: Python and SQL, with LLMs, AI agents, prompt engineering, RAG and voice AI. On the enterprise side — Microsoft Graph, Google Workspace APIs, OAuth 2.0, PostgreSQL, MongoDB, AWS, IBM RPA and Odoo CRM, with Power BI for the dashboards.";
  if (/(experience|work|job|envision|spire|career|edureka)/.test(s))
    return "Presently a Business Analyst at Envision Beyond in Bengaluru — he began as a trainee in mid-2025 and was double-promoted by October, I might add. Previously a Data Analyst Consultant at Spire Technologies, and before that a research intern at Edureka.";
  if (/(education|college|degree|study|certif)/.test(s))
    return "A B.E. in Computer Science (Data Science) from MVJ College of Engineering, Bengaluru, class of 2024. Certified in Google Data Analytics, Google Project Management, and Smart Contracts.";
  if (/(contact|hire|reach|mail|available|remote|relocat)/.test(s))
    return `You may reach Mr. Kumar at ${profile.email}, or via LinkedIn. He is based in Bengaluru, fully flexible on relocation within India, and open to remote, hybrid or on-site arrangements.`;
  if (/(name is|i'm |i am |call me)/.test(s))
    return "A pleasure to make your acquaintance. Do ask me anything about Mr. Kumar's work — his voice AI, document pipelines, sales agents, or how to reach him.";
  return "I'd be delighted to tell you about Mr. Kumar's voice AI work, his document pipelines, the sales agent he built, his skills, experience, or how to contact him. (I'm presently in demo mode; with a Groq key configured I can answer anything.)";
}

// --- Groq streaming response ---
export async function groqStream(
  q: string,
  history: ChatMsg[],
  onChunk: (chunk: string) => void,
  userMsgCount: number
): Promise<void> {
  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Re-inject full KB every 5 user messages for better LLM memory (mirrors Streamlit)
  if (userMsgCount > 0 && userMsgCount % 5 === 0) {
    messages.push({
      role: "system",
      content: `Full résumé reference (periodic refresh):\n${knowledgeBase}`,
    });
  }

  // Append recent history (last 8 turns)
  messages.push(...history.slice(-8));
  messages.push({ role: "user", content: q });

  const res = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(AUTH_HEADER ? { Authorization: `Bearer ${AUTH_HEADER}` } : {}),
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.9,
      max_tokens: 400,
      top_p: 0.9,
      stream: true,
      messages,
    }),
  });

  if (!res.ok) throw new Error(`Groq ${res.status}`);

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) throw new Error("No response body");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split("\n");
    for (const line of lines) {
      const trimmed = line.replace(/^data: /, "").trim();
      if (!trimmed || trimmed === "[DONE]") continue;
      try {
        const parsed = JSON.parse(trimmed);
        const delta = parsed.choices?.[0]?.delta?.content ?? "";
        if (delta) onChunk(delta);
      } catch {
        // skip malformed SSE lines
      }
    }
  }
}

// --- Main export ---
export async function ask(
  q: string,
  history: ChatMsg[] = [],
  onChunk?: (chunk: string) => void,
  userMsgCount = 0
): Promise<string> {
  if (WORKER_URL || GROQ_KEY) {
    try {
      let full = "";
      await groqStream(
        q,
        history,
        (chunk) => {
          full += chunk;
          onChunk?.(chunk);
        },
        userMsgCount
      );
      return full;
    } catch {
      return localAnswer(q);
    }
  }
  return localAnswer(q);
}
