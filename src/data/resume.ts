export const profile = {
  name: "Pavan Kumar",
  role: "Business Analyst",
  tagline: "I automate what companies do by hand.",
  summary:
    "Business Analyst who builds enterprise AI automation — real-time voice assistants, LLM agents and document pipelines that replace manual workflows in production. Python, SQL, and a lot of systems that quietly do the work of whole teams.",
  location: "Bengaluru, India",
  email: "pavan.aidev@gmail.com",
  phone: "+91-8050737339",
  github: "https://github.com/UPavankumar",
  linkedin: "https://linkedin.com/in/u-pavankumar",
  site: "https://portfolio-u-pavan-kumar.web.app",
};

export const stats = [
  { value: 2000, suffix: "+", label: "financial documents processed / month" },
  { value: 100, suffix: "K+", label: "records through data pipelines" },
  { value: 30, suffix: " days", label: "to first qualified inbound leads" },
  { value: 4, suffix: "", label: "production AI systems shipped" },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  stack: string[];
  problem: string;
  build: string;
  outcome: string;
  pipeline: string[];
};

export const projects: Project[] = [
  {
    id: "aria",
    index: "01",
    title: "Aria — Real-Time Voice AI Assistant",
    stack: ["Python", "Pipecat", "WebRTC", "Groq Whisper", "LLaMA 3.1", "ElevenLabs"],
    problem: "Natural phone-style conversation with an AI needs sub-second latency — most stacks feel like walkie-talkies.",
    build:
      "Low-latency voice loop on Pipecat + WebRTC with Groq Whisper for speech recognition and LLaMA 3.1 for reasoning. Intelligent interruption handling, dynamic knowledge-base lookup, domain-tuned recognition and failover when providers degrade.",
    outcome: "Real-time conversations that survive interruptions and provider outages.",
    pipeline: ["MIC", "WHISPER", "LLaMA 3.1", "ELEVENLABS", "SPEAKER"],
  },
  {
    id: "sales-agent",
    index: "02",
    title: "AI Lead Generation & Sales Agent",
    stack: ["Python", "Microsoft Graph API", "Groq LLaMA", "PostgreSQL"],
    problem: "Inbound leads sat in a shared inbox; research and first replies took hours of manual work.",
    build:
      "Agent that ingests inbound email via Microsoft Graph, researches the company, generates a personalized reply, creates the Outlook draft and tracks responses — with PostgreSQL as the system of record.",
    outcome: "Inbox-to-drafted-reply with research, untouched by humans.",
    pipeline: ["INBOX", "RESEARCH", "LLM DRAFT", "OUTLOOK", "TRACK"],
  },
  {
    id: "einvoice",
    index: "03",
    title: "Multi-Tenant e-Invoice Pipeline",
    stack: ["Python", "Microsoft Graph API", "OAuth 2.0", "REST APIs"],
    problem: "Invoices, credit and debit notes across multiple business tenants, all requiring Malaysian LHDN e-Invoice compliance.",
    build:
      "Enterprise ETL platform: automated PDF/Excel extraction, JSON transformation, schema validation and regulatory submission — isolated per tenant, authenticated via OAuth 2.0.",
    outcome: "2,000+ financial documents a month, extracted, validated and submitted automatically.",
    pipeline: ["PDF / XLSX", "EXTRACT", "VALIDATE", "TRANSFORM", "LHDN"],
  },
  {
    id: "content",
    index: "04",
    title: "AI Content & SEO Automation Platform",
    stack: ["Python", "Google Workspace APIs", "python-docx", "Prompt Engineering"],
    problem: "Enterprise content operations: generation is easy, consistent quality and publishing discipline are not.",
    build:
      "Prompt-engineered generation gated by deterministic validation, then automated document assembly, Google Drive publishing and Google Sheets synchronization — full workflow orchestration.",
    outcome: "First-page Google rankings for commercial keywords within 2 months.",
    pipeline: ["BRIEF", "LLM DRAFT", "VALIDATE", "DOCX", "PUBLISH"],
  },
];

export const employment = [
  {
    company: "Envision Beyond",
    role: "Business Analyst",
    type: "Full-time",
    place: "Bengaluru · Hybrid",
    period: "Oct 2025 — Present",
    badge: "Double-promoted — skipped a level",
    points: [
      "Built enterprise AI applications across invoice processing, sales automation and customer support.",
      "Led the multi-tenant e-Invoicing platform processing 2,000+ documents/month.",
      "Engineered Microsoft Graph + PostgreSQL + Odoo CRM automation for email ingestion, leads and customer sync.",
      "Owned SEO & content strategy — qualified inbound leads in 30 days, first-page rankings in 2 months.",
      "Shipped SQL-backed Power BI dashboards for operational KPIs.",
    ],
  },
  {
    company: "Spire Technologies",
    role: "Data Analyst Consultant",
    type: "Contract",
    place: "Bengaluru",
    period: "Sep 2024 — Jan 2025",
    badge: "",
    points: [
      "Python–SQL pipelines processing 100K+ records with improved data quality.",
      "Power BI recruitment analytics, cutting reporting turnaround by 15%.",
      "Optimized MongoDB workflows with Python and AWS.",
    ],
  },
];

export const internships = [
  {
    company: "Envision Beyond",
    role: "Business Analyst Trainee",
    place: "Bengaluru",
    period: "Jun 2025 — Oct 2025",
    summary:
      "Built the first automation workflows and dashboards that became the team's AI stack — promoted straight to Business Analyst at the end of the term.",
    stack: ["Python", "PostgreSQL", "IBM RPA", "Power BI"],
  },
  {
    company: "Edureka",
    role: "Marketing Research Analyst Intern",
    place: "Bengaluru",
    period: "Mar 2024 — Jun 2024",
    summary:
      "Applied NLP and text analytics to lift content engagement 20%, and segmented customers with scikit-learn to sharpen marketing strategy.",
    stack: ["Python", "NLP", "scikit-learn"],
  },
];

export const education = {
  school: "MVJ College of Engineering, Bengaluru",
  degree: "B.E. Computer Science (Data Science)",
  period: "2020 — 2024",
  detail: "CGPA 7.73",
};

export const skills = [
  { group: "Languages", items: ["Python", "SQL"] },
  {
    group: "AI",
    items: ["LLMs", "AI Agents", "Prompt Engineering", "RAG", "Voice AI", "Groq LLaMA", "Whisper"],
  },
  {
    group: "Frameworks",
    items: ["Pipecat", "Streamlit", "Pandas", "NumPy", "OpenPyXL", "python-docx"],
  },
  {
    group: "Enterprise APIs",
    items: ["Microsoft Graph", "Google Drive", "Google Sheets", "REST", "OAuth 2.0"],
  },
  {
    group: "Cloud & Data",
    items: ["PostgreSQL", "MongoDB", "AWS EC2/S3", "Odoo CRM", "ETL Pipelines"],
  },
  { group: "Visualization", items: ["Power BI", "Tableau", "Git"] },
];

export const certifications = [
  "Google Data Analytics (Coursera)",
  "HackerRank: Python & Problem Solving",
];
