import { AppShell } from "../components/AppShell";
import { BrandFooter } from "../components/Brand";
import { QRCodeCard } from "../components/QRCode";
import { eventBase, eventConfig, publicOrigin } from "../config/eventConfig";

export default function QRPage() {
  const origin = publicOrigin();
  const checkInUrl = `${origin}${eventBase}/check-in`;
  const portalUrl = `${origin}${eventBase}`;

  return (
    <AppShell header title="Event QR Codes">
      <section className="bg-navy-950 px-5 pb-6 pt-6 text-white">
        <span className="section-eyebrow text-gold-300">Print & Display</span>
        <h1 className="mt-1 font-display text-2xl font-extrabold">Event QR Codes</h1>
        <p className="mt-2 text-sm text-navy-100">
          Display these at the registration counter, on an A4 poster, a slide, or
          share via WhatsApp. Both download as high-resolution PNGs.
        </p>
      </section>

      <div className="space-y-5 px-5 py-6">
        <QRCodeCard
          value={checkInUrl}
          label="Scan to Check In"
          caption={checkInUrl}
          downloadName="attendify-check-in-qr.png"
        />
        <QRCodeCard
          value={portalUrl}
          label="Scan to Open Attendify"
          caption={portalUrl}
          downloadName="attendify-portal-qr.png"
        />

        <div className="rounded-xl bg-sand-100 p-4 text-xs leading-relaxed text-navy-500">
          <p className="font-bold text-navy-700">Tip</p>
          <p className="mt-1">
            After you deploy, set <code className="rounded bg-white px-1">VITE_PUBLIC_URL</code>{" "}
            to your live URL (e.g. https://{eventConfig.slug}.netlify.app) so the QR
            codes point to production instead of this preview origin.
          </p>
        </div>
      </div>

      <BrandFooter />
    </AppShell>
  );
}
