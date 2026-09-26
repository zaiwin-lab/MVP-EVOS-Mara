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
const co: PromptField = {
  id: "company", type: "text",
  label: { bm: "Nama syarikat", en: "Company name" },
  placeholder: { bm: "cth. Seri Wangi Enterprise Sdn Bhd", en: "e.g. Seri Wangi Enterprise Sdn Bhd" },
};
const pr: PromptField = {
  id: "product", type: "text",
  label: { bm: "Produk / perkhidmatan", en: "Product / service" },
  placeholder: { bm: "cth. produk penjagaan kulit, khidmat perunding", en: "e.g. skincare products, consulting services" },
};
const tc: PromptField = {
  id: "customer", type: "text",
  label: { bm: "Pelanggan sasaran", en: "Target customer" },
  placeholder: { bm: "cth. wanita bekerja 30–45 tahun di Lembah Klang", en: "e.g. working women 30–45 in the Klang Valley" },
};
const rev: PromptField = {
  id: "revenue", type: "text",
  label: { bm: "Jualan bulanan (anggaran)", en: "Monthly revenue (approx.)" },
  placeholder: { bm: "cth. RM45,000 sebulan", en: "e.g. RM45,000 a month" },
};
const bp: PromptField = {
  id: "problem", type: "textarea",
  label: { bm: "Masalah / cabaran perniagaan", en: "Business problem" },
  placeholder: { bm: "Terangkan cabaran sebenar yang anda hadapi sekarang", en: "Describe the real challenge you are facing now" },
};
const ob: PromptField = {
  id: "objective", type: "text",
  label: { bm: "Objektif utama", en: "Objective" },
  placeholder: { bm: "Apa yang anda mahu capai?", en: "What do you want to achieve?" },
};
const au: PromptField = {
  id: "audience", type: "text",
  label: { bm: "Sasaran / pihak terlibat", en: "Audience" },
  placeholder: { bm: "cth. pasukan, pelanggan, lembaga pengarah, pelabur", en: "e.g. your team, customers, the board, investors" },
};
const cx: PromptField = {
  id: "context", type: "textarea",
  label: { bm: "Maklumat / konteks tambahan", en: "Context" },
  placeholder: { bm: "Terangkan situasi atau latar belakang ringkas", en: "Describe the situation or brief background" },
};
const raw: PromptField = {
  id: "raw", type: "textarea",
  label: { bm: "Kandungan / data mentah", en: "Raw content" },
  placeholder: { bm: "Tampal nota, senarai atau angka di sini", en: "Paste notes, lists or figures here" },
};

const FIN_DISCLAIMER =
  "AI membantu analisis dan draf sahaja. Semua angka kewangan mesti disemak dan disahkan oleh akauntan atau pegawai kewangan yang bertanggungjawab.";
const HR_DISCLAIMER =
  "AI menyokong penyediaan draf sahaja. Semua keputusan pekerjaan mesti mematuhi Akta Kerja dan disemak oleh pihak yang berkelayakan.";
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
  "leadership", "A",
  "Kepimpinan, Pentadbiran & Pengurusan", "Leadership, Admin & Management",
  "Keputusan lebih yakin, pentadbiran lebih kemas.",
  "crown", "violet",
  "Anda penasihat strategik kepada seorang CEO wanita yang memimpin sebuah PKS di Malaysia.",
  [
    { title: "Keputusan Strategik CEO", titleEn: "CEO Strategic Decision", desc: "Bantu buat keputusan besar dengan lebih yakin.", fields: [co, bp, ob],
      task: "Bertindak sebagai penasihat strategik kepada CEO. Bantu saya membuat keputusan perniagaan ini dengan menimbang pilihan, risiko dan kesan jangka panjang.",
      deliverables: ["3 pilihan tindakan dengan kebaikan dan keburukan", "Risiko utama setiap pilihan dan cara mengurangkannya", "Cadangan keputusan dan sebab ia dipilih"] },
    { title: "Ringkasan Mesyuarat Pengurusan", titleEn: "Management Meeting Summary", desc: "Tukar nota mesyuarat kepada ringkasan dan tindakan.", fields: [co, raw],
      task: "Ringkaskan nota mesyuarat ini kepada rumusan eksekutif yang boleh dibaca dalam satu minit.",
      deliverables: ["Rumusan 5 baris untuk pihak pengurusan", "Senarai tindakan dengan pemilik dan tarikh", "Isu yang belum selesai dan perlu dibawa ke mesyuarat berikutnya"] },
    { title: "Pelan Tindakan Pengurusan", titleEn: "Management Action Plan", desc: "Bina pelan tindakan yang jelas untuk pasukan pengurusan.", fields: [co, ob, cx],
      task: "Bina pelan tindakan pengurusan yang jelas untuk mencapai objektif ini dalam tempoh yang munasabah.",
      deliverables: ["Objektif dipecahkan kepada 4–6 langkah utama", "Pemilik, tempoh dan petunjuk kejayaan bagi setiap langkah", "Halangan yang dijangka dan cara menanganinya"] },
    { title: "Surat Rasmi Syarikat", titleEn: "Official Company Letter", desc: "Draf surat rasmi yang profesional dan tepat.", fields: [co, au, ob],
      task: "Draf surat rasmi syarikat yang profesional, ringkas dan sesuai dengan penerima yang dinyatakan.",
      deliverables: ["Surat penuh dengan pembukaan dan penutup yang sesuai", "Nada profesional dan bahasa yang tepat", "Cadangan tajuk surat dan rujukan fail"] },
    { title: "Bina SOP Syarikat", titleEn: "Create a Company SOP", desc: "Tukar proses kerja kepada SOP bertulis.", fields: [co, cx, ob],
      task: "Tukar proses kerja ini kepada SOP bertulis yang boleh diikuti oleh mana-mana kakitangan baharu.",
      deliverables: ["SOP langkah demi langkah dengan pemilik setiap langkah", "Senarai semak ringkas untuk kegunaan harian", "Titik kawalan kualiti dan perkara yang biasa tersilap"] },
    { title: "Analisis Masalah Perniagaan", titleEn: "Business Problem Analysis", desc: "Cari punca sebenar, bukan gejala.", fields: [co, bp],
      task: "Analisis masalah perniagaan ini sehingga ke punca sebenar, bukan sekadar gejala yang kelihatan.",
      deliverables: ["Punca sebenar dan bukti yang menyokongnya", "Kesan kepada jualan, kos atau pasukan", "3 tindakan pembetulan mengikut keutamaan"] },
    { title: "Laporan Pengurusan Bulanan", titleEn: "Monthly Management Report", desc: "Susun laporan bulanan yang mudah difahami.", fields: [co, raw, ob],
      task: "Susun laporan pengurusan bulanan daripada maklumat ini, ditulis untuk pembaca yang sibuk.",
      deliverables: ["Rumusan eksekutif satu perenggan", "Pencapaian, isu dan nombor utama bulan ini", "Fokus dan tindakan untuk bulan hadapan"] },
    { title: "Rangka Pembentangan Eksekutif", titleEn: "Plan an Executive Presentation", desc: "Rangka pembentangan yang meyakinkan.", fields: [co, au, ob],
      task: "Rangka struktur pembentangan eksekutif yang meyakinkan untuk audiens yang dinyatakan.",
      deliverables: ["Rangka 8–10 slaid dengan mesej utama setiap satu", "Ayat pembuka yang menarik perhatian dalam 30 saat", "Soalan sukar yang mungkin ditanya dan jawapannya"] },
    { title: "Susun Keutamaan Tugas", titleEn: "Prioritise Your Workload", desc: "Tentukan apa yang perlu dibuat dahulu.", fields: [co, raw, ob],
      task: "Susun semula senarai tugas ini mengikut keutamaan sebenar berdasarkan impak dan segera.",
      deliverables: ["Tugas disusun kepada empat kumpulan keutamaan", "3 perkara yang patut dihentikan atau diwakilkan", "Cadangan fokus untuk minggu ini"] },
    { title: "Pelan Pelaksanaan 90 Hari", titleEn: "90-Day Execution Plan", desc: "Tukar matlamat kepada pelan 90 hari.", fields: [co, ob, cx],
      task: "Bina pelan pelaksanaan 90 hari untuk mencapai objektif perniagaan ini.",
      deliverables: ["Sasaran dan tindakan bagi hari 1–30, 31–60 dan 61–90", "Petunjuk prestasi utama (KPI) setiap fasa", "Semakan bulanan dan cara menilai kemajuan"] },
  ]
);

const AREA_B = assemble(
  "people", "B",
  "Sumber Manusia & Pasukan", "Human Resources & People",
  "Bina dan pimpin pasukan yang betul.",
  "users", "blue",
  "Anda pakar sumber manusia yang menasihati pemilik perniagaan PKS di Malaysia.",
  [
    { title: "Tulis Deskripsi Jawatan", titleEn: "Write a Job Description", desc: "Draf deskripsi jawatan yang jelas dan menarik.", fields: [co, { id: "topic", type: "text", label: { bm: "Jawatan yang hendak diisi", en: "Jawatan yang hendak diisi" }, placeholder: { bm: "", en: "" } }, cx],
      task: "Tulis deskripsi jawatan yang jelas, menarik dan realistik untuk jawatan ini.",
      deliverables: ["Tanggungjawab utama dan skop kerja", "Kelayakan wajib berbanding kelayakan tambahan", "Ayat promosi syarikat untuk menarik calon yang betul"] },
    { title: "Soalan Temu Duga", titleEn: "Interview Questions", desc: "Sediakan soalan yang mendedahkan keupayaan sebenar.", fields: [co, { id: "topic", type: "text", label: { bm: "Jawatan", en: "Jawatan" }, placeholder: { bm: "", en: "" } }, ob],
      task: "Sediakan set soalan temu duga yang mendedahkan keupayaan sebenar calon, bukan jawapan hafalan.",
      deliverables: ["8–10 soalan berasaskan situasi sebenar", "Apa yang perlu didengar dalam jawapan yang baik", "Tanda amaran yang perlu diberi perhatian"] },
    { title: "Bandingkan Calon", titleEn: "Compare Candidates", desc: "Banding calon secara adil dan berstruktur.", fields: [co, raw, ob],
      task: "Bandingkan calon-calon ini secara berstruktur berdasarkan maklumat yang diberikan.",
      deliverables: ["Jadual perbandingan mengikut kriteria utama", "Kekuatan dan risiko setiap calon", "Cadangan pilihan dan sebabnya"] },
    { title: "Tetapkan KPI Kakitangan", titleEn: "Set Staff KPIs", desc: "Bina KPI yang boleh diukur dan adil.", fields: [co, { id: "topic", type: "text", label: { bm: "Jawatan", en: "Jawatan" }, placeholder: { bm: "", en: "" } }, ob],
      task: "Bina KPI yang jelas, boleh diukur dan adil untuk jawatan ini.",
      deliverables: ["4–6 KPI dengan sasaran dan cara pengukuran", "Kekerapan semakan yang sesuai", "Cara membincangkan KPI dengan kakitangan"] },
    { title: "Penilaian Prestasi", titleEn: "Performance Review", desc: "Sediakan penilaian prestasi yang membina.", fields: [co, raw, cx],
      task: "Sediakan penilaian prestasi yang membina, jujur dan boleh ditindaklanjuti.",
      deliverables: ["Rumusan pencapaian dengan bukti", "Bidang penambahbaikan yang dinyatakan dengan hormat", "Sasaran dan sokongan untuk tempoh berikutnya"], disclaimer: HR_DISCLAIMER },
    { title: "Pelan Pembangunan Kakitangan", titleEn: "Staff Development Plan", desc: "Rancang pembangunan kakitangan berpotensi.", fields: [co, { id: "topic", type: "text", label: { bm: "Nama / jawatan", en: "Nama / jawatan" }, placeholder: { bm: "", en: "" } }, ob],
      task: "Bina pelan pembangunan untuk kakitangan ini supaya bersedia ke peringkat seterusnya.",
      deliverables: ["Kemahiran yang perlu dibina mengikut keutamaan", "Cara pembelajaran: tugasan, bimbingan atau latihan", "Semakan kemajuan dalam 3 dan 6 bulan"] },
    { title: "Analisis Keperluan Latihan", titleEn: "Training Needs Analysis", desc: "Kenal pasti latihan yang benar-benar diperlukan.", fields: [co, cx, ob],
      task: "Kenal pasti keperluan latihan sebenar pasukan berdasarkan situasi yang diterangkan.",
      deliverables: ["Jurang kemahiran mengikut keutamaan", "Latihan yang disyorkan dan hasil yang dijangka", "Cara mengukur kesan latihan selepas 3 bulan"] },
    { title: "Pengumuman Dalaman", titleEn: "Internal Announcement", desc: "Draf pengumuman dalaman yang jelas.", fields: [co, { id: "topic", type: "text", label: { bm: "Perkara", en: "Perkara" }, placeholder: { bm: "", en: "" } }, au],
      task: "Draf pengumuman dalaman yang jelas, ringkas dan tidak menimbulkan salah faham.",
      deliverables: ["Pengumuman penuh dengan nada yang sesuai", "Soalan yang mungkin timbul dan jawapannya", "Versi ringkas untuk WhatsApp pasukan"] },
    { title: "Tingkatkan Semangat Pasukan", titleEn: "Improve Team Engagement", desc: "Idea praktikal meningkatkan semangat pasukan.", fields: [co, cx, ob],
      task: "Cadangkan cara praktikal dan berpatutan untuk meningkatkan semangat serta penglibatan pasukan.",
      deliverables: ["8 idea yang boleh dilaksanakan tanpa kos besar", "Perkara yang perlu dihentikan kerana melemahkan semangat", "Cara mengukur perubahan dalam 60 hari"] },
    { title: "Uruskan Prestasi Lemah", titleEn: "Manage Underperformance", desc: "Tangani prestasi lemah dengan tegas dan adil.", fields: [co, cx, ob],
      task: "Bantu saya menangani isu prestasi ini dengan tegas, adil dan berperikemanusiaan.",
      deliverables: ["Rangka perbualan pertama, ayat demi ayat", "Pelan penambahbaikan prestasi dengan tempoh jelas", "Langkah seterusnya jika tiada perubahan"], disclaimer: HR_DISCLAIMER },
  ]
);

const AREA_C = assemble(
  "operations", "C",
  "Operasi & Produktiviti", "Operations & Productivity",
  "Kerja lebih lancar, masa lebih terurus.",
  "settings", "teal",
  "Anda perunding operasi dan produktiviti untuk PKS di Malaysia.",
  [
    { title: "Perbaik Aliran Kerja", titleEn: "Improve a Workflow", desc: "Buang langkah yang membazir masa.", fields: [co, cx, ob],
      task: "Kaji aliran kerja ini dan cadangkan versi yang lebih ringkas tanpa menjejaskan kualiti.",
      deliverables: ["Aliran kerja semasa berbanding cadangan baharu", "Langkah yang boleh dibuang atau digabungkan", "Anggaran masa yang dapat dijimatkan"] },
    { title: "SOP Operasi Harian", titleEn: "Daily Operations SOP", desc: "Tulis SOP untuk kerja harian.", fields: [co, cx, ob],
      task: "Tulis SOP operasi harian yang boleh diikuti tanpa pengawasan rapat.",
      deliverables: ["Langkah harian mengikut turutan dan masa", "Senarai semak buka dan tutup operasi", "Perkara yang perlu dilaporkan segera"] },
    { title: "Senarai Semak Harian", titleEn: "Daily Checklist", desc: "Bina senarai semak operasi yang ringkas.", fields: [co, cx],
      task: "Bina senarai semak harian yang ringkas untuk memastikan operasi berjalan lancar.",
      deliverables: ["Senarai semak pagi, tengah hari dan penutup", "Perkara kritikal yang tidak boleh dilangkau", "Cara merekod dan menyemaknya setiap minggu"] },
    { title: "Cari Halangan Proses", titleEn: "Find Process Bottlenecks", desc: "Kesan di mana kerja tersekat.", fields: [co, bp],
      task: "Kenal pasti di mana proses ini tersekat dan mengapa ia berlaku.",
      deliverables: ["Titik sekatan utama dan puncanya", "Kesan sekatan kepada masa dan kos", "Penyelesaian segera dan penyelesaian jangka panjang"] },
    { title: "Peluang Automasi", titleEn: "Automation Opportunities", desc: "Kenal pasti kerja yang boleh diautomasikan.", fields: [co, cx, ob],
      task: "Kenal pasti tugas dalam operasi ini yang boleh diautomasikan atau dipermudah dengan teknologi.",
      deliverables: ["Senarai tugas yang sesuai diautomasikan mengikut keutamaan", "Jenis alat atau pendekatan yang sesuai untuk setiap satu", "Satu automasi yang patut dimulakan dahulu dan sebabnya"] },
    { title: "Bandingkan Pembekal", titleEn: "Compare Vendors", desc: "Banding pembekal secara berstruktur.", fields: [co, raw, ob],
      task: "Bandingkan pembekal ini secara berstruktur dan cadangkan pilihan terbaik.",
      deliverables: ["Jadual perbandingan harga, kualiti dan risiko", "Soalan yang perlu ditanya sebelum membuat keputusan", "Cadangan pilihan dan syarat rundingan"] },
    { title: "Perancangan Stok", titleEn: "Inventory Planning", desc: "Rancang stok tanpa terlebih atau kehabisan.", fields: [co, pr, raw],
      task: "Bantu saya merancang tahap stok yang sesuai berdasarkan maklumat jualan ini.",
      deliverables: ["Cadangan tahap stok minimum dan maksimum", "Produk berisiko lebihan atau kehabisan stok", "Jadual semakan stok yang praktikal"] },
    { title: "Kawalan Kualiti", titleEn: "Quality Control", desc: "Bina kawalan kualiti yang mudah dilaksana.", fields: [co, pr, cx],
      task: "Bina sistem kawalan kualiti yang mudah dilaksanakan untuk produk atau perkhidmatan ini.",
      deliverables: ["Kriteria kualiti yang jelas dan boleh diukur", "Titik pemeriksaan dalam proses", "Tindakan apabila kualiti tidak menepati piawai"] },
    { title: "Laporan Operasi Mingguan", titleEn: "Weekly Operations Report", desc: "Susun laporan operasi mingguan.", fields: [co, raw],
      task: "Susun laporan operasi mingguan daripada maklumat ini untuk dibentangkan kepada pengurusan.",
      deliverables: ["Rumusan prestasi minggu ini dalam 5 baris", "Isu yang berulang dan perlu perhatian", "Tindakan yang dicadangkan untuk minggu hadapan"] },
    { title: "Tingkatkan Produktiviti", titleEn: "Improve Productivity", desc: "Cari cara pasukan bekerja lebih pintar.", fields: [co, cx, ob],
      task: "Cadangkan cara meningkatkan produktiviti pasukan tanpa menambah beban kerja.",
      deliverables: ["Punca produktiviti rendah berdasarkan konteks", "5 penambahbaikan yang boleh dimulakan minggu ini", "Cara mengukur peningkatan dalam 30 hari"] },
  ]
);

const AREA_D = assemble(
  "marketing", "D",
  "Pemasaran & Penjenamaan", "Marketing & Branding",
  "Jenama lebih jelas, pemasaran lebih tajam.",
  "megaphone", "rose",
  "Anda pakar strategi pemasaran dan penjenamaan untuk PKS di Malaysia.",
  [
    { title: "Pelan Pemasaran", titleEn: "Marketing Plan", desc: "Bina pelan pemasaran yang praktikal.", fields: [co, pr, tc, ob],
      task: "Bina pelan pemasaran praktikal untuk produk ini dengan bajet dan pasukan yang terhad.",
      deliverables: ["Mesej utama dan kedudukan produk", "Saluran pemasaran mengikut keutamaan", "Pelan tindakan 90 hari dengan sasaran"] },
    { title: "Bina Persona Pelanggan", titleEn: "Build a Customer Persona", desc: "Fahami pelanggan anda dengan lebih tepat.", fields: [co, pr, tc],
      task: "Bina persona pelanggan yang terperinci untuk produk ini.",
      deliverables: ["Profil pelanggan: latar, keperluan dan kekangan", "Apa yang mendorong mereka membeli dan apa yang menghalang", "Di mana dan bagaimana untuk menjangkau mereka"] },
    { title: "Konsep Kempen", titleEn: "Campaign Concept", desc: "Hasilkan konsep kempen yang menonjol.", fields: [co, pr, tc, ob],
      task: "Cadangkan konsep kempen pemasaran yang menonjol untuk produk dan pelanggan ini.",
      deliverables: ["3 konsep kempen dengan tema dan mesej utama", "Cadangan visual dan nada untuk setiap konsep", "Konsep yang paling sesuai dan sebabnya"] },
    { title: "Kandungan Media Sosial", titleEn: "Social Media Content", desc: "Hasilkan kandungan sebulan dalam satu kali.", fields: [co, pr, tc],
      task: "Hasilkan idea kandungan media sosial untuk sebulan bagi produk ini.",
      deliverables: ["12 idea siaran dengan tajuk dan sudut cerita", "Cadangan format: gambar, video pendek atau teks", "Ayat pembuka untuk 3 siaran terbaik"] },
    { title: "Teks Iklan", titleEn: "Advertising Copy", desc: "Tulis teks iklan yang menarik tindakan.", fields: [co, pr, tc, ob],
      task: "Tulis teks iklan yang ringkas dan menarik tindakan untuk produk ini.",
      deliverables: ["3 versi teks iklan dengan panjang berbeza", "Tajuk utama yang paling kuat untuk setiap versi", "Seruan tindakan yang jelas"] },
    { title: "Kalendar Kandungan", titleEn: "Content Calendar", desc: "Susun kalendar kandungan sebulan.", fields: [co, pr, ob],
      task: "Susun kalendar kandungan sebulan yang realistik untuk pasukan kecil.",
      deliverables: ["Kalendar mingguan dengan tema setiap minggu", "Kekerapan siaran yang munasabah", "Kandungan yang boleh diguna semula"] },
    { title: "Kedudukan Jenama", titleEn: "Brand Positioning", desc: "Jelaskan kedudukan jenama anda.", fields: [co, pr, tc],
      task: "Bantu saya menjelaskan kedudukan jenama ini berbanding pesaing.",
      deliverables: ["Pernyataan kedudukan jenama dalam satu ayat", "Apa yang membezakan jenama ini", "Perkara yang perlu berhenti dikatakan kerana terlalu umum"] },
    { title: "Analisis Pesaing", titleEn: "Competitor Analysis", desc: "Fahami kekuatan dan kelemahan pesaing.", fields: [co, pr, raw],
      task: "Analisis pesaing ini dan kenal pasti ruang yang boleh diambil.",
      deliverables: ["Kekuatan dan kelemahan setiap pesaing", "Ruang pasaran yang belum diisi", "Cara membezakan diri tanpa berperang harga"] },
    { title: "Strategi Promosi", titleEn: "Promotion Strategy", desc: "Rancang promosi tanpa merosakkan margin.", fields: [co, pr, ob],
      task: "Rancang strategi promosi yang menarik tanpa menjejaskan margin keuntungan.",
      deliverables: ["3 mekanik promosi dan kesannya kepada margin", "Tempoh dan syarat yang disyorkan", "Cara mengukur sama ada promosi berbaloi"] },
    { title: "Semak Prestasi Pemasaran", titleEn: "Review Marketing Performance", desc: "Nilai apa yang berkesan dan apa yang tidak.", fields: [co, raw, ob],
      task: "Nilai prestasi pemasaran ini dan cadangkan ke mana bajet patut dialihkan.",
      deliverables: ["Saluran yang berkesan berbanding yang membazir", "Angka utama yang perlu dipantau", "Cadangan pengagihan bajet seterusnya"] },
  ]
);

const AREA_E = assemble(
  "sales", "E",
  "Jualan & Pertumbuhan Pelanggan", "Sales & Customer Growth",
  "Lebih banyak jualan daripada usaha yang sama.",
  "trendingUp", "amber",
  "Anda jurulatih jualan yang membantu pemilik perniagaan PKS di Malaysia.",
  [
    { title: "Skrip Jualan", titleEn: "Sales Script", desc: "Bina skrip jualan yang tidak berbunyi memaksa.", fields: [co, pr, tc],
      task: "Bina skrip jualan yang yakin dan mesra untuk produk ini.",
      deliverables: ["Skrip pembukaan, penerangan dan penutupan", "Soalan untuk memahami keperluan pelanggan", "Cara menutup jualan tanpa mendesak"] },
    { title: "Susulan WhatsApp", titleEn: "WhatsApp Follow-Up", desc: "Draf mesej susulan yang dibalas.", fields: [co, pr, cx],
      task: "Draf siri mesej susulan WhatsApp yang sopan dan berkesan.",
      deliverables: ["3 mesej susulan untuk hari 1, 3 dan 7", "Nada mesra yang tidak mengganggu", "Bila patut berhenti membuat susulan"] },
    { title: "Saring Prospek", titleEn: "Qualify Leads", desc: "Kenal pasti prospek yang berbaloi dikejar.", fields: [co, pr, raw],
      task: "Bantu saya menyaring prospek ini untuk menentukan yang paling berbaloi dikejar.",
      deliverables: ["Kriteria prospek berkualiti untuk perniagaan ini", "Prospek disusun mengikut keutamaan", "Soalan penyaringan untuk perbualan pertama"] },
    { title: "Struktur Cadangan Harga", titleEn: "Proposal Structure", desc: "Susun cadangan harga yang meyakinkan.", fields: [co, pr, tc, ob],
      task: "Susun struktur cadangan harga yang meyakinkan untuk pelanggan ini.",
      deliverables: ["Rangka cadangan bahagian demi bahagian", "Cara membentangkan harga supaya nilai dilihat dahulu", "Perkara yang selalu menyebabkan cadangan ditolak"] },
    { title: "Jawab Bantahan Pelanggan", titleEn: "Handle Objections", desc: "Sedia jawapan untuk bantahan biasa.", fields: [co, pr, cx],
      task: "Sediakan jawapan yang yakin untuk bantahan yang biasa diterima daripada pelanggan.",
      deliverables: ["8 bantahan biasa dengan jawapan ringkas", "Cara menangani bantahan harga secara khusus", "Ayat yang perlu dielakkan kerana melemahkan kedudukan"] },
    { title: "Susulan Pelanggan", titleEn: "Customer Follow-Up", desc: "Kekalkan hubungan selepas jualan.", fields: [co, pr, ob],
      task: "Bina rutin susulan pelanggan selepas jualan yang mudah dilaksanakan.",
      deliverables: ["Jadual susulan 7, 30 dan 90 hari", "Mesej untuk setiap titik susulan", "Cara meminta ulasan atau rujukan"] },
    { title: "Jualan Tambahan", titleEn: "Upselling", desc: "Cadangkan tawaran naik taraf yang wajar.", fields: [co, pr, tc],
      task: "Cadangkan peluang jualan tambahan yang munasabah untuk pelanggan sedia ada.",
      deliverables: ["Tawaran naik taraf yang sesuai dan harganya", "Masa terbaik untuk menawarkannya", "Ayat tawaran yang tidak terasa memaksa"] },
    { title: "Jualan Silang", titleEn: "Cross-Selling", desc: "Padankan produk yang saling melengkapi.", fields: [co, pr, raw],
      task: "Kenal pasti peluang jualan silang antara produk yang ada.",
      deliverables: ["Padanan produk yang masuk akal untuk pelanggan", "Cara membentangkan padanan itu", "Pakej yang boleh ditawarkan"] },
    { title: "Semak Saluran Jualan", titleEn: "Sales Pipeline Review", desc: "Lihat di mana jualan tersekat.", fields: [co, raw, ob],
      task: "Semak saluran jualan ini dan kenal pasti di mana prospek tersekat.",
      deliverables: ["Peringkat saluran yang paling banyak kehilangan prospek", "Punca kemungkinan bagi setiap kebocoran", "Tindakan untuk minggu ini"] },
    { title: "Aktifkan Semula Pelanggan", titleEn: "Reactivate Past Customers", desc: "Hubungi semula pelanggan yang sudah lama senyap.", fields: [co, pr, cx],
      task: "Bina kempen untuk menghubungi semula pelanggan yang sudah lama tidak membeli.",
      deliverables: ["Mesej pembuka yang tidak terasa janggal", "Tawaran yang sesuai untuk menarik semula", "Senarai pelanggan yang patut dihubungi dahulu"] },
  ]
);

const AREA_F = assemble(
  "finance", "F",
  "Kewangan & Prestasi Perniagaan", "Finance & Business Performance",
  "Angka yang difahami, keputusan yang tepat.",
  "wallet", "emerald",
  "Anda penasihat kewangan perniagaan untuk PKS di Malaysia.",
  [
    { title: "Analisis Perbelanjaan", titleEn: "Expense Analysis", desc: "Lihat ke mana wang syarikat pergi.", fields: [co, raw, ob],
      task: "Analisis perbelanjaan ini dan kenal pasti di mana wang boleh dijimatkan.",
      deliverables: ["Perbelanjaan disusun mengikut saiz dan jenis", "Kos yang boleh dikurangkan tanpa menjejaskan operasi", "3 tindakan penjimatan mengikut keutamaan"], disclaimer: FIN_DISCLAIMER },
    { title: "Aliran Tunai", titleEn: "Cash Flow", desc: "Fahami dan rancang aliran tunai.", fields: [co, rev, raw],
      task: "Bantu saya memahami kedudukan aliran tunai ini dan merancang 3 bulan ke hadapan.",
      deliverables: ["Kedudukan tunai semasa dalam bahasa mudah", "Bulan yang berisiko ketat dan sebabnya", "Langkah menstabilkan aliran tunai"], disclaimer: FIN_DISCLAIMER },
    { title: "Strategi Harga", titleEn: "Pricing Strategy", desc: "Tetapkan harga yang mencerminkan nilai.", fields: [co, pr, rev, tc],
      task: "Bantu saya menilai semula harga produk ini berbanding kos dan nilai kepada pelanggan.",
      deliverables: ["Analisis harga semasa berbanding kos dan pasaran", "2–3 pilihan struktur harga", "Risiko dan cara memperkenalkan perubahan harga"], disclaimer: FIN_DISCLAIMER },
    { title: "Analisis Pulang Modal", titleEn: "Break-Even Analysis", desc: "Kira bila perniagaan mula untung.", fields: [co, pr, raw],
      task: "Kira titik pulang modal untuk produk atau perniagaan ini dan terangkan maksudnya.",
      deliverables: ["Pengiraan titik pulang modal langkah demi langkah", "Jumlah jualan yang diperlukan setiap bulan", "Andaian yang digunakan dan risikonya"], disclaimer: FIN_DISCLAIMER },
    { title: "Margin Keuntungan", titleEn: "Profit Margin", desc: "Kenal pasti produk yang benar-benar untung.", fields: [co, pr, raw],
      task: "Analisis margin keuntungan produk ini dan kenal pasti yang paling menguntungkan.",
      deliverables: ["Margin setiap produk disusun dari tinggi ke rendah", "Produk yang rugi atau nyaris rugi", "Cadangan tindakan bagi produk bermargin rendah"], disclaimer: FIN_DISCLAIMER },
    { title: "Bajet Tahunan", titleEn: "Annual Budget", desc: "Bina bajet yang realistik.", fields: [co, rev, ob],
      task: "Bantu saya membina bajet tahunan yang realistik untuk perniagaan ini.",
      deliverables: ["Bajet mengikut kategori utama", "Andaian pertumbuhan dan asasnya", "Perkara yang perlu dipantau setiap bulan"], disclaimer: FIN_DISCLAIMER },
    { title: "Kurangkan Kos", titleEn: "Cost Reduction", desc: "Kurangkan kos tanpa menjejaskan kualiti.", fields: [co, raw, ob],
      task: "Cadangkan cara mengurangkan kos tanpa menjejaskan kualiti atau semangat pasukan.",
      deliverables: ["Kos yang boleh dikurangkan segera", "Kos yang tidak patut disentuh dan sebabnya", "Anggaran penjimatan bagi setiap cadangan"], disclaimer: FIN_DISCLAIMER },
    { title: "Unjuran Jualan", titleEn: "Revenue Forecast", desc: "Unjurkan jualan dengan andaian yang jelas.", fields: [co, rev, raw],
      task: "Bina unjuran jualan untuk 6 bulan akan datang berdasarkan prestasi lalu.",
      deliverables: ["Unjuran bulanan dengan senario rendah dan tinggi", "Andaian utama yang digunakan", "Petunjuk awal jika unjuran tersasar"], disclaimer: FIN_DISCLAIMER },
    { title: "Bandingkan Pelaburan", titleEn: "Compare Investments", desc: "Banding pilihan pelaburan secara berstruktur.", fields: [co, raw, ob],
      task: "Bandingkan pilihan pelaburan ini dan cadangkan yang paling sesuai.",
      deliverables: ["Kos, pulangan dan tempoh bagi setiap pilihan", "Risiko utama dan cara mengurangkannya", "Cadangan pilihan dan sebabnya"], disclaimer: FIN_DISCLAIMER },
    { title: "Papan Pemuka Kewangan CEO", titleEn: "CEO Financial Dashboard", desc: "Tentukan angka yang perlu dipantau.", fields: [co, rev, ob],
      task: "Cadangkan papan pemuka kewangan ringkas yang perlu saya pantau sebagai CEO.",
      deliverables: ["6–8 angka utama dan sebab setiap satu penting", "Kekerapan semakan bagi setiap angka", "Tanda amaran yang memerlukan tindakan segera"], disclaimer: FIN_DISCLAIMER },
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
