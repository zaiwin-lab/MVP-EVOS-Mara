import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n } from "../context/I18nContext";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";

export default function Login() {
  const navigate = useNavigate();
  const { setParticipantId, refresh } = useParticipant();
  const { t } = useI18n();

  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const p = await store.login(mobile, email);
      if (!p) {
        setError(t("lgWrong"));
        setSubmitting(false);
        return;
      }
      setParticipantId(p.id);
      await refresh();
      navigate("/my");
    } catch (e) {
      console.error(e);
      setError(t("commonError"));
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className={`${SITE_WRAP} py-12`}>
        <div className="mx-auto max-w-md">
          <div className="card p-6 sm:p-7">
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-300"><Icon name="lock" className="h-6 w-6" /></span>
              <h1 className="mt-4 font-display text-2xl font-extrabold text-navy-900">{t("welcomeBack")}</h1>
              <p className="mt-2 text-sm text-navy-500">{t("lgIntro")}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="field-label">{t("mobileNumber")}</label>
                <input className="field-input" value={mobile} inputMode="tel" autoComplete="tel" placeholder="cth. 012-345 6789" onChange={(e) => setMobile(e.target.value)} />
              </div>
              <div>
                <label className="field-label">{t("emailLabel")}</label>
                <input className="field-input" value={email} type="email" inputMode="email" autoComplete="email" placeholder="anda@koperasi.com" onChange={(e) => setEmail(e.target.value)} />
              </div>
              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <button onClick={submit} disabled={submitting} className="btn-gold w-full">
                {submitting ? t("lgSubmitting") : t("lgSubmit")} {!submitting && <Icon name="arrowRight" className="h-5 w-5" />}
              </button>
            </div>

            <p className="mt-5 text-center text-sm text-navy-500">
              {t("notRegistered")} <Link to="/check-in" className="font-bold text-navy-800 underline">{t("registerHere")}</Link>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
