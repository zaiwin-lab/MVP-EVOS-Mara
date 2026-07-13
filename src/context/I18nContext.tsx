import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "bm";

// Core participant-facing labels. English is the primary language;
// Bahasa Malaysia is provided for the most-used navigation and actions
// (spec §23 — clarity over full translation for the MVP).
const DICT: Record<string, { en: string; bm: string }> = {
  checkIn: { en: "Check In", bm: "Daftar Kehadiran" },
  myProfile: { en: "My Profile", bm: "Profil Saya" },
  assessment: { en: "Assessment", bm: "Penilaian" },
  resources: { en: "Resources", bm: "Bahan Program" },
  actionPlan: { en: "Action Plan", bm: "Pelan Tindakan" },
  reflection: { en: "Reflection", bm: "Refleksi" },
  startJourney: { en: "Start My Journey", bm: "Mula Perjalanan Saya" },
  viewProgramme: { en: "View Programme", bm: "Lihat Program" },
  meetTrainers: { en: "Meet the Trainers", bm: "Kenali Jurulatih" },
  results: { en: "My Result", bm: "Keputusan Saya" },
  continue: { en: "Continue", bm: "Teruskan" },
  back: { en: "Back", bm: "Kembali" },
  save: { en: "Save", bm: "Simpan" },
  home: { en: "Home", bm: "Utama" },
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: keyof typeof DICT) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "attendify:lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "bm" ? "bm" : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang: setLangState,
      toggle: () => setLangState((l) => (l === "en" ? "bm" : "en")),
      t: (key) => DICT[key]?.[lang] ?? DICT[key]?.en ?? String(key),
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
