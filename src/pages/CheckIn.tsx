import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { store } from "../data/store";
import { toProperName } from "../lib/names";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n, type Localized } from "../context/I18nContext";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";

// ⚠️ Iban here still needs a native-speaker review — see src/content/site.ts.
/** The copy for this page. It registers people; it does not mark them present. */
interface ModeCopy {
  eyebrow: Localized; title: Localized; subtitle: Localized;
  cardHeading: Localized; cardNote: Localized;
  cta: Localized; ctaBusy: Localized;
  successNew: Localized; successReturn: Localized; successDesc: Localized;
  benefits: { icon: string; title: Localized; desc: Localized }[];
}

const COPY: ModeCopy = {
    eyebrow: { bm: "Pendaftaran Penyertaan · Register", en: "Programme Registration", zh: "报名参加", iban: "Pendaftar Penyerta" },
    title: { bm: "Daftar Penyertaan Anda", en: "Register your place", zh: "登记您的席位", iban: "Daftar Penyerta Nuan" },
    subtitle: {
      bm: `Tempahkan tempat anda untuk program ini. Tempat terhad kepada ${eventConfig.expectedParticipants} peserta.`,
      en: `Reserve your place on this programme. Places are limited to ${eventConfig.expectedParticipants} participants.`,
      zh: `为这个课程预留您的席位。名额限 ${eventConfig.expectedParticipants} 人。`,
      iban: `Tempah endur nuan ba program tu. Endur semina ke ${eventConfig.expectedParticipants} peserta.`,
    },
    cardHeading: { bm: "Borang Pendaftaran Peserta", en: "Participant registration form", zh: "参与者报名表", iban: "Borang Pendaftar Peserta" },
    cardNote: {
      bm: "Maklumat anda digunakan untuk pendaftaran dan tempahan tempat program.",
      en: "Your details are used to register you and reserve your place.",
      zh: "您的资料将用于报名及预留席位。",
      iban: "Penerang nuan dikena kena daftar sereta nempah endur nuan.",
    },
    cta: { bm: "Hantar Pendaftaran", en: "Submit Registration", zh: "提交报名", iban: "Kirim Pendaftar" },
    ctaBusy: { bm: "Menghantar…", en: "Submitting…", zh: "提交中…", iban: "Benung ngirim…" },
    successNew: { bm: "Akaun Anda Sedia!", en: "Your account is ready", zh: "账户已就绪！", iban: "Akaun Nuan Udah Sedia!" },
    successReturn: { bm: "Anda Sudah Berdaftar!", en: "You are already registered!", zh: "您已经报名了！", iban: "Nuan Udah Daftar!" },
    successDesc: {
      bm: `Terima kasih! Akaun anda untuk ${eventConfig.eventName} telah dibuka. Simpan rujukan ini. Pada hari program, imbas kod QR di tempat acara untuk menandakan kehadiran anda.`,
      en: `Thank you. Your account for ${eventConfig.eventNameLocal} is open. Keep this reference. On the programme day, scan the QR code at the venue to mark your attendance.`,
      zh: `谢谢您！您在「${eventConfig.eventNameLocal}」的账户已开通。请保存此参考编号。课程当天，请扫描现场的二维码来登记出席。`,
      iban: `Terima kasih! Akaun nuan ke ${eventConfig.eventName} udah dibuka. Simpan rujukan tu. Ba hari program, imbas kod QR ba endur acara kena nandaka kehadiran nuan.`,
    },
    benefits: [
      {
        icon: "checkCircle",
        title: { bm: "Tempahan Tempat Anda", en: "Your place is reserved", zh: "为您保留席位", iban: "Endur Nuan Ditempah" },
        desc: { bm: "Pendaftaran awal memastikan tempat anda dalam program tempat terhad ini.", en: "Registering early secures your place on this limited programme.", zh: "提前报名可确保您在这个名额有限的课程中的席位。", iban: "Daftar awal ngasuh endur nuan tetap ba program ti mimit endur tu." },
      },
      {
        icon: "spark",
        title: { bm: "Check-In Lebih Pantas", en: "Faster check-in", zh: "签到更快", iban: "Check-In Chelap Agi" },
        desc: { bm: "Pada hari program, imbas QR dan daftar masuk dengan lebih cepat.", en: "On the day, scan the QR code and check in in seconds.", zh: "活动当天扫描二维码，几秒即可签到。", iban: "Ba hari program, imbas QR lalu daftar masuk enggau chelap." },
      },
      {
        icon: "users",
        title: { bm: "Untuk Koperasi Anda", en: "For your co-operative", zh: "为贵合作社而设", iban: "Ke Koperasi Nuan" },
        desc: { bm: `Maksimum ${eventConfig.maxPerCoop} wakil setiap koperasi digalakkan menyertai.`, en: `Up to ${eventConfig.maxPerCoop} representatives per co-operative are encouraged to attend.`, zh: `每家合作社建议最多派 ${eventConfig.maxPerCoop} 位代表参加。`, iban: `Maksimum ${eventConfig.maxPerCoop} wakil tiap koperasi dikeransing datai.` },
      },
    ],
};

export default function CheckIn() {
  const navigate = useNavigate();
  const { setParticipantId, refresh } = useParticipant();
  const { t, pick } = useI18n();
  const [params] = useSearchParams();
  // Someone who scanned the day-of QR without an account lands here; `next`
  // carries them straight back to it once they have one.
  const next = params.get("next") === "/hadir" ? "/hadir" : null;
  const c = COPY;

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
      // Registering is not attending. Attendance is only ever marked by
      // scanning the QR code on the programme day — see src/pages/Attend.tsx.
      setParticipantId(participant.id);
      await refresh();
      setDone({ ref: participant.ref, returning });
    } catch (e) {
      console.error(e);
      setError(t("commonError"));
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      {/* Hero banner */}
      {/* Compact on phones: someone arriving from the QR code at the venue
          should see the first field without scrolling. */}
      <section className="hero-glow relative overflow-hidden bg-navy-950 text-white">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className={`relative ${SITE_WRAP} py-5 sm:py-11`}>
          <span className="hidden items-center rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-gold-300 sm:inline-flex">
            {pick(c.eyebrow)}
          </span>
          <h1 className="h-display text-[23px] sm:mt-4 sm:text-[40px]">{pick(c.title)}</h1>
          <p className="mt-1.5 hidden max-w-2xl text-[14.5px] leading-relaxed text-white/60 sm:mt-3 sm:block">{pick(c.subtitle)}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/55 sm:mt-5 sm:gap-2 sm:text-xs">
            <span className="inline-flex items-center gap-1.5 sm:chip sm:border sm:border-white/10 sm:bg-white/10 sm:text-white">
              <Icon name="calendar" className="h-3.5 w-3.5 text-gold-400" /> {eventConfig.dates}
            </span>
            <span className="inline-flex items-center gap-1.5 sm:chip sm:border sm:border-white/10 sm:bg-white/10 sm:text-white">
              <Icon name="location" className="h-3.5 w-3.5 text-gold-400" /> {eventConfig.venue}
            </span>
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-10`}>
        <div className="mx-auto max-w-xl">
          {done ? (
            <Success ref_={done.ref} returning={done.returning} next={next} onContinue={() => navigate(next ?? "/prompt-hub")} />
          ) : (
            <div className="card p-6 sm:p-7">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-gold-300"><Icon name="clipboard" className="h-4 w-4" /></span>
                <h2 className="font-display text-lg font-bold text-navy-900">{pick(c.cardHeading)}</h2>
              </div>
              <p className="mt-1 text-xs text-navy-400">{pick(c.cardNote)}</p>

              <div className="mt-5 space-y-4">
                <Field label={t("fullName")} value={fullName} onChange={setFullName} placeholder="cth. Ahmad Firdaus bin Rahman" autoComplete="name" tidy />
                <Field label={t("ciCoopName")} value={coopName} onChange={setCoopName} placeholder="cth. Koperasi Serba Guna Kuching Berhad" autoComplete="organization" tidy />
                <Field label={t("mobileNumber")} value={mobile} onChange={setMobile} placeholder="cth. 012-345 6789" inputMode="tel" autoComplete="tel" />
                <Field label={t("emailLabel")} value={email} onChange={setEmail} placeholder="anda@koperasi.com" type="email" inputMode="email" autoComplete="email" />
                <div>
                  <label className="field-label">{t("ciRole")}</label>
                  <select className="field-input" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">{t("ciPickRole")}</option>
                    {eventConfig.roleOptions.map((r) => (
                      <option key={r.value} value={r.value}>{pick(r.label)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button onClick={submit} disabled={!canSubmit || submitting} className="btn-gold mt-5 w-full">
                {submitting ? pick(c.ctaBusy) : pick(c.cta)}
                {!submitting && <Icon name="arrowRight" className="h-5 w-5" />}
              </button>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {c.benefits.map((b) => (
            <div key={b.icon} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700"><Icon name={b.icon} className="h-5 w-5" /></span>
              <div>
                <div className="text-sm font-bold text-navy-900">{pick(b.title)}</div>
                <div className="text-xs text-navy-500">{pick(b.desc)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function Success({ ref_, returning, next, onContinue }: { ref_: string; returning: boolean; next: string | null; onContinue: () => void }) {
  const { t, pick } = useI18n();
  const c = COPY;
  return (
    <div className="card p-7 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Icon name="checkCircle" className="h-9 w-9" />
      </div>
      <h2 className="mt-4 font-display text-2xl font-extrabold text-navy-900">
        {returning ? pick(c.successReturn) : pick(c.successNew)}
      </h2>
      <p className="mt-2 text-sm text-navy-500">{pick(c.successDesc)}</p>
      <div className="mt-5 inline-flex flex-col items-center rounded-2xl bg-sand-100 px-6 py-4">
        <span className="text-[11px] font-bold uppercase tracking-wide text-navy-400">{t("ciYourRef")}</span>
        <span className="font-display text-2xl font-extrabold text-navy-900">{ref_}</span>
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <button onClick={onContinue} className="btn-gold">
          {next ? t("atMarkCta") : t("ldOpenHub")} <Icon name="arrowRight" className="h-5 w-5" />
        </button>
        <Link to={next ? "/prompt-hub" : "/readiness"} className="btn-outline">
          {next ? t("ldOpenHub") : t("rdUnsureCta")}
        </Link>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", inputMode, autoComplete, tidy,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; inputMode?: "text" | "numeric" | "tel" | "email"; autoComplete?: string;
  /** Capitalise the value when the field loses focus. */
  tidy?: boolean;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        value={value}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        // Tidied on blur rather than on every keystroke: capitalising mid-word
        // fights the person typing, and it means they see what will be printed
        // while they can still correct it, instead of meeting it on the
        // certificate. The store applies the same rule on save regardless.
        onBlur={tidy ? (e) => onChange(toProperName(e.target.value)) : undefined}
      />
    </div>
  );
}
