import { useState } from "react";
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

// Floating support: WhatsApp + a lightweight 24/7 Digital Officer modal.
// Mission-critical MVP — a full FAQ assistant can replace the modal later.
export function FloatingActions() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

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
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/50 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-3xl">
              🤖
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold text-navy-900">
              24/7 Digital Officer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-600">
              Need assistance?
              <br />
              Please contact KOBIS or WhatsApp us.
              <br />
              <br />
              More FAQ will be available soon.
            </p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn-gold mt-5 w-full"
            >
              💬 WhatsApp Us
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-ghost mt-2 w-full text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
