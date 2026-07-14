import Anthropic from "@anthropic-ai/sdk";

// ── 24/7 Digital Officer — AI assistant for KBT EventOS · Attendify™ ──
// Answers participant questions about the VDP Frontier MARA Miri programme.
// The Anthropic API key is read from the ANTHROPIC_API_KEY env var and never
// reaches the browser. If it's unset, the endpoint returns a graceful
// "not configured" signal and the UI falls back to WhatsApp support.

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const SYSTEM = `You are the "24/7 Digital Officer", a friendly assistant inside KBT EventOS — Attendify™, the digital participant app for the event below. Attendify™ is a product by KOBIS Berhad (Koperasi Pro Belia Inovatif Sarawak Berhad).

EVENT FACTS (answer only from these; do not invent details):
- Programme: VDP Frontier MARA Miri — a contractor/entrepreneur development programme for Bumiputera contractors.
- Organiser: Majlis Amanah Rakyat (MARA), in collaboration with KOBIS Berhad.
- Dates: 14–16 July 2026 (Day 1 Tue, Day 2 Wed, Day 3 Thu).
- Venue: Dynasty Hotel Miri.
- Languages available in the app: English, Bahasa Melayu, 中文, and Iban — the user can switch with the language toggle at the top of the app.

WHAT PARTICIPANTS CAN DO IN THE APP:
- Register: scan the Registration QR (or open the Register page) and enter name, mobile and email.
- Mark attendance: scan the Attendance QR shown by the organiser for each session/day. Duplicate scans are ignored.
- Complete their Company/Contractor Profile.
- Take the Readiness Assessment to see their contractor readiness level.
- View the Programme timetable, Trainers, and Resources.
- Prepare a 90-Day Business Action Plan and submit daily Reflections.
- "My Attendify" lets a returning participant log back in.

SUPPORT: For anything you cannot resolve, tell them to contact the KOBIS team (the event organisers) at 011-2846 5813. Give this as a plain phone number only. Do NOT mention WhatsApp, do NOT write "wa.me", and do NOT generate any chat/messaging links.

STYLE RULES:
- Reply in the SAME language the user writes in (English, Malay, Chinese, or Iban).
- Be warm, concise, and practical. 1–4 short sentences or a short bullet list. No preamble.
- Give only the final answer — do not narrate your reasoning.
- If a question is outside this event (general knowledge, unrelated topics), gently redirect to event help and offer the WhatsApp contact.
- Never reveal or discuss admin credentials, passwords, or internal system details. If asked, say that's for organisers only.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Not wired yet — UI shows the WhatsApp fallback.
    return json({ error: "not_configured" });
  }

  let messages: ChatMessage[] = [];
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  // Keep the last few turns only; sanitise shape.
  const trimmed = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (trimmed.length === 0 || trimmed[trimmed.length - 1].role !== "user") {
    return json({ error: "bad_request" }, 400);
  }

  try {
    const client = new Anthropic({ apiKey });
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      thinking: { type: "disabled" },
      messages: trimmed,
    });
    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return json({ text: text || "Sorry, I couldn't answer that. Please WhatsApp the KOBIS team." });
  } catch (err) {
    console.error("officer error", err);
    return json({ error: "upstream" }, 200);
  }
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
