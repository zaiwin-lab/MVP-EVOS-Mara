import { Link } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { AGENDA } from "../content/site";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";

export default function Programme() {
  return (
    <SiteLayout>
      <section className="bg-navy-950 text-white">
        <div className={`${SITE_WRAP} py-10 lg:py-12`}>
          <span className="section-eyebrow text-gold-300">Program</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Aliran Program Sehari</h1>
          <p className="mt-3 max-w-2xl text-sm text-navy-200">
            Program praktikal dan ringan yang membimbing koperasi menerap AI langkah demi langkah — mengikut rentak anda.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="chip bg-white/10 text-white"><Icon name="calendar" className="h-3.5 w-3.5" /> {eventConfig.dates} · {eventConfig.weekday}</span>
            <span className="chip bg-white/10 text-white"><Icon name="clock" className="h-3.5 w-3.5" /> {eventConfig.time}</span>
            <span className="chip bg-white/10 text-white"><Icon name="location" className="h-3.5 w-3.5" /> {eventConfig.venue}</span>
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-12`}>
        <ol className="relative space-y-3 border-l-2 border-navy-100 pl-6">
          {AGENDA.map((a, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-navy-900">
                {i + 1}
              </span>
              <div className="card p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip bg-navy-900 text-white">{a.time}</span>
                  <span className="font-display text-base font-bold text-navy-900">{a.title}</span>
                </div>
                <p className="mt-1.5 text-sm text-navy-500">{a.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 rounded-xl bg-sand-100 px-4 py-3 text-xs text-navy-500">
          Jadual tentatif — masa sesi mungkin diubah sepanjang program. Panduan ringkas, bukan KPI wajib.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/check-in" className="btn-gold">Daftar / Check-In <Icon name="arrowRight" className="h-5 w-5" /></Link>
          <Link to="/prompt-hub" className="btn-outline">Terokai Prompt Hub</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
