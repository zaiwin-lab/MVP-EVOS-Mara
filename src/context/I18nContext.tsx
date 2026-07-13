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
  { code: "iban", label: "Bahasa Iban", short: "IB" },
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

  // ── Landing: hero meta ──
  programmeSupported: { en: "Programme Supported", bm: "Program Disokong", zh: "支持的项目", iban: "Program Disokong" },
  datesLabel: { en: "Dates", bm: "Tarikh", zh: "日期", iban: "Tarikh" },
  venueLabel: { en: "Venue", bm: "Tempat", zh: "地点", iban: "Endur" },
  configuredNote: {
    en: "Attendify™ configured to support the VDP Frontier MARA Miri participant journey.",
    bm: "Attendify™ dikonfigurasikan untuk menyokong perjalanan peserta VDP Frontier MARA Miri.",
    zh: "Attendify™ 已配置以支持 VDP Frontier MARA Miri 参与者旅程。",
    iban: "Attendify™ disediaka kena nyukung pejalai peserta VDP Frontier MARA Miri.",
  },
  organisedBy: { en: "Organised by", bm: "Dianjurkan oleh", zh: "主办单位：", iban: "Diatur ulih" },
  inCollaborationWith: { en: "In collaboration with", bm: "dengan kerjasama", zh: "协办：", iban: "enggau kerjasama" },

  // ── Landing: programme overview ──
  programmeOverview: { en: "Programme Overview", bm: "Gambaran Program", zh: "课程概览", iban: "Gambar Program" },
  threeDaysHeading: {
    en: "Three days. One transformation.",
    bm: "Tiga hari. Satu transformasi.",
    zh: "三天，一次蜕变。",
    iban: "Tiga hari. Siti perubahan.",
  },
  programmeOverviewDesc: {
    en: "A practical programme to strengthen Bumiputera contractors — from business foundations to winning tenders and digital growth.",
    bm: "Program praktikal untuk memperkukuh kontraktor Bumiputera — daripada asas perniagaan kepada memenangi tender dan pertumbuhan digital.",
    zh: "一项实用课程，助力土著承包商——从业务基础到赢得标书与数字化成长。",
    iban: "Program praktikal kena ngeringka kontraktor Bumiputera — ari dasar bisnis ngagai menang tender enggau pemansang digital.",
  },
  dayLabel: { en: "Day", bm: "Hari", zh: "天", iban: "Hari" },
  viewDay: { en: "View day", bm: "Lihat hari", zh: "查看当天", iban: "Peda hari" },

  // ── Landing: journey ──
  yourJourney: { en: "Your Journey", bm: "Perjalanan Anda", zh: "您的旅程", iban: "Pejalai Nuan" },
  oneScanHeading: {
    en: "One scan starts everything",
    bm: "Satu imbasan memulakan segalanya",
    zh: "一次扫描，开启一切",
    iban: "Siti imbas berengkahka semua utai",
  },
  stepLabel: { en: "Step", bm: "Langkah", zh: "步骤", iban: "Langkah" },
  jScanQr: { en: "Scan QR", bm: "Imbas QR", zh: "扫描二维码", iban: "Imbas QR" },
  jConfirm: { en: "Confirm Attendance", bm: "Sahkan Kehadiran", zh: "确认出席", iban: "Sahka Kehadiran" },
  jProfile: { en: "Complete Profile", bm: "Lengkapkan Profil", zh: "完善资料", iban: "Ngaga Profil" },
  jAssessment: { en: "Readiness Assessment", bm: "Penilaian Kesediaan", zh: "准备度评估", iban: "Penilaian Kesediaan" },
  jResults: { en: "Personalised Results", bm: "Keputusan Diperibadikan", zh: "个性化结果", iban: "Keputusan Nuan Empu" },
  jResources: { en: "Programme Resources", bm: "Bahan Program", zh: "课程资源", iban: "Bahan Program" },
  jActionPlan: { en: "90-Day Action Plan", bm: "Pelan Tindakan 90 Hari", zh: "90天行动计划", iban: "Pelan Tindakan 90 Hari" },

  // ── Landing: readiness indicators ──
  contractorReadinessAssessment: {
    en: "Contractor Readiness Assessment",
    bm: "Penilaian Kesediaan Kontraktor",
    zh: "承包商准备度评估",
    iban: "Penilaian Kesediaan Kontraktor",
  },
  knowWhereYouStand: {
    en: "Know exactly where you stand",
    bm: "Ketahui kedudukan sebenar anda",
    zh: "清楚了解您的现状",
    iban: "Nemu endur nuan bediri",
  },
  indicatorsDesc: {
    en: "Five indicators. A score out of 100. Personalised, developmental recommendations you can act on immediately.",
    bm: "Lima penunjuk. Skor daripada 100. Cadangan pembangunan diperibadikan yang boleh anda laksanakan segera.",
    zh: "五项指标。满分 100。可立即执行的个性化发展建议。",
    iban: "Lima penunjuk. Skor ari 100. Saran pemansang ke ulih digaga nuan tekala nya.",
  },
  scoredOutOf20: { en: "Scored out of 20", bm: "Skor daripada 20", zh: "满分 20", iban: "Skor ari 20" },

  // ── Landing: trainers & resources ──
  learnFromLeaders: {
    en: "Learn from industry leaders",
    bm: "Belajar daripada pemimpin industri",
    zh: "向行业领袖学习",
    iban: "Belajar ari tuai industri",
  },
  quickAccess: { en: "Quick Access", bm: "Akses Pantas", zh: "快速访问", iban: "Akses Chelap" },
  programmeResourcesTitle: { en: "Programme resources", bm: "Bahan Program", zh: "课程资源", iban: "Bahan Program" },
  allResources: { en: "All resources", bm: "Semua bahan", zh: "全部资源", iban: "Semua bahan" },

  // ── Sub-pages ──
  programmeTitle: { en: "Programme", bm: "Program", zh: "课程", iban: "Program" },
  threeDayLearningJourney: {
    en: "The Three-Day Learning Journey",
    bm: "Perjalanan Pembelajaran Tiga Hari",
    zh: "三天学习旅程",
    iban: "Pejalai Belajar Tiga Hari",
  },
  meetTrainersTitle: { en: "Meet the Trainers", bm: "Kenali Jurulatih", zh: "认识讲师", iban: "Temu Pengajar" },
  programmeFaculty: { en: "Programme Faculty", bm: "Fakulti Program", zh: "课程讲师团", iban: "Fakulti Program" },
  focusAreas: { en: "Focus Areas", bm: "Bidang Fokus", zh: "专注领域", iban: "Bidang Fokus" },
  resourceCentre: { en: "Resource Centre", bm: "Pusat Bahan", zh: "资源中心", iban: "Pusat Bahan" },
  everythingYouNeed: {
    en: "Everything you need",
    bm: "Segala yang anda perlukan",
    zh: "您所需的一切",
    iban: "Semua utai ke dikinginka nuan",
  },
  resourcesIntro: {
    en: "Templates, checklists and tools to apply what you learn. New items are released during the programme.",
    bm: "Templat, senarai semak dan alat untuk mengaplikasikan pembelajaran anda. Bahan baharu dikeluarkan sepanjang program.",
    zh: "模板、清单与工具，帮助您应用所学。新内容将在课程期间发布。",
    iban: "Templat, senarai semak enggau alat kena ngena utai ti dipelajar nuan. Bahan baru dikeluarka lebuh program.",
  },
  openResourcesFolder: {
    en: "Open Resources Folder (Google Drive)",
    bm: "Buka Folder Bahan (Google Drive)",
    zh: "打开资源文件夹（Google Drive）",
    iban: "Buka Folder Bahan (Google Drive)",
  },
  comingChip: { en: "Coming", bm: "Akan Datang", zh: "即将推出", iban: "Deka Datai" },
  comingNote: {
    en: "Items marked “Coming” will be released during the programme.",
    bm: "Bahan bertanda “Akan Datang” akan dikeluarkan sepanjang program.",
    zh: "标记为“即将推出”的内容将在课程期间发布。",
    iban: "Bahan ke betanda “Deka Datai” deka dikeluarka lebuh program.",
  },

  // ── Portal: My Attendify / Admin / registration / login ──
  myAttendify: { en: "My Attendify", bm: "My Attendify", zh: "My Attendify", iban: "My Attendify" },
  admin: { en: "Admin", bm: "Admin", zh: "管理", iban: "Admin" },
  register: { en: "Register", bm: "Daftar", zh: "注册", iban: "Daftar" },
  registerEnter: {
    en: "Register & Enter Attendify",
    bm: "Daftar & Masuk Attendify",
    zh: "注册并进入 Attendify",
    iban: "Daftar & Tama Attendify",
  },
  createAccount: {
    en: "Create your account",
    bm: "Cipta akaun anda",
    zh: "创建您的账户",
    iban: "Ngaga akaun nuan",
  },
  registerIntro: {
    en: "Register once, then use your mobile number and email to log in during the programme.",
    bm: "Daftar sekali, kemudian guna nombor telefon dan e-mel anda untuk log masuk sepanjang program.",
    zh: "注册一次，之后使用您的手机号码和电子邮箱在课程期间登录。",
    iban: "Daftar sekali, udah nya ngena no. telefon enggau e-mel nuan kena login lebuh program.",
  },
  emailPhoneNote: {
    en: "You’ll use your mobile number and email to log in and to verify attendance.",
    bm: "Anda akan guna nombor telefon dan e-mel untuk log masuk dan mengesahkan kehadiran.",
    zh: "您将使用手机号码和电子邮箱登录并验证出席。",
    iban: "Nuan deka ngena no. telefon enggau e-mel kena login lalu ngesahka kehadiran.",
  },
  emailLabel: { en: "Email", bm: "E-mel", zh: "电子邮箱", iban: "E-mel" },
  companyOptional: {
    en: "Company Name (optional)",
    bm: "Nama Syarikat (pilihan)",
    zh: "公司名称（选填）",
    iban: "Nama Kompeni (pilih)",
  },
  createPin: { en: "Create a 4–6 digit PIN", bm: "Cipta PIN 4–6 digit", zh: "设置 4–6 位 PIN 码", iban: "Ngaga PIN 4–6 digit" },
  confirmPin: { en: "Confirm PIN", bm: "Sahkan PIN", zh: "确认 PIN 码", iban: "Sahka PIN" },
  pinMismatch: { en: "PINs do not match.", bm: "PIN tidak sepadan.", zh: "PIN 码不一致。", iban: "PIN nadai sama." },
  mobileExists: {
    en: "This mobile number is already registered. Please log in.",
    bm: "Nombor telefon ini telah didaftarkan. Sila log masuk.",
    zh: "此手机号码已注册，请登录。",
    iban: "No. telefon tu udah didaftar. Login dulu.",
  },
  createMyAccount: { en: "Create My Account", bm: "Cipta Akaun Saya", zh: "创建我的账户", iban: "Ngaga Akaun Aku" },
  alreadyRegistered: {
    en: "Already registered?",
    bm: "Sudah berdaftar?",
    zh: "已注册？",
    iban: "Udah daftar?",
  },
  logIn: { en: "Log in", bm: "Log masuk", zh: "登录", iban: "Login" },
  welcomeBack: { en: "Welcome Back", bm: "Selamat Kembali", zh: "欢迎回来", iban: "Selamat Pulai" },
  loginIntro: {
    en: "Enter your mobile number and email to continue your journey.",
    bm: "Masukkan nombor telefon dan e-mel anda untuk meneruskan perjalanan.",
    zh: "输入您的手机号码和电子邮箱以继续您的旅程。",
    iban: "Tama no. telefon enggau e-mel nuan kena neruska pejalai.",
  },
  wrongLogin: {
    en: "Mobile number or email is incorrect.",
    bm: "Nombor telefon atau e-mel tidak betul.",
    zh: "手机号码或电子邮箱不正确。",
    iban: "No. telefon tauka e-mel nadai betul.",
  },
  notRegistered: {
    en: "Not registered yet?",
    bm: "Belum berdaftar?",
    zh: "还没注册？",
    iban: "Apin daftar?",
  },
  registerHere: { en: "Register here", bm: "Daftar di sini", zh: "在此注册", iban: "Daftar ditu" },
  continueJourney: { en: "Continue Journey", bm: "Teruskan Perjalanan", zh: "继续旅程", iban: "Terus Pejalai" },
  overallReadiness: { en: "Overall Readiness", bm: "Kesediaan Keseluruhan", zh: "整体准备度", iban: "Kesediaan Semua" },
  myAttendance: { en: "My Attendance", bm: "Kehadiran Saya", zh: "我的出席", iban: "Kehadiran Aku" },
  attendanceMarked: {
    en: "Attendance recorded",
    bm: "Kehadiran direkodkan",
    zh: "出席已记录",
    iban: "Kehadiran udah direkod",
  },
  alreadyMarked: {
    en: "You are already marked present for this session.",
    bm: "Anda sudah ditanda hadir untuk sesi ini.",
    zh: "您已在本场次被标记为出席。",
    iban: "Nuan udah ditanda datai ke sesi tu.",
  },
  exit: { en: "Exit", bm: "Keluar", zh: "退出", iban: "Pansut" },
};

// Short domain terms used as tags (programme topics, trainer focus areas).
// Looked up by their English phrase; unknown terms pass through unchanged.
const GLOSSARY: Record<string, Localized> = {
  "Contractor mindset": { bm: "Minda kontraktor", zh: "承包商思维" },
  "Industry expectations": { bm: "Jangkaan industri", zh: "行业期望" },
  "Corporate profile": { bm: "Profil korporat", zh: "公司简介" },
  "Capability statement": { bm: "Penyata keupayaan", zh: "能力说明书" },
  "Business credibility": { bm: "Kredibiliti perniagaan", zh: "商业信誉" },
  "Project management": { bm: "Pengurusan projek", zh: "项目管理" },
  "Tender readiness": { bm: "Kesediaan tender", zh: "投标准备度" },
  "Proposal excellence": { bm: "Kecemerlangan cadangan", zh: "卓越提案" },
  "Client engagement": { bm: "Penglibatan pelanggan", zh: "客户互动" },
  "Business presentation": { bm: "Pembentangan perniagaan", zh: "商业演示" },
  "AI for contractors": { bm: "AI untuk kontraktor", zh: "承包商的人工智能" },
  "Business automation": { bm: "Automasi perniagaan", zh: "业务自动化" },
  "AI proposal writing": { bm: "Penulisan cadangan AI", zh: "AI 提案撰写" },
  "Digital marketing": { bm: "Pemasaran digital", zh: "数字营销" },
  "90-day business action plan": { bm: "Pelan tindakan perniagaan 90 hari", zh: "90天商业行动计划" },
  "Contractor development": { bm: "Pembangunan kontraktor", zh: "承包商发展" },
  "Tender & proposal excellence": { bm: "Kecemerlangan tender & cadangan", zh: "投标与提案卓越" },
  "Business strategy": { bm: "Strategi perniagaan", zh: "商业策略" },
  "Industry best practices": { bm: "Amalan terbaik industri", zh: "行业最佳实践" },
  "Artificial intelligence": { bm: "Kecerdasan buatan", zh: "人工智能" },
  "Digital transformation": { bm: "Transformasi digital", zh: "数字化转型" },
  "AI productivity": { bm: "Produktiviti AI", zh: "AI 生产力" },
  "Business innovation": { bm: "Inovasi perniagaan", zh: "商业创新" },
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT) => string;
  pick: (value: Localized) => string;
  term: (phrase: string) => string;
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
      term: (phrase) =>
        GLOSSARY[phrase] ? pick({ en: phrase, ...GLOSSARY[phrase] }, lang) : phrase,
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
