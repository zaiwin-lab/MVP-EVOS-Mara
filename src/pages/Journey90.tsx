import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n, type Localized } from "../context/I18nContext";
import { store } from "../data/store";

// ⚠️ Iban here still needs a native-speaker review — see src/content/site.ts.
interface Month {
  n: number;
  tag: string;
  accent: string;
  title: Localized;
  focus: Localized;
  range: string;
  steps: Localized[];
  quote: Localized;
}

const MONTHS: Month[] = [
  {
    n: 1, tag: "EXPLORE", accent: "emerald", range: "Prompt 1–3",
    title: { bm: "Bulan 1 — Explore", en: "Month 1 — Explore", zh: "第 1 个月 — 探索", iban: "Bulan 1 — Explore" },
    focus: {
      bm: "Kenali AI dan cuba yang asas.",
      en: "Get to know AI and try the basics.",
      zh: "认识 AI，先试试基础功能。",
      iban: "Nemu pasal AI lalu nguji utai ti asas.",
    },
    steps: [
      { bm: "Baca contoh prompt dan fahami kegunaannya.", en: "Read the example prompts and understand what they are for.", zh: "阅读示例提示，了解它们的用途。", iban: "Macha chunto prompt lalu meretika kegunaan iya." },
      { bm: "Cuba sendiri sekurang-kurangnya 1 prompt.", en: "Try at least one prompt yourself.", zh: "至少亲自试用一个提示。", iban: "Uji empu sekurang-kurang siti prompt." },
      { bm: "Kongsi pengalaman dengan rakan koperasi.", en: "Share what you found with others in the co-op.", zh: "与合作社的伙伴分享你的体验。", iban: "Kunsika pengalaman enggau pangan ba koperasi." },
    ],
    quote: { bm: "Mulakan dengan rasa ingin tahu.", en: "Start with curiosity.", zh: "从好奇心开始。", iban: "Berengkah enggau ati ti deka nemu." },
  },
  {
    n: 2, tag: "APPLY", accent: "blue", range: "Prompt 4–7",
    title: { bm: "Bulan 2 — Apply", en: "Month 2 — Apply", zh: "第 2 个月 — 应用", iban: "Bulan 2 — Apply" },
    focus: {
      bm: "Cuba dalam tugasan harian.",
      en: "Put it to work in everyday tasks.",
      zh: "把它用在日常工作里。",
      iban: "Kena iya ba pengawa tiap hari.",
    },
    steps: [
      { bm: "Pilih 2–3 prompt yang relevan dengan kerja anda.", en: "Pick 2–3 prompts relevant to your work.", zh: "选出 2–3 个与你的工作相关的提示。", iban: "Pilih 2–3 prompt ti ngena enggau pengawa nuan." },
      { bm: "Uji dalam situasi sebenar (cth. emel, laporan, promosi).", en: "Use them in real situations (emails, reports, promotions).", zh: "在真实情境中使用（电邮、报告、促销）。", iban: "Uji ba pekara amat (cth. e-mel, laporan, promosi)." },
      { bm: "Catat apa yang berkesan dan apa boleh diperbaiki.", en: "Note what worked and what could be better.", zh: "记录哪些有效、哪些还能改进。", iban: "Tulis nama ti beguna enggau nama ti ulih dimanahka." },
    ],
    quote: { bm: "Pembelajaran berlaku bila anda mencuba.", en: "Learning happens when you try.", zh: "动手尝试，才会学到东西。", iban: "Pemelajar datai lebuh nuan nguji." },
  },
  {
    n: 3, tag: "IMPROVE", accent: "rose", range: "Prompt 8–10",
    title: { bm: "Bulan 3 — Improve", en: "Month 3 — Improve", zh: "第 3 个月 — 精进", iban: "Bulan 3 — Improve" },
    focus: {
      bm: "Kukuhkan kemahiran dan teroka lebih jauh.",
      en: "Strengthen your skills and go further.",
      zh: "巩固技能，走得更远。",
      iban: "Ngeringka pengelandik lalu nguji utai ti jauh agi." ,
    },
    steps: [
      { bm: "Cuba prompt yang lebih kreatif atau strategik.", en: "Try the more creative or strategic prompts.", zh: "尝试更具创意或策略性的提示。", iban: "Uji prompt ti kreatif tauka strategik agi." },
      { bm: "Sesuaikan prompt mengikut keperluan koperasi.", en: "Adapt the prompts to what your co-op needs.", zh: "按合作社的需要调整提示。", iban: "Ubah prompt nitihka pengingin koperasi." },
      { bm: "Rancang apa yang ingin diteruskan selepas 90 hari.", en: "Plan what you want to carry on after the 90 days.", zh: "规划 90 天后要继续做的事。", iban: "Ngatur nama ti deka diteruska udah 90 hari." },
    ],
    quote: { bm: "Langkah kecil membawa perubahan besar.", en: "Small steps bring big change.", zh: "小步前进，带来大改变。", iban: "Langkah mit mai penguba ti besai." },
  },
];

const REFLECT: { id: string; q: Localized }[] = [
  {
    id: "useful",
    q: { bm: "Prompt mana paling berguna untuk anda?", en: "Which prompt was most useful to you?", zh: "哪个提示对你最有用？", iban: "Prompt ni ti pemadu beguna ke nuan?" },
  },
  {
    id: "tried",
    q: { bm: "Apa yang anda telah cuba gunakan dalam kerja atau koperasi?", en: "What have you tried using in your work or your co-op?", zh: "你在工作或合作社里试用了什么？", iban: "Nama utai ti udah diuji nuan ba pengawa tauka koperasi?" },
  },
  {
    id: "next",
    q: { bm: "Apa seterusnya?", en: "What is next for you?", zh: "接下来打算做什么？", iban: "Nama ti deka digaga nuan udah tu?" },
  },
];

const TONE: Record<string, string> = {
  emerald: "border-emerald-100 bg-emerald-50/60",
  blue: "border-sky-100 bg-sky-50/60",
  rose: "border-rose-100 bg-rose-50/60",
};
const DOT: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-sky-500",
  rose: "bg-rose-500",
};

export default function Journey90() {
  const { participantId, record, refresh } = useParticipant();
  const { t, pick } = useI18n();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedFlag, setSavedFlag] = useState(false);

  useEffect(() => {
    if (record?.participant.journeyReflection) setAnswers(record.participant.journeyReflection);
  }, [record]);

  async function save() {
    if (!participantId) return;
    await store.updateParticipant(participantId, { journeyReflection: answers });
    await refresh();
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 2500);
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
        <div className={`relative ${SITE_WRAP} py-10 lg:py-12`}>
          <span className="section-eyebrow text-gold-300">{t("j9Eyebrow")}</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("j9Title")}</h1>
          <p className="mt-3 max-w-2xl text-sm text-navy-200">{t("j9Intro")}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-gold-200">
            <Icon name="checkCircle" className="h-3.5 w-3.5" /> {t("j9Note")}
          </span>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-12`}>
        <div className="grid gap-4 lg:grid-cols-3">
          {MONTHS.map((m) => (
            <div key={m.n} className={`flex flex-col rounded-3xl border p-6 ${TONE[m.accent]}`}>
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${DOT[m.accent]}`}>
                  <span className="text-sm font-extrabold">{m.n}</span>
                </span>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-navy-400">{m.tag}</div>
                  <div className="font-display text-lg font-bold text-navy-900">{pick(m.title)}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-navy-800">{pick(m.focus)}</span>
                <span className="chip bg-white text-navy-600">{m.range}</span>
              </div>
              <ol className="mt-4 space-y-2">
                {m.steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-navy-600">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT[m.accent]}`} /> {pick(s)}
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-navy-100 pt-3 text-xs italic text-navy-400">“{pick(m.quote)}”</p>
            </div>
          ))}
        </div>

        {/* Reflection space */}
        <div className="mt-10 rounded-3xl bg-navy-950 p-6 text-white sm:p-8">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gold-300">
              <Icon name="book" className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">{t("j9ReflectTitle")}</h2>
              <p className="text-xs text-navy-200">{t("j9ReflectSub")}</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {REFLECT.map((r, i) => (
              <div key={r.id}>
                <label className="block text-sm font-semibold text-white">
                  <span className="mr-1.5 text-gold-300">{i + 1}.</span>{pick(r.q)}
                </label>
                <textarea
                  className="mt-1.5 min-h-[70px] w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-navy-300 focus:border-gold-400 focus:outline-none"
                  placeholder={t("j9Placeholder")}
                  value={answers[r.id] ?? ""}
                  onChange={(e) => setAnswers((p) => ({ ...p, [r.id]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          {participantId ? (
            <button onClick={save} className="btn-gold mt-5">
              <Icon name={savedFlag ? "check" : "book"} className="h-5 w-5" /> {savedFlag ? t("j9Saved") : t("j9Save")}
            </button>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/check-in" className="btn-gold">{t("j9RegisterCta")}</Link>
              <span className="text-xs text-navy-300">{t("j9Optional")}</span>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
