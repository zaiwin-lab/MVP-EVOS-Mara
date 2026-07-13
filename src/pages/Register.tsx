import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { LogoMark } from "../components/Brand";
import { Icon } from "../components/Icon";
import { eventConfig } from "../config/eventConfig";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n } from "../context/I18nContext";
import { PENDING_ATTEND_KEY } from "./Attend";

function nextRoute(): string {
  const pending = localStorage.getItem(PENDING_ATTEND_KEY);
  if (pending) {
    localStorage.removeItem(PENDING_ATTEND_KEY);
    return `/attend/${pending}`;
  }
  return "/my";
}

export default function Register() {
  const navigate = useNavigate();
  const { setParticipantId, refresh } = useParticipant();
  const { t } = useI18n();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit =
    fullName.trim().length > 1 && mobile.trim().length >= 7 && emailOk;

  async function submit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const existing = await store.findByMobile(mobile);
      if (existing) {
        setError(t("mobileExists"));
        setSubmitting(false);
        return;
      }
      const p = await store.createParticipant({ fullName, mobile, email, companyName });
      setParticipantId(p.id);
      await refresh();
      navigate(nextRoute());
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <AppShell
      header
      title={t("register")}
      onBack={() => navigate("/")}
      footer={
        <button onClick={submit} disabled={!canSubmit || submitting} className="btn-gold w-full">
          {submitting ? "…" : t("createMyAccount")}
          {!submitting && <Icon name="arrowRight" className="h-5 w-5" />}
        </button>
      }
    >
      <section className="bg-navy-950 px-5 pb-6 pt-6 text-center text-white">
        <LogoMark className="mx-auto h-12 w-12" />
        <h1 className="mt-4 font-display text-2xl font-extrabold">{t("createAccount")}</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-navy-100">{t("registerIntro")}</p>
        <div className="mt-3 text-xs text-navy-300">
          {eventConfig.eventName} · {eventConfig.venue}
        </div>
      </section>

      <div className="space-y-4 px-5 py-6">
        <Field label={t("fullName")} value={fullName} onChange={setFullName} placeholder="e.g. Ahmad Faizal Bin Osman" autoComplete="name" />
        <Field label={t("mobileNumber")} value={mobile} onChange={setMobile} placeholder="e.g. 0138765432" inputMode="tel" autoComplete="tel" />
        <Field label={t("emailLabel")} value={email} onChange={setEmail} type="email" placeholder="you@company.com" autoComplete="email" />
        <Field label={t("companyOptional")} value={companyName} onChange={setCompanyName} placeholder="e.g. Faizal Bina Sdn. Bhd." autoComplete="organization" />

        <p className="text-xs text-navy-400">{t("emailPhoneNote")}</p>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <p className="pt-2 text-center text-sm text-navy-500">
          {t("alreadyRegistered")}{" "}
          <Link to="/login" className="font-bold text-navy-800 underline">
            {t("logIn")}
          </Link>
        </p>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoComplete?: string;
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
      />
    </div>
  );
}
