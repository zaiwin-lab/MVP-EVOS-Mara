// ─────────────────────────────────────────────────────────────
// PARTICIPANT INFORMATION — CEOnita Strategik
//
// Venue, logistics, what to bring, house rules and dress code, as
// supplied by the organiser. Nothing is inferred: where a detail was not
// given it is simply absent rather than guessed at.
// ─────────────────────────────────────────────────────────────

import type { Localized } from "../context/I18nContext";

export interface VenueItem {
  icon: string;
  label: Localized;
  value: Localized;
}

export const VENUE: VenueItem[] = [
  {
    icon: "location",
    label: { bm: "Tempat", en: "Venue" },
    value: {
      bm: "Mines Beach Resort\nJalan Dulang, Mines Resort City\n43300 Seri Kembangan, Selangor",
      en: "Mines Beach Resort\nJalan Dulang, Mines Resort City\n43300 Seri Kembangan, Selangor",
    },
  },
  {
    icon: "calendar",
    label: { bm: "Dewan Seminar", en: "Seminar Room" },
    value: { bm: "Hang Tuah, Tingkat 3", en: "Hang Tuah, Level 3" },
  },
  {
    icon: "checkCircle",
    label: { bm: "Surau", en: "Prayer Room" },
    value: { bm: "Tingkat 1", en: "Level 1" },
  },
  {
    icon: "users",
    label: { bm: "Penginapan", en: "Accommodation" },
    value: {
      bm: "Twin-sharing\nDaftar masuk: 28 Sept 2026, 3:00 PM\nDaftar keluar: 29 Sept 2026, 12:00 PM",
      en: "Twin-sharing\nCheck-in: 28 Sept 2026, 3:00 PM\nCheck-out: 29 Sept 2026, 12:00 PM",
    },
  },
];

export const CHECKLIST: Localized[] = [
  { bm: "Laptop / tablet / iPad", en: "Laptop / tablet / iPad" },
  { bm: "Kalkulator", en: "Calculator" },
  { bm: "Buku nota & alat tulis", en: "Notebook & stationery" },
  { bm: "Profil syarikat", en: "Company profile" },
  { bm: "Laporan kewangan", en: "Financial report" },
  { bm: "Power bank", en: "Power bank" },
  { bm: "Pengecas telefon", en: "Phone charger" },
  { bm: "Extension plug", en: "Extension plug" },
  { bm: "Jaket / sweater", en: "Jacket / sweater" },
  { bm: "Name tag", en: "Name tag" },
];

export const REMINDERS: Localized[] = [
  { bm: "Hadir tepat pada masanya bagi setiap sesi.", en: "Be on time for every session." },
  { bm: "Berpakaian kemas, sopan dan selesa sepanjang program.", en: "Dress neatly, modestly and comfortably throughout." },
  { bm: "Rakaman gambar, video atau audio memerlukan kebenaran terlebih dahulu.", en: "Photography, video or audio recording requires permission first." },
  { bm: "Ikuti arahan dan aliran program yang ditetapkan.", en: "Follow the programme instructions and running order." },
  { bm: "Rujuk pegawai program sekiranya memerlukan bantuan.", en: "Speak to a programme officer if you need assistance." },
];

export const DRESS_CODE: Localized = {
  bm: "Pakaian profesional, kemas dan sopan sepanjang program. Suhu dewan mungkin berubah — bawa jaket atau sweater.",
  en: "Professional, neat and modest attire throughout. Room temperature can change — bring a jacket or sweater.",
};
