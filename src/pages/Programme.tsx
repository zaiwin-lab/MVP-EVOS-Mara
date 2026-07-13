import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BrandFooter } from "../components/Brand";
import { Icon } from "../components/Icon";
import { PROGRAMME_DAYS } from "../content/programme";
import { eventConfig } from "../config/eventConfig";

export default function Programme() {
  const navigate = useNavigate();
  return (
    <AppShell header title="Programme">
      <section className="bg-navy-950 px-5 pb-8 pt-6 text-white">
        <span className="section-eyebrow text-gold-300">
          {eventConfig.eventName}
        </span>
        <h1 className="mt-1 font-display text-2xl font-extrabold">
          The Three-Day Learning Journey
        </h1>
        <p className="mt-2 text-sm text-navy-100">
          {eventConfig.eventNameLocal} · {eventConfig.dates} · {eventConfig.venue}
        </p>
      </section>

      <section className="px-5 py-6">
        <ol className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-navy-100">
          {PROGRAMME_DAYS.map((d) => (
            <li key={d.day} className="relative pl-12">
              <div className="absolute left-0 top-0 flex h-10 w-10 flex-col items-center justify-center rounded-full bg-navy-800 text-white ring-4 ring-white">
                <span className="text-sm font-extrabold leading-none">{d.day}</span>
              </div>
              <div className="card p-4">
                <div className="text-xs font-semibold text-gold-600">{d.date}</div>
                <h2 className="mt-0.5 font-display text-lg font-extrabold text-navy-900">
                  {d.title}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.topics.map((topic) => (
                    <span
                      key={topic}
                      className="chip bg-navy-50 text-navy-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <button
          onClick={() => navigate("/check-in")}
          className="btn-gold mt-8 w-full"
        >
          Start My Journey
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>
      </section>

      <BrandFooter />
    </AppShell>
  );
}
