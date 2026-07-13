import { AppShell } from "../components/AppShell";
import { BrandFooter } from "../components/Brand";
import { QRCodeCard } from "../components/QRCode";
import { eventBase, eventConfig, publicOrigin } from "../config/eventConfig";

export default function QRPage() {
  const origin = publicOrigin();
  const registrationUrl = `${origin}${eventBase}/register`;

  return (
    <AppShell header title="Event QR Codes">
      <section className="bg-navy-950 px-5 pb-6 pt-6 text-white">
        <span className="section-eyebrow text-gold-300">Print & Display</span>
        <h1 className="mt-1 font-display text-2xl font-extrabold">Event QR Codes</h1>
        <p className="mt-2 text-sm text-navy-100">
          One Registration QR for accounts, and one Attendance QR per day. Each
          downloads as a high-resolution PNG for a poster, slide or WhatsApp.
        </p>
      </section>

      <div className="space-y-5 px-5 py-6">
        <QRCodeCard
          value={registrationUrl}
          label="Registration — Register & Enter Attendify"
          caption={registrationUrl}
          downloadName="attendify-registration-qr.png"
        />
        {eventConfig.attendanceSessions.map((s) => (
          <QRCodeCard
            key={s.id}
            value={`${origin}/attend/${s.id}`}
            label={`Attendance · ${s.label}`}
            caption={`${s.weekday}, ${s.date} · ${eventConfig.venue}`}
            downloadName={`attendify-attendance-${s.id}-qr.png`}
          />
        ))}

        <div className="rounded-xl bg-sand-100 p-4 text-xs leading-relaxed text-navy-500">
          <p className="font-bold text-navy-700">Tip</p>
          <p className="mt-1">
            The full QR generator (with all sessions) also lives inside the Admin
            dashboard. QR codes always point at this live site.
          </p>
        </div>
      </div>

      <BrandFooter />
    </AppShell>
  );
}
