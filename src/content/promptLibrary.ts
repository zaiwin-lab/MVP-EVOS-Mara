// ─────────────────────────────────────────────────────────────
// 60-PROMPT LIBRARY  ·  6 Bidang Utama Koperasi × 10 Prompt Missions
// One maintainable content file (spec §9). NO paid AI API is used —
// the app simply COMBINES the participant's inputs with a professional
// prompt template, which they copy into ChatGPT / Claude / Gemini.
//
// LANGUAGES: the BM + English wording lives here, inline, next to each
// mission. 中文 and Bahasa Iban for the parts people BROWSE (area names,
// mission titles, one-line descriptions) live in promptLibrary.i18n.ts
// and are merged in by assemble() below. The prompt TEMPLATE itself
// (role / task / deliverables / disclaimer) stays Bahasa Melayu — that
// is the text participants paste into ChatGPT, Claude or Gemini.
// ─────────────────────────────────────────────────────────────

import { pick, type Localized } from "../context/I18nContext";
import { AREA_I18N, MISSION_I18N } from "./promptLibrary.i18n";

export interface PromptField {
  id: string;
  label: Localized;
  placeholder: Localized;
  type: "text" | "textarea" | "select";
  options?: string[];
}

export interface PromptMission {
  id: string; // e.g. "A1"
  n: number;
  title: Localized;
  desc: Localized; // one-liner
  role: string; // persona, BM (set per area)
  fields: PromptField[];
  task: string; // BM
  deliverables: string[]; // BM
  disclaimer?: string; // BM
}

export interface WorkArea {
  id: string;
  code: string; // "A".."F"
  title: Localized;
  blurb: Localized;
  icon: string;
  accent: string; // pastel accent key (mapped to classes in the UI)
  missions: PromptMission[];
}

// ── Reusable fields ──────────────────────────────────────────
const cp: PromptField = {
  id: "coop", type: "text",
  label: { bm: "Nama koperasi", en: "Co-op name", zh: "合作社名称", iban: "Nama koperasi" },
  placeholder: { bm: "cth. Koperasi Serba Guna Kuching Berhad", en: "e.g. Koperasi Serba Guna Kuching Berhad", zh: "例如：Koperasi Serba Guna Kuching Berhad" },
};
const cx: PromptField = {
  id: "context", type: "textarea",
  label: { bm: "Maklumat / konteks tambahan", en: "Context", zh: "补充资料／背景", iban: "Maklumat tambah" },
  placeholder: { bm: "Terangkan situasi, cabaran atau latar belakang ringkas", en: "Describe the situation, challenge or brief background", zh: "简述情况、挑战或背景", iban: "Terangka pekara, penanggul tauka latar belakang pandak" },
};
const ob: PromptField = {
  id: "objective", type: "text",
  label: { bm: "Objektif utama", en: "Objective", zh: "主要目标", iban: "Tuju utama" },
  placeholder: { bm: "Apa yang anda mahu capai?", en: "What do you want to achieve?", zh: "您想达成什么？", iban: "Nama utai ti deka dikemisi nuan?" },
};
const au: PromptField = {
  id: "audience", type: "text",
  label: { bm: "Sasaran / pihak terlibat", en: "Audience", zh: "目标对象", iban: "Orang ti dituju" },
  placeholder: { bm: "cth. anggota, pelanggan, kakitangan, Lembaga", en: "e.g. members, customers, staff, the Board", zh: "例如：会员、顾客、员工、董事会", iban: "cth. anggota, pelanggan, pengawa, Lembaga" },
};
const tp: PromptField = {
  id: "topic", type: "text",
  label: { bm: "Tajuk / fokus", en: "Topic", zh: "主题／重点", iban: "Tajuk / fokus" },
  placeholder: { bm: "cth. produk, aktiviti, isu", en: "e.g. a product, an activity, an issue", zh: "例如：产品、活动、问题", iban: "cth. produk, pengawa, pekara" },
};
const pr: PromptField = {
  id: "product", type: "text",
  label: { bm: "Produk / perkhidmatan", en: "Product / service", zh: "产品／服务", iban: "Produk / servis" },
  placeholder: { bm: "cth. barangan runcit, khidmat simpanan", en: "e.g. grocery goods, savings services", zh: "例如：杂货商品、储蓄服务", iban: "cth. utai kedai, servis simpan duit" },
};
const raw: PromptField = {
  id: "raw", type: "textarea",
  label: { bm: "Kandungan / data mentah", en: "Raw content", zh: "原始内容／数据", iban: "Kandung / data mentah" },
  placeholder: { bm: "Tampal nota, senarai atau angka di sini", en: "Paste notes, lists or figures here", zh: "在此贴上笔记、清单或数字", iban: "Tampal nota, senarai tauka angka ditu" },
};

const FIN_DISCLAIMER =
  "AI membantu analisis dan draf sahaja. Semua maklumat kewangan mesti disemak dan disahkan oleh pegawai kewangan / akauntan yang bertanggungjawab.";
const GOV_DISCLAIMER =
  "AI menyokong penyediaan sahaja dan tidak menggantikan pertimbangan Lembaga, nasihat guaman atau pengesahan pihak berkuasa.";

/** How a mission is written below: plain BM + English strings. */
type Raw = Omit<PromptMission, "role" | "id" | "n" | "title" | "desc"> & {
  title: string; // BM
  titleEn: string;
  desc: string; // BM one-liner
  fields: PromptField[];
};

/** Build a work area, folding in the zh/iban layer from promptLibrary.i18n.ts. */
function assemble(
  id: string,
  code: string,
  title: string,
  titleEn: string,
  blurb: string,
  icon: string,
  accent: string,
  role: string,
  missions: Raw[]
): WorkArea {
  const areaX = AREA_I18N[id];
  return {
    id, code, icon, accent,
    title: { bm: title, en: titleEn, ...areaX?.title },
    blurb: { bm: blurb, en: blurb, ...areaX?.blurb },
    missions: missions.map((mm, i) => {
      const missionId = `${code}${i + 1}`;
      const mX = MISSION_I18N[missionId];
      const { titleEn: mTitleEn, title: mTitle, desc: mDesc, ...rest } = mm;
      return {
        ...rest,
        role,
        id: missionId,
        n: i + 1,
        title: { bm: mTitle, en: mTitleEn, ...mX?.title },
        desc: { bm: mDesc, en: mDesc, ...mX?.desc },
      };
    }),
  };
}

// ── A. Membership & Member Services ──────────────────────────
const AREA_A = assemble(
  "membership", "A",
  "Keahlian & Perkhidmatan Ahli", "Membership & Member Services",
  "Memberdaya & memberi perkhidmatan terbaik kepada anggota koperasi.",
  "users", "violet",
  "Anda pakar pembangunan keahlian dan khidmat anggota koperasi di Malaysia.",
  [
    { title: "Perbaik Onboarding Anggota Baharu", titleEn: "Improve New Member Onboarding", desc: "Rangka aliran sambutan anggota baharu yang mesra dan jelas.", fields: [cp, cx, ob],
      task: "Bantu koperasi mereka bentuk proses onboarding anggota baharu yang mudah, mesra dan mengalu-alukan.",
      deliverables: ["Langkah onboarding dari pendaftaran hingga penglibatan pertama", "Mesej alu-aluan dan senarai maklumat yang perlu dikongsi", "Cadangan cara membuat anggota baharu rasa dihargai"] },
    { title: "Jawab Soalan Lazim Anggota", titleEn: "Answer Common Member Questions", desc: "Sediakan jawapan tepat untuk soalan biasa anggota.", fields: [cp, tp, cx],
      task: "Hasilkan jawapan yang jelas dan mesra untuk soalan lazim daripada anggota koperasi.",
      deliverables: ["Senarai 8–10 soalan lazim dengan jawapan ringkas", "Nada mesra dan mudah difahami", "Cadangan soalan tambahan yang mungkin ditanya"] },
    { title: "Cipta Kemas Kini WhatsApp Anggota", titleEn: "Create Member WhatsApp Updates", desc: "Draf mesej WhatsApp ringkas untuk anggota.", fields: [cp, tp, ob],
      task: "Tulis mesej kemas kini WhatsApp yang ringkas, jelas dan menarik untuk anggota koperasi.",
      deliverables: ["3 versi mesej (rasmi, mesra, ringkas)", "Ayat pembuka yang menarik perhatian", "Seruan tindakan yang jelas"] },
    { title: "Tingkatkan Penyertaan Anggota", titleEn: "Increase Member Participation", desc: "Idea meningkatkan penglibatan anggota dalam aktiviti.", fields: [cp, cx, ob],
      task: "Cadangkan cara praktikal untuk meningkatkan penyertaan anggota dalam aktiviti dan program koperasi.",
      deliverables: ["10 idea penglibatan yang boleh dilaksanakan", "Cadangan insentif atau pengiktirafan", "Langkah pertama yang mudah dimulakan"] },
    { title: "Aktifkan Semula Anggota Tidak Aktif", titleEn: "Reactivate Inactive Members", desc: "Strategi menghubungi semula anggota yang kurang aktif.", fields: [cp, cx, ob],
      task: "Bina strategi mesra untuk menghubungi dan mengaktifkan semula anggota yang tidak aktif.",
      deliverables: ["Mesej khusus untuk anggota tidak aktif", "Sebab yang mungkin dan cara menanganinya", "Pelan tindakan hubungan semula 30 hari"] },
    { title: "Reka Kaji Selidik Kepuasan Anggota", titleEn: "Design Member Satisfaction Survey", desc: "Bina borang kaji selidik yang ringkas dan berkesan.", fields: [cp, tp, ob],
      task: "Reka kaji selidik kepuasan anggota yang ringkas untuk mendapatkan maklum balas berguna.",
      deliverables: ["8–12 soalan (skala + terbuka)", "Ayat pengenalan kaji selidik", "Cadangan cara menyebarkan dan menggalakkan jawapan"] },
    { title: "Ringkaskan Maklum Balas Anggota", titleEn: "Summarise Member Feedback", desc: "Ringkaskan maklum balas menjadi tema dan tindakan.", fields: [cp, raw],
      task: "Analisis dan ringkaskan maklum balas anggota kepada tema utama dan tindakan yang boleh diambil.",
      deliverables: ["Tema utama daripada maklum balas", "Isu yang paling kerap disebut", "3 tindakan penambahbaikan yang dicadangkan"] },
    { title: "Rancang Kempen Manfaat Anggota", titleEn: "Plan Member Benefits Campaign", desc: "Rangka kempen mempromosi manfaat keanggotaan.", fields: [cp, tp, au, ob],
      task: "Rancang kempen ringkas untuk mempromosikan manfaat menjadi anggota koperasi.",
      deliverables: ["Konsep dan tema kempen", "Senarai manfaat utama untuk diserlahkan", "Pelan pelaksanaan mudah dan saluran promosi"] },
    { title: "Cipta Pelan Penglibatan Anggota Bulanan", titleEn: "Create Monthly Member Engagement Plan", desc: "Kalendar aktiviti anggota untuk sebulan.", fields: [cp, cx, ob],
      task: "Bina pelan penglibatan anggota untuk sebulan yang ringkas dan realistik.",
      deliverables: ["Kalendar aktiviti mingguan", "Jenis kandungan/komunikasi setiap minggu", "Cara mengukur penglibatan"] },
    { title: "Perbaik Pengalaman Anggota Keseluruhan", titleEn: "Improve Overall Member Experience", desc: "Cadangan menambah baik keseluruhan pengalaman anggota.", fields: [cp, cx, ob],
      task: "Kaji dan cadangkan penambahbaikan untuk keseluruhan pengalaman anggota koperasi.",
      deliverables: ["Titik sentuh utama pengalaman anggota", "Penambahbaikan cepat (quick wins)", "Cadangan jangka sederhana"] },
  ]
);

// ── B. Operations & Administration ───────────────────────────
const AREA_B = assemble(
  "operations", "B",
  "Operasi & Pentadbiran", "Operations & Administration",
  "Operasi lebih lancar & pentadbiran yang lebih berkesan.",
  "clipboard", "blue",
  "Anda pakar operasi dan pentadbiran koperasi di Malaysia.",
  [
    { title: "Permudah Proses Kerja Semasa", titleEn: "Simplify a Current Work Process", desc: "Ringkaskan sesuatu proses kerja supaya lebih cekap.", fields: [cp, raw, ob],
      task: "Analisis proses kerja semasa dan cadangkan cara memudahkan serta menjadikannya lebih cekap.",
      deliverables: ["Langkah proses semasa (ringkas)", "Langkah yang boleh digabung/dibuang", "Proses baharu yang dipermudah"] },
    { title: "Cipta SOP", titleEn: "Create an SOP", desc: "Bina prosedur operasi standard yang jelas.", fields: [cp, tp, cx],
      task: "Hasilkan SOP (Prosedur Operasi Standard) yang jelas dan mudah diikuti untuk tugas berkenaan.",
      deliverables: ["Tujuan dan skop SOP", "Langkah demi langkah yang bernombor", "Peranan bertanggungjawab dan nota penting"] },
    { title: "Tukar Nota Mesyuarat kepada Senarai Tindakan", titleEn: "Turn Meeting Notes into Action Items", desc: "Ubah nota mesyuarat menjadi tindakan jelas.", fields: [cp, raw],
      task: "Tukar nota mesyuarat menjadi senarai tindakan yang jelas dengan pemilik dan tarikh.",
      deliverables: ["Senarai tindakan (tindakan · pemilik · tarikh)", "Keputusan utama yang dicapai", "Perkara untuk susulan mesyuarat akan datang"] },
    { title: "Draf Surat Rasmi / Memo", titleEn: "Draft Official Letter / Memo", desc: "Tulis surat atau memo rasmi koperasi.", fields: [cp, tp, au, cx],
      task: "Draf surat rasmi atau memo koperasi yang profesional dan tepat.",
      deliverables: ["Draf surat/memo lengkap", "Nada rasmi dan sesuai", "Cadangan tajuk/subjek"] },
    { title: "Bina Senarai Semak Kakitangan Mingguan", titleEn: "Build Weekly Staff Checklist", desc: "Senarai semak tugas mingguan kakitangan.", fields: [cp, cx, ob],
      task: "Bina senarai semak tugas mingguan yang jelas untuk kakitangan koperasi.",
      deliverables: ["Senarai semak mengikut hari/kekerapan", "Tugas keutamaan ditanda", "Ruang catatan/status"] },
    { title: "Kenal Pasti Tugas Berulang", titleEn: "Identify Repetitive Tasks", desc: "Cari tugas berulang yang boleh dipermudah/automasi.", fields: [cp, raw],
      task: "Kenal pasti tugas berulang dalam operasi koperasi dan cadangkan cara memudahkan atau mengautomasikannya.",
      deliverables: ["Senarai tugas berulang", "Tugas yang boleh diautomasi/dipermudah", "Alat atau kaedah yang dicadangkan"] },
    { title: "Perbaik Aliran Kerja Dokumen / Failing", titleEn: "Improve Filing / Document Workflow", desc: "Susun sistem fail dan dokumen dengan lebih baik.", fields: [cp, cx, ob],
      task: "Cadangkan sistem penyusunan dokumen dan failing yang lebih kemas dan mudah dicapai.",
      deliverables: ["Struktur folder/kategori yang dicadangkan", "Konvensyen penamaan fail", "Amalan penyelenggaraan berterusan"] },
    { title: "Cipta FAQ Dalaman", titleEn: "Create Internal FAQ", desc: "Panduan soal-jawab dalaman untuk kakitangan.", fields: [cp, tp, cx],
      task: "Hasilkan FAQ dalaman untuk membantu kakitangan menjawab soalan biasa dengan konsisten.",
      deliverables: ["10 soalan dalaman dengan jawapan", "Disusun mengikut kategori", "Nota rujukan/di mana dapatkan bantuan"] },
    { title: "Sediakan Kemas Kini Pengurusan", titleEn: "Prepare Management Update", desc: "Ringkasan status untuk pihak pengurusan.", fields: [cp, raw, ob],
      task: "Sediakan kemas kini ringkas untuk pihak pengurusan berdasarkan maklumat yang diberikan.",
      deliverables: ["Ringkasan status utama", "Pencapaian dan isu", "Langkah seterusnya yang dicadangkan"] },
    { title: "Reka Aliran Kerja Lebih Cekap", titleEn: "Design a More Efficient Workflow", desc: "Reka semula aliran kerja supaya lebih lancar.", fields: [cp, raw, ob],
      task: "Reka aliran kerja yang lebih cekap untuk proses yang dinyatakan.",
      deliverables: ["Aliran kerja baharu (langkah demi langkah)", "Titik yang menjimatkan masa", "Cara memantau keberkesanan"] },
  ]
);

// ── C. Marketing & Communications ────────────────────────────
const AREA_C = assemble(
  "marketing", "C",
  "Pemasaran & Komunikasi", "Marketing & Communications",
  "Pemasaran lebih hebat & komunikasi yang lebih berkesan.",
  "spark", "rose",
  "Anda pakar pemasaran digital dan komunikasi yang berpengalaman dalam sektor koperasi di Malaysia.",
  [
    { title: "Cipta Kandungan Media Sosial", titleEn: "Create Social Media Content", desc: "Caption menarik untuk Facebook, Instagram atau TikTok.", fields: [cp, pr, au, ob],
      task: "Hasilkan kandungan media sosial yang menarik untuk mempromosikan produk/perkhidmatan koperasi.",
      deliverables: ["3 caption menarik (dengan variasi nada)", "Cadangan visual/imej yang sesuai", "Hashtag relevan dan seruan tindakan (CTA)"] },
    { title: "Cipta Promosi WhatsApp", titleEn: "Create WhatsApp Promotion", desc: "Mesej promosi WhatsApp yang meyakinkan.", fields: [cp, pr, ob],
      task: "Cipta mesej promosi WhatsApp yang ringkas dan meyakinkan untuk pelanggan koperasi.",
      deliverables: ["Mesej promosi yang padat", "Tawaran/insentif yang jelas", "CTA yang mendorong tindakan segera"] },
    { title: "Hasilkan Teks Poster Promosi", titleEn: "Generate Poster Copy", desc: "Teks iklan menarik untuk poster atau banner.", fields: [cp, pr, tp, ob],
      task: "Hasilkan teks poster/banner promosi yang menarik dan mudah dibaca.",
      deliverables: ["Tajuk utama (headline) yang menarik", "Teks sokongan ringkas", "CTA dan maklumat penting"] },
    { title: "Bina Kalendar Kandungan 30 Hari", titleEn: "Build 30-Day Content Calendar", desc: "Jadual kandungan media sosial sebulan.", fields: [cp, pr, au, ob],
      task: "Bina kalendar kandungan media sosial 30 hari untuk koperasi.",
      deliverables: ["Idea kandungan mengikut minggu/hari", "Campuran jenis kandungan (info, promosi, kisah)", "Cadangan tema mingguan"] },
    { title: "Cipta Idea Video Pendek / Reels", titleEn: "Create Short Video / Reels Ideas", desc: "Konsep dan skrip video pendek yang menarik.", fields: [cp, pr, ob],
      task: "Cadangkan idea dan skrip ringkas video pendek (Reels/TikTok) untuk koperasi.",
      deliverables: ["5 idea konsep video pendek", "Skrip ringkas untuk satu idea terbaik", "Cadangan hook 3 saat pertama"] },
    { title: "Perbaik Penerangan Produk / Perkhidmatan", titleEn: "Improve Product / Service Description", desc: "Penerangan produk yang lebih menarik dan jelas.", fields: [cp, pr, au],
      task: "Perbaik penerangan produk/perkhidmatan koperasi supaya lebih menarik dan meyakinkan.",
      deliverables: ["Penerangan baharu yang menarik", "Manfaat utama (bukan sekadar ciri)", "Versi ringkas untuk media sosial"] },
    { title: "Bina Kempen Promosi", titleEn: "Build Promotional Campaign", desc: "Rangka kempen pemasaran yang bersepadu.", fields: [cp, pr, au, ob],
      task: "Rangka kempen promosi ringkas dan bersepadu untuk koperasi.",
      deliverables: ["Konsep dan tema kempen", "Saluran dan jenis kandungan", "Pelan pelaksanaan dan cara ukur kejayaan"] },
    { title: "Cipta Persona Pelanggan", titleEn: "Create Customer Persona", desc: "Profil pelanggan sasaran koperasi.", fields: [cp, pr, cx],
      task: "Hasilkan persona pelanggan sasaran untuk membantu koperasi memasarkan dengan lebih tepat.",
      deliverables: ["1–2 persona pelanggan (latar, keperluan, cabaran)", "Cara terbaik menjangkau mereka", "Mesej yang paling sesuai"] },
    { title: "Perbaik CTA / Tawaran", titleEn: "Improve CTA / Offer", desc: "Seruan tindakan dan tawaran yang lebih meyakinkan.", fields: [cp, pr, ob],
      task: "Cipta seruan tindakan (CTA) dan tawaran yang lebih meyakinkan untuk koperasi.",
      deliverables: ["5 variasi CTA yang kuat", "Cadangan penambahbaikan tawaran", "Sebab tawaran menarik untuk pelanggan"] },
    { title: "Semak Strategi Pemasaran Sedia Ada", titleEn: "Review Existing Marketing Strategy", desc: "Analisis dan cadangan penambahbaikan pemasaran.", fields: [cp, raw, ob],
      task: "Semak strategi pemasaran sedia ada dan cadangkan penambahbaikan berdasarkan maklumat diberikan.",
      deliverables: ["Kekuatan dan kelemahan strategi semasa", "Peluang penambahbaikan", "3 langkah keutamaan seterusnya"] },
  ]
);

// ── D. Business Development & Revenue ─────────────────────────
const AREA_D = assemble(
  "business", "D",
  "Pembangunan Perniagaan & Hasil", "Business Development & Revenue",
  "Memacu pertumbuhan perniagaan & menjana hasil koperasi.",
  "target", "emerald",
  "Anda perunding pembangunan perniagaan dan strategi hasil untuk koperasi di Malaysia.",
  [
    { title: "Cari Peluang Hasil Baharu", titleEn: "Find New Revenue Opportunities", desc: "Idea sumber pendapatan baharu untuk koperasi.", fields: [cp, cx, ob],
      task: "Cadangkan peluang hasil baharu yang realistik berdasarkan keupayaan koperasi.",
      deliverables: ["5–7 idea sumber hasil baharu", "Kesesuaian dengan koperasi", "Langkah pertama untuk mencuba satu idea"] },
    { title: "Kenal Pasti Segmen Pelanggan Baharu", titleEn: "Identify New Customer Segments", desc: "Segmen pelanggan baharu yang berpotensi.", fields: [cp, pr, cx],
      task: "Kenal pasti segmen pelanggan baharu yang berpotensi untuk koperasi.",
      deliverables: ["Senarai segmen pelanggan berpotensi", "Keperluan setiap segmen", "Cara menjangkau segmen tersebut"] },
    { title: "Cipta Pakej Produk / Perkhidmatan Baharu", titleEn: "Create New Product / Service Package", desc: "Reka pakej tawaran baharu yang menarik.", fields: [cp, pr, au, ob],
      task: "Reka pakej produk/perkhidmatan baharu yang menarik untuk pelanggan koperasi.",
      deliverables: ["Konsep pakej dan kandungannya", "Cadangan struktur harga", "Sebab pakej ini menarik"] },
    { title: "Perbaik Tawaran Sedia Ada", titleEn: "Improve Existing Offer", desc: "Tingkatkan nilai tawaran semasa.", fields: [cp, pr, cx],
      task: "Cadangkan cara menambah nilai dan memperbaik tawaran sedia ada koperasi.",
      deliverables: ["Penambahbaikan nilai tawaran", "Cara menonjolkan nilai kepada pelanggan", "Idea bundling atau tambahan"] },
    { title: "Hasilkan Idea Perkongsian Strategik", titleEn: "Generate Partnership Ideas", desc: "Idea kerjasama dengan pihak lain.", fields: [cp, cx, ob],
      task: "Cadangkan idea perkongsian strategik yang boleh memberi manfaat kepada koperasi.",
      deliverables: ["Jenis rakan kongsi berpotensi", "Manfaat bersama (win-win)", "Cara memulakan perbincangan"] },
    { title: "Cari Peluang Upsell / Cross-Sell", titleEn: "Find Upsell / Cross-Sell Opportunities", desc: "Peluang menjual lebih kepada pelanggan sedia ada.", fields: [cp, pr, cx],
      task: "Kenal pasti peluang upsell dan cross-sell daripada produk/perkhidmatan sedia ada.",
      deliverables: ["Peluang upsell/cross-sell", "Gandingan produk yang sesuai", "Ayat cadangan kepada pelanggan"] },
    { title: "Bina Pelan Jualan 30 Hari", titleEn: "Build 30-Day Sales Plan", desc: "Pelan jualan ringkas untuk sebulan.", fields: [cp, pr, ob],
      task: "Bina pelan jualan 30 hari yang ringkas dan boleh dilaksanakan.",
      deliverables: ["Sasaran dan fokus mingguan", "Aktiviti jualan utama", "Cara memantau pencapaian"] },
    { title: "Sediakan Pitch Perniagaan", titleEn: "Prepare Business Pitch", desc: "Skrip pitch ringkas dan meyakinkan.", fields: [cp, pr, au, ob],
      task: "Sediakan pitch perniagaan ringkas dan meyakinkan untuk koperasi.",
      deliverables: ["Pitch ringkas (30–60 saat)", "Nilai unik koperasi", "Penutup dan seruan tindakan"] },
    { title: "Analisis Kedudukan Pesaing", titleEn: "Analyse Competitor Position", desc: "Fahami kedudukan berbanding pesaing.", fields: [cp, cx],
      task: "Bantu koperasi memahami kedudukannya berbanding pesaing dan cara membezakan diri.",
      deliverables: ["Perbandingan kekuatan/kelemahan", "Peluang membezakan koperasi", "Cadangan kelebihan bersaing"] },
    { title: "Cipta Pelan Tindakan Pertumbuhan", titleEn: "Create Growth Action Plan", desc: "Pelan pertumbuhan yang jelas dan realistik.", fields: [cp, cx, ob],
      task: "Bina pelan tindakan pertumbuhan yang jelas dan realistik untuk koperasi.",
      deliverables: ["Matlamat pertumbuhan utama", "Langkah tindakan mengikut keutamaan", "Petunjuk kejayaan yang mudah diukur"] },
  ]
);

// ── E. Finance & Management Reporting ────────────────────────
const AREA_E = assemble(
  "finance", "E",
  "Kewangan & Pelaporan", "Finance & Management Reporting",
  "Pengurusan kewangan & pelaporan yang lebih telus.",
  "chart", "amber",
  "Anda penganalisis kewangan yang membantu koperasi menyediakan maklumat pengurusan (bukan pengganti akauntan bertauliah).",
  [
    { title: "Ringkaskan Maklumat Kewangan Bulanan", titleEn: "Summarise Monthly Financial Information", desc: "Ringkasan mudah difahami untuk pihak pengurusan.", fields: [cp, raw],
      task: "Ringkaskan maklumat kewangan bulanan kepada bentuk yang mudah difahami oleh pengurusan koperasi.",
      deliverables: ["Ringkasan angka utama", "Perkara yang menonjol (naik/turun)", "Nota untuk perhatian pengurusan"], disclaimer: FIN_DISCLAIMER },
    { title: "Terangkan Perubahan Hasil / Perbelanjaan", titleEn: "Explain Revenue / Expense Changes", desc: "Jelaskan sebab perubahan angka.", fields: [cp, raw],
      task: "Bantu menerangkan kemungkinan sebab perubahan hasil dan perbelanjaan dalam bahasa mudah.",
      deliverables: ["Ringkasan perubahan utama", "Kemungkinan sebab (untuk disahkan)", "Soalan susulan untuk disemak"], disclaimer: FIN_DISCLAIMER },
    { title: "Sediakan Paparan Aliran Tunai Ringkas", titleEn: "Prepare Simple Cashflow View", desc: "Susun gambaran aliran tunai yang mudah.", fields: [cp, raw],
      task: "Susun gambaran aliran tunai ringkas berdasarkan maklumat yang diberikan.",
      deliverables: ["Struktur aliran tunai masuk vs keluar", "Perkara yang perlu dipantau", "Cadangan cara memaparkan kepada Lembaga"], disclaimer: FIN_DISCLAIMER },
    { title: "Kenal Pasti Peluang Penjimatan Kos", titleEn: "Identify Cost-Saving Opportunities", desc: "Cari kawasan berpotensi untuk jimat kos.", fields: [cp, raw],
      task: "Kenal pasti kawasan yang berpotensi untuk penjimatan kos dalam koperasi.",
      deliverables: ["Kawasan berpotensi untuk penjimatan", "Cadangan tindakan berhati-hati", "Perkara untuk disahkan sebelum bertindak"], disclaimer: FIN_DISCLAIMER },
    { title: "Draf Ulasan Pengurusan Bulanan", titleEn: "Draft Monthly Management Commentary", desc: "Ulasan naratif untuk laporan bulanan.", fields: [cp, raw],
      task: "Draf ulasan pengurusan bulanan (naratif) berdasarkan angka yang diberikan.",
      deliverables: ["Ulasan naratif ringkas", "Sorotan prestasi dan isu", "Nada profesional dan berhati-hati"], disclaimer: FIN_DISCLAIMER },
    { title: "Sediakan Andaian Belanjawan", titleEn: "Prepare Budget Assumptions", desc: "Senaraikan andaian untuk penyediaan belanjawan.", fields: [cp, cx, ob],
      task: "Bantu menyenaraikan andaian yang munasabah untuk penyediaan belanjawan koperasi.",
      deliverables: ["Senarai andaian utama", "Andaian yang perlu disahkan", "Risiko jika andaian tidak tepat"], disclaimer: FIN_DISCLAIMER },
    { title: "Serlahkan Angka yang Perlu Perhatian", titleEn: "Highlight Figures Requiring Attention", desc: "Tunjukkan angka yang luar biasa.", fields: [cp, raw],
      task: "Kenal pasti dan serlahkan angka yang luar biasa atau memerlukan perhatian pengurusan.",
      deliverables: ["Angka yang menonjol", "Sebab ia perlu diberi perhatian", "Soalan untuk disemak lanjut"], disclaimer: FIN_DISCLAIMER },
    { title: "Cipta Soalan Kewangan untuk Lembaga", titleEn: "Create Board Finance Questions", desc: "Soalan bernas untuk semakan kewangan Lembaga.", fields: [cp, raw],
      task: "Hasilkan soalan kewangan yang bernas untuk ditanya semasa mesyuarat Lembaga.",
      deliverables: ["8–10 soalan kewangan yang bernas", "Disusun mengikut topik", "Nota tujuan setiap soalan"], disclaimer: FIN_DISCLAIMER },
    { title: "Bandingkan Sebenar vs Belanjawan", titleEn: "Compare Actual vs Budget", desc: "Bandingkan prestasi sebenar dengan belanjawan.", fields: [cp, raw],
      task: "Bandingkan prestasi sebenar dengan belanjawan dan terangkan jurang secara ringkas.",
      deliverables: ["Ringkasan perbandingan sebenar vs belanjawan", "Jurang utama (varians)", "Kemungkinan sebab untuk disahkan"], disclaimer: FIN_DISCLAIMER },
    { title: "Sediakan Ringkasan Laporan Pengurusan", titleEn: "Prepare Management Report Summary", desc: "Ringkasan eksekutif laporan pengurusan.", fields: [cp, raw],
      task: "Sediakan ringkasan eksekutif laporan pengurusan yang jelas dan padat.",
      deliverables: ["Ringkasan eksekutif", "Perkara utama untuk keputusan", "Cadangan langkah seterusnya"], disclaimer: FIN_DISCLAIMER },
  ]
);

// ── F. Governance, Board & Strategy ──────────────────────────
const AREA_F = assemble(
  "governance", "F",
  "Tadbir Urus, Lembaga & Strategi", "Governance, Board & Strategy",
  "Tadbir urus baik, Lembaga berkesan & strategi masa depan.",
  "building", "indigo",
  "Anda setiausaha / penasihat tadbir urus yang membantu Lembaga koperasi menyediakan bahan (bukan pengganti nasihat guaman).",
  [
    { title: "Sediakan Agenda Mesyuarat Lembaga", titleEn: "Prepare Board Meeting Agenda", desc: "Agenda mesyuarat yang tersusun.", fields: [cp, tp, cx],
      task: "Sediakan agenda mesyuarat Lembaga yang tersusun dan lengkap.",
      deliverables: ["Agenda bernombor dengan anggaran masa", "Perkara untuk keputusan vs makluman", "Nota persediaan sebelum mesyuarat"], disclaimer: GOV_DISCLAIMER },
    { title: "Tukar Perbincangan Mesyuarat kepada Senarai Tindakan", titleEn: "Turn Meeting Discussion into Action List", desc: "Ubah perbincangan menjadi tindakan jelas.", fields: [cp, raw],
      task: "Tukar perbincangan mesyuarat Lembaga menjadi senarai tindakan yang jelas.",
      deliverables: ["Senarai tindakan (tindakan · pemilik · tarikh)", "Keputusan yang dicapai", "Perkara untuk susulan"], disclaimer: GOV_DISCLAIMER },
    { title: "Analisis Cadangan Projek Baharu", titleEn: "Analyse a New Project Proposal", desc: "Nilai cadangan projek secara seimbang.", fields: [cp, raw, ob],
      task: "Analisis cadangan projek baharu secara seimbang untuk membantu Lembaga membuat keputusan.",
      deliverables: ["Ringkasan cadangan", "Kelebihan, risiko dan keperluan sumber", "Soalan penting untuk Lembaga"], disclaimer: GOV_DISCLAIMER },
    { title: "Sediakan Kebaikan / Keburukan Sesuatu Keputusan", titleEn: "Prepare Pros / Cons of a Decision", desc: "Analisis pro dan kontra keputusan.", fields: [cp, tp, cx],
      task: "Sediakan analisis kebaikan dan keburukan bagi keputusan yang sedang dipertimbangkan.",
      deliverables: ["Senarai kebaikan", "Senarai keburukan/risiko", "Perkara untuk dipertimbangkan sebelum putus"], disclaimer: GOV_DISCLAIMER },
    { title: "Kenal Pasti Risiko Utama", titleEn: "Identify Key Risks", desc: "Senaraikan risiko dan langkah mitigasi.", fields: [cp, tp, cx],
      task: "Kenal pasti risiko utama berkaitan perkara ini dan cadangkan langkah mitigasi.",
      deliverables: ["Senarai risiko utama", "Tahap kesan/kemungkinan (ringkas)", "Cadangan langkah mengurangkan risiko"], disclaimer: GOV_DISCLAIMER },
    { title: "Draf Keutamaan Strategik", titleEn: "Draft Strategic Priorities", desc: "Rangka keutamaan strategik koperasi.", fields: [cp, cx, ob],
      task: "Bantu Lembaga merangka keutamaan strategik yang jelas untuk koperasi.",
      deliverables: ["3–5 keutamaan strategik", "Sebab setiap keutamaan penting", "Petunjuk kejayaan ringkas"], disclaimer: GOV_DISCLAIMER },
    { title: "Bina Pelan Tindakan Tahunan", titleEn: "Build Annual Action Plan", desc: "Pelan tindakan setahun yang teratur.", fields: [cp, cx, ob],
      task: "Bina pelan tindakan tahunan yang teratur berdasarkan keutamaan koperasi.",
      deliverables: ["Matlamat tahunan utama", "Aktiviti mengikut suku tahun", "Pihak bertanggungjawab dan semakan"], disclaimer: GOV_DISCLAIMER },
    { title: "Sediakan Soalan untuk Pihak Pengurusan", titleEn: "Prepare Questions for Management", desc: "Soalan pengawasan untuk Lembaga.", fields: [cp, tp, cx],
      task: "Sediakan soalan pengawasan yang bernas untuk Lembaga bertanya kepada pihak pengurusan.",
      deliverables: ["Soalan mengikut topik", "Tujuan setiap soalan", "Perkara untuk diberi perhatian dalam jawapan"], disclaimer: GOV_DISCLAIMER },
    { title: "Semak Kemajuan Berbanding Objektif", titleEn: "Review Progress Against Objectives", desc: "Nilai kemajuan berbanding objektif.", fields: [cp, raw, ob],
      task: "Bantu Lembaga menyemak kemajuan berbanding objektif yang ditetapkan.",
      deliverables: ["Ringkasan status setiap objektif", "Apa yang berjalan baik / tersekat", "Cadangan tindakan pembetulan"], disclaimer: GOV_DISCLAIMER },
    { title: "Sediakan Taklimat Keputusan Strategik", titleEn: "Prepare Strategic Decision Brief", desc: "Taklimat ringkas untuk keputusan penting.", fields: [cp, tp, raw, ob],
      task: "Sediakan taklimat keputusan strategik yang ringkas dan seimbang untuk Lembaga.",
      deliverables: ["Latar dan konteks keputusan", "Pilihan dengan pertimbangan", "Cadangan dan langkah seterusnya"], disclaimer: GOV_DISCLAIMER },
  ]
);

export const WORK_AREAS: WorkArea[] = [AREA_A, AREA_B, AREA_C, AREA_D, AREA_E, AREA_F];

export const PROMPT_COUNT = WORK_AREAS.reduce((n, a) => n + a.missions.length, 0);

export function getWorkArea(id: string): WorkArea | undefined {
  return WORK_AREAS.find((a) => a.id === id);
}

export function getMission(areaId: string, missionId: string): { area: WorkArea; mission: PromptMission } | undefined {
  const area = getWorkArea(areaId);
  const mission = area?.missions.find((m) => m.id === missionId);
  return area && mission ? { area, mission } : undefined;
}

/** Combine the professional template with the participant's inputs. */
export function buildPrompt(
  _area: WorkArea,
  mission: PromptMission,
  values: Record<string, string>
): string {
  const details =
    mission.fields
      .map((f) => {
        const v = (values[f.id] || "").trim();
        return v ? `- ${pick(f.label, "bm")}: ${v}` : null;
      })
      .filter(Boolean)
      .join("\n") || "- (Tiada butiran tambahan diberikan)";

  const deliver = mission.deliverables.map((d, i) => `${i + 1}. ${d}`).join("\n");

  const parts = [
    mission.role,
    "",
    `Tugasan: ${mission.task}`,
    "",
    "Butiran koperasi:",
    details,
    "",
    "Sila hasilkan:",
    deliver,
    "",
    "Gaya: Bahasa Melayu yang jelas, ringkas dan praktikal untuk koperasi. Sertakan langkah atau contoh jika membantu.",
  ];
  if (mission.disclaimer) parts.push("", `Nota penting: ${mission.disclaimer}`);
  return parts.join("\n");
}
