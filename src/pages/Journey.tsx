import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BrandFooter } from "../components/Brand";
import { Icon } from "../components/Icon";
import { ScoreRing } from "../components/ScoreRing";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n } from "../context/I18nContext";
import { eventConfig } from "../config/eventConfig";

export default function Journey() {
  const { record, loading, participantId, signOut } = useParticipant();
  const navigate = useNavigate();
  const { t } = useI18n();

  if (!loading && !participantId) {
    return (
      <AppShell header title={t("myAttendify")}>
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <Icon name="lock" className="h-10 w-10 text-navy-300" />
          <h2 className="mt-4 font-display text-lg font-extrabold text-navy-900">
            {t("myAttendify")}
          </h2>
          <p className="mt-2 max-w-xs text-sm text-navy-500">{t("loginIntro")}</p>
          <button onClick={() => navigate("/login")} className="btn-gold mt-6 w-full">
            {t("logIn")}
            <Icon name="arrowRight" className="h-5 w-5" />
          </button>
          <button onClick={() => navigate("/register")} className="btn-outline mt-3 w-full">
            {t("registerHere")}
          </button>
        </div>
      </AppShell>
    );
  }

  const p = record?.participant;
  const hasProfile = Boolean(record?.profile);
  const hasAssessment = Boolean(record?.result);
  const hasPlan = Boolean(record?.actionPlan);
  const attendedSessions = new Set((record?.attendance ?? []).map((a) => a.session));

  const steps = [
    { to: "/profile", icon: "clipboard", label: t("myProfile"), done: hasProfile },
    { to: "/assessment", icon: "chart", label: t("assessment"), done: hasAssessment },
    { to: "/result", icon: "target", label: t("results"), done: hasAssessment, locked: !hasAssessment },
    { to: "/action-plan", icon: "spark", label: t("actionPlan"), done: hasPlan },
    { to: "/reflection", icon: "book", label: t("reflection"), done: false },
    { to: "/resources", icon: "download", label: t("resources"), done: false },
  ];

  // "Continue Journey" points at the first incomplete core step.
  const nextStep = !hasProfile
    ? "/profile"
    : !hasAssessment
      ? "/assessment"
      : !hasPlan
        ? "/action-plan"
        : "/result";

  return (
    <AppShell
      footer={
        <button onClick={() => navigate(nextStep)} className="btn-gold w-full">
          {t("continueJourney")}
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>
      }
    >
      {/* Welcome header */}
      <section className="bg-navy-950 px-5 pb-8 pt-6 text-white">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <span className="section-eyebrow text-gold-300">{t("welcomeBack")}</span>
            <h1 className="mt-1 truncate font-display text-2xl font-extrabold leading-tight">
              {p?.fullName ?? ""}
            </h1>
            {p?.companyName && <p className="mt-0.5 truncate text-sm text-navy-200">{p.companyName}</p>}
          </div>
          <button
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/70"
          >
            {t("exit")}
          </button>
        </div>

        {/* Readiness score */}
        {record?.result ? (
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <ScoreRing score={record.result.totalScore} size={92} />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gold-300">
                {t("overallReadiness")}
              </div>
              <div className="mt-1 font-display text-lg font-extrabold">
                {record.result.readinessCategory}
              </div>
              <Link to="/result" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-navy-100 hover:text-white">
                {t("results")} <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <Link
            to="/assessment"
            className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gold-300">
                {t("overallReadiness")}
              </div>
              <div className="mt-1 text-sm text-navy-100">{t("assessment")} →</div>
            </div>
            <Icon name="chart" className="h-8 w-8 text-gold-300" />
          </Link>
        )}
      </section>

      {/* Attendance */}
      <section className="px-5 pt-6">
        <h2 className="section-eyebrow">{t("myAttendance")}</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {eventConfig.attendanceSessions.map((s) => {
            const present = attendedSessions.has(s.id);
            return (
              <div
                key={s.id}
                className={`rounded-2xl border p-3 text-center ${
                  present ? "border-green-200 bg-green-50" : "border-navy-100 bg-white"
                }`}
              >
                <div
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${
                    present ? "bg-green-500 text-white" : "bg-navy-100 text-navy-400"
                  }`}
                >
                  <Icon name={present ? "check" : "clock"} className="h-5 w-5" />
                </div>
                <div className="mt-2 text-sm font-bold text-navy-900">{s.label}</div>
                <div className="text-[10px] text-navy-400">{s.date.replace(" 2026", "")}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Journey checklist */}
      <section className="space-y-3 px-5 py-6">
        <h2 className="section-eyebrow">{t("yourJourney")}</h2>
        {steps.map((s) => {
          const inner = (
            <>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  s.done
                    ? "bg-green-50 text-green-600"
                    : s.locked
                      ? "bg-navy-50 text-navy-300"
                      : "bg-navy-800 text-white"
                }`}
              >
                <Icon name={s.done ? "check" : s.icon} className="h-5 w-5" />
              </div>
              <span className="flex-1 font-bold text-navy-900">{s.label}</span>
              {s.done ? (
                <Icon name="checkCircle" className="h-5 w-5 shrink-0 text-green-500" />
              ) : s.locked ? (
                <Icon name="lock" className="h-4 w-4 shrink-0 text-navy-300" />
              ) : (
                <Icon name="arrowRight" className="h-5 w-5 shrink-0 text-navy-300" />
              )}
            </>
          );
          return s.locked ? (
            <div key={s.to} className="card flex items-center gap-4 p-4 opacity-60">{inner}</div>
          ) : (
            <Link key={s.to} to={s.to} className="card flex items-center gap-4 p-4 transition hover:shadow-lift">
              {inner}
            </Link>
          );
        })}
      </section>

      <BrandFooter />
    </AppShell>
  );
}
