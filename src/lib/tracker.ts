// Utility to track visitor journey across pages for contact dispatch & lead analytics

const STORAGE_KEY = "pavan_visitor_journey";

interface PageVisit {
  path: string;
  title: string;
  timestamp: string;
}

interface VisitorSession {
  sessionId: string;
  startTime: number;
  entryPage: string;
  referrer: string;
  journey: PageVisit[];
}

const PAGE_NAMES: Record<string, string> = {
  "/": "Home (Overview & 3D Hero)",
  "/about": "About (Bio, Career Timeline & Certs)",
  "/projects": "Work (Case Studies & Pipelines)",
  "/skills": "Skills (Engineering & API Matrix)",
  "/contact": "Contact (Direct Message Form)",
};

function getStoredSession(): VisitorSession {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore storage parse error
  }

  const initialSession: VisitorSession = {
    sessionId: "sess_" + Math.random().toString(36).substring(2, 9),
    startTime: Date.now(),
    entryPage: window.location.pathname,
    referrer: document.referrer || "Direct / Bookmark",
    journey: [],
  };

  return initialSession;
}

function saveSession(session: VisitorSession) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage quota error
  }
}

export function recordPageVisit(pathname: string) {
  const session = getStoredSession();
  const pageTitle = PAGE_NAMES[pathname] || pathname;
  const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // Avoid duplicate back-to-back records of the same page
  const last = session.journey[session.journey.length - 1];
  if (!last || last.path !== pathname) {
    session.journey.push({
      path: pathname,
      title: pageTitle,
      timestamp: timeString,
    });
  }

  saveSession(session);
}

export function getVisitorJourneyData() {
  const session = getStoredSession();
  const durationSec = Math.round((Date.now() - session.startTime) / 1000);
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;
  const durationFormatted = `${minutes}m ${seconds}s`;

  const pathList = session.journey.map((j) => j.path).join(" ➔ ") || window.location.pathname;
  const detailedList = session.journey
    .map((j, i) => `${i + 1}. ${j.title} (${j.timestamp})`)
    .join("\n");

  return {
    sessionId: session.sessionId,
    entryPage: session.entryPage,
    currentPage: window.location.pathname,
    referrer: session.referrer,
    durationFormatted,
    pageCount: session.journey.length,
    pathSummary: pathList,
    detailedJourney: detailedList,
    device: `${window.innerWidth}x${window.innerHeight} (${navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop"})`,
  };
}

export function formatJourneyForEmail(): string {
  const data = getVisitorJourneyData();
  return `
========================================
📊 VISITOR NAVIGATION JOURNEY
• Navigation Path: ${data.pathSummary}
• Entry Page: ${data.entryPage}
• Time on Site: ${data.durationFormatted}
• Total Views: ${data.pageCount} pages
• Referrer: ${data.referrer}
• Device: ${data.device}
----------------------------------------
Page Sequence:
${data.detailedJourney}
========================================
`.trim();
}
