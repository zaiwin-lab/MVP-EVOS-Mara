import { AppShell } from "../components/AppShell";
import { BrandFooter } from "../components/Brand";
import { Icon } from "../components/Icon";
import { TRAINERS } from "../content/programme";

export default function Trainers() {
  return (
    <AppShell header title="Meet the Trainers">
      <section className="bg-navy-950 px-5 pb-8 pt-6 text-white">
        <span className="section-eyebrow text-gold-300">Programme Faculty</span>
        <h1 className="mt-1 font-display text-2xl font-extrabold">
          Learn from industry leaders
        </h1>
        <p className="mt-2 text-sm text-navy-100">
          Two experienced trainers guiding you across foundations, opportunities,
          and digital transformation.
        </p>
      </section>

      <section className="space-y-5 px-5 py-6">
        {TRAINERS.map((tr) => (
          <article key={tr.name} className="card overflow-hidden">
            <div className="flex items-center gap-4 bg-navy-50 p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy-800 text-2xl font-extrabold text-gold-400">
                {tr.initials}
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-lg font-extrabold leading-tight text-navy-900">
                  {tr.name}
                </h2>
                <div className="mt-0.5 text-xs font-bold text-gold-600">{tr.role}</div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm leading-relaxed text-navy-600">{tr.title}</p>
              <div className="mt-4 text-xs font-bold uppercase tracking-wide text-navy-400">
                Focus Areas
              </div>
              <ul className="mt-2 space-y-1.5">
                {tr.focusAreas.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-navy-700">
                    <Icon name="check" className="h-4 w-4 shrink-0 text-gold-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <BrandFooter />
    </AppShell>
  );
}
