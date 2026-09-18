import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getWorkArea } from "../content/promptLibrary";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { areaAccent } from "../lib/accents";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n, pick as pickLang } from "../context/I18nContext";
import { store } from "../data/store";

export default function WorkArea() {
  const { areaId } = useParams();
  const area = areaId ? getWorkArea(areaId) : undefined;
  const { participantId, record, refresh } = useParticipant();
  const { t, pick, lang } = useI18n();

  // Record the participant's chosen starting work area (light tracking).
  useEffect(() => {
    if (!participantId || !area) return;
    if (record?.participant.selectedWorkArea === area.id) return;
    void store.updateParticipant(participantId, { selectedWorkArea: area.id }).then(() => refresh());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantId, area?.id]);

  if (!area) return <Navigate to="/prompt-hub" replace />;

  const ac = areaAccent(area.accent);
  const tried = new Set(record?.participant.triedPromptIds ?? []);
  const triedInArea = area.missions.filter((m) => tried.has(m.id)).length;

  return (
    <SiteLayout>
      <section className="bg-navy-950 text-white">
        <div className={`${SITE_WRAP} py-10 lg:py-12`}>
          <Link to="/prompt-hub" className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-200 hover:text-white">
            <Icon name="arrowLeft" className="h-4 w-4" /> {t("waAllAreas")}
          </Link>
          <div className="mt-4 flex items-start gap-4">
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${ac.badge}`}>
              <Icon name={area.icon} className="h-7 w-7" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{pick(area.title)}</h1>
              {lang !== "en" && lang !== "zh" && (
                <p className="text-sm font-semibold text-gold-200">{pickLang(area.title, "en")}</p>
              )}
              <p className="mt-1 text-sm text-navy-200">{pick(area.blurb)}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="chip bg-white/10 text-white">{t("waMissions").replace("{n}", String(area.missions.length))}</span>
            {participantId && (
              <span className="chip bg-gold-400/20 text-gold-200">{t("waTried").replace("{a}", String(triedInArea)).replace("{b}", String(area.missions.length))}</span>
            )}
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-10`}>
        <div className="space-y-3">
          {area.missions.map((m) => {
            const done = tried.has(m.id);
            return (
              <Link
                key={m.id}
                to={`/prompt-hub/${area.id}/${m.id}`}
                className="card group flex items-center gap-4 p-4 transition hover:shadow-lift sm:p-5"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${done ? "bg-navy-900 text-gold-300" : ac.soft}`}>
                  {done ? <Icon name="check" className="h-5 w-5" /> : m.n}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-sm font-bold text-navy-900 sm:text-base">{pick(m.title)}</div>
                  <div className="truncate text-xs text-navy-400">{pick(m.desc)}</div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-navy-700 group-hover:text-gold-600">
                  <span className="hidden sm:inline">{t("waViewPrompt")}</span>
                  <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-6 rounded-xl bg-sand-100 px-4 py-3 text-xs text-navy-500">{t("waTip")}</p>
      </section>
    </SiteLayout>
  );
}
