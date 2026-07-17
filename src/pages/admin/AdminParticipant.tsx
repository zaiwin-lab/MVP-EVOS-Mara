import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { store } from "../../data/store";
import type { ParticipantRecord } from "../../data/types";
import { INDICATORS } from "../../content/assessment";
import { Icon } from "../../components/Icon";
import { RadarChart } from "../../components/RadarChart";
import { ScoreRing } from "../../components/ScoreRing";

const AUTH_KEY = "attendify:adminAuthed";

export default function AdminParticipant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<ParticipantRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfBusy, setPdfBusy] = useState(false);

  const handleDownloadPdf = async () => {
    if (pdfBusy || !record) return;
    setPdfBusy(true);
    try {
      const { generateSingleParticipantPdf } = await import("../../lib/pdf");
      await generateSingleParticipantPdf(record);
    } catch (err) {
      console.error("PDF export failed", err);
      alert("Sorry, the PDF export failed. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) !== "1") {
      navigate("/admin");
      return;
    }
    if (!id) return;
    store.getRecord(id).then((r) => {
      setRecord(r);
      setLoading(false);
    });
  }, [id, navigate]);

  if (loading) {
    return <div className="min-h-dvh bg-sand-50 py-20 text-center text-sm text-navy-400">Loading…</div>;
  }
  if (!record) {
    return (
      <div className="min-h-dvh bg-sand-50 py-20 text-center">
        <p className="text-sm text-navy-500">Participant not found.</p>
        <Link to="/admin" className="btn-outline mt-4 inline-flex">Back to dashboard</Link>
      </div>
    );
  }

  const { participant: p, profile, result, actionPlan, reflections } = record;

  return (
    <div className="min-h-dvh bg-sand-50">
      <header className="sticky top-0 z-20 border-b border-navy-100 bg-navy-950 text-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            to="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
          >
            <Icon name="arrowLeft" />
          </Link>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">{p.fullName}</div>
            <div className="truncate text-[11px] text-navy-300">{p.companyName}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={pdfBusy}
              className="btn-gold px-3 py-1.5 text-xs disabled:opacity-50"
              title="Download this participant's full data as PDF"
            >
              <Icon name="download" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{pdfBusy ? "Preparing…" : "Download PDF"}</span>
            </button>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">
              {p.ref}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-5 px-4 py-6">
        {/* Participant info */}
        <Panel title="Participant Information" icon="users">
          <DL
            rows={[
              ["Full Name", p.fullName],
              ["Mobile", p.mobile],
              ["Email", p.email ?? "—"],
              ["Position", p.position ?? "—"],
              ["Age Range", p.ageRange ?? "—"],
              ["District", p.district ?? "—"],
              ["Checked In", new Date(p.checkedInAt).toLocaleString("en-MY")],
            ]}
          />
        </Panel>

        {/* Company profile */}
        {profile ? (
          <Panel title="Company Profile" icon="clipboard">
            <DL
              rows={[
                ["Registration No.", profile.registrationNumber || "—"],
                ["Established", profile.establishedYear || "—"],
                ["CIDB Grade", profile.cidbGrade || "—"],
                ["Category", profile.category || "—"],
                ["Employees", profile.employeeCount || "—"],
                ["Service Area", profile.mainServiceArea || "—"],
                ["Experience (yrs)", profile.experienceYears || "—"],
                ["Completed Projects", profile.completedProjects || "—"],
                ["Digital Status", profile.digitalStatus || "—"],
              ]}
            />
            {profile.capabilities.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-wide text-navy-400">Capabilities</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.capabilities.map((c) => (
                    <span key={c} className="chip bg-navy-50 text-navy-700">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {Object.values(profile.digitalLinks).some(Boolean) && (
              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-wide text-navy-400">Digital Links</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {Object.entries(profile.digitalLinks)
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <span key={k} className="chip bg-sand-100 text-navy-700">
                        {k}: {v}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </Panel>
        ) : (
          <EmptyPanel label="Company profile not completed yet." />
        )}

        {/* Assessment result */}
        {result ? (
          <Panel title="Readiness Result" icon="chart">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center">
                <ScoreRing score={result.totalScore} size={140} />
                <span className="mt-2 chip bg-navy-800 text-white">{result.readinessCategory}</span>
              </div>
              <div className="w-full flex-1">
                <RadarChart
                  axes={INDICATORS.map((i) => ({
                    label: i.radarLabel,
                    value: result.indicatorScores[i.id] ?? 0,
                    max: 20,
                  }))}
                  size={220}
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {INDICATORS.map((ind) => (
                <div key={ind.id} className="flex items-center justify-between rounded-lg bg-sand-50 px-3 py-2 text-sm">
                  <span className="text-navy-600">{ind.title}</span>
                  <span className="font-bold text-navy-900">{result.indicatorScores[ind.id]}/20</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-sand-50 p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-navy-400">Summary</div>
              <p className="mt-1 text-sm text-navy-700">{result.summary}</p>
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold uppercase tracking-wide text-navy-400">Recommended Actions</div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-navy-700">
                {result.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ol>
            </div>
          </Panel>
        ) : (
          <EmptyPanel label="Assessment not completed yet." />
        )}

        {/* Action plan */}
        {actionPlan && (
          <Panel title="90-Day Action Plan" icon="target">
            <DL
              rows={[
                ["Priority", actionPlan.priority || "—"],
                ["30 Days", `${actionPlan.day30Action || "—"}${actionPlan.day30Date ? ` (${actionPlan.day30Date})` : ""}`],
                ["60 Days", `${actionPlan.day60Action || "—"}${actionPlan.day60Date ? ` (${actionPlan.day60Date})` : ""}`],
                ["90 Days", `${actionPlan.day90Action || "—"}${actionPlan.day90Date ? ` (${actionPlan.day90Date})` : ""}`],
                ["Business Goal", actionPlan.businessGoal || "—"],
                ["Committed", actionPlan.commitment ? "Yes" : "No"],
              ]}
            />
          </Panel>
        )}

        {/* Reflections */}
        {reflections.length > 0 && (
          <Panel title="Daily Reflections" icon="book">
            <div className="space-y-4">
              {reflections
                .sort((a, b) => a.dayNumber - b.dayNumber)
                .map((r) => (
                  <div key={r.dayNumber}>
                    <div className="text-xs font-bold uppercase tracking-wide text-gold-600">
                      Day {r.dayNumber}
                    </div>
                    <ul className="mt-1 space-y-1 text-sm text-navy-700">
                      {Object.values(r.responses)
                        .filter(Boolean)
                        .map((v, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-navy-300">•</span>
                            {v}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          </Panel>
        )}
      </main>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <h2 className="font-display text-base font-extrabold text-navy-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-navy-200 py-8 text-center text-sm text-navy-400">
      {label}
    </div>
  );
}

function DL({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-navy-50 py-1.5">
          <dt className="text-xs font-semibold text-navy-400">{k}</dt>
          <dd className="text-right text-sm font-medium text-navy-800">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
