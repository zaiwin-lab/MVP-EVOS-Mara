import { useEffect, useRef, useState } from "react";
import { LANGS, useI18n } from "../context/I18nContext";

interface LanguagePickerProps {
  /** "dark" for use on navy backgrounds, "light" for white bars. */
  tone?: "dark" | "light";
}

export function LanguagePicker({ tone = "light" }: LanguagePickerProps) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const triggerClass =
    tone === "dark"
      ? "border-white/20 text-white/85 hover:bg-white/10"
      : "border-navy-200 text-navy-700 hover:bg-navy-50";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${triggerClass}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("selectLanguage")}
      >
        <GlobeIcon />
        <span>{current.short}</span>
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-navy-100 bg-white py-1 shadow-lift"
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-navy-400">
            {t("selectLanguage")}
          </div>
          {LANGS.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-navy-50 ${
                l.code === lang ? "font-bold text-navy-900" : "text-navy-600"
              }`}
            >
              <span>{l.label}</span>
              {l.code === lang && (
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}
