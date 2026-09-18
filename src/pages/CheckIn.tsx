import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n, type Localized } from "../context/I18nContext";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";

const SESSION = eventConfig.attendanceSessions[0].id;

type Mode = "checkin" | "register";

// ⚠️ Iban here still needs a native-speaker review — see src/content/site.ts.
interface ModeCopy {
  eyebrow: Localized; title: Localized; subtitle: Localized;
  cardHeading: Localized; cardNote: Localized;
  cta: Localized; ctaBusy: Localized;
  successNew: Localized; successReturn: Localized; successDesc: Localized;
  benefits: { icon: string; title: Localized; desc: Localized }[];
}

const COPY: Record<Mode, ModeCopy> = {
  checkin: {
    eyebrow: { bm: "QR Check-In & Registration", en: "QR Check-In & Registration", zh: "二维码签到与注册", iban: "QR Check-In & Daftar" },
    title: { bm: "Daftar Masuk Peserta", en: "Participant Check-In", zh: "参与者签到", iban: "Daftar Masuk Peserta" },
    subtitle: {
      bm: "Daftar masuk dengan mudah untuk pengesahan kehadiran program.",
      en: "Check in quickly so your attendance is recorded.",
      zh: "快速签到，确认您的出席记录。",
      iban: "Daftar masuk enggau mudah kena ngesahka kehadiran program.",
    },
    cardHeading: {
      bm: "Lengkapkan Maklumat Pendaftaran",
      en: "Complete your registration details",
      zh: "填写您的签到资料",
      iban: "Ngaga Penerang Pendaftar",
    },
    cardNote: {
      bm: "Maklumat anda digunakan untuk rekod kehadiran program.",
      en: "Your details are used for the programme attendance record.",
      zh: "您的资料将用于课程出席记录。",
      iban: "Penerang nuan dikena ke rekod kehadiran program.",
    },
    cta: { bm: "Daftar Sekarang", en: "Check In Now", zh: "立即签到", iban: "Daftar Diatu" },
    ctaBusy: { bm: "Mendaftar…", en: "Checking in…", zh: "签到中…", iban: "Benung daftar…" },
    successNew: { bm: "Pendaftaran Berjaya!", en: "You are checked in!", zh: "签到成功！", iban: "Pendaftar Udah Nyadi!" },
    successReturn: { bm: "Selamat Kembali!", en: "Welcome back!", zh: "欢迎回来！", iban: "Selamat Pulai!" },
    successDesc: {
      bm: `Kehadiran anda untuk ${eventConfig.eventName} telah direkodkan.`,
      en: `Your attendance for ${eventConfig.eventNameLocal} has been recorded.`,
      zh: `您在「${eventConfig.eventNameLocal}」的出席已记录。`,
      iban: `Kehadiran nuan ke ${eventConfig.eventName} udah direkod.`,
    },
    benefits: [
      {
        icon: "users",
        title: { bm: "Rekod Kehadiran Lebih Tepat", en: "More accurate attendance records", zh: "更准确的出席记录", iban: "Rekod Kehadiran Ti Betul Agi" },
        desc: { bm: "Sistem merekod kehadiran secara automatik dan masa sebenar.", en: "Attendance is recorded automatically, in real time.", zh: "系统自动实时记录出席情况。", iban: "Sistem ngerekod kehadiran empu enggau maya amat." },
      },
      {
        icon: "spark",
        title: { bm: "Semakan Pantas", en: "Quick to check in", zh: "签到快捷", iban: "Semak Chelap" },
        desc: { bm: "Proses daftar masuk yang cepat dan mudah tanpa borang manual.", en: "A fast, simple check-in with no paper forms.", zh: "签到快速简单，无需手写表格。", iban: "Pengawa daftar masuk ti chelap sereta mudah, nadai borang kertas." },
      },
      {
        icon: "checkCircle",
        title: { bm: "E-Sijil Penyertaan", en: "e-Certificate of participation", zh: "参与电子证书", iban: "E-Sijil Penyerta" },
        desc: { bm: "Rekod kehadiran digunakan untuk penjanaan e-sijil selepas program.", en: "Attendance records are used to issue e-certificates after the programme.", zh: "出席记录将用于课程后签发电子证书。", iban: "Rekod kehadiran dikena ngaga e-sijil udah program." },
      },
    ],
  },
  register: {
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
    successNew: { bm: "Pendaftaran Berjaya!", en: "You are registered!", zh: "报名成功！", iban: "Pendaftar Udah Nyadi!" },
    successReturn: { bm: "Anda Sudah Berdaftar!", en: "You are already registered!", zh: "您已经报名了！", iban: "Nuan Udah Daftar!" },
    successDesc: {
      bm: `Terima kasih! Penyertaan anda untuk ${eventConfig.eventName} telah direkodkan. Simpan rujukan ini dan tunjukkannya semasa hari program untuk daftar masuk (check-in).`,
      en: `Thank you. Your place on ${eventConfig.eventNameLocal} is recorded. Keep this reference and show it on the day to check in.`,
      zh: `谢谢您！您在「${eventConfig.eventNameLocal}」的席位已记录。请保存此参考编号，并在活动当天出示以便签到。`,
      iban: `Terima kasih! Penyerta nuan ke ${eventConfig.eventName} udah direkod. Simpan rujukan tu lalu tunjuk iya ba hari program kena daftar masuk.`,
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
  },
};

export default function CheckIn({ mode = "checkin" }: { mode?: Mode }) {
  const navigate = useNavigate();
  const { setParticipantId, refresh } = useParticipant();
  const { t, pick } = useI18n();
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
      setError(t("commonError"));
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
          <span className="hidden section-eyebrow text-gold-300 sm:inline">{pick(c.eyebrow)}</span>
          <h1 className="font-display text-xl font-extrabold sm:mt-2 sm:text-4xl">{pick(c.title)}</h1>
          <p className="mt-1 hidden text-sm text-navy-200 sm:mt-2 sm:block">{pick(c.subtitle)}</p>
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
                <h2 className="font-display text-lg font-bold text-navy-900">{pick(c.cardHeading)}</h2>
              </div>
              <p className="mt-1 text-xs text-navy-400">{pick(c.cardNote)}</p>

              <div className="mt-5 space-y-4">
                <Field label={t("fullName")} value={fullName} onChange={setFullName} placeholder="cth. Ahmad Firdaus bin Rahman" autoComplete="name" />
                <Field label={t("ciCoopName")} value={coopName} onChange={setCoopName} placeholder="cth. Koperasi Serba Guna Kuching Berhad" autoComplete="organization" />
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
              <p className="mt-3 text-center text-xs text-navy-400">
                {t("alreadyRegistered")} <Link to="/login" className="font-bold text-navy-800 underline">{t("logIn")}</Link>
              </p>
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

function Success({ mode, ref_, returning, onContinue }: { mode: Mode; ref_: string; returning: boolean; onContinue: () => void }) {
  const { t, pick } = useI18n();
  const c = COPY[mode];
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
        <button onClick={onContinue} className="btn-gold">{t("rdToMySpace")} <Icon name="arrowRight" className="h-5 w-5" /></button>
        <Link to="/readiness" className="btn-outline">{t("msStartAssessment")}</Link>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", inputMode, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; inputMode?: "text" | "numeric" | "tel" | "email"; autoComplete?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input className="field-input" value={value} type={type} inputMode={inputMode} autoComplete={autoComplete} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
