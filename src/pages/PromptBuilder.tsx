import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { buildPrompt, getMission } from "../content/promptLibrary";
import type { SavedPrompt } from "../data/types";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { areaAccent } from "../lib/accents";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n, pick as pickLang } from "../context/I18nContext";
import { store } from "../data/store";

export default function PromptBuilder() {
  const { areaId, missionId } = useParams();
  const found = areaId && missionId ? getMission(areaId, missionId) : undefined;
  const { participantId, record, refresh } = useParticipant();
  const { t, pick } = useI18n();

  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [needsAccount, setNeedsAccount] = useState(false);

  const alreadySaved = useMemo(
    () => Boolean(record?.participant.savedPrompts?.some((s) => s.id === missionId)),
    [record, missionId]
  );

  if (!found) return <Navigate to="/prompt-hub" replace />;
  const { area, mission } = found;
  const ac = areaAccent(area.accent);

  const set = (id: string, v: string) => setValues((prev) => ({ ...prev, [id]: v }));

  async function generate() {
    // Browsing the library is open to everyone, but using a prompt is tied to
    // an account so it lands in "Senarai Prompt Saya".
    if (!participantId) {
      setNeedsAccount(true);
      return;
    }
    setNeedsAccount(false);

    const text = buildPrompt(area, mission, values);
    setOutput(text);
    setCopied(false);
    setSaved(false);

    // Durable record, one row per participant per prompt — including the
    // finished text and their answers, so they can read it back later.
    try {
      await store.recordPromptAttempt({
        participantId,
        areaId: area.id,
        missionId: mission.id,
        promptTitle: pickLang(mission.title, "bm"),
        promptText: text,
        inputs: values,
      });
    } catch (err) {
      // Never let tracking block the participant from using their prompt.
      console.warn("Could not record prompt attempt", err);
    }

    // Keep the legacy summary field in step for the admin dashboard.
    const prev = record?.participant.triedPromptIds ?? [];
    if (!prev.includes(mission.id)) {
      await store.updateParticipant(participantId, { triedPromptIds: [...prev, mission.id] });
    }
    await refresh();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — user can select manually */
    }
  }

  function downloadTxt() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-${mission.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function saveToList() {
    if (!participantId || alreadySaved) return;
    const entry: SavedPrompt = {
      id: mission.id,
      areaId: area.id,
      title: pickLang(mission.title, "bm"),
      text: output,
      savedAt: new Date().toISOString(),
    };
    const prev = record?.participant.savedPrompts ?? [];
    await store.updateParticipant(participantId, { savedPrompts: [...prev.filter((s) => s.id !== mission.id), entry] });
    await refresh();
    setSaved(true);
  }

  return (
    <SiteLayout>
      <section className="bg-navy-950 text-white">
        <div className={`${SITE_WRAP} py-8`}>
          <Link to={`/prompt-hub/${area.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-200 hover:text-white">
            <Icon name="arrowLeft" className="h-4 w-4" /> {pick(area.title)}
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <span className={`chip ${ac.soft}`}>{t("pbPromptOfTen").replace("{n}", String(mission.n))}</span>
            <span className="chip bg-white/10 text-white">{pick(area.title)}</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{pick(mission.title)}</h1>
          <p className="mt-1 text-sm text-navy-200">{pick(mission.desc)}</p>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-10`}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Builder form */}
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${ac.badge}`}>
                <Icon name="template" className="h-4 w-4" />
              </span>
              <h2 className="font-display text-base font-bold text-navy-900">{t("pbFillDetails")}</h2>
            </div>
            <p className="mt-1 text-xs text-navy-400">{t("pbFillNote")}</p>

            <div className="mt-5 space-y-4">
              {mission.fields.map((f) => (
                <div key={f.id}>
                  <label className="field-label">
                    {pick(f.label)}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      className="field-input min-h-[90px] resize-y"
                      placeholder={pick(f.placeholder)}
                      value={values[f.id] ?? ""}
                      onChange={(e) => set(f.id, e.target.value)}
                    />
                  ) : f.type === "select" ? (
                    <select className="field-input" value={values[f.id] ?? ""} onChange={(e) => set(f.id, e.target.value)}>
                      <option value="">Pilih…</option>
                      {(f.options ?? []).map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="field-input"
                      placeholder={pick(f.placeholder)}
                      value={values[f.id] ?? ""}
                      onChange={(e) => set(f.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            {mission.disclaimer && (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
                <Icon name="lock" className="mr-1 inline h-3.5 w-3.5" /> {mission.disclaimer}
              </p>
            )}

            <button onClick={generate} className="btn-gold mt-5 w-full">
              <Icon name="spark" className="h-5 w-5" /> {t("pbGenerate")}
            </button>

            {needsAccount && (
              <div className="mt-4 rounded-2xl border border-gold-300 bg-gold-50 p-4">
                <p className="text-sm font-bold text-navy-900">{t("pbLoginTitle")}</p>
                <p className="mt-1 text-xs leading-relaxed text-navy-600">
                  {t("pbLoginBodyA")} <b>{t("myPrompts")}</b> {t("pbLoginBodyB")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/check-in" className="btn-gold px-4 py-2 text-sm">
                    {t("pbLoginCta")}
                  </Link>
                  <Link
                    to={`/prompt-hub/${area.id}`}
                    className="rounded-full border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-600 hover:bg-navy-50"
                  >
                    {t("pbBackToList")}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Result */}
          <div className="card flex flex-col p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-gold-300">
                  <Icon name="document" className="h-4 w-4" />
                </span>
                <h2 className="font-display text-base font-bold text-navy-900">{t("pbResultTitle")}</h2>
              </div>
              {output && <span className="chip bg-emerald-100 text-emerald-700"><Icon name="check" className="h-3 w-3" /> {t("pbReady")}</span>}
            </div>

            {output ? (
              <>
                <pre className="mt-4 flex-1 whitespace-pre-wrap rounded-xl border border-navy-100 bg-sand-50 p-4 text-[13px] leading-relaxed text-navy-800">
                  {output}
                </pre>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <button onClick={copy} className="btn-primary text-sm">
                    <Icon name={copied ? "check" : "clipboard"} className="h-4 w-4" /> {copied ? t("pbCopied") : t("pbCopy")}
                  </button>
                  <button onClick={downloadTxt} className="btn-outline text-sm">
                    <Icon name="download" className="h-4 w-4" /> {t("pbDownload")}
                  </button>
                  {participantId ? (
                    <button onClick={saveToList} disabled={alreadySaved || saved} className="btn-ghost text-sm disabled:opacity-60">
                      <Icon name="book" className="h-4 w-4" /> {alreadySaved || saved ? t("pbSavedState") : t("pbSaveToList")}
                    </button>
                  ) : (
                    <Link to="/check-in" className="btn-ghost text-sm">
                      <Icon name="book" className="h-4 w-4" /> {t("pbRegisterToSave")}
                    </Link>
                  )}
                </div>
                <div className="mt-4 rounded-xl bg-sand-100 px-4 py-3 text-xs text-navy-600">
                  <Icon name="spark" className="mr-1 inline h-3.5 w-3.5 text-gold-600" />
                  {t("pbPasteHint")}
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-300">
                  <Icon name="spark" className="h-7 w-7" />
                </span>
                <p className="mt-4 max-w-xs text-sm text-navy-400">{t("pbEmpty")}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
