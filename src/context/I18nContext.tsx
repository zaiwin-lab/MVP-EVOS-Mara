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
  // Site navigation labels — added so the header can be translated.
  navProgramme: { en: "Programme", bm: "Program", zh: "课程", iban: "Program" },
  navPromptHub: { en: "Prompt Hub", bm: "Prompt Hub", zh: "提示中心", iban: "Prompt Hub" },
  navGallery: { en: "Photo Gallery", bm: "Galeri Foto", zh: "照片库", iban: "Galeri Gambar" },
  navFaq: { en: "FAQ", bm: "Soalan Lazim", zh: "常见问题", iban: "Tanya Selalu" },
  logOut: { en: "Log Out", bm: "Log Keluar", zh: "退出登录", iban: "Pansut" },
  myPrompts: { en: "My Prompt List", bm: "Senarai Prompt Saya", zh: "我的提示列表", iban: "Senarai Prompt Aku" },
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
  tentativeNote: {
    en: "Tentative schedule — session times may be adjusted during the programme.",
    bm: "Jadual tentatif — masa sesi mungkin diubah sepanjang program.",
    zh: "暂定日程 — 各环节时间可能在课程期间调整。",
    iban: "Jadual tentatif — jam sesi engka diubah lebuh program.",
  },
  todaysLearningJourney: {
    en: "Today’s Learning Journey",
    bm: "Perjalanan Pembelajaran Hari Ini",
    zh: "今日学习旅程",
    iban: "Pejalai Belajar Sari Tu",
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

  // ── Readiness Snapshot (ProgramOS Lite) ──
  rdEyebrow: {
    en: "AI Readiness Assessment",
    bm: "Penilaian Kesiapsiagaan AI",
    zh: "AI 就绪度评估",
    iban: "Penilaian Kesedia AI",
  },
  rdTitle: {
    en: "AI Readiness Snapshot",
    bm: "Gambaran Kesiapsiagaan AI",
    zh: "AI 就绪度快照",
    iban: "Gambar Kesedia AI",
  },
  rdIntro: {
    en: "Only {n} questions · About 2 minutes · A guide, not a formal audit.",
    bm: "Hanya {n} soalan · Lebih kurang 2 minit · Panduan, bukan audit formal.",
    zh: "只需 {n} 道题 · 约 2 分钟 · 仅供参考，非正式审核。",
    iban: "Semina {n} tanya · Kira-kira 2 minit · Panduan, ukai audit formal.",
  },
  rdQuestionOf: { en: "Question {i} / {n}", bm: "Soalan {i} / {n}", zh: "第 {i} 题 / 共 {n} 题", iban: "Tanya {i} / {n}" },
  rdPrevious: { en: "Previous", bm: "Sebelumnya", zh: "上一题", iban: "Ti Dulu" },
  rdLevelLabel: {
    en: "Readiness level: {band}",
    bm: "Tahap Kesiapsiagaan: {band}",
    zh: "就绪度等级：{band}",
    iban: "Tikas Kesedia: {band}",
  },
  rdRadarTitle: {
    en: "Your overall picture",
    bm: "Gambaran Kedudukan Anda",
    zh: "您的整体概况",
    iban: "Gambar Penatai Nuan",
  },
  rdRecommendTitle: {
    en: "Recommended area to start with",
    bm: "Bidang cadangan untuk anda mulakan",
    zh: "建议您从这个领域开始",
    iban: "Bidang ti dipadah kena berengkah",
  },
  rdStartThisArea: {
    en: "Start with this area",
    bm: "Mula dengan bidang ini",
    zh: "从这个领域开始",
    iban: "Berengkah enggau bidang tu",
  },
  rdSeeAllAreas: {
    en: "See all 6 work areas",
    bm: "Lihat Semua 6 Bidang",
    zh: "查看全部 6 个领域",
    iban: "Peda Semua 6 Bidang",
  },
  rdToMySpace: { en: "Go to My Space", bm: "Ke Ruang Saya", zh: "前往我的空间", iban: "Ke Ruang Aku" },
  rdRegisterToSave: {
    en: "Register to save your result",
    bm: "Daftar untuk simpan keputusan",
    zh: "注册以保存结果",
    iban: "Daftar kena nyimpan keputusan",
  },
  rdSaveNote: {
    en: "Check in so this result is saved to My Space.",
    bm: "Daftar kehadiran untuk menyimpan keputusan ini ke Ruang Saya.",
    zh: "请先签到，结果便会保存到「我的空间」。",
    iban: "Daftar kehadiran kena nyimpan keputusan tu ba Ruang Aku.",
  },

  // ── Shared page actions ──
  ctaReadyRegister: {
    en: "Ready to begin? Register now",
    bm: "Sedia untuk bermula? Daftar sekarang",
    zh: "准备好了吗？立即报名",
    iban: "Udah sedia berengkah? Daftar diatu",
  },
  ctaRegisterCheckIn: { en: "Register / Check-In", bm: "Daftar / Check-In", zh: "报名／签到", iban: "Daftar / Check-In" },
  ctaExplorePromptHub: { en: "Explore the Prompt Hub", bm: "Terokai Prompt Hub", zh: "探索提示中心", iban: "Uji Peda Prompt Hub" },
  pgScheduleNote: {
    en: "Tentative schedule — session times may shift during the programme. A light guide, not a compulsory KPI.",
    bm: "Jadual tentatif — masa sesi mungkin diubah sepanjang program. Panduan ringkas, bukan KPI wajib.",
    zh: "暂定日程——各环节时间可能在课程期间调整。这是轻松的指引，不是硬性 KPI。",
    iban: "Jadual tentatif — jam sesi engka diubah sepemanjai program. Panduan ti pandak, ukai KPI ti mesti.",
  },
  metaParticipants: { en: "{n} Participants", bm: "{n} Peserta", zh: "{n} 位参与者", iban: "{n} Peserta" },
  metaLimitedPlaces: { en: "Limited places", bm: "Tempat Terhad", zh: "名额有限", iban: "Endur Mimit" },
  metaReps: { en: "{n} Representatives", bm: "{n} Wakil", zh: "{n} 位代表", iban: "{n} Wakil" },
  metaPerCoop: { en: "Per co-operative", bm: "Setiap Koperasi", zh: "每家合作社", iban: "Tiap Koperasi" },
  homeAria: { en: "ProgramOS Lite — Home", bm: "ProgramOS Lite — Utama", zh: "ProgramOS Lite — 首页", iban: "ProgramOS Lite — Utama" },

  // ── In-page QR scanner ──
  msScanTitle: {
    en: "Mark your attendance",
    bm: "Tandakan Kehadiran Anda",
    zh: "登记您的出席",
    iban: "Tandaka Kehadiran Nuan",
  },
  msScanBody: {
    en: "On the programme day, scan the QR code at the venue.",
    bm: "Pada hari program, imbas kod QR di tempat acara.",
    zh: "课程当天，请扫描现场的二维码。",
    iban: "Ba hari program, imbas kod QR ba endur acara.",
  },
  scanTitle: { en: "Scan the attendance QR", bm: "Imbas QR Kehadiran", zh: "扫描出席二维码", iban: "Imbas QR Kehadiran" },
  scanCta: { en: "Scan QR", bm: "Imbas QR", zh: "扫描二维码", iban: "Imbas QR" },
  scanStarting: { en: "Starting the camera…", bm: "Membuka kamera…", zh: "正在启动相机…", iban: "Benung muka kamera…" },
  scanHint: {
    en: "Point the camera at the QR code displayed at the venue.",
    bm: "Halakan kamera ke kod QR yang dipaparkan di tempat acara.",
    zh: "将相机对准现场展示的二维码。",
    iban: "Tuju kamera ngagai kod QR ti dipegarika ba endur acara.",
  },
  scanClose: { en: "Close", bm: "Tutup", zh: "关闭", iban: "Tutup" },
  scanDenied: {
    en: "Camera access was blocked",
    bm: "Akses kamera disekat",
    zh: "相机权限被拒绝",
    iban: "Akses kamera ditagang",
  },
  scanNoCamera: { en: "No camera found", bm: "Kamera tidak dijumpai", zh: "找不到相机", iban: "Kamera nadai ditemu" },
  scanInsecure: {
    en: "The camera needs a secure (https) connection",
    bm: "Kamera memerlukan sambungan selamat (https)",
    zh: "使用相机需要安全（https）连接",
    iban: "Kamera minta sambung ti aman (https)",
  },
  scanUnsupported: {
    en: "This browser cannot open the camera",
    bm: "Pelayar ini tidak boleh membuka kamera",
    zh: "此浏览器无法打开相机",
    iban: "Pelayar tu enda ulih muka kamera",
  },
  scanFallbackHint: {
    en: "You can still mark attendance with the button on this page, or scan the QR with your phone's own camera app.",
    bm: "Anda masih boleh menandakan kehadiran dengan butang di halaman ini, atau imbas QR menggunakan aplikasi kamera telefon anda.",
    zh: "您仍可用本页的按钮登记出席，或用手机自带的相机扫描二维码。",
    iban: "Nuan agi ulih nandaka kehadiran ngena butang ba laman tu, tauka imbas QR ngena aplikasi kamera telefon nuan empu.",
  },
  scanWrongCode: {
    en: "That is not the attendance QR for this programme.",
    bm: "Itu bukan kod QR kehadiran untuk program ini.",
    zh: "那不是本课程的出席二维码。",
    iban: "Nya ukai kod QR kehadiran ke program tu.",
  },

  // ── Scan to attend (programme day) ──
  atEyebrow: { en: "Programme day", bm: "Hari Program", zh: "课程当天", iban: "Hari Program" },
  atTitle: { en: "Mark your attendance", bm: "Tandakan Kehadiran Anda", zh: "登记您的出席", iban: "Tandaka Kehadiran Nuan" },
  atCounterLabel: {
    en: "Participants checked in",
    bm: "Peserta telah hadir",
    zh: "已签到人数",
    iban: "Peserta ti udah datai",
  },
  atGreeting: { en: "Signed in as", bm: "Log masuk sebagai", zh: "当前登录", iban: "Login nyadi" },
  atMarkCta: { en: "I'm here", bm: "Saya Hadir", zh: "我到了", iban: "Aku Udah Datai" },
  atMarking: { en: "Recording…", bm: "Merekod…", zh: "记录中…", iban: "Benung ngerekod…" },
  atMarkHint: {
    en: "One tap. Your attendance is what your e-certificate is issued from.",
    bm: "Satu tekan sahaja. Kehadiran anda inilah asas penjanaan e-sijil.",
    zh: "只需点一下。您的出席记录就是电子证书的依据。",
    iban: "Semina sekali tekan. Kehadiran nuan nya ti dikena ngaga e-sijil.",
  },
  atDoneTitle: { en: "You're marked present", bm: "Kehadiran Direkodkan", zh: "出席已记录", iban: "Kehadiran Udah Direkod" },
  atDoneBody: {
    en: "Thank you, {name}. Enjoy the programme — your e-certificate will be waiting in My Space.",
    bm: "Terima kasih, {name}. Selamat mengikuti program — e-sijil anda menanti di Ruang Saya.",
    zh: "谢谢您，{name}。祝您学有所得——电子证书已在「我的空间」等候。",
    iban: "Terima kasih, {name}. Selamat nitihka program — e-sijil nuan nganti ba Ruang Aku.",
  },
  atSignInTitle: {
    en: "Sign in to mark attendance",
    bm: "Log Masuk untuk Tandakan Kehadiran",
    zh: "登录以登记出席",
    iban: "Login kena Nandaka Kehadiran",
  },
  atSignInBody: {
    en: "Use the phone number and email you registered with.",
    bm: "Guna nombor telefon dan emel yang anda daftarkan.",
    zh: "请使用您注册时填写的手机号码与电子邮箱。",
    iban: "Kena no. telefon enggau e-mel ti udah didaftar nuan.",
  },
  atSignInCta: { en: "Sign in & mark attendance", bm: "Log Masuk & Tandakan Hadir", zh: "登录并登记出席", iban: "Login & Tandaka Hadir" },

  // ── e-Certificate ──
  certEyebrow: { en: "Certificate of participation", bm: "Sijil Penyertaan", zh: "参与证书", iban: "Sijil Penyerta" },
  certTitle: { en: "Your e-certificate", bm: "E-Sijil Anda", zh: "您的电子证书", iban: "E-Sijil Nuan" },
  certHint: {
    en: "Print it, or choose “Save as PDF” in the print dialog to keep a copy.",
    bm: "Cetak, atau pilih “Save as PDF” dalam tetingkap cetak untuk menyimpan salinan.",
    zh: "可直接打印，或在打印窗口选择「另存为 PDF」保存副本。",
    iban: "Chetak, tauka pilih “Save as PDF” ba tetingkap chetak kena nyimpan salin.",
  },
  certPrint: { en: "Print / Save as PDF", bm: "Cetak / Simpan PDF", zh: "打印／保存 PDF", iban: "Chetak / Simpan PDF" },
  certBadge: { en: "Certificate of Participation", bm: "Sijil Penyertaan", zh: "参与证书", iban: "Sijil Penyerta" },
  certHeading: {
    en: "This certificate is proudly presented to",
    bm: "Sijil ini dengan bangganya dianugerahkan kepada",
    zh: "本证书荣誉颁发给",
    iban: "Sijil tu enggau bangga diberi ngagai",
  },
  certBody: {
    en: "for successfully participating in and completing the programme",
    bm: "atas kejayaan menyertai dan menyempurnakan program",
    zh: "圆满参与并完成本课程",
    iban: "laban udah nyerta sereta ngelamatka program",
  },
  certSerialLabel: { en: "Certificate No.", bm: "No. Sijil", zh: "证书编号", iban: "No. Sijil" },
  certIssued: { en: "Issued", bm: "Dikeluarkan", zh: "签发", iban: "Dikeluarka" },
  certVerifyNote: {
    en: "Serial {serial}. The organiser can confirm it against the programme attendance record.",
    bm: "Siri {serial}. Penganjur boleh mengesahkannya dengan rekod kehadiran program.",
    zh: "编号 {serial}。主办单位可对照课程出席记录核实。",
    iban: "Siri {serial}. Penganjur ulih ngesahka iya enggau rekod kehadiran program.",
  },
  certLockedTitle: {
    en: "Not available yet",
    bm: "Belum Tersedia",
    zh: "尚未可用",
    iban: "Apin Sedia",
  },
  certLockedBody: {
    en: "Your e-certificate appears here once your attendance on the programme day has been recorded.",
    bm: "E-sijil anda akan dipaparkan di sini sebaik kehadiran anda pada hari program direkodkan.",
    zh: "当您在课程当天的出席记录完成后，电子证书就会显示在这里。",
    iban: "E-sijil nuan deka pegari ditu lebuh kehadiran nuan ba hari program udah direkod.",
  },
  msCertificate: { en: "My e-certificate", bm: "E-Sijil Saya", zh: "我的电子证书", iban: "E-Sijil Aku" },
  msCertReady: { en: "Ready to download", bm: "Sedia dimuat turun", zh: "可供下载", iban: "Sedia diambi" },
  msCertPending: { en: "After the programme day", bm: "Selepas hari program", zh: "课程当天之后", iban: "Udah hari program" },

  // ── Site chrome ──
  headerCta: { en: "Register / Sign In", bm: "Daftar / Log Masuk", zh: "注册／登录", iban: "Daftar / Login" },
  headerCtaShort: { en: "Register", bm: "Daftar", zh: "注册", iban: "Daftar" },
  wordmarkSub: { en: "AI for Co-operatives", bm: "AI untuk Koperasi", zh: "合作社的 AI", iban: "AI ke Koperasi" },
  footerTagline: {
    en: "AI Does Not Replace People — It Empowers Co-operatives.",
    bm: "AI Bukan Menggantikan Manusia, Tetapi Memperkasa Koperasi.",
    zh: "AI 不是取代人，而是赋能合作社。",
    iban: "AI Ukai Nganti Mensia, Tang Meri Kuasa Ngagai Koperasi.",
  },

  // ── Landing page ──
  ldFeatEyebrow: { en: "The programme", bm: "Program Ini", zh: "关于课程", iban: "Program Tu" },
  ldFeatTitle: {
    en: "Everything runs from one place",
    bm: "Semuanya bermula dari satu tempat",
    zh: "一切从同一个地方开始",
    iban: "Semua berengkah ari siti endur",
  },
  ldFeatDesc: {
    en: "Check in, measure where your co-op stands, then work through prompts built for the job in front of you.",
    bm: "Daftar kehadiran, ukur kedudukan koperasi anda, kemudian gunakan prompt yang dibina untuk kerja di hadapan anda.",
    zh: "先签到，评估贵合作社的现况，再用为您手上工作而设的提示。",
    iban: "Daftar kehadiran, ukur penatai koperasi nuan, udah nya kena prompt ti digaga ke pengawa ti bisi di mua nuan.",
  },
  ldStartJourney: {
    en: "Start Your AI Journey",
    bm: "Mulakan Perjalanan AI Anda",
    zh: "开启您的 AI 旅程",
    iban: "Berengkahka Pejalai AI Nuan",
  },
  ldAccessModules: { en: "Open the modules", bm: "Akses Modul", zh: "取用模块", iban: "Buka Modul" },
  ldPhotoGallery: { en: "Photo gallery", bm: "Galeri Foto", zh: "照片库", iban: "Galeri Gambar" },
  ldExplore: { en: "Explore", bm: "Terokai", zh: "了解更多", iban: "Uji Peda" },
  ldQuickEyebrow: { en: "Your quick doors", bm: "Pintu Pantas Anda", zh: "快速入口", iban: "Pintu Chelap Nuan" },
  ldQuickTitle: { en: "Main programme access", bm: "Akses Utama Program", zh: "课程主要入口", iban: "Akses Utama Program" },
  ldQuickDesc: {
    en: "Everything you need, in one place.",
    bm: "Semua yang anda perlukan, di satu tempat.",
    zh: "您需要的一切，都在这里。",
    iban: "Semua utai ti dikinginka nuan, ba siti endur.",
  },
  ldAreasEyebrow: { en: "6 co-op work areas", bm: "6 Bidang Utama Koperasi", zh: "合作社 6 大核心领域", iban: "6 Bidang Utama Koperasi" },
  ldAreasTitle: {
    en: "{n} practical prompts, built for co-operatives",
    bm: "{n} prompt praktikal, disusun untuk koperasi",
    zh: "{n} 个实用提示，专为合作社而设",
    iban: "{n} prompt praktikal, digaga ke koperasi",
  },
  ldAreasDesc: {
    en: "Each area holds 10 prompt missions designed for practical co-op use.",
    bm: "Setiap bidang mengandungi 10 prompt mission yang direka khas untuk kegunaan koperasi secara praktikal.",
    zh: "每个领域包含 10 个提示任务，专为合作社的实际运用而设计。",
    iban: "Tiap bidang bisi 10 prompt mission ti digaga ke pengguna koperasi ti praktikal.",
  },
  ldMissionsChip: { en: "10 Prompt Missions", bm: "10 Prompt Missions", zh: "10 个提示任务", iban: "10 Prompt Missions" },
  ldUnsureTitle: {
    en: "Not sure which area to start with?",
    bm: "Tidak pasti bidang mana untuk bermula?",
    zh: "不确定该从哪个领域开始？",
    iban: "Enda tentu bidang ni ke berengkah?",
  },
  ldUnsureDesc: {
    en: "Take the AI Readiness Snapshot — {n} questions, 2 minutes — and we will suggest one area to start with.",
    bm: "Lengkapkan AI Readiness Snapshot — {n} soalan, 2 minit — dan kami cadangkan satu bidang untuk anda mulakan.",
    zh: "完成 AI 就绪度快照——{n} 道题，2 分钟——我们会建议一个起步领域。",
    iban: "Ngaga AI Readiness Snapshot — {n} tanya, 2 minit — lalu kami deka madah siti bidang kena berengkah.",
  },

  // ── Programme & FAQ page headers ──
  pgEyebrow: { en: "Programme", bm: "Program", zh: "课程", iban: "Program" },
  pgTitle: { en: "The One-Day Programme Flow", bm: "Aliran Program Sehari", zh: "一日课程流程", iban: "Aliran Program Sehari" },
  pgIntro: {
    en: "A light, practical programme that walks co-operatives into AI step by step — at your own pace.",
    bm: "Program praktikal dan ringan yang membimbing koperasi menerap AI langkah demi langkah — mengikut rentak anda.",
    zh: "一个轻量而实用的课程，带领合作社一步步导入 AI——按自己的节奏前进。",
    iban: "Program praktikal sereta ringan ti mimpin koperasi ngena AI selangkah-selangkah — nitihka rentak nuan empu.",
  },
  faqTitle: { en: "Frequently Asked Questions", bm: "Soalan Lazim", zh: "常见问题", iban: "Tanya Ti Selalu" },
  faqIntro: {
    en: "The things people most often ask about ProgramOS Lite.",
    bm: "Perkara yang sering ditanya tentang ProgramOS Lite.",
    zh: "关于 ProgramOS Lite 最常被问到的问题。",
    iban: "Pekara ti selalu ditanya pasal ProgramOS Lite.",
  },

  // ── Prompt Hub ──
  phEyebrow: { en: "AI Prompt Hub · 6 Work Areas", bm: "AI Prompt Hub · 6 Bidang Utama", zh: "AI 提示中心 · 6 大领域", iban: "AI Prompt Hub · 6 Bidang Utama" },
  phTitle: { en: "Choose Your Work Area", bm: "Pilih Bidang Utama Anda", zh: "选择您的核心领域", iban: "Pilih Bidang Utama Nuan" },
  phIntro: {
    en: "Each area holds a set of AI prompts put together to help co-operatives work more easily, faster and more effectively — {n} prompts in all.",
    bm: "Setiap bidang mengandungi koleksi prompt AI yang disusun khas untuk membantu koperasi bekerja dengan lebih mudah, cepat dan berkesan — {n} prompt kesemuanya.",
    zh: "每个领域都收录了一组 AI 提示，帮助合作社更轻松、更快速、更有效地工作——共 {n} 个提示。",
    iban: "Tiap bidang bisi kumpul prompt AI ti digaga kena nulung koperasi bekereja enggau mudah, chelap sereta beguna agi — {n} prompt semua.",
  },
  phStep1: { en: "Choose an area", bm: "Pilih Bidang", zh: "选择领域", iban: "Pilih Bidang" },
  phStep1Desc: {
    en: "Pick the one area most relevant to what your co-op needs.",
    bm: "Pilih satu bidang yang paling relevan dengan keperluan koperasi anda.",
    zh: "选出与贵合作社需求最相关的一个领域。",
    iban: "Pilih siti bidang ti pemadu ngena enggau pengingin koperasi nuan.",
  },
  phStep2: { en: "Browse the prompts", bm: "Lihat Prompt", zh: "浏览提示", iban: "Peda Prompt" },
  phStep2Desc: {
    en: "Explore the prompt list for that area.",
    bm: "Terokai senarai prompt mengikut bidang.",
    zh: "浏览该领域的提示清单。",
    iban: "Uji peda senarai prompt ba bidang nya.",
  },
  phStep3: { en: "Get started", bm: "Mulakan", zh: "开始使用", iban: "Berengkah" },
  phStep3Desc: {
    en: "Fill in your details, generate the prompt, and use it in the AI of your choice.",
    bm: "Isi butiran, jana prompt, dan gunakan dalam AI pilihan anda.",
    zh: "填写资料、生成提示，然后在您选择的 AI 中使用。",
    iban: "Isi penerang, ngaga prompt, lalu kena ba AI ti dipilih nuan.",
  },
  phSelected: { en: "Selected", bm: "Dipilih", zh: "已选择", iban: "Udah dipilih" },
  phSeeTen: { en: "See 10 prompts", bm: "Lihat 10 Prompt", zh: "查看 10 个提示", iban: "Peda 10 Prompt" },
  phUnsure: { en: "Not sure which area?", bm: "Tidak pasti bidang mana?", zh: "不确定选哪个领域？", iban: "Enda tentu bidang ni?" },
  phUnsureDesc: {
    en: "Take the AI Readiness Snapshot and we will suggest one area to start with.",
    bm: "Ambil AI Readiness Snapshot dan kami cadangkan satu bidang untuk anda mulakan.",
    zh: "先做 AI 就绪度快照，我们会建议一个起步领域。",
    iban: "Ambi AI Readiness Snapshot lalu kami deka madah siti bidang kena berengkah.",
  },
  phStartAssessment: { en: "Start the assessment", bm: "Mula Penilaian", zh: "开始评估", iban: "Berengkah Penilaian" },

  // ── Simplified journey (nav, home sections, after-programme, result) ──
  navModules: { en: "Modules & Resources", bm: "Modul & Sumber", zh: "模块与资源", iban: "Modul & Bahan" },
  ldCheckInCta: { en: "Check In", bm: "Daftar Kehadiran", zh: "签到", iban: "Daftar Kehadiran" },
  ldOpenHub: { en: "Open the Prompt Hub", bm: "Buka Prompt Hub", zh: "打开提示中心", iban: "Muka Prompt Hub" },
  ldTodayEyebrow: { en: "Today", bm: "Hari Ini", zh: "今天", iban: "Sehari Tu" },
  ldTodayTitle: { en: "Today's Programme", bm: "Program Hari Ini", zh: "今日课程", iban: "Program Sehari Tu" },
  ldToolkitEyebrow: { en: "Your AI toolkit", bm: "AI Toolkit Anda", zh: "您的 AI 工具包", iban: "AI Toolkit Nuan" },
  ldToolkitTitle: {
    en: "Choose the area closest to your work",
    bm: "Pilih Bidang Yang Berkaitan Dengan Kerja Anda",
    zh: "选择与您工作最相关的领域",
    iban: "Pilih Bidang Ti Ngena Enggau Pengawa Nuan",
  },
  ldToolkitDesc: {
    en: "Ten ready-made prompts in each area. Open one, fill in a few details, copy it.",
    bm: "Sepuluh prompt siap sedia dalam setiap bidang. Buka satu, isi beberapa butiran, salin.",
    zh: "每个领域备有十个现成提示。打开一个、填几项资料、复制即可。",
    iban: "Sepuluh prompt ti udah sedia ba tiap bidang. Muka siti, isi sekeda butir, salin.",
  },
  ldTakeEyebrow: { en: "After today", bm: "Selepas Hari Ini", zh: "课程之后", iban: "Udah Sehari Tu" },
  ldTakeTitle: { en: "Take it home with you", bm: "Bawa Balik Selepas Program", zh: "把成果带回去", iban: "Bai Pulai Udah Program" },
  ldModulesCardDesc: {
    en: "Slides, templates and references — open them any time.",
    bm: "Slide, template dan rujukan — buka bila-bila masa.",
    zh: "简报、模板与参考资料，随时取用。",
    iban: "Slide, template enggau rujukan — muka kemaya-maya.",
  },
  ldGalleryCardDesc: {
    en: "Official photographs from the programme day.",
    bm: "Gambar rasmi daripada hari program.",
    zh: "课程当天的官方照片。",
    iban: "Gambar resmi ari hari program.",
  },
  ldFaqEyebrow: { en: "Quick answers", bm: "Jawapan Ringkas", zh: "简短解答", iban: "Saut Pandak" },

  // ── After the programme (foot of each work area) ──
  waAfterTitle: { en: "Carry on after the programme", bm: "Teruskan Selepas Program", zh: "课程之后继续", iban: "Teruska Udah Program" },
  waAfterNote: {
    en: "Use it as your co-operative needs and at your own pace.",
    bm: "Gunakan mengikut keperluan dan rentak koperasi anda.",
    zh: "按合作社的需要与节奏使用即可。",
    iban: "Kena iya nitihka pengingin enggau rentak koperasi nuan.",
  },

  // ── 5 questions — a suggestion, not an audit ──
  rdShortTitle: { en: "5 Quick Questions", bm: "5 Soalan Ringkas", zh: "5 个简短问题", iban: "5 Tanya Pandak" },
  rdShortEyebrow: { en: "Where to start", bm: "Tempat Untuk Bermula", zh: "从哪里开始", iban: "Endur Berengkah" },
  rdShortIntro: {
    en: "Answer five quick questions and we will suggest one area to start with.",
    bm: "Jawab lima soalan ringkas dan kami cadangkan satu bidang untuk anda mulakan.",
    zh: "回答五个简短问题，我们会建议一个起步领域。",
    iban: "Saut lima tanya ti pandak lalu kami deka madah siti bidang kena berengkah.",
  },
  rdSuggestTitle: {
    en: "An area for you to start with",
    bm: "Cadangan Bidang Untuk Anda Mulakan",
    zh: "建议您从这个领域开始",
    iban: "Cadangan Bidang Ke Nuan Berengkah",
  },
  rdAlsoExplore: {
    en: "You are welcome to explore any of the other areas too.",
    bm: "Anda juga boleh meneroka mana-mana bidang lain.",
    zh: "您也可以自由探索其他任何领域。",
    iban: "Nuan mega ulih nguji bidang bukai.",
  },
  rdGuideNote: {
    en: "A short guide, not an audit or a certification.",
    bm: "Panduan ringkas, bukan audit atau pensijilan.",
    zh: "这是简短指引，不是审核或认证。",
    iban: "Panduan ti pandak, ukai audit tauka pensijilan.",
  },
  rdUnsureCta: { en: "Start the 5 questions", bm: "Mulakan 5 Soalan", zh: "开始 5 个问题", iban: "Berengkah 5 Tanya" },

  // ── Modules & resources, when nothing has been linked yet ──
  sbNoneTitle: { en: "Modules are on their way", bm: "Modul Akan Dikongsi", zh: "模块即将提供", iban: "Modul Deka Dikunsika" },
  sbNoneDesc: {
    en: "The slides and templates will be shared here on the programme day. This page is the one place to come back to.",
    bm: "Slide dan template akan dikongsi di sini pada hari program. Halaman ini tempat untuk anda kembali.",
    zh: "简报与模板将于课程当天在此提供，日后回到这个页面即可。",
    iban: "Slide enggau template deka dikunsika ditu ba hari program. Laman tu endur nuan pulai baru.",
  },
  glNoneTitle: { en: "Photographs after the programme", bm: "Gambar Selepas Program", zh: "课程后的照片", iban: "Gambar Udah Program" },
  myCertificate: { en: "My e-certificate", bm: "E-Sijil Saya", zh: "我的电子证书", iban: "E-Sijil Aku" },

  // ── Work area page ──
  waAllAreas: { en: "All areas", bm: "Semua Bidang", zh: "全部领域", iban: "Semua Bidang" },
  waMissions: { en: "{n} Prompt Missions", bm: "{n} Prompt Missions", zh: "{n} 个提示任务", iban: "{n} Prompt Missions" },
  waTried: { en: "{a}/{b} tried", bm: "{a}/{b} telah dicuba", zh: "已尝试 {a}/{b}", iban: "{a}/{b} udah diuji" },
  waViewPrompt: { en: "View prompt", bm: "Lihat Prompt", zh: "查看提示", iban: "Peda Prompt" },
  waTip: {
    en: "Tip: treat what the prompt gives you as a starting point and adjust it to your co-op. Small prompt, big impact!",
    bm: "Petua: Gunakan hasil prompt ini sebagai titik permulaan dan sesuaikan mengikut keperluan koperasi anda. Kecilkan Prompt, Besarkan Impak!",
    zh: "小贴士：把提示生成的内容当作起点，再按贵合作社的需要调整。小提示，大影响！",
    iban: "Petua: Kena utai ti ulih ari prompt tu nyadi pun, lalu ubah nitihka pengingin koperasi nuan. Prompt mit, impak besai!",
  },

  // ── Prompt builder ──
  pbPromptOfTen: { en: "Prompt {n} / 10", bm: "Prompt {n} / 10", zh: "第 {n} 个提示 / 共 10 个", iban: "Prompt {n} / 10" },
  pbFillDetails: { en: "Fill in your details", bm: "Isi Butiran Anda", zh: "填写您的资料", iban: "Isi Penerang Nuan" },
  pbFillNote: {
    en: "Just a few short details. Blank fields are skipped.",
    bm: "Hanya beberapa maklumat ringkas. Medan kosong akan dilangkau.",
    zh: "只需几项简短资料。留空的栏位会被跳过。",
    iban: "Semina sekeda penerang pandak. Ruang ti kosong deka dilintasi.",
  },
  pbGenerate: { en: "Generate My Prompt", bm: "Jana Prompt Saya", zh: "生成我的提示", iban: "Ngaga Prompt Aku" },
  pbLoginTitle: {
    en: "Sign in first to use this prompt",
    bm: "Log masuk dahulu untuk guna prompt ini",
    zh: "请先登录再使用此提示",
    iban: "Login dulu kena ngena prompt tu",
  },
  pbLoginBodyA: {
    en: "The prompt you generate is saved to",
    bm: "Prompt yang anda jana akan disimpan dalam",
    zh: "您生成的提示会保存到",
    iban: "Prompt ti digaga nuan deka disimpan ba",
  },
  pbLoginBodyB: {
    en: "so you can read it back after the programme. Browsing the prompt library stays free.",
    bm: "supaya anda boleh rujuk semula selepas program. Melihat pustaka prompt kekal percuma.",
    zh: "方便您在课程结束后回顾。浏览提示库仍然免费。",
    iban: "ngambika nuan ulih macha iya baru udah program. Meda pustaka prompt agi percuma.",
  },
  pbLoginCta: { en: "Sign In / Register", bm: "Log Masuk / Daftar", zh: "登录／注册", iban: "Login / Daftar" },
  pbBackToList: { en: "Back to the list", bm: "Kembali ke senarai", zh: "返回清单", iban: "Pulai ngagai senarai" },
  pbResultTitle: { en: "Your prompt", bm: "Hasil Prompt Anda", zh: "您的提示", iban: "Prompt Nuan" },
  pbReady: { en: "Ready", bm: "Sedia", zh: "就绪", iban: "Sedia" },
  pbCopied: { en: "Copied!", bm: "Disalin!", zh: "已复制！", iban: "Udah disalin!" },
  pbCopy: { en: "Copy prompt", bm: "Salin Prompt", zh: "复制提示", iban: "Salin Prompt" },
  pbDownload: { en: "Download .txt", bm: "Muat Turun .txt", zh: "下载 .txt", iban: "Ambi .txt" },
  pbSavedState: { en: "Saved", bm: "Disimpan", zh: "已保存", iban: "Udah disimpan" },
  pbSaveToList: { en: "Save to my list", bm: "Simpan ke Senarai", zh: "保存到清单", iban: "Simpan ba Senarai" },
  pbRegisterToSave: { en: "Register to save", bm: "Daftar untuk simpan", zh: "注册以保存", iban: "Daftar kena nyimpan" },
  pbPasteHint: {
    en: "Copy this prompt and paste it into ChatGPT, Claude or Gemini for the best result.",
    bm: "Salin prompt ini dan tampalkan ke dalam ChatGPT, Claude atau Gemini untuk mendapatkan hasil terbaik.",
    zh: "复制此提示，贴到 ChatGPT、Claude 或 Gemini 中，效果最佳。",
    iban: "Salin prompt tu lalu tampal ba ChatGPT, Claude tauka Gemini kena ulih hasil ti pemadu manah.",
  },
  pbEmpty: {
    en: "Fill in the details on the left and press “Generate My Prompt”. Your professional prompt appears here, ready to copy.",
    bm: "Isi butiran di sebelah dan tekan “Jana Prompt Saya”. Prompt profesional anda akan dipaparkan di sini, sedia untuk disalin.",
    zh: "在左侧填写资料，然后按「生成我的提示」。您的专业提示会显示在这里，可直接复制。",
    iban: "Isi penerang ba sepiak lalu tekan “Ngaga Prompt Aku”. Prompt profesional nuan deka pegari ditu, sedia disalin.",
  },

  // ── My Space ──
  msLoading: { en: "Loading…", bm: "Memuatkan…", zh: "载入中…", iban: "Benung ngambi…" },
  msEyebrow: { en: "My Space · My Results", bm: "Ruang Saya · Hasil Saya", zh: "我的空间 · 我的成果", iban: "Ruang Aku · Hasil Aku" },
  msGreeting: { en: "Hello, {name} 👋", bm: "Salam, {name} 👋", zh: "您好，{name} 👋", iban: "Selamat, {name} 👋" },
  msParticipantRole: { en: "Participant", bm: "Peserta", zh: "参与者", iban: "Peserta" },
  msAttendanceYes: { en: "Attendance recorded", bm: "Kehadiran direkodkan", zh: "出席已记录", iban: "Kehadiran udah direkod" },
  msAttendanceNo: { en: "Not checked in yet", bm: "Belum daftar kehadiran", zh: "尚未签到", iban: "Apin daftar kehadiran" },
  msTriedCount: { en: "{n} prompts tried", bm: "{n} prompt dicuba", zh: "已尝试 {n} 个提示", iban: "{n} prompt udah diuji" },
  msSavedCount: { en: "{n} prompts saved", bm: "{n} prompt disimpan", zh: "已保存 {n} 个提示", iban: "{n} prompt udah disimpan" },
  msReadiness: { en: "AI readiness", bm: "Kesiapsiagaan AI", zh: "AI 就绪度", iban: "Kesedia AI" },
  msRetake: { en: "Take it again", bm: "Ambil semula", zh: "重新评估", iban: "Ambi baru" },
  msNoAssessment: { en: "You have not taken the assessment yet.", bm: "Anda belum mengambil penilaian.", zh: "您尚未进行评估。", iban: "Nuan apin ngambi penilaian." },
  msStartAssessment: { en: "Start the AI assessment", bm: "Mula Penilaian AI", zh: "开始 AI 评估", iban: "Berengkah Penilaian AI" },
  msFocusArea: { en: "Your focus area", bm: "Bidang Fokus Anda", zh: "您的重点领域", iban: "Bidang Fokus Nuan" },
  msOpen: { en: "Open", bm: "Buka", zh: "打开", iban: "Buka" },
  msNoArea: {
    en: "You have not chosen an area yet. Explore the 6 work areas.",
    bm: "Anda belum memilih bidang. Terokai 6 bidang utama.",
    zh: "您尚未选择领域。来看看 6 大核心领域。",
    iban: "Nuan apin milih bidang. Uji peda 6 bidang utama.",
  },
  msChooseArea: { en: "Choose an area", bm: "Pilih Bidang", zh: "选择领域", iban: "Pilih Bidang" },
  msAddMore: { en: "Add more", bm: "Tambah lagi", zh: "添加更多", iban: "Tambah agi" },
  msNoPrompts: {
    en: "No prompts used yet. Open the Prompt Hub, fill in your co-op details and press “Generate My Prompt” — it will appear here.",
    bm: "Belum ada prompt digunakan. Buka Prompt Hub, isi butiran koperasi anda dan tekan “Jana Prompt Saya” — ia akan muncul di sini.",
    zh: "您还没有使用过任何提示。打开提示中心，填写合作社资料并按「生成我的提示」——它就会出现在这里。",
    iban: "Apin bisi prompt dikena. Buka Prompt Hub, isi penerang koperasi nuan lalu tekan “Ngaga Prompt Aku” — iya deka pegari ditu.",
  },
  msSixAreas: { en: "6 work areas", bm: "6 Bidang Utama", zh: "6 大核心领域", iban: "6 Bidang Utama" },
  msJourney: { en: "90-day journey", bm: "Perjalanan 90 Hari", zh: "90 天旅程", iban: "Pejalai 90 Hari" },
  msResources: { en: "Modules & resources", bm: "Modul & Sumber", zh: "模块与资源", iban: "Modul & Bahan" },
  msTimesUsed: { en: "used {n}×", bm: "{n} kali guna", zh: "使用 {n} 次", iban: "dikena {n} kali" },
  msSavedTag: { en: "Saved", bm: "Disimpan", zh: "已保存", iban: "Udah disimpan" },
  msViewPrompt: { en: "View prompt", bm: "Lihat prompt", zh: "查看提示", iban: "Peda prompt" },
  msClosePrompt: { en: "Close", bm: "Tutup", zh: "收起", iban: "Tutup" },
  msCopyPrompt: { en: "Copy prompt", bm: "Salin prompt", zh: "复制提示", iban: "Salin prompt" },
  msRegenerate: { en: "Generate again", bm: "Jana semula", zh: "重新生成", iban: "Ngaga baru" },
  msNoStoredText: {
    en: "This prompt was recorded before the text was stored. Generate it again to keep a copy.",
    bm: "Prompt ini direkodkan sebelum teks disimpan. Jana semula untuk menyimpan salinannya.",
    zh: "此提示是在开始保存文本之前记录的。重新生成即可保留副本。",
    iban: "Prompt tu direkod sebedau teks disimpan. Ngaga baru kena nyimpan salin iya.",
  },

  // ── Check-in / registration form ──
  ciCoopName: { en: "Co-op Name", bm: "Nama Koperasi", zh: "合作社名称", iban: "Nama Koperasi" },
  ciRole: { en: "Role", bm: "Peranan", zh: "职务", iban: "Pengawa" },
  ciPickRole: { en: "Choose your role…", bm: "Pilih peranan anda…", zh: "选择您的职务…", iban: "Pilih pengawa nuan…" },
  ciYourRef: { en: "Your reference", bm: "Rujukan Anda", zh: "您的参考编号", iban: "Rujukan Nuan" },

  // ── Login ──
  lgIntro: {
    en: "Enter your phone number and email to continue.",
    bm: "Masukkan nombor telefon dan emel anda untuk meneruskan.",
    zh: "输入您的手机号码与电子邮箱以继续。",
    iban: "Tama no. telefon enggau e-mel nuan kena neruska.",
  },
  lgWrong: {
    en: "That phone number or email is not correct.",
    bm: "Nombor telefon atau emel tidak betul.",
    zh: "手机号码或电子邮箱不正确。",
    iban: "No. telefon tauka e-mel nadai betul.",
  },
  lgSubmitting: { en: "Signing in…", bm: "Log masuk…", zh: "登录中…", iban: "Benung login…" },
  lgSubmit: { en: "Sign In", bm: "Log Masuk", zh: "登录", iban: "Login" },
  commonError: {
    en: "Sorry, something went wrong. Please try again.",
    bm: "Maaf, berlaku ralat. Sila cuba lagi.",
    zh: "抱歉，出了点问题。请再试一次。",
    iban: "Ampun, bisi penyalah. Uji baru.",
  },

  // ── Resources (Modul & Sumber) ──
  sbEyebrow: { en: "Modules & Resources", bm: "Modul & Sumber", zh: "模块与资源", iban: "Modul & Bahan" },
  sbTitle: { en: "Modules, Templates & References", bm: "Modul, Template & Rujukan", zh: "模块、模板与参考资料", iban: "Modul, Template & Rujukan" },
  sbIntro: {
    en: "Get the learning materials, templates, toolkits and key resources for ProgramOS Lite — all in one place through a Google Folder.",
    bm: "Akses bahan pembelajaran, template, toolkit dan sumber penting ProgramOS Lite — semua di satu tempat melalui Google Folder.",
    zh: "取用 ProgramOS Lite 的学习材料、模板、工具包与重要资源——全都集中在一个 Google 文件夹中。",
    iban: "Ambi bahan belajar, template, toolkit enggau bahan beguna ProgramOS Lite — semua ba siti endur ngena Google Folder.",
  },
  sbOpenAll: { en: "Open everything in Google Folder", bm: "Buka Semua di Google Folder", zh: "在 Google 文件夹中打开全部", iban: "Buka Semua ba Google Folder" },
  sbOpenFolder: { en: "Open in Google Folder", bm: "Buka di Google Folder", zh: "在 Google 文件夹中打开", iban: "Buka ba Google Folder" },
  sbComingSoon: { en: "Coming soon", bm: "Akan Dikemaskini", zh: "即将更新", iban: "Deka Dikemas Kini" },
  sbNote: {
    en: "Resources are shared through the official ProgramOS Lite Google Folder. Links marked “Coming soon” switch on as soon as the folder URL is ready.",
    bm: "Sumber disediakan melalui Google Folder rasmi ProgramOS Lite. Pautan bertanda “Akan Dikemaskini” akan diaktifkan sebaik URL folder disediakan.",
    zh: "资源通过 ProgramOS Lite 的官方 Google 文件夹分享。标记为「即将更新」的链接会在文件夹网址就绪后启用。",
    iban: "Bahan dikunsi ngena Google Folder resmi ProgramOS Lite. Pautan ti betanda “Deka Dikemas Kini” deka diidupka lebuh URL folder udah sedia.",
  },
  sbGalleryTitle: { en: "Programme photo gallery", bm: "Galeri Foto Program", zh: "课程照片库", iban: "Galeri Gambar Program" },
  sbGalleryDesc: {
    en: "See the moments that mattered during the programme.",
    bm: "Lihat momen bermakna sepanjang program.",
    zh: "回顾课程期间的精彩时刻。",
    iban: "Peda maya ti berguna sepemanjai program.",
  },
  sbViewGallery: { en: "View the gallery", bm: "Lihat Galeri", zh: "查看照片库", iban: "Peda Galeri" },

  // ── Gallery ──
  glEyebrow: { en: "Photo Gallery", bm: "Galeri Foto", zh: "照片库", iban: "Galeri Gambar" },
  glTitle: { en: "Programme Moments & Activities", bm: "Momen Program & Aktiviti", zh: "课程时刻与活动", iban: "Maya Program & Pengawa" },
  glIntro: {
    en: "The moments that mattered throughout ProgramOS Lite.",
    bm: "Detik-detik bermakna sepanjang ProgramOS Lite.",
    zh: "ProgramOS Lite 期间值得纪念的时刻。",
    iban: "Maya ti berguna sepemanjai ProgramOS Lite.",
  },
  glFullTitle: { en: "See the full gallery", bm: "Lihat galeri penuh", zh: "查看完整照片库", iban: "Peda galeri penuh" },
  glFullDesc: {
    en: "All programme photos are shared through the official album.",
    bm: "Semua foto program dikongsi melalui album rasmi.",
    zh: "所有课程照片都通过官方相册分享。",
    iban: "Semua gambar program dikunsi ngena album resmi.",
  },
  glOpen: { en: "Open the photo gallery", bm: "Buka Galeri Foto", zh: "打开照片库", iban: "Buka Galeri Gambar" },
  glSoonDesc: {
    en: "The photo gallery appears here as soon as the programme album is ready.",
    bm: "Galeri foto akan dipaparkan di sini sebaik sahaja album program disediakan.",
    zh: "课程相册准备好后，照片库就会显示在这里。",
    iban: "Galeri gambar deka pegari ditu lebuh album program udah sedia.",
  },

  // ── 90-day journey ──
  j9Eyebrow: { en: "90-Day Prompt Exploration Journey", bm: "90-Day Prompt Exploration Journey", zh: "90 天提示探索旅程", iban: "Pejalai Nguji Prompt 90 Hari" },
  j9Title: { en: "The 90-Day Journey", bm: "Perjalanan 90 Hari", zh: "90 天旅程", iban: "Pejalai 90 Hari" },
  j9Intro: {
    en: "Step by step, at your own pace. Start small, learn together, and find where AI can help your co-op.",
    bm: "Langkah demi langkah, mengikut rentak anda. Mulakan kecil, belajar bersama, dan temui peluang AI untuk koperasi anda.",
    zh: "一步一步，按自己的节奏。从小处着手，一起学习，找到 AI 能帮上忙的地方。",
    iban: "Selangkah-selangkah, nitihka rentak nuan empu. Berengkah ari utai mit, belajar sama, lalu ngiga peluang AI ke koperasi nuan.",
  },
  j9Note: {
    en: "A light guide, not a compulsory KPI.",
    bm: "Panduan ringkas, bukan KPI wajib.",
    zh: "这是轻松的指引，不是硬性 KPI。",
    iban: "Panduan ti pandak, ukai KPI ti mesti.",
  },
  j9ReflectTitle: { en: "Your reflection space", bm: "Ruang Refleksi Anda", zh: "您的反思空间", iban: "Ruang Refleksi Nuan" },
  j9ReflectSub: {
    en: "Take a little time to think it over.",
    bm: "Luangkan sedikit masa untuk fikirkan.",
    zh: "花点时间想一想。",
    iban: "Beri sekeda maya kena berunding.",
  },
  j9Placeholder: { en: "Write your reflection here…", bm: "Tulis refleksi anda di sini…", zh: "在这里写下您的反思…", iban: "Tulis refleksi nuan ditu…" },
  j9Saved: { en: "Reflection saved", bm: "Refleksi Disimpan", zh: "反思已保存", iban: "Refleksi Udah Disimpan" },
  j9Save: { en: "Save my reflection", bm: "Simpan Refleksi", zh: "保存我的反思", iban: "Simpan Refleksi" },
  j9RegisterCta: { en: "Register to save your reflection", bm: "Daftar untuk simpan refleksi", zh: "注册以保存反思", iban: "Daftar kena nyimpan refleksi" },
  j9Optional: {
    en: "Reflection is optional — no pressure.",
    bm: "Refleksi adalah pilihan — tiada tekanan.",
    zh: "反思是自愿的——没有压力。",
    iban: "Refleksi nya pilih — nadai tekan.",
  },
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
  // Bahasa Melayu is the default: this programme runs in BM for ANGKASA
  // Sarawak co-operatives, and it is the language every string is written
  // in first. Visitors switch from the header and the choice is remembered.
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (["en", "bm", "zh", "iban"] as Lang[]).includes(saved as Lang)
      ? (saved as Lang)
      : "bm";
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
