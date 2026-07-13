import { LANGS, useI18n } from "../context/I18nContext";

interface LangToggleProps {
  /** "dark" for navy backgrounds, "light" for white bars. */
  tone?: "dark" | "light";
}

/**
 * Always-visible one-click language toggle: [ EN ] [ BM ] [ 中 ] [ IB ].
 * No dropdown — every language is one tap away (spec §5).
 */
export function LangToggle({ tone = "light" }: LangToggleProps) {
  const { lang, setLang } = useI18n();

  const base =
    tone === "dark"
      ? "border-white/15 bg-white/5"
      : "border-navy-100 bg-navy-50";

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-center gap-0.5 rounded-full border p-0.5 ${base}`}
    >
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            className={`min-w-[30px] rounded-full px-2 py-1 text-xs font-bold transition ${
              active
                ? "bg-gold-400 text-navy-900 shadow-sm"
                : tone === "dark"
                  ? "text-white/70 hover:text-white"
                  : "text-navy-500 hover:text-navy-800"
            }`}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}
