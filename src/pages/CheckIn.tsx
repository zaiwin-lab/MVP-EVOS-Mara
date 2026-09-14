import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";

const SESSION = eventConfig.attendanceSessions[0].id;

const BENEFITS = [
  { icon: "users", title: "Rekod Kehadiran Lebih Tepat", desc: "Sistem merekod kehadiran secara automatik dan masa sebenar." },
  { icon: "spark", title: "Semakan Pantas", desc: "Proses daftar masuk yang cepat dan mudah tanpa borang manual." },
  { icon: "checkCircle", title: "E-Sijil Penyertaan", desc: "Rekod kehadiran digunakan untuk penjanaan e-sijil selepas program." },
];

export default function CheckIn() {
  const navigate = useNavigate();
  const { setParticipantId, refresh } = useParticipant();

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
      await store.markAttendance(participant.id, SESSION);
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
        <div className={`relative ${SITE_WRAP} py-9`}>
          <span className="section-eyebrow text-gold-300">QR Check-In &amp; Registration</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Daftar Masuk Peserta</h1>
          <p className="mt-2 text-sm text-navy-200">Daftar masuk dengan mudah untuk pengesahan kehadiran program.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="chip bg-white/10 text-white"><Icon name="calendar" className="h-3.5 w-3.5" /> {eventConfig.dates}</span>
            <span className="chip bg-white/10 text-white"><Icon name="location" className="h-3.5 w-3.5" /> {eventConfig.venue}</span>
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-10`}>
        <div className="mx-auto max-w-xl">
          {done ? (
            <Success ref_={done.ref} returning={done.returning} onContinue={() => navigate("/my")} />
          ) : (
            <div className="card p-6 sm:p-7">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-gold-300"><Icon name="clipboard" className="h-4 w-4" /></span>
                <h2 className="font-display text-lg font-bold text-navy-900">Lengkapkan Maklumat Pendaftaran</h2>
              </div>
              <p className="mt-1 text-xs text-navy-400">Maklumat anda digunakan untuk rekod kehadiran program.</p>

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
                {submitting ? "Mendaftar…" : "Daftar Sekarang"}
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
          {BENEFITS.map((b) => (
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

function Success({ ref_, returning, onContinue }: { ref_: string; returning: boolean; onContinue: () => void }) {
  return (
    <div className="card p-7 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Icon name="checkCircle" className="h-9 w-9" />
      </div>
      <h2 className="mt-4 font-display text-2xl font-extrabold text-navy-900">
        {returning ? "Selamat Kembali!" : "Pendaftaran Berjaya!"}
      </h2>
      <p className="mt-2 text-sm text-navy-500">
        Kehadiran anda untuk {eventConfig.eventName} telah direkodkan.
      </p>
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
