import knowledgeBase from "../data/knowledge_base.md?raw";
import { profile } from "../data/resume";

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
const WORKER_URL = import.meta.env.VITE_WORKER_URL as string | undefined;

const API_ENDPOINT = WORKER_URL ?? "https://api.groq.com/openai/v1/chat/completions";
const AUTH_HEADER = WORKER_URL ? undefined : GROQ_KEY;

export type ChatMsg = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Alfred Pennyworth, Mr. Pavan Kumar's professional AI executive advisor and representative — analytical, articulate, refined, and deeply knowledgeable.
Speak like a seasoned British advisor: concise (2–4 sentences), insightful, respectful, and authoritative.

Rules:
1. Address the user by name if they have provided one.
2. Maintain warm British professionalism.
3. Answer questions about Mr. Kumar grounded ONLY in his verified achievements and résumé.
4. Highlight concrete metrics and impact (e.g. 2,000+ docs/mo, double promotion in 4 months, real-time voice WebRTC pipeline, 85% precision models).

Résumé Summary:
${knowledgeBase}`;

// Name extraction
const NAME_INDICATORS = ["my name is", "i'm ", "i am ", "call me", "this is", "name's", "it's "];

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

// Comprehensive Semantic Knowledge Engine (High-Intelligence Local RAG)
interface KnowledgeSnippet {
  topic: string;
  keywords: string[];
  response: string;
}

const KNOWLEDGE_GRAPH: KnowledgeSnippet[] = [
  // 1. Aria Voice AI
  {
    topic: "Aria Voice AI",
    keywords: ["aria", "voice", "speech", "whisper", "webrtc", "pipecat", "elevenlabs", "audio", "latency", "interruption"],
    response:
      "Aria stands among Mr. Kumar's crowning technical achievements. It is an ultra-low-latency Voice AI system engineered on Pipecat and WebRTC, integrating Groq Whisper for speech recognition, LLaMA 3.1 for reasoning, and ElevenLabs for natural speech synthesis. Crucially, it manages real-time mid-sentence interruptions and features resilient multi-provider failover.",
  },
  // 2. e-Invoicing Platform
  {
    topic: "e-Invoicing Automation",
    keywords: ["invoice", "einvoice", "e-invoice", "lhdn", "document", "etl", "malaysia", "regulatory", "tax", "financial", "2000"],
    response:
      "Mr. Kumar engineered a multi-tenant e-Invoicing automation platform currently processing upwards of 2,000 financial documents monthly. The architecture ingests raw PDFs and Excel sheets, performs automated schema validation and JSON transformation, and conducts direct regulatory submissions to Malaysia's LHDN tax authority with rigorous tenant isolation.",
  },
  // 3. Sales & Lead Gen Agent
  {
    topic: "AI Sales & Outreach Agent",
    keywords: ["lead", "sales", "email", "outreach", "crm", "agent", "odoo", "outlook", "graph", "inbox", "inbound"],
    response:
      "Mr. Kumar developed an autonomous inbound sales agent leveraging Microsoft Graph API, Groq LLaMA, PostgreSQL, and Odoo CRM. The agent monitors incoming mailboxes, performs deep automated research on the sender's enterprise, drafts bespoke replies into Outlook, and tracks lead qualification end-to-end.",
  },
  // 4. Content Gen & SEO Platform
  {
    topic: "AI Content & SEO Automation",
    keywords: ["seo", "content", "marketing", "google", "ranking", "google drive", "sheets", "traffic", "organic"],
    response:
      "Mr. Kumar created an AI Content Generation platform with strict deterministic validation gates. It automates technical copy production, document assembly via python-docx, and Google Drive publishing — an architecture that qualified inbound leads within 30 days and secured first-page Google rankings in under 2 months.",
  },
  // 5. Machine Learning & Churn
  {
    topic: "ML Models & Churn",
    keywords: ["churn", "ml", "machine learning", "xgboost", "kmeans", "clustering", "customer", "prediction", "models", "data science"],
    response:
      "In the predictive modeling domain, Mr. Kumar developed an e-Commerce customer churn solution utilizing XGBoost (achieving 85% precision) combined with K-Means clustering for behavioral retention segmentation.",
  },
  // 6. Experience at Envision Beyond & Double Promotion
  {
    topic: "Work Experience & Promotion",
    keywords: ["envision", "experience", "work", "job", "career", "role", "promotion", "double", "trainee", "bangalore", "bengaluru", "current"],
    response:
      "Presently, Mr. Kumar serves as a Business Analyst (AI Automation) at Envision Beyond in Bengaluru. Notably, having joined as an intern in July 2025 where he built their core ETL reporting pipelines, his exceptional automation delivery earned him a double promotion within four months.",
  },
  // 7. Spire Technologies & Consulting
  {
    topic: "Spire Technologies",
    keywords: ["spire", "consultant", "data analyst", "recruitment", "analytics", "pipeline", "100k"],
    response:
      "Prior to Envision Beyond, Mr. Kumar was a Data Analyst Consultant at Spire Technologies, where he designed Python-SQL pipelines handling 100K+ records and engineered Power BI recruitment dashboards that slashed executive reporting turnaround by 15%.",
  },
  // 8. Technical Skills & Tools
  {
    topic: "Technical Stack",
    keywords: ["skill", "stack", "tech", "tool", "language", "python", "sql", "framework", "llm", "rag", "database", "postgres", "aws", "docker"],
    response:
      "Mr. Kumar's primary technical repertoire encompasses Python and SQL, AI Agents, LLM prompt engineering, RAG, and Voice AI pipelines. On the enterprise infrastructure tier, he works extensively with Microsoft Graph API, Google Workspace APIs, REST, OAuth 2.0, PostgreSQL, MongoDB, AWS (EC2/S3), IBM RPA, N8n, and Power BI.",
  },
  // 9. Education & Degree
  {
    topic: "Education & Academics",
    keywords: ["education", "college", "degree", "mvj", "engineering", "b.e", "btech", "cgpa", "study", "graduate", "university"],
    response:
      "Mr. Kumar holds a Bachelor of Engineering (B.E.) in Computer Science with a specialization in Data Science from MVJ College of Engineering, Bengaluru (Class of 2024, CGPA 7.73).",
  },
  // 10. Certifications
  {
    topic: "Certifications",
    keywords: ["certif", "google data", "project management", "smart contracts", "hackerrank", "coursera"],
    response:
      "His verified credentials include Google Data Analytics, Google Project Management, Smart Contracts from SUNY University, and HackerRank Python & Problem Solving certifications.",
  },
  // 11. Contact, Hiring & Relocation
  {
    topic: "Contact & Availability",
    keywords: ["contact", "hire", "email", "reach", "phone", "available", "relocat", "salary", "remote", "hybrid", "join"],
    response:
      `Mr. Kumar is based in Bengaluru and is fully flexible to relocate anywhere within India without requiring assistance. He is open to remote, hybrid, or on-site opportunities. You may contact him directly at ${profile.email} or (+91) 8050737339.`,
  },
  // 12. Career Aspirations
  {
    topic: "Career Aspirations",
    keywords: ["goal", "aspiration", "future", "target", "aim", "roles", "engineer"],
    response:
      "Mr. Kumar is actively pursuing advanced engineering roles that merge data intelligence with autonomous automation — notably AI Engineer, AI/ML Specialist, Machine Learning Engineer, and Enterprise Automation Architect.",
  },
];

// Semantic Scorer
function getSemanticAnswer(query: string): string {
  const q = query.toLowerCase();
  const userName = extractName(query);
  const prefix = userName ? `A pleasure, ${userName}. ` : "";

  // Greetings
  if (/^(hi|hello|hey|good morning|good evening|greetings|who are you|who is alfred)/i.test(q.trim())) {
    return `${prefix}I am Alfred Pennyworth, executive AI advisor to Mr. Pavan Kumar. I would be delighted to brief you on Mr. Kumar's real-time Voice AI architectures, his 2,000+ doc/mo enterprise pipelines, his technical competencies, or how you might engage his expertise.`;
  }

  let bestMatch: KnowledgeSnippet | null = null;
  let highestScore = 0;

  for (const snippet of KNOWLEDGE_GRAPH) {
    let score = 0;
    for (const kw of snippet.keywords) {
      if (q.includes(kw)) {
        score += kw.length > 4 ? 3 : 1.5;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = snippet;
    }
  }

  if (bestMatch && highestScore >= 2) {
    return prefix + bestMatch.response;
  }

  // Broad Synthesis Fallback
  return (
    prefix +
    "Mr. Pavan Kumar is an accomplished Business Analyst and AI Automation Specialist in Bengaluru. He is renowned for engineering production Voice AI platforms (Aria WebRTC), multi-tenant e-Invoicing pipelines processing 2,000+ monthly documents, and autonomous sales agents. Pray, specify if you would like details regarding his projects, technical stack, or contact information."
  );
}

// Groq SSE Stream handler
export async function groqStream(
  q: string,
  history: ChatMsg[],
  onChunk: (chunk: string) => void,
  userMsgCount: number
): Promise<string> {
  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (userMsgCount > 0 && userMsgCount % 5 === 0) {
    messages.push({
      role: "system",
      content: `Full reference refresh:\n${knowledgeBase}`,
    });
  }

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
      temperature: 0.85,
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

  let accumulated = "";

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
        if (delta) {
          accumulated += delta;
          onChunk(delta);
        }
      } catch {
        // malformed chunk ignore
      }
    }
  }

  return accumulated;
}

// Main Ask Query Engine
export async function ask(
  q: string,
  history: ChatMsg[] = [],
  onChunk?: (chunk: string) => void,
  userMsgCount = 0
): Promise<string> {
  if (WORKER_URL || GROQ_KEY) {
    try {
      const liveAnswer = await groqStream(q, history, onChunk ?? (() => {}), userMsgCount);
      if (liveAnswer.trim()) {
        return liveAnswer;
      }
    } catch (err) {
      console.warn("Groq streaming offline, activating semantic knowledge engine:", err);
    }
  }

  // Fallback to high-intelligence semantic knowledge engine
  return getSemanticAnswer(q);
}
