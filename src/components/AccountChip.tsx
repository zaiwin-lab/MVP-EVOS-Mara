import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../context/I18nContext";
import { useParticipant } from "../context/ParticipantContext";

interface AccountChipProps {
  /** "dark" for navy backgrounds, "light" for white bars. Matches LangToggle. */
  tone?: "dark" | "light";
}

function initials(name = ""): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const letters = parts.map((w) => w[0] ?? "").join("");
  return letters.toUpperCase() || "?";
}

/**
 * Always-visible signed-in state, so a participant can see they are logged in
 * and log out from any page — not only from the Journey screen.
 */
export function AccountChip({ tone = "light" }: AccountChipProps) {
  const { record, signOut } = useParticipant();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const participant = record?.participant;

  // Signed out — stay quiet. The pages have their own register/login CTAs.
  if (!participant) return null;

  const border = tone === "dark" ? "border-white/15 bg-white/5" : "border-navy-100 bg-navy-50";
  const nameText = tone === "dark" ? "text-white" : "text-navy-800";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-2 rounded-full border py-0.5 pl-0.5 pr-2.5 ${border}`}
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-gold-400 text-[11px] font-extrabold text-navy-900"
          aria-hidden="true"
        >
          {initials(participant.fullName)}
        </span>
        <span className={`max-w-[84px] truncate text-xs font-bold ${nameText}`}>
          {participant.fullName.split(" ")[0]}
        </span>
      </button>

      {open && (
        <>
          {/* Click-away layer so the menu closes like a native one. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-navy-100 bg-white shadow-lg"
          >
            <Link
              to="/my"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-50"
            >
              {t("myProfile")}
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut();
                navigate("/");
              }}
              className="block w-full border-t border-navy-100 px-4 py-2.5 text-left text-sm font-semibold text-navy-500 hover:bg-navy-50"
            >
              {t("exit")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
