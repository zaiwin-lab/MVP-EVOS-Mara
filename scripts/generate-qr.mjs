// Generate print-ready QR PNGs for the event.
// Usage:
//   node scripts/generate-qr.mjs https://your-live-url.netlify.app
// or set PUBLIC_URL env. Writes into ./public so they ship with the app
// and are also downloadable in-app at /qr.

import QRCode from "qrcode";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SLUG = "vdp-frontier-miri";
const base =
  process.argv[2] || process.env.PUBLIC_URL || "https://vdp-frontier-miri.netlify.app";
const origin = base.replace(/\/$/, "");

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "qr");
await mkdir(outDir, { recursive: true });

const targets = [
  { name: "check-in", url: `${origin}/event/${SLUG}/check-in`, label: "Scan to Check In" },
  { name: "portal", url: `${origin}/event/${SLUG}`, label: "Scan to Open Attendify" },
];

for (const t of targets) {
  const file = join(outDir, `attendify-${t.name}-qr.png`);
  await QRCode.toFile(file, t.url, {
    width: 1024,
    margin: 4,
    color: { dark: "#0e1a34", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });
  console.log(`✓ ${t.label.padEnd(24)} → public/qr/attendify-${t.name}-qr.png`);
  console.log(`    ${t.url}`);
}

console.log("\nDone. High-resolution PNGs are ready for print, poster, slide or WhatsApp.");
