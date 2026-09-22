// Generate print-ready QR PNGs for the programme.
// Usage:
//   node scripts/generate-qr.mjs https://angkasatda.netlify.app
// or set PUBLIC_URL. Writes into ./public/qr, which ships with the build.
//
// These must stay in step with the admin console's own QR generator
// (src/pages/admin/AdminDashboard.tsx), which builds the same two URLs from
// whatever origin it is opened on. The codes here are the ones that go on a
// printed poster or a slide, so the paths are spelled out rather than derived.

import QRCode from "qrcode";
import { mkdir, readdir, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const base =
  process.argv[2] || process.env.PUBLIC_URL || "https://angkasatda.netlify.app";
const origin = base.replace(/\/$/, "");

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "qr");
await mkdir(outDir, { recursive: true });

// Anything already in the folder is from an earlier event or an earlier
// origin. A stale QR on a poster sends a room full of people to the wrong
// site, so the folder is cleared rather than added to.
for (const file of await readdir(outDir)) {
  if (file.endsWith(".png")) await unlink(join(outDir, file));
}

const targets = [
  {
    name: "kehadiran",
    url: `${origin}/hadir`,
    label: "Kehadiran — imbas pada hari program (24 September 2026)",
  },
  {
    name: "pendaftaran",
    url: `${origin}/check-in`,
    label: "Pendaftaran — daftar akaun sebelum program",
  },
];

for (const t of targets) {
  const file = join(outDir, `programos-lite-${t.name}-qr.png`);
  await QRCode.toFile(file, t.url, {
    width: 1024,
    margin: 4,
    color: { dark: "#0e1a34", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });
  console.log(`✓ ${t.label}`);
  console.log(`    → public/qr/programos-lite-${t.name}-qr.png`);
  console.log(`    ${t.url}`);
}

console.log("\nSiap. PNG resolusi tinggi untuk poster, slaid atau WhatsApp.");
