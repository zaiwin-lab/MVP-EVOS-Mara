import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Four supported languages. English is the base; every other language
// falls back gracefully (iban → bm → en, zh → en) so the UI never shows
// a blank string even where a translation hasn't been provided yet.
export type Lang = "en" | "bm" | "zh" | "iban";

export interface LangMeta {
  code: Lang;
  label: string; // shown in the picker, in its own language
  short: string; // compact chip label
}

export const LANGS: LangMeta[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "bm", label: "Bahasa Melayu", short: "BM" },
  { code: "zh", label: "中文", short: "中" },
  { code: "iban", label: "Bahasa Iban", short: "IBAN" },
];

export type Localized = Partial<Record<Lang, string>>;

/** Resolve a localized value with a sensible fallback chain. */
export function pick(value: Localized, lang: Lang): string {
  if (value[lang]) return value[lang] as string;
  if (lang === "iban" && value.bm) return value.bm; // Iban speakers read BM
  return value.en ?? value.bm ?? Object.values(value)[0] ?? "";
}

// ── Interface dictionary ─────────────────────────────────────
// Kept intentionally focused on the strings participants interact with.
const DICT: Record<string, Localized> = {
  // navigation & common actions
  home: { en: "Home", bm: "Utama", zh: "首页", iban: "Utama" },
  checkIn: { en: "Check In", bm: "Daftar Kehadiran", zh: "签到", iban: "Daftar Kehadiran" },
  myProfile: { en: "My Profile", bm: "Profil Saya", zh: "我的资料", iban: "Profil Aku" },
  assessment: { en: "Assessment", bm: "Penilaian", zh: "评估", iban: "Penilaian" },
  resources: { en: "Resources", bm: "Bahan Program", zh: "资源", iban: "Bahan Program" },
  actionPlan: { en: "Action Plan", bm: "Pelan Tindakan", zh: "行动计划", iban: "Pelan Tindakan" },
  reflection: { en: "Reflection", bm: "Refleksi", zh: "反思", iban: "Refleksi" },
  results: { en: "My Result", bm: "Keputusan Saya", zh: "我的结果", iban: "Keputusan Aku" },
  continue: { en: "Continue", bm: "Teruskan", zh: "继续", iban: "Terus" },
  back: { en: "Back", bm: "Kembali", zh: "返回", iban: "Pulai" },
  save: { en: "Save", bm: "Simpan", zh: "保存", iban: "Simpan" },
  next: { en: "Next", bm: "Seterusnya", zh: "下一个", iban: "Terus" },
  language: { en: "Language", bm: "Bahasa", zh: "语言", iban: "Jaku" },
  selectLanguage: {
    en: "Select language",
    bm: "Pilih bahasa",
    zh: "选择语言",
    iban: "Pilih jaku",
  },

  // hero / landing actions
  startJourney: {
    en: "Start My Journey",
    bm: "Mula Perjalanan Saya",
    zh: "开始我的旅程",
    iban: "Berang Pejalai Aku",
  },
  viewProgramme: { en: "View Programme", bm: "Lihat Program", zh: "查看课程", iban: "Peda Program" },
  meetTrainers: { en: "Meet the Trainers", bm: "Kenali Jurulatih", zh: "认识讲师", iban: "Temu Pengajar" },

  // check-in flow
  welcomeTo: { en: "Welcome to", bm: "Selamat Datang ke", zh: "欢迎来到", iban: "Selamat Datai ke" },
  checkInNow: {
    en: "Check In Now",
    bm: "Daftar Kehadiran Sekarang",
    zh: "立即签到",
    iban: "Daftar Kehadiran Diatu",
  },
  takesAMinute: {
    en: "Takes less than a minute.",
    bm: "Kurang dari seminit.",
    zh: "不到一分钟。",
    iban: "Kurang ari seminit.",
  },
  letsCheckYouIn: {
    en: "Let’s get you checked in",
    bm: "Mari daftarkan kehadiran anda",
    zh: "让我们为您签到",
    iban: "Aram kitai daftar kehadiran nuan",
  },
  threeQuickDetails: {
    en: "Just three quick details. You can complete your full profile next.",
    bm: "Hanya tiga maklumat ringkas. Anda boleh lengkapkan profil penuh selepas ini.",
    zh: "只需三项简单信息。您可以稍后完成完整资料。",
    iban: "Semina tiga penerang. Nuan ulih ngaga profil penuh udah tu.",
  },
  fullName: { en: "Full Name", bm: "Nama Penuh", zh: "全名", iban: "Nama Penuh" },
  mobileNumber: { en: "Mobile Number", bm: "No. Telefon", zh: "手机号码", iban: "No. Telefon" },
  companyName: { en: "Company Name", bm: "Nama Syarikat", zh: "公司名称", iban: "Nama Kompeni" },
  confirmAttendance: {
    en: "Confirm Attendance",
    bm: "Sahkan Kehadiran",
    zh: "确认出席",
    iban: "Sahka Kehadiran",
  },
  checkingIn: { en: "Checking in…", bm: "Mendaftar…", zh: "签到中…", iban: "Benung daftar…" },
  attendanceConfirmed: {
    en: "Attendance Confirmed",
    bm: "Kehadiran Disahkan",
    zh: "出席已确认",
    iban: "Kehadiran Udah Disahka",
  },
  continueToProfile: {
    en: "Continue to My Contractor Profile",
    bm: "Teruskan ke Profil Kontraktor Saya",
    zh: "继续填写承包商资料",
    iban: "Terus ke Profil Kontraktor Aku",
  },
  confirmationReference: {
    en: "Confirmation Reference",
    bm: "Rujukan Pengesahan",
    zh: "确认参考编号",
    iban: "Rujukan Pengesahan",
  },
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT) => string;
  pick: (value: Localized) => string;
}

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "attendify:lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (["en", "bm", "zh", "iban"] as Lang[]).includes(saved as Lang)
      ? (saved as Lang)
      : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang =
      lang === "zh" ? "zh" : lang === "en" ? "en" : "ms";
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang: setLangState,
      t: (key) => (DICT[key] ? pick(DICT[key], lang) : String(key)),
      pick: (value) => pick(value, lang),
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
