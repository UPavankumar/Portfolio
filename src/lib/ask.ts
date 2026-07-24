import knowledgeBase from "../data/knowledge_base.md?raw";
import { profile } from "../data/resume";

// Ported from github.com/UPavankumar/Portfolio_Assistant (Streamlit "Alfred" bot).
// Set VITE_GROQ_API_KEY in .env (local) or as a GitHub Actions secret (deploy)
// to make Alfred answer with a live LLM; without it he falls back to
// keyword matching over the resume. Note: a key bundled into a static site is
// visible to visitors — use a free-tier key or move this behind a proxy.
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

export type ChatMsg = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Alfred Pennyworth, Mr. Pavan Kumar's professional AI assistant — analytical, articulate, and composed.
Speak like a seasoned British advisor: concise (2-4 sentences), insightful, and respectful.

Rules:
1. Address the user by name if they have provided one.
2. Never exceed 4 sentences unless the user asks for detail.
3. Maintain warm professionalism and authority.
4. Answer questions about Mr. Kumar grounded ONLY in the knowledge base below; if asked something unrelated, steer back politely.

Knowledge base:
${knowledgeBase}`;

function localAnswer(q: string): string {
  const s = q.toLowerCase();
  if (/(voice|aria|speech|whisper|call)/.test(s))
    return "Ah, Aria — one of Mr. Kumar's finest works. A real-time Voice AI assistant built on Pipecat and WebRTC, with Groq Whisper for speech recognition, LLaMA 3.1 for reasoning and ElevenLabs for speech. It handles interruptions mid-sentence and fails over gracefully between providers.";
  if (/(invoice|einvoice|e-invoice|lhdn|document|etl)/.test(s))
    return "His multi-tenant e-Invoicing platform processes upwards of 2,000 financial documents monthly — automated PDF and Excel extraction, JSON transformation, schema validation and Malaysian LHDN regulatory submission, each tenant kept properly isolated.";
  if (/(lead|sales|email|outreach|crm|agent)/.test(s))
    return "Mr. Kumar built an AI sales agent that reads inbound email via Microsoft Graph, researches the sender's company, drafts a personalized reply into Outlook and tracks responses — PostgreSQL and Odoo CRM keeping the books, as it were.";
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

async function groqAnswer(q: string, history: ChatMsg[]): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.9,
      max_tokens: 400,
      top_p: 0.9,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-8),
        { role: "user", content: q },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content as string;
}

export async function ask(q: string, history: ChatMsg[] = []): Promise<string> {
  if (GROQ_KEY) {
    try {
      return await groqAnswer(q, history);
    } catch {
      return localAnswer(q);
    }
  }
  return localAnswer(q);
}
