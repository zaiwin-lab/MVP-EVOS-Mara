import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { LogoMark } from "../components/Brand";
import { Icon } from "../components/Icon";
import { eventConfig } from "../config/eventConfig";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";
import type { Participant } from "../data/types";

type Step = "welcome" | "form" | "confirmed";

export default function CheckIn() {
  const navigate = useNavigate();
  const { setParticipantId, refresh } = useParticipant();

  const [step, setStep] = useState<Step>("welcome");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);

  const canSubmit =
    fullName.trim().length > 1 &&
    mobile.trim().length >= 7 &&
    companyName.trim().length > 1;

  async function handleCheckIn() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      // Duplicate prevention by mobile number.
      const existing = await store.findByMobile(mobile);
      let p: Participant;
      if (existing) {
        p = existing;
      } else {
        p = await store.createParticipant({ fullName, mobile, companyName });
      }
      setParticipant(p);
      setParticipantId(p.id);
      await refresh();
      setStep("confirmed");
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Screen 1: Welcome ──────────────────────────────────────
  if (step === "welcome") {
    return (
      <AppShell>
        <div className="flex min-h-dvh flex-col bg-navy-950 px-6 py-10 text-white">
          <button
            onClick={() => navigate("/")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
            aria-label="Home"
          >
            <Icon name="arrowLeft" />
          </button>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <LogoMark className="h-16 w-16" />
            <span className="section-eyebrow mt-6 text-gold-300">Welcome to</span>
            <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight">
              {eventConfig.eventName}
            </h1>
            <p className="mt-2 max-w-xs text-sm text-navy-100">
              {eventConfig.eventNameLocal}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-navy-200">
              <Icon name="calendar" className="h-4 w-4 text-gold-300" />
              {eventConfig.dates}
              <span className="text-navy-500">·</span>
              <Icon name="location" className="h-4 w-4 text-gold-300" />
              {eventConfig.venue}
            </div>
          </div>

          <button onClick={() => setStep("form")} className="btn-gold w-full text-base">
            Check In Now · Daftar Kehadiran
            <Icon name="arrowRight" className="h-5 w-5" />
          </button>
          <p className="mt-3 text-center text-xs text-navy-300">
            Takes less than a minute.
          </p>
        </div>
      </AppShell>
    );
  }

  // ── Screen 2: Minimal form ─────────────────────────────────
  if (step === "form") {
    return (
      <AppShell
        header
        title="Check In"
        onBack={() => setStep("welcome")}
        footer={
          <button
            onClick={handleCheckIn}
            disabled={!canSubmit || submitting}
            className="btn-gold w-full"
          >
            {submitting ? "Checking in…" : "Confirm Attendance"}
            {!submitting && <Icon name="arrowRight" className="h-5 w-5" />}
          </button>
        }
      >
        <div className="px-5 py-6">
          <h2 className="font-display text-xl font-extrabold text-navy-900">
            Let’s get you checked in
          </h2>
          <p className="mt-1 text-sm text-navy-500">
            Just three quick details. You can complete your full profile next.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="field-label" htmlFor="fullName">
                Full Name · Nama Penuh
              </label>
              <input
                id="fullName"
                className="field-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ahmad Faizal Bin Osman"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="mobile">
                Mobile Number · No. Telefon
              </label>
              <input
                id="mobile"
                className="field-input"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 0138765432"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="company">
                Company Name · Nama Syarikat
              </label>
              <input
                id="company"
                className="field-input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Faizal Bina Sdn. Bhd."
                autoComplete="organization"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      </AppShell>
    );
  }

  // ── Screen 3: Confirmation ─────────────────────────────────
  return (
    <AppShell
      footer={
        <button onClick={() => navigate("/journey")} className="btn-primary w-full">
          Continue to My Contractor Profile
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>
      }
    >
      <div className="px-5 py-8">
        <div className="animate-scale-in flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
            <Icon name="checkCircle" className="h-12 w-12" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-navy-900">
            Attendance Confirmed
          </h1>
          <p className="mt-1 text-sm text-navy-500">
            Welcome to {eventConfig.eventName}
          </p>
        </div>

        {participant && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-navy-100 shadow-card">
            <div className="bg-navy-900 px-5 py-4 text-white">
              <div className="text-xs font-semibold uppercase tracking-wide text-gold-300">
                Confirmation Reference
              </div>
              <div className="mt-0.5 font-display text-2xl font-extrabold tracking-wider">
                {participant.ref}
              </div>
            </div>
            <dl className="divide-y divide-navy-50 bg-white">
              <Row label="Participant" value={participant.fullName} />
              <Row label="Company" value={participant.companyName} />
              <Row
                label="Check-in Time"
                value={new Date(participant.checkedInAt).toLocaleString("en-MY", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
              <Row label="Programme" value={eventConfig.eventName} />
            </dl>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-navy-400">
          Please keep your confirmation reference. You can now complete your
          contractor profile and readiness assessment.
        </p>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <dt className="text-xs font-semibold text-navy-400">{label}</dt>
      <dd className="text-right text-sm font-semibold text-navy-900">{value}</dd>
    </div>
  );
}
