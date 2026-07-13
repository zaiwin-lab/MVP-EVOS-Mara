import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";

const DAY_PROMPTS: Record<number, { key: string; label: string }[]> = {
  1: [
    { key: "lesson", label: "The most important lesson I learned today" },
    { key: "improve", label: "One area my company should improve" },
    { key: "action", label: "One action I will take" },
  ],
  2: [
    { key: "opportunity", label: "One business opportunity I am now better prepared for" },
    { key: "tender", label: "One tender or proposal improvement I will make" },
    { key: "question", label: "One question I still have" },
  ],
  3: [
    { key: "aiTool", label: "One AI tool I will begin using" },
    { key: "digitise", label: "One process I will digitise" },
    { key: "commitment", label: "My most important 90-day commitment" },
  ],
};

export default function Reflection() {
  const navigate = useNavigate();
  const { participantId, record, loading, refresh } = useParticipant();
  const [day, setDay] = useState<1 | 2 | 3>(1);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = record?.reflections.find((r) => r.dayNumber === day);
    setResponses(existing?.responses ?? {});
    setSaved(false);
  }, [day, record]);

  if (!loading && !participantId) {
    return (
      <AppShell header title="Reflection">
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

  async function save() {
    if (!participantId) return;
    setSaving(true);
    try {
      await store.saveReflection({
        participantId,
        dayNumber: day,
        responses,
        submittedAt: new Date().toISOString(),
      });
      await refresh();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      header
      title="Daily Reflection"
      onBack={() => navigate("/journey")}
      footer={
        <button onClick={save} disabled={saving} className="btn-gold w-full">
          {saving ? "Saving…" : `Save Day ${day} Reflection`}
          {!saving && <Icon name="check" className="h-5 w-5" />}
        </button>
      }
    >
      {/* day tabs */}
      <div className="sticky top-[57px] z-10 bg-white px-5 py-3">
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-navy-50 p-1">
          {[1, 2, 3].map((d) => {
            const done = record?.reflections.some((r) => r.dayNumber === d);
            return (
              <button
                key={d}
                onClick={() => setDay(d as 1 | 2 | 3)}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold transition ${
                  day === d ? "bg-white text-navy-900 shadow-sm" : "text-navy-500"
                }`}
              >
                Day {d}
                {done && <Icon name="check" className="h-3.5 w-3.5 text-green-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {saved && (
        <div className="mx-5 mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          <Icon name="checkCircle" className="h-5 w-5" />
          Day {day} reflection saved.
        </div>
      )}

      <div className="space-y-5 px-5 py-5">
        {DAY_PROMPTS[day].map((p) => (
          <div key={p.key}>
            <label className="field-label">{p.label}</label>
            <textarea
              className="field-input min-h-[90px]"
              value={responses[p.key] ?? ""}
              onChange={(e) => {
                setResponses((r) => ({ ...r, [p.key]: e.target.value }));
                setSaved(false);
              }}
              placeholder="Write your reflection…"
            />
          </div>
        ))}
      </div>
    </AppShell>
  );
}
