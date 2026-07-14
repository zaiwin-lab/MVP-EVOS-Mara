import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { eventConfig } from "../config/eventConfig";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n } from "../context/I18nContext";

export const PENDING_ATTEND_KEY = "attendify:pendingAttend";

type State = "loading" | "done" | "already" | "invalid";

export default function Attend() {
  const { session = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { participantId, record, loading, refresh } = useParticipant();
  const { t } = useI18n();
  const [state, setState] = useState<State>("loading");

  // Preset day sessions carry weekday/date; custom sessions (from the admin
  // QR generator) carry their label in the `n` query param or the slug id.
  const preset = eventConfig.attendanceSessions.find((s) => s.id === session);
  const sessionMeta = preset
    ? { label: preset.label, weekday: preset.weekday, date: preset.date }
    : session
      ? {
          label: searchParams.get("n") || deslugify(session),
          weekday: "",
          date: "",
        }
      : null;

  useEffect(() => {
    if (loading) return;

    if (!sessionMeta) {
      setState("invalid");
      return;
    }

    // Not logged in → remember this session and send to login.
    if (!participantId) {
      localStorage.setItem(PENDING_ATTEND_KEY, session);
      navigate("/login", { replace: true });
      return;
    }

    let alive = true;
    store.markAttendance(participantId, session).then(async (marked) => {
      if (!alive) return;
      await refresh();
      setState(marked ? "done" : "already");
      localStorage.removeItem(PENDING_ATTEND_KEY);
    });
    return () => {
      alive = false;
    };
  }, [loading, participantId, session, sessionMeta, navigate, refresh]);

  if (state === "invalid") {
    return (
      <AppShell header title={t("myAttendance")} onBack={() => navigate("/my")}>
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <Icon name="qr" className="h-10 w-10 text-navy-300" />
          <p className="mt-3 text-sm text-navy-500">Unknown attendance session.</p>
          <button onClick={() => navigate("/my")} className="btn-outline mt-5">
            {t("myAttendify")}
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      footer={
        <button onClick={() => navigate("/my")} className="btn-primary w-full">
          {t("continueJourney")}
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        {state === "loading" ? (
          <p className="text-sm text-navy-400">…</p>
        ) : (
          <div className="animate-scale-in flex flex-col items-center">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full ${
                state === "done" ? "bg-green-50 text-green-600" : "bg-gold-50 text-gold-600"
              }`}
            >
              <Icon name="checkCircle" className="h-12 w-12" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-extrabold text-navy-900">
              {state === "done" ? t("attendanceMarked") : t("alreadyMarked")}
            </h1>
            {sessionMeta && (
              <div className="mt-4 w-full max-w-xs rounded-2xl border border-navy-100 bg-white p-4 text-left shadow-card">
                <Row
                  label={t("myAttendance")}
                  value={
                    sessionMeta.weekday
                      ? `${sessionMeta.label} · ${sessionMeta.weekday}`
                      : sessionMeta.label
                  }
                />
                {sessionMeta.date && <Row label={t("datesLabel")} value={sessionMeta.date} />}
                <Row label={t("venueLabel")} value={eventConfig.venue} />
                <Row label={t("fullName")} value={record?.participant.fullName ?? ""} />
                <Row
                  label="Time"
                  value={new Date().toLocaleTimeString("en-MY", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

// "day-1-morning" → "Day 1 Morning" (fallback label for custom sessions).
function deslugify(id: string): string {
  return id
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-navy-50 py-2 last:border-0">
      <span className="text-xs font-semibold text-navy-400">{label}</span>
      <span className="text-right text-sm font-semibold text-navy-900">{value}</span>
    </div>
  );
}
