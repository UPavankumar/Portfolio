// Cloudflare Worker — Alfred Groq Proxy
// Keeps GROQ_API_KEY server-side, never exposed to the browser.
//
// Deploy:
//   cd worker
//   npx wrangler deploy
//   npx wrangler secret put GROQ_API_KEY

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://portfolio-u-pavan-kumar.web.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json();

      // Forward request to Groq with the secret key (never leaves this Worker)
      const groqRes = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!groqRes.ok) {
        const err = await groqRes.text();
        return new Response(err, {
          status: groqRes.status,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
      }

      // Stream the SSE response straight back to the browser
      return new Response(groqRes.body, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }
  },
};
