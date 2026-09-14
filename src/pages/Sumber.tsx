import { Link } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";

export default function Sumber() {
  const { resources, moduleFolderUrl } = eventConfig;

  return (
    <SiteLayout>
      <section className="bg-navy-950 text-white">
        <div className={`${SITE_WRAP} py-10 lg:py-12`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="section-eyebrow text-gold-300">Modul &amp; Sumber</span>
              <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Modul, Template &amp; Rujukan</h1>
              <p className="mt-3 max-w-2xl text-sm text-navy-200">
                Akses bahan pembelajaran, template, toolkit dan sumber penting ProgramOS Lite — semua di satu tempat melalui Google Folder.
              </p>
            </div>
            <FolderButton url={moduleFolderUrl} label="Buka Semua di Google Folder" primary />
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-12`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <div key={r.id} className="card flex flex-col gap-3 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                <Icon name={r.icon} className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-base font-bold text-navy-900">{r.title}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-navy-300">{r.titleEn}</div>
              </div>
              <p className="text-sm text-navy-500">{r.desc}</p>
              <div className="mt-auto pt-1">
                <FolderButton url={r.url} label="Buka di Google Folder" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-sand-100 px-5 py-4 text-xs text-navy-500">
          Sumber disediakan melalui Google Folder rasmi ProgramOS Lite. Pautan bertanda “Akan Dikemaskini” akan diaktifkan sebaik URL folder disediakan.
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 rounded-3xl bg-navy-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">Galeri Foto Program</h3>
            <p className="text-sm text-navy-200">Lihat momen bermakna sepanjang program.</p>
          </div>
          <Link to="/galeri" className="btn-gold shrink-0">Lihat Galeri <Icon name="arrowRight" className="h-5 w-5" /></Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function FolderButton({ url, label, primary = false }: { url: string; label: string; primary?: boolean }) {
  if (!url) {
    return (
      <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-navy-200 bg-white/60 px-4 py-2.5 text-sm font-semibold text-navy-400">
        <Icon name="clock" className="h-4 w-4" /> Akan Dikemaskini
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={primary ? "btn-gold shrink-0" : "btn-ghost w-full text-sm"}
    >
      <Icon name="arrowRight" className="h-4 w-4" /> {label}
    </a>
  );
}
