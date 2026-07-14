import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Paths that show a sticky bottom CTA — hide the floating buttons there so
// they never cover the participant's "Continue" action.
const HIDE_ON = [
  "/attend",
  "/assessment",
  "/action-plan",
  "/reflection",
  "/profile",
  "/result",
  "/my",
  "/journey",
];

const WA_NUMBER = "601128465813";
const WA_TEXT = encodeURIComponent(
  "Hello KOBIS Team.\n\nI need assistance regarding Attendify."
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`;

const GREETING =
  "Hi! I'm your 24/7 Digital Officer for VDP Frontier MARA Miri. Ask me anything — how to register, mark attendance, the programme, venue, and more. 😊";

const SUGGESTIONS = [
  "How do I register?",
  "How do I mark attendance?",
  "Where is the programme?",
  "Venue & dates?",
];

interface Msg {
  role: "user" | "assistant";
  content: string;
}

// Floating support: WhatsApp + an AI-powered 24/7 Digital Officer chat.
export function FloatingActions() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy, open]);

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);

    // Send only from the first real user turn (API requires a leading user message).
    const firstUser = next.findIndex((m) => m.role === "user");
    const payload = firstUser >= 0 ? next.slice(firstUser) : next;

    try {
      const res = await fetch("/.netlify/functions/officer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (data && typeof data.text === "string") {
        setMsgs((m) => [...m, { role: "assistant", content: data.text }]);
      } else {
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "I'm not fully set up yet — please contact the KOBIS team on WhatsApp and they'll help you right away.",
          },
        ]);
      }
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I couldn't reach the assistant just now. Please WhatsApp the KOBIS team for help.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
        <a
          href={WA_LINK}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-lg transition hover:brightness-105 active:scale-95"
          title="WhatsApp KOBIS Support"
        >
          <span className="text-lg leading-none">💬</span>
          <span className="hidden text-sm sm:inline">WhatsApp</span>
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-navy-900 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-navy-800 active:scale-95"
          title="24/7 Digital Officer"
        >
          <span className="text-lg leading-none">🤖</span>
          <span className="hidden text-sm sm:inline">24/7 Digital Officer</span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/50 p-0 sm:items-center sm:p-4">
          <div className="flex h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[560px] sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 bg-navy-900 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl">
                  🤖
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-bold">24/7 Digital Officer</div>
                  <div className="text-[11px] text-navy-300">Ask about the programme</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 text-2xl leading-none text-white/70 hover:bg-white/10"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-sand-50 px-3 py-4">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "rounded-br-sm bg-navy-800 text-white"
                        : "rounded-bl-sm border border-navy-100 bg-white text-navy-900"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {busy && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm border border-navy-100 bg-white px-4 py-3 text-navy-400 shadow-sm">
                    <span className="inline-flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-navy-300 [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-navy-300 [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-navy-300" />
                    </span>
                  </div>
                </div>
              )}

              {msgs.length <= 1 && !busy && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-navy-100 bg-white p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question…"
                  className="field-input flex-1 py-2.5"
                  disabled={busy}
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="btn-primary shrink-0 px-4 py-2.5"
                >
                  Send
                </button>
              </form>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-center text-xs font-semibold text-green-700 hover:underline"
              >
                💬 Or chat with a human on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
