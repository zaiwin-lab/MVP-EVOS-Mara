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

/** After auth, resume a pending attendance scan if there was one. */
function nextRoute(): string {
  const pending = localStorage.getItem(PENDING_ATTEND_KEY);
  if (pending) {
    localStorage.removeItem(PENDING_ATTEND_KEY);
    return `/attend/${pending}`;
  }
  return "/my";
}

export default function Login() {
  const navigate = useNavigate();
  const { setParticipantId, refresh } = useParticipant();
  const { t } = useI18n();

  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = mobile.trim().length >= 7 && pin.trim().length >= 4;

  async function submit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const p = await store.login(mobile, pin);
      if (!p) {
        setError(t("wrongLogin"));
        setSubmitting(false);
        return;
      }
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
      title={t("myAttendify")}
      onBack={() => navigate("/")}
      footer={
        <button onClick={submit} disabled={!canSubmit || submitting} className="btn-gold w-full">
          {submitting ? "…" : t("logIn")}
          {!submitting && <Icon name="arrowRight" className="h-5 w-5" />}
        </button>
      }
    >
      <section className="bg-navy-950 px-5 pb-6 pt-6 text-center text-white">
        <LogoMark className="mx-auto h-12 w-12" />
        <h1 className="mt-4 font-display text-2xl font-extrabold">{t("welcomeBack")}</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-navy-100">{t("loginIntro")}</p>
        <div className="mt-3 text-xs text-navy-300">{eventConfig.eventName}</div>
      </section>

      <div className="space-y-4 px-5 py-6">
        <div>
          <label className="field-label">{t("mobileNumber")}</label>
          <input
            className="field-input"
            value={mobile}
            inputMode="tel"
            autoComplete="tel"
            placeholder="e.g. 0138765432"
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">{t("pinLabel")}</label>
          <input
            className="field-input tracking-[0.4em]"
            value={pin}
            type="password"
            inputMode="numeric"
            placeholder="••••"
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <p className="pt-2 text-center text-sm text-navy-500">
          {t("notRegistered")}{" "}
          <Link to="/register" className="font-bold text-navy-800 underline">
            {t("registerHere")}
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
