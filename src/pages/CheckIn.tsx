import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";

const SESSION = eventConfig.attendanceSessions[0].id;

type Mode = "checkin" | "register";

const COPY: Record<Mode, {
  eyebrow: string; title: string; subtitle: string; cardHeading: string; cardNote: string;
  cta: string; ctaBusy: string;
  successNew: string; successReturn: string; successDesc: string;
  benefits: { icon: string; title: string; desc: string }[];
}> = {
  checkin: {
    eyebrow: "QR Check-In & Registration",
    title: "Daftar Masuk Peserta",
    subtitle: "Daftar masuk dengan mudah untuk pengesahan kehadiran program.",
    cardHeading: "Lengkapkan Maklumat Pendaftaran",
    cardNote: "Maklumat anda digunakan untuk rekod kehadiran program.",
    cta: "Daftar Sekarang", ctaBusy: "Mendaftar…",
    successNew: "Pendaftaran Berjaya!", successReturn: "Selamat Kembali!",
    successDesc: `Kehadiran anda untuk ${eventConfig.eventName} telah direkodkan.`,
    benefits: [
      { icon: "users", title: "Rekod Kehadiran Lebih Tepat", desc: "Sistem merekod kehadiran secara automatik dan masa sebenar." },
      { icon: "spark", title: "Semakan Pantas", desc: "Proses daftar masuk yang cepat dan mudah tanpa borang manual." },
      { icon: "checkCircle", title: "E-Sijil Penyertaan", desc: "Rekod kehadiran digunakan untuk penjanaan e-sijil selepas program." },
    ],
  },
  register: {
    eyebrow: "Pendaftaran Penyertaan · Register",
    title: "Daftar Penyertaan Anda",
    subtitle: "Tempahkan tempat anda untuk program ini. Tempat terhad kepada 30 peserta.",
    cardHeading: "Borang Pendaftaran Peserta",
    cardNote: "Maklumat anda digunakan untuk pendaftaran dan tempahan tempat program.",
    cta: "Hantar Pendaftaran", ctaBusy: "Menghantar…",
    successNew: "Pendaftaran Berjaya!", successReturn: "Anda Sudah Berdaftar!",
    successDesc: `Terima kasih! Penyertaan anda untuk ${eventConfig.eventName} telah direkodkan. Simpan rujukan ini dan tunjukkannya semasa hari program untuk daftar masuk (check-in).`,
    benefits: [
      { icon: "checkCircle", title: "Tempahan Tempat Anda", desc: "Pendaftaran awal memastikan tempat anda dalam program tempat terhad ini." },
      { icon: "spark", title: "Check-In Lebih Pantas", desc: "Pada hari program, imbas QR dan daftar masuk dengan lebih cepat." },
      { icon: "users", title: "Untuk Koperasi Anda", desc: "Maksimum 2 wakil setiap koperasi digalakkan menyertai." },
    ],
  },
};

export default function CheckIn({ mode = "checkin" }: { mode?: Mode }) {
  const navigate = useNavigate();
  const { setParticipantId, refresh } = useParticipant();
  const c = COPY[mode];

  const [fullName, setFullName] = useState("");
  const [coopName, setCoopName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ref: string; returning: boolean } | null>(null);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit =
    fullName.trim().length > 1 && coopName.trim().length > 1 && mobile.trim().length >= 7 && emailOk;

  async function submit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      let participant = await store.findByMobile(mobile);
      const returning = Boolean(participant);
      if (!participant) {
        participant = await store.createParticipant({ fullName, mobile, email, coopName, role });
      }
      // Only the on-site check-in marks event-day attendance.
      // Promo registration signs people up without marking them present.
      if (mode === "checkin") {
        await store.markAttendance(participant.id, SESSION);
      }
      setParticipantId(participant.id);
      await refresh();
      setDone({ ref: participant.ref, returning });
    } catch (e) {
      console.error(e);
      setError("Maaf, berlaku ralat. Sila cuba lagi.");
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
        {/* Compact on phones: someone arriving from the QR code at the venue
            should see the first field without scrolling, so the full hero is
            kept for wider screens only. */}
        <div className={`relative ${SITE_WRAP} py-4 sm:py-9`}>
          <span className="hidden section-eyebrow text-gold-300 sm:inline">{c.eyebrow}</span>
          <h1 className="font-display text-xl font-extrabold sm:mt-2 sm:text-4xl">{c.title}</h1>
          <p className="mt-1 hidden text-sm text-navy-200 sm:mt-2 sm:block">{c.subtitle}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-navy-200 sm:mt-4 sm:gap-2 sm:text-xs">
            <span className="inline-flex items-center gap-1.5 sm:chip sm:bg-white/10 sm:text-white">
              <Icon name="calendar" className="h-3.5 w-3.5 text-gold-300" /> {eventConfig.dates}
            </span>
            <span className="inline-flex items-center gap-1.5 sm:chip sm:bg-white/10 sm:text-white">
              <Icon name="location" className="h-3.5 w-3.5 text-gold-300" /> {eventConfig.venue}
            </span>
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-10`}>
        <div className="mx-auto max-w-xl">
          {done ? (
            <Success mode={mode} ref_={done.ref} returning={done.returning} onContinue={() => navigate("/my")} />
          ) : (
            <div className="card p-6 sm:p-7">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-gold-300"><Icon name="clipboard" className="h-4 w-4" /></span>
                <h2 className="font-display text-lg font-bold text-navy-900">{c.cardHeading}</h2>
              </div>
              <p className="mt-1 text-xs text-navy-400">{c.cardNote}</p>

              <div className="mt-5 space-y-4">
                <Field label="Nama Penuh" en="Full Name" value={fullName} onChange={setFullName} placeholder="cth. Ahmad Firdaus bin Rahman" autoComplete="name" />
                <Field label="Nama Koperasi" en="Co-op Name" value={coopName} onChange={setCoopName} placeholder="cth. Koperasi Serba Guna Kuching Berhad" autoComplete="organization" />
                <Field label="No. Telefon" en="Phone No." value={mobile} onChange={setMobile} placeholder="cth. 012-345 6789" inputMode="tel" autoComplete="tel" />
                <Field label="Emel" en="Email" value={email} onChange={setEmail} placeholder="anda@koperasi.com" type="email" inputMode="email" autoComplete="email" />
                <div>
                  <label className="field-label">Peranan <span className="font-normal text-navy-300">· Role</span></label>
                  <select className="field-input" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Pilih peranan anda…</option>
                    {eventConfig.roleOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button onClick={submit} disabled={!canSubmit || submitting} className="btn-gold mt-5 w-full">
                {submitting ? c.ctaBusy : c.cta}
                {!submitting && <Icon name="arrowRight" className="h-5 w-5" />}
              </button>
              <p className="mt-3 text-center text-xs text-navy-400">
                Sudah berdaftar sebelum ini? <Link to="/login" className="font-bold text-navy-800 underline">Log masuk</Link>
              </p>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {c.benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700"><Icon name={b.icon} className="h-5 w-5" /></span>
              <div>
                <div className="text-sm font-bold text-navy-900">{b.title}</div>
                <div className="text-xs text-navy-500">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function Success({ mode, ref_, returning, onContinue }: { mode: Mode; ref_: string; returning: boolean; onContinue: () => void }) {
  const c = COPY[mode];
  return (
    <div className="card p-7 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Icon name="checkCircle" className="h-9 w-9" />
      </div>
      <h2 className="mt-4 font-display text-2xl font-extrabold text-navy-900">
        {returning ? c.successReturn : c.successNew}
      </h2>
      <p className="mt-2 text-sm text-navy-500">{c.successDesc}</p>
      <div className="mt-5 inline-flex flex-col items-center rounded-2xl bg-sand-100 px-6 py-4">
        <span className="text-[11px] font-bold uppercase tracking-wide text-navy-400">Rujukan Anda</span>
        <span className="font-display text-2xl font-extrabold text-navy-900">{ref_}</span>
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <button onClick={onContinue} className="btn-gold">Ke Ruang Saya <Icon name="arrowRight" className="h-5 w-5" /></button>
        <Link to="/readiness" className="btn-outline">Mula Penilaian AI</Link>
      </div>
    </div>
  );
}

function Field({
  label, en, value, onChange, placeholder, type = "text", inputMode, autoComplete,
}: {
  label: string; en: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; inputMode?: "text" | "numeric" | "tel" | "email"; autoComplete?: string;
}) {
  return (
    <div>
      <label className="field-label">{label} <span className="font-normal text-navy-300">· {en}</span></label>
      <input className="field-input" value={value} type={type} inputMode={inputMode} autoComplete={autoComplete} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
