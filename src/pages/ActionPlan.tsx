import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";
import type { ActionPlan as ActionPlanType } from "../data/types";

export default function ActionPlan() {
  const navigate = useNavigate();
  const { participantId, record, loading, refresh } = useParticipant();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [plan, setPlan] = useState<ActionPlanType>({
    participantId: "",
    priority: "",
    day30Action: "",
    day30Date: "",
    day60Action: "",
    day60Date: "",
    day90Action: "",
    day90Date: "",
    businessGoal: "",
    commitment: false,
    submittedAt: "",
  });

  useEffect(() => {
    if (record?.actionPlan) setPlan({ ...record.actionPlan });
  }, [record]);

  const set = <K extends keyof ActionPlanType>(k: K, v: ActionPlanType[K]) =>
    setPlan((p) => ({ ...p, [k]: v }));

  if (!loading && !participantId) {
    return (
      <AppShell header title="Action Plan">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <Icon name="lock" className="h-10 w-10 text-navy-300" />
          <h2 className="mt-4 font-display text-lg font-extrabold text-navy-900">
            Please check in first
          </h2>
          <button onClick={() => navigate("/check-in")} className="btn-gold mt-6 w-full">
            Check In Now
          </button>
        </div>
      </AppShell>
    );
  }

  const canSave = plan.priority.trim() && plan.commitment;

  async function save() {
    if (!participantId || !canSave) return;
    setSaving(true);
    try {
      await store.saveActionPlan({
        ...plan,
        participantId,
        submittedAt: new Date().toISOString(),
      });
      await refresh();
      setSaved(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      header
      title="90-Day Action Plan"
      onBack={() => navigate("/journey")}
      footer={
        <button onClick={save} disabled={!canSave || saving} className="btn-gold w-full">
          {saving ? "Saving…" : saved ? "Update Action Plan" : "Save Action Plan"}
          {!saving && <Icon name="check" className="h-5 w-5" />}
        </button>
      }
    >
      <section className="bg-navy-950 px-5 pb-6 pt-6 text-white">
        <span className="section-eyebrow text-gold-300">Your Commitment</span>
        <h1 className="mt-1 font-display text-2xl font-extrabold">
          Turn insight into action
        </h1>
        <p className="mt-2 text-sm text-navy-100">
          Three focused actions over 90 days. Keep it realistic and specific.
        </p>
      </section>

      {saved && (
        <div className="mx-5 mt-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          <Icon name="checkCircle" className="h-5 w-5" />
          Your action plan has been saved.
        </div>
      )}

      <div className="space-y-5 px-5 py-6">
        <div>
          <label className="field-label">My Main Improvement Priority</label>
          <textarea
            className="field-input min-h-[80px]"
            value={plan.priority}
            onChange={(e) => set("priority", e.target.value)}
            placeholder="e.g. Strengthen our digital presence and proposal readiness"
          />
        </div>

        <PlanStep
          badge="30"
          title="Within 30 Days"
          action={plan.day30Action}
          date={plan.day30Date}
          onAction={(v) => set("day30Action", v)}
          onDate={(v) => set("day30Date", v)}
        />
        <PlanStep
          badge="60"
          title="Within 60 Days"
          action={plan.day60Action}
          date={plan.day60Date}
          onAction={(v) => set("day60Action", v)}
          onDate={(v) => set("day60Date", v)}
        />
        <PlanStep
          badge="90"
          title="Within 90 Days"
          action={plan.day90Action}
          date={plan.day90Date}
          onAction={(v) => set("day90Action", v)}
          onDate={(v) => set("day90Date", v)}
        />

        <div>
          <label className="field-label">My Business Goal</label>
          <textarea
            className="field-input min-h-[80px]"
            value={plan.businessGoal}
            onChange={(e) => set("businessGoal", e.target.value)}
            placeholder="e.g. Grow into larger civil projects and secure preferred-vendor status"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-navy-100 bg-sand-50 p-4">
          <input
            type="checkbox"
            checked={plan.commitment}
            onChange={(e) => set("commitment", e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-gold-500"
          />
          <span className="text-sm font-medium text-navy-700">
            I commit to taking practical steps to strengthen my business
            professionalism, competitiveness, and future readiness.
          </span>
        </label>
      </div>
    </AppShell>
  );
}

function PlanStep({
  badge,
  title,
  action,
  date,
  onAction,
  onDate,
}: {
  badge: string;
  title: string;
  action: string;
  date: string;
  onAction: (v: string) => void;
  onDate: (v: string) => void;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-xs font-extrabold text-gold-300">
          {badge}
        </span>
        <span className="font-bold text-navy-900">{title}</span>
      </div>
      <div className="mt-3 space-y-3">
        <div>
          <label className="field-label text-xs">Action</label>
          <input
            className="field-input"
            value={action}
            onChange={(e) => onAction(e.target.value)}
            placeholder="What will you do?"
          />
        </div>
        <div>
          <label className="field-label text-xs">Target Completion Date</label>
          <input
            type="date"
            className="field-input"
            value={date}
            onChange={(e) => onDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
