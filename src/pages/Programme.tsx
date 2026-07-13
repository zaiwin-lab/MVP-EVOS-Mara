import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BrandFooter } from "../components/Brand";
import { Icon } from "../components/Icon";
import { PROGRAMME_DAYS } from "../content/programme";
import { eventConfig } from "../config/eventConfig";
import { useI18n } from "../context/I18nContext";

export default function Programme() {
  const navigate = useNavigate();
  const { t, pick, term } = useI18n();

  return (
    <AppShell header title={t("programmeTitle")}>
      <section className="bg-navy-950 px-5 pb-8 pt-6 text-white">
        <span className="section-eyebrow text-gold-300">{eventConfig.eventName}</span>
        <h1 className="mt-1 font-display text-2xl font-extrabold">
          {t("threeDayLearningJourney")}
        </h1>
        <p className="mt-2 text-sm text-navy-100">
          {eventConfig.eventNameLocal}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-200">
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" className="h-4 w-4 text-gold-300" /> {eventConfig.dates}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="location" className="h-4 w-4 text-gold-300" /> {eventConfig.venue}
          </span>
        </div>
      </section>

      <div className="space-y-8 px-5 py-6">
        {PROGRAMME_DAYS.map((d) => (
          <section key={d.day}>
            {/* Day header */}
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-navy-900 text-white">
                <span className="text-[9px] font-semibold uppercase text-gold-300">
                  {t("dayLabel")}
                </span>
                <span className="text-xl font-extrabold leading-none">{d.day}</span>
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-lg font-extrabold text-navy-900">
                  {d.titleI18n ? pick(d.titleI18n) : d.title}
                </h2>
                <div className="text-xs font-semibold text-gold-600">
                  {d.weekday} · {d.date}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-navy-500">
                  <Icon name="clock" className="h-3.5 w-3.5" />
                  {d.timeRange}
                </div>
              </div>
            </div>

            {/* Trainer */}
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-navy-50 px-3 py-2 text-xs">
              <Icon name="users" className="h-4 w-4 text-navy-500" />
              <span className="font-semibold text-navy-700">{d.trainer}</span>
            </div>

            {/* Timeline: detailed schedule if provided, else themed sessions */}
            <ol className="relative mt-4 space-y-3 border-l-2 border-navy-100 pl-5">
              {(d.schedule.length > 0
                ? d.schedule
                : d.topics.map((topic) => ({ time: "", activity: topic, trainer: undefined, kind: "session" as const }))
              ).map((item, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-gold-400" />
                  {item.time && (
                    <div className="text-xs font-bold text-navy-800">{item.time}</div>
                  )}
                  <div className="text-sm text-navy-700">
                    {d.schedule.length > 0 ? item.activity : term(item.activity)}
                  </div>
                  {item.trainer && (
                    <div className="text-[11px] text-navy-400">{item.trainer}</div>
                  )}
                </li>
              ))}
            </ol>

            <p className="mt-3 rounded-lg bg-sand-100 px-3 py-2 text-[11px] text-navy-400">
              {t("tentativeNote")}
            </p>

            {/* Today's Learning Journey */}
            <div className="mt-4 rounded-2xl bg-navy-900 p-4 text-center text-white">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300">
                {t("todaysLearningJourney")}
              </div>
              <div className="mt-1 font-display text-2xl font-extrabold tracking-wide">
                {d.journeyWord}
              </div>
            </div>
          </section>
        ))}

        <button onClick={() => navigate("/register")} className="btn-gold mt-2 w-full">
          {t("startJourney")}
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>
      </div>

      <BrandFooter />
    </AppShell>
  );
}
