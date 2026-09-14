// ─────────────────────────────────────────────────────────────
// SITE CONTENT — programme agenda, feature cards, quick access, FAQ.
// BM-first with concise English secondary labels (spec §3).
// ─────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  to: string;
}

// Main navigation (spec §4).
export const NAV: NavItem[] = [
  { label: "Utama", to: "/" },
  { label: "Program", to: "/program" },
  { label: "Prompt Hub", to: "/prompt-hub" },
  { label: "Sumber", to: "/sumber" },
  { label: "Galeri Foto", to: "/galeri" },
  { label: "Modul Google Folder", to: "/sumber" },
  { label: "FAQ", to: "/faq" },
];

// Six premium feature cards on the landing page.
export const FEATURES = [
  { icon: "spark", title: "Pembelajaran Praktikal", desc: "Workshop hands-on dengan contoh sebenar untuk koperasi.", to: "/program" },
  { icon: "target", title: "AI Prompt Hub", desc: "60 prompt siap guna untuk operasi, pemasaran & analisis.", to: "/prompt-hub" },
  { icon: "chart", title: "Penilaian AI Ringkas", desc: "Ukur tahap kesiapsiagaan AI koperasi anda dalam 2 minit.", to: "/readiness" },
  { icon: "calendar", title: "Pelan 90 Hari", desc: "Rangka perjalanan ringkas selepas program untuk hasil sebenar.", to: "/journey" },
  { icon: "book", title: "Modul & Toolkit", desc: "Nota, template, video dan sumber rujukan di Google Folder.", to: "/sumber" },
  { icon: "qr", title: "Jejak Kehadiran QR", desc: "Daftar masuk mudah, rekod penyertaan, e-sijil selepas program.", to: "/check-in" },
] as const;

// Quick-access strip (Pintu Pantas / Akses Utama Program).
export const QUICK_LINKS = [
  { icon: "qr", title: "QR Check-In", desc: "Daftar masuk peserta", to: "/check-in" },
  { icon: "chart", title: "Readiness Snapshot", desc: "Nilai kesiapsiagaan AI", to: "/readiness" },
  { icon: "target", title: "6 Bidang Utama", desc: "Teroka fokus program", to: "/prompt-hub" },
  { icon: "spark", title: "10 Prompt Missions", desc: "Cabaran praktikal", to: "/prompt-hub" },
  { icon: "book", title: "Resources", desc: "Modul, template & rujukan", to: "/sumber" },
  { icon: "slides", title: "Galeri Foto", desc: "Momen program & aktiviti", to: "/galeri" },
] as const;

// Single-day agenda (tentative). Keep it light — this is ProgramOS Lite.
export const AGENDA = [
  { time: "8:30 – 9:00", title: "Pendaftaran & QR Check-In", desc: "Daftar masuk peserta menggunakan kod QR." },
  { time: "9:00 – 9:30", title: "Pembukaan & Hala Tuju", desc: "Ucapan ANGKASA, KOBIS & SDEC — mengapa AI untuk koperasi." },
  { time: "9:30 – 10:30", title: "Penilaian Kesiapsiagaan AI", desc: "Peserta lengkapkan AI Readiness Snapshot dan fahami kedudukan koperasi." },
  { time: "10:30 – 12:30", title: "6 Bidang Utama Koperasi", desc: "Terokai bagaimana AI membantu setiap bidang operasi koperasi." },
  { time: "12:30 – 2:00", title: "Rehat & Makan Tengah Hari", desc: "Networking sesama peserta koperasi." },
  { time: "2:00 – 3:30", title: "AI Prompt Hub — Hands-on", desc: "Bina prompt sebenar menggunakan Prompt Builder dan cuba dalam AI pilihan anda." },
  { time: "3:30 – 4:30", title: "Perjalanan 90 Hari", desc: "Rangka langkah kecil untuk terus menggunakan AI selepas program." },
  { time: "4:30 – 5:00", title: "Refleksi & Penutup", desc: "Kongsi pembelajaran dan langkah seterusnya." },
] as const;

export const FAQS = [
  { q: "Apakah itu ProgramOS Lite?", a: "ProgramOS Lite ialah program pembangunan Transformasi Digital & AI untuk Koperasi — inisiatif bersama ANGKASA, KOBIS Berhad dan SDEC. Ia membantu koperasi menerap AI dalam operasi harian secara mudah dan praktikal." },
  { q: "Siapa yang boleh menyertai?", a: "Program ini terbuka kepada koperasi terpilih. Maksimum 2 wakil setiap koperasi, dengan 30 tempat sahaja." },
  { q: "Adakah saya perlu mahir teknologi?", a: "Tidak. Program direka untuk semua tahap. Anda hanya perlu bawa telefon pintar dan kesediaan untuk belajar." },
  { q: "Adakah program ini menggunakan AI berbayar?", a: "Tidak. Sistem ini membantu anda MEMBINA prompt berkualiti. Anda kemudian salin dan gunakan dalam ChatGPT, Claude atau Gemini secara percuma." },
  { q: "Bagaimana saya daftar kehadiran?", a: "Imbas kod QR yang dipaparkan di lokasi program menggunakan telefon anda, isi maklumat ringkas, dan anda telah didaftarkan." },
  { q: "Adakah data koperasi saya selamat?", a: "Ya. Maklumat digunakan hanya untuk rekod kehadiran dan aktiviti program. Data program ini berasingan sepenuhnya daripada program lain." },
  { q: "Apakah AI Readiness Snapshot?", a: "Penilaian ringkas 5 soalan untuk menganggar tahap kesiapsiagaan AI koperasi anda. Ia panduan, bukan audit atau pensijilan formal." },
  { q: "Apa yang berlaku selepas program?", a: "Anda boleh terus menggunakan 60 prompt dan mengikut Perjalanan 90 Hari mengikut rentak anda sendiri — tiada KPI wajib." },
] as const;

// Three institutional pillars in the footer band.
export const PILLARS = [
  { title: "Koperasi Lebih Kukuh", desc: "Melalui ilmu, teknologi dan kolaborasi." },
  { title: "Masa Depan Lebih Bijak", desc: "Bersama AI untuk impak sebenar." },
  { title: "Masyarakat Lebih Sejahtera", desc: "Koperasi memacu kemajuan bersama." },
] as const;
