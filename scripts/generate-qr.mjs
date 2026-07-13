// Generate print-ready QR PNGs for the event.
// Usage:
//   node scripts/generate-qr.mjs https://kbt-attendify-maravdp.netlify.app
// or set PUBLIC_URL env. Writes into ./public/qr.
// (The admin dashboard also has an in-app QR generator.)

import QRCode from "qrcode";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SLUG = "vdp-frontier-miri";
const SESSIONS = [
  { id: "day-1", label: "Day 1 · Tuesday 14 July 2026" },
  { id: "day-2", label: "Day 2 · Wednesday 15 July 2026" },
  { id: "day-3", label: "Day 3 · Thursday 16 July 2026" },
];

const base =
  process.argv[2] || process.env.PUBLIC_URL || "https://kbt-attendify-maravdp.netlify.app";
const origin = base.replace(/\/$/, "");

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "qr");
await mkdir(outDir, { recursive: true });

const targets = [
  { name: "registration", url: `${origin}/event/${SLUG}/register`, label: "Registration — Register & Enter Attendify" },
  ...SESSIONS.map((s) => ({
    name: `attendance-${s.id}`,
    url: `${origin}/attend/${s.id}`,
    label: `Attendance · ${s.label}`,
  })),
];

for (const t of targets) {
  const file = join(outDir, `attendify-${t.name}-qr.png`);
  await QRCode.toFile(file, t.url, {
    width: 1024,
    margin: 4,
    color: { dark: "#0e1a34", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });
  console.log(`✓ ${t.label}`);
  console.log(`    → public/qr/attendify-${t.name}-qr.png`);
  console.log(`    ${t.url}`);
}

console.log("\nDone. High-resolution PNGs ready for poster, slide or WhatsApp.");
