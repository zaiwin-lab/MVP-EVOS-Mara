import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BrandFooter } from "../components/Brand";
import { Icon } from "../components/Icon";
import { useParticipant } from "../context/ParticipantContext";
import { eventConfig } from "../config/eventConfig";

interface StepCard {
  to: string;
  icon: string;
  title: string;
  subtitle: string;
  done: boolean;
  locked?: boolean;
}

export default function Journey() {
  const { record, loading, participantId, signOut } = useParticipant();
  const navigate = useNavigate();

  if (!loading && !participantId) {
    return (
      <AppShell header title="My Journey">
        <EmptyState onCheckIn={() => navigate("/check-in")} />
      </AppShell>
    );
  }

  const p = record?.participant;
  const hasProfile = Boolean(record?.profile);
  const hasAssessment = Boolean(record?.result);
  const hasPlan = Boolean(record?.actionPlan);

  const steps: StepCard[] = [
    {
      to: "/profile",
      icon: "clipboard",
      title: "Contractor Profile",
      subtitle: hasProfile ? "Completed — tap to review" : "Tell us about your company",
      done: hasProfile,
    },
    {
      to: "/assessment",
      icon: "chart",
      title: "Readiness Assessment",
      subtitle: hasAssessment ? "Completed — view your result" : "20 questions · 5–8 minutes",
      done: hasAssessment,
    },
    {
      to: "/result",
      icon: "target",
      title: "My Readiness Result",
      subtitle: hasAssessment ? "Your score & recommendations" : "Complete the assessment first",
      done: false,
      locked: !hasAssessment,
    },
    {
      to: "/action-plan",
      icon: "spark",
      title: "90-Day Action Plan",
      subtitle: hasPlan ? "Completed — tap to review" : "Plan your next three months",
      done: hasPlan,
    },
    {
      to: "/reflection",
      icon: "book",
      title: "Daily Reflection",
      subtitle: "Capture your key takeaways",
      done: false,
    },
    {
      to: "/resources",
      icon: "download",
      title: "Programme Resources",
      subtitle: "Templates, checklists & tools",
      done: false,
    },
  ];

  const doneCount = [hasProfile, hasAssessment, hasPlan].filter(Boolean).length;
  const pct = Math.round((doneCount / 3) * 100);

  return (
    <AppShell>
      {/* Personalised header */}
      <section className="bg-navy-950 px-5 pb-8 pt-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <span className="section-eyebrow text-gold-300">Welcome back</span>
            <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight">
              {p?.fullName ?? "Participant"}
            </h1>
            <p className="mt-0.5 text-sm text-navy-200">{p?.companyName}</p>
          </div>
          <button
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/70"
          >
            Exit
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-navy-100">Core journey progress</span>
            <span className="text-gold-300">{pct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gold-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {p?.ref && (
            <div className="mt-3 text-[11px] text-navy-300">
              Reference: <span className="font-bold text-white">{p.ref}</span>
            </div>
          )}
        </div>
      </section>

      {/* Step cards */}
      <section className="space-y-3 px-5 py-6">
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
              <div className="min-w-0 flex-1">
                <div className="font-bold text-navy-900">{s.title}</div>
                <div className="truncate text-xs text-navy-400">{s.subtitle}</div>
              </div>
              {s.done ? (
                <span className="chip shrink-0 bg-green-50 text-green-700">Done</span>
              ) : s.locked ? (
                <Icon name="lock" className="h-4 w-4 shrink-0 text-navy-300" />
              ) : (
                <Icon name="arrowRight" className="h-5 w-5 shrink-0 text-navy-300" />
              )}
            </>
          );

          return s.locked ? (
            <div
              key={s.to}
              className="card flex items-center gap-4 p-4 opacity-60"
              aria-disabled
            >
              {inner}
            </div>
          ) : (
            <Link
              key={s.to}
              to={s.to}
              className="card flex items-center gap-4 p-4 transition hover:shadow-lift"
            >
              {inner}
            </Link>
          );
        })}
      </section>

      <div className="px-5 pb-2 text-center text-xs text-navy-400">
        {eventConfig.eventName}
      </div>
      <BrandFooter />
    </AppShell>
  );
}

function EmptyState({ onCheckIn }: { onCheckIn: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-50 text-navy-500">
        <Icon name="qr" className="h-8 w-8" />
      </div>
      <h2 className="mt-5 font-display text-xl font-extrabold text-navy-900">
        Check in to begin
      </h2>
      <p className="mt-2 max-w-xs text-sm text-navy-500">
        Your participant journey starts with a quick check-in at the registration
        area.
      </p>
      <button onClick={onCheckIn} className="btn-gold mt-6 w-full">
        Check In Now
        <Icon name="arrowRight" className="h-5 w-5" />
      </button>
    </div>
  );
}
