// ─────────────────────────────────────────────────────────────
// PROMPT LIBRARY — translation layer
//
// The library itself (promptLibrary.ts) holds the Bahasa Melayu wording
// and the English mission titles. This file carries everything else for
// the parts participants BROWSE — work-area names and blurbs, mission
// titles and one-line descriptions — in English, 中文 and Bahasa Iban.
//
// The prompt TEMPLATE text (role, task, deliverables, disclaimers) stays
// in Bahasa Melayu on purpose: it is what gets pasted into ChatGPT /
// Claude / Gemini, and the programme teaches it in BM.
//
// ⚠️ IBAN NEEDS A NATIVE-SPEAKER REVIEW before the programme runs.
// These renderings were produced without a native reviewer. Anywhere a
// key is missing, pick() falls back to Bahasa Melayu — which Iban
// speakers read — so DELETING a doubtful line is always safe.
// ─────────────────────────────────────────────────────────────

import type { Localized } from "../context/I18nContext";

/** en/zh/iban for a work area. The BM wording comes from promptLibrary.ts. */
export const AREA_I18N: Record<string, { title: Localized; blurb: Localized }> = {
  membership: {
    title: { zh: "会员与会员服务", iban: "Penganggota enggau Servis Anggota" },
    blurb: {
      en: "Empowering members and serving them well.",
      zh: "赋能会员，提供最好的会员服务。",
      iban: "Ngemansangka sereta meri servis ti pemadu manah ngagai anggota koperasi.",
    },
  },
  operations: {
    title: { zh: "营运与行政", iban: "Pengawa enggau Pentadbir" },
    blurb: { en: "Smoother operations and more effective administration.", zh: "让营运更顺畅，行政更有效。", iban: "Pengawa lancar agi sereta pentadbir ti bekaul." },
  },
  marketing: {
    title: { zh: "市场推广与传播", iban: "Pemasaran enggau Komunikasi" },
    blurb: { en: "Stronger marketing and more effective communication.", zh: "更强的营销，更有效的沟通。", iban: "Pemasaran ti kuat agi sereta komunikasi ti bekaul." },
  },
  business: {
    title: { zh: "业务发展与收入", iban: "Pemansang Bisnis enggau Hasil" },
    blurb: { en: "Driving business growth and generating income for the co-op.", zh: "推动业务成长，创造合作社收入。", iban: "Mai pemansang bisnis sereta ngaga hasil koperasi." },
  },
  finance: {
    title: { zh: "财务与管理报告", iban: "Duit enggau Laporan Pengurusan" },
    blurb: { en: "Clearer financial management and reporting.", zh: "更透明的财务管理与报告。", iban: "Ngurus duit enggau laporan ti terang agi." },
  },
  governance: {
    title: { zh: "治理、董事会与策略", iban: "Tadbir Urus, Lembaga enggau Strategi" },
    blurb: { en: "Good governance, an effective Board and a strategy for the future.", zh: "良好治理、高效董事会与未来策略。", iban: "Tadbir urus manah, Lembaga bekaul enggau strategi jemah ila." },
  },
};

/** en/zh/iban for each of the 60 missions, keyed by mission id (A1…F10). */
export const MISSION_I18N: Record<string, { title: Localized; desc: Localized }> = {
  // ── A. Membership & Member Services ──
  A1: {
    title: { zh: "改善新会员入会流程", iban: "Ngemanahka Onboarding Anggota Baru" },
    desc: { en: "Design a friendly, clear welcome flow for new members.", zh: "设计友善清晰的新会员迎新流程。", iban: "Ngaga aliran nyambut anggota baru ti manah sereta terang." },
  },
  A2: {
    title: { zh: "回答会员常见问题", iban: "Nyaut Tanya Selalu Anggota" },
    desc: { en: "Prepare accurate answers to the questions members ask most.", zh: "为会员常见问题准备准确的回答。", iban: "Nyedia saut ti betul ke tanya biasa anggota." },
  },
  A3: {
    title: { zh: "撰写会员 WhatsApp 通知", iban: "Ngaga Berita WhatsApp Anggota" },
    desc: { en: "Draft short WhatsApp updates for your members.", zh: "为会员草拟简洁的 WhatsApp 讯息。", iban: "Ngaga pesan WhatsApp ti pandak ke anggota." },
  },
  A4: {
    title: { zh: "提升会员参与度", iban: "Ngambahka Penyerta Anggota" },
    desc: { en: "Ideas to get more members taking part in activities.", zh: "提升会员参与活动的点子。", iban: "Runding kena ngambahka penyerta anggota ba pengawa." },
  },
  A5: {
    title: { zh: "唤醒不活跃会员", iban: "Ngidupka Baru Anggota Ti Enda Aktif" },
    desc: { en: "A strategy for reconnecting with members who have gone quiet.", zh: "重新联系不活跃会员的策略。", iban: "Chara ngachau baru anggota ti enda aktif." },
  },
  A6: {
    title: { zh: "设计会员满意度调查", iban: "Ngaga Kaji Selidik Pengerindu Anggota" },
    desc: { en: "Build a short, effective member satisfaction survey.", zh: "建立简洁有效的调查问卷。", iban: "Ngaga borang kaji selidik ti pandak sereta beguna." },
  },
  A7: {
    title: { zh: "归纳会员反馈", iban: "Muruska Saut Anggota" },
    desc: { en: "Turn member feedback into themes and actions.", zh: "将反馈整理成主题与行动。", iban: "Muruska saut nyadi tema enggau pengawa." },
  },
  A8: {
    title: { zh: "策划会员福利宣传", iban: "Ngatur Kempen Untung Anggota" },
    desc: { en: "Plan a campaign that promotes the benefits of membership.", zh: "规划推广会员福利的活动。", iban: "Ngaga kempen mansangka untung nyadi anggota." },
  },
  A9: {
    title: { zh: "制定每月会员互动计划", iban: "Ngaga Pelan Penyerta Anggota Tiap Bulan" },
    desc: { en: "A one-month calendar of member activities.", zh: "一个月的会员活动日历。", iban: "Kalendar pengawa anggota kena sebulan." },
  },
  A10: {
    title: { zh: "改善整体会员体验", iban: "Ngemanahka Pengalaman Anggota" },
    desc: { en: "Suggestions for improving the member experience end to end.", zh: "改善整体会员体验的建议。", iban: "Saran ngemanahka semua pengalaman anggota." },
  },

  // ── B. Operations & Administration ──
  B1: {
    title: { zh: "简化现有工作流程", iban: "Mudahka Proses Pengawa Diatu" },
    desc: { en: "Make one work process simpler and more efficient.", zh: "让某项工作流程更简洁高效。", iban: "Ngaga siti proses pengawa nyadi lancar agi." },
  },
  B2: {
    title: { zh: "编写标准作业程序（SOP）", iban: "Ngaga SOP" },
    desc: { en: "Build a clear standard operating procedure.", zh: "建立清晰的标准作业程序。", iban: "Ngaga prosedur pengawa standard ti terang." },
  },
  B3: {
    title: { zh: "把会议记录变成行动清单", iban: "Ngubah Nota Gempuru Nyadi Senarai Pengawa" },
    desc: { en: "Turn meeting notes into clear action items.", zh: "把会议记录转化为明确行动。", iban: "Ngubah nota gempuru nyadi pengawa ti terang." },
  },
  B4: {
    title: { zh: "草拟公函／通告", iban: "Ngaga Surat Resmi / Memo" },
    desc: { en: "Write an official co-op letter or memo.", zh: "撰写合作社的正式信函或通告。", iban: "Nulis surat tauka memo resmi koperasi." },
  },
  B5: {
    title: { zh: "建立每周员工检查清单", iban: "Ngaga Senarai Semak Pengawa Tiap Minggu" },
    desc: { en: "A weekly task checklist for staff.", zh: "员工每周任务检查清单。", iban: "Senarai semak pengawa tiap minggu." },
  },
  B6: {
    title: { zh: "找出重复性工作", iban: "Ngiga Pengawa Ti Diulang" },
    desc: { en: "Find repetitive tasks that could be simplified or automated.", zh: "找出可简化或自动化的重复工作。", iban: "Ngiga pengawa ti diulang ti ulih dipemudah tauka diautomasi." },
  },
  B7: {
    title: { zh: "改善档案与文件流程", iban: "Ngemanahka Sistem Fail enggau Dokumen" },
    desc: { en: "Organise your filing and document system properly.", zh: "更好地整理档案与文件系统。", iban: "Nusun sistem fail enggau dokumen enggau manah agi." },
  },
  B8: {
    title: { zh: "建立内部常见问答", iban: "Ngaga FAQ Dalam" },
    desc: { en: "An internal question-and-answer guide for staff.", zh: "供员工使用的内部问答指南。", iban: "Panduan tanya-saut dalam ke pengawa." },
  },
  B9: {
    title: { zh: "准备管理层汇报", iban: "Nyedia Berita ke Pengurusan" },
    desc: { en: "A status summary for the management team.", zh: "给管理层的状态摘要。", iban: "Murus status ke pengurusan." },
  },
  B10: {
    title: { zh: "设计更高效的工作流程", iban: "Ngaga Aliran Pengawa Ti Lancar Agi" },
    desc: { en: "Redesign a workflow so it runs more smoothly.", zh: "重新设计更顺畅的工作流程。", iban: "Ngaga baru aliran pengawa ngambika lancar agi." },
  },

  // ── C. Marketing & Communications ──
  C1: {
    title: { zh: "创作社交媒体内容", iban: "Ngaga Kandung Media Sosial" },
    desc: { en: "Engaging captions for Facebook, Instagram or TikTok.", zh: "适用于 Facebook、Instagram 或 TikTok 的吸睛文案。", iban: "Caption ti nyelai ke Facebook, Instagram tauka TikTok." },
  },
  C2: {
    title: { zh: "撰写 WhatsApp 促销讯息", iban: "Ngaga Promosi WhatsApp" },
    desc: { en: "A persuasive WhatsApp promotion message.", zh: "有说服力的 WhatsApp 促销讯息。", iban: "Pesan promosi WhatsApp ti ulih ngasuh orang arap." },
  },
  C3: {
    title: { zh: "生成海报文案", iban: "Ngaga Teks Poster" },
    desc: { en: "Eye-catching copy for a poster or banner.", zh: "海报或横幅的吸睛广告文案。", iban: "Teks iklan ti nyelai ke poster tauka banner." },
  },
  C4: {
    title: { zh: "建立 30 天内容日历", iban: "Ngaga Kalendar Kandung 30 Hari" },
    desc: { en: "A month of social media content, scheduled.", zh: "一个月的社交媒体内容排程。", iban: "Jadual kandung media sosial sebulan." },
  },
  C5: {
    title: { zh: "构思短视频／Reels 创意", iban: "Ngaga Runding Video Pandak / Reels" },
    desc: { en: "Concepts and scripts for short, engaging videos.", zh: "吸引人的短视频概念与脚本。", iban: "Konsep enggau skrip video pandak ti nyelai." },
  },
  C6: {
    title: { zh: "优化产品／服务说明", iban: "Ngemanahka Penerang Produk / Servis" },
    desc: { en: "A clearer, more appealing product description.", zh: "更吸引、更清晰的产品说明。", iban: "Penerang produk ti nyelai sereta terang agi." },
  },
  C7: {
    title: { zh: "策划促销活动", iban: "Ngaga Kempen Promosi" },
    desc: { en: "Plan a joined-up marketing campaign.", zh: "规划整合式营销活动。", iban: "Ngaga kempen pemasaran ti bekaul." },
  },
  C8: {
    title: { zh: "建立客户画像", iban: "Ngaga Persona Pelanggan" },
    desc: { en: "A profile of the customers your co-op is targeting.", zh: "合作社目标客户的画像。", iban: "Profil pelanggan ti dituju koperasi." },
  },
  C9: {
    title: { zh: "优化行动呼吁与优惠", iban: "Ngemanahka CTA / Tawar" },
    desc: { en: "Stronger calls to action and more convincing offers.", zh: "更具说服力的行动呼吁与优惠。", iban: "Seruan pengawa enggau tawar ti kuat agi." },
  },
  C10: {
    title: { zh: "检视现有营销策略", iban: "Nyemak Strategi Pemasaran Ti Bisi" },
    desc: { en: "Analyse your marketing and suggest improvements.", zh: "分析营销现况并提出改善建议。", iban: "Analisis enggau saran ngemanahka pemasaran." },
  },

  // ── D. Business Development & Revenue ──
  D1: {
    title: { zh: "寻找新收入机会", iban: "Ngiga Peluang Hasil Baru" },
    desc: { en: "Ideas for new sources of income for your co-op.", zh: "为合作社发掘新的收入来源。", iban: "Runding pun pendapat baru ke koperasi." },
  },
  D2: {
    title: { zh: "发掘新客户群", iban: "Ngiga Kumpul Pelanggan Baru" },
    desc: { en: "New customer segments worth pursuing.", zh: "具潜力的新客户群体。", iban: "Kumpul pelanggan baru ti bisi peluang." },
  },
  D3: {
    title: { zh: "设计新产品／服务配套", iban: "Ngaga Pakej Produk / Servis Baru" },
    desc: { en: "Design an attractive new package or offer.", zh: "设计吸引人的新配套。", iban: "Ngaga pakej tawar baru ti nyelai." },
  },
  D4: {
    title: { zh: "提升现有优惠", iban: "Ngemanahka Tawar Ti Bisi" },
    desc: { en: "Add more value to what you already sell.", zh: "提升目前产品的价值。", iban: "Ngambahka rega tawar ti bisi diatu." },
  },
  D5: {
    title: { zh: "构思策略伙伴合作", iban: "Ngaga Runding Kerjasama" },
    desc: { en: "Ideas for working together with other organisations.", zh: "与其他单位合作的构想。", iban: "Runding bekereja enggau pihak bukai." },
  },
  D6: {
    title: { zh: "发掘加购与交叉销售机会", iban: "Ngiga Peluang Upsell / Cross-Sell" },
    desc: { en: "Opportunities to sell more to existing customers.", zh: "向现有客户销售更多的机会。", iban: "Peluang nyual mayuh agi ngagai pelanggan ti bisi." },
  },
  D7: {
    title: { zh: "建立 30 天销售计划", iban: "Ngaga Pelan Jual 30 Hari" },
    desc: { en: "A short, workable sales plan for one month.", zh: "一个月的简明销售计划。", iban: "Pelan jual ti pandak kena sebulan." },
  },
  D8: {
    title: { zh: "准备商业推介", iban: "Nyedia Pitch Bisnis" },
    desc: { en: "A brief, convincing pitch script.", zh: "简洁而有说服力的推介稿。", iban: "Skrip pitch ti pandak sereta ngasuh arap." },
  },
  D9: {
    title: { zh: "分析竞争者定位", iban: "Analisis Penatai Pesaing" },
    desc: { en: "Understand where you stand against competitors.", zh: "了解与竞争者相比的定位。", iban: "Meretika penatai diri berbanding pesaing." },
  },
  D10: {
    title: { zh: "制定成长行动计划", iban: "Ngaga Pelan Pengawa Pemansang" },
    desc: { en: "A clear, realistic plan for growth.", zh: "清晰且实际的成长计划。", iban: "Pelan pemansang ti terang sereta ulih digaga." },
  },

  // ── E. Finance & Management Reporting ──
  E1: {
    title: { zh: "归纳每月财务资料", iban: "Muruska Maklumat Duit Tiap Bulan" },
    desc: { en: "A summary management can actually understand.", zh: "让管理层容易理解的摘要。", iban: "Murus ti mudah dipereti pengurusan." },
  },
  E2: {
    title: { zh: "解释收入与开支变化", iban: "Nerangka Penguba Hasil / Belanja" },
    desc: { en: "Explain why the numbers moved.", zh: "说明数字变化的原因。", iban: "Nerangka kebuah angka beubah." },
  },
  E3: {
    title: { zh: "准备简易现金流概览", iban: "Nyedia Paparan Aliran Duit Ti Pandak" },
    desc: { en: "Lay out a simple view of money in and money out.", zh: "整理易懂的现金流概况。", iban: "Nusun gambar aliran duit ti mudah." },
  },
  E4: {
    title: { zh: "找出节省成本的机会", iban: "Ngiga Peluang Nyimpan Kos" },
    desc: { en: "Find areas with potential to save cost.", zh: "找出有潜力节省成本的地方。", iban: "Ngiga endur ti ulih nyimpan kos." },
  },
  E5: {
    title: { zh: "草拟每月管理层评述", iban: "Ngaga Ulas Pengurusan Tiap Bulan" },
    desc: { en: "The written commentary for a monthly report.", zh: "月报中的文字评述。", iban: "Ulas naratif ke laporan tiap bulan." },
  },
  E6: {
    title: { zh: "准备预算假设", iban: "Nyedia Andai Belanjawan" },
    desc: { en: "List the assumptions behind your budget.", zh: "列出编制预算所需的假设。", iban: "Nyenarai andai kena ngaga belanjawan." },
  },
  E7: {
    title: { zh: "标出需要留意的数字", iban: "Nunjuk Angka Ti Patut Diperatika" },
    desc: { en: "Point out the numbers that look unusual.", zh: "指出异常的数字。", iban: "Nunjuk angka ti nyelai." },
  },
  E8: {
    title: { zh: "拟定董事会财务提问", iban: "Ngaga Tanya Duit ke Lembaga" },
    desc: { en: "Sharp finance questions for the Board to ask.", zh: "供董事会财务检视的深入提问。", iban: "Tanya ti dalam ke semakan duit Lembaga." },
  },
  E9: {
    title: { zh: "比较实际与预算", iban: "Bandingka Amat enggau Belanjawan" },
    desc: { en: "Compare actual performance against budget.", zh: "比较实际表现与预算。", iban: "Bandingka pengawa amat enggau belanjawan." },
  },
  E10: {
    title: { zh: "准备管理报告摘要", iban: "Nyedia Murus Laporan Pengurusan" },
    desc: { en: "An executive summary of the management report.", zh: "管理报告的执行摘要。", iban: "Murus eksekutif laporan pengurusan." },
  },

  // ── F. Governance, Board & Strategy ──
  F1: {
    title: { zh: "准备董事会议程", iban: "Nyedia Agenda Gempuru Lembaga" },
    desc: { en: "A well-organised board meeting agenda.", zh: "条理清晰的会议议程。", iban: "Agenda gempuru ti tusun." },
  },
  F2: {
    title: { zh: "把会议讨论变成行动清单", iban: "Ngubah Randau Gempuru Nyadi Senarai Pengawa" },
    desc: { en: "Turn discussion into clear action items.", zh: "把讨论转化为明确行动。", iban: "Ngubah randau nyadi pengawa ti terang." },
  },
  F3: {
    title: { zh: "分析新项目提案", iban: "Meretika Cadang Projek Baru" },
    desc: { en: "Assess a new project proposal even-handedly.", zh: "平衡地评估项目提案。", iban: "Nilai cadang projek enggau timbang ti rata." },
  },
  F4: {
    title: { zh: "整理决策利弊", iban: "Nyedia Penguntung / Penanggul Siti Putus" },
    desc: { en: "Weigh up the pros and cons of a decision.", zh: "分析某项决定的利与弊。", iban: "Analisis penguntung enggau penanggul siti putus." },
  },
  F5: {
    title: { zh: "识别主要风险", iban: "Ngiga Risiko Besai" },
    desc: { en: "List the key risks and how to reduce them.", zh: "列出风险与缓解措施。", iban: "Nyenarai risiko enggau chara ngurangka iya." },
  },
  F6: {
    title: { zh: "草拟策略重点", iban: "Ngaga Keutamaan Strategik" },
    desc: { en: "Set out the co-op's strategic priorities.", zh: "拟定合作社的策略重点。", iban: "Ngaga utai ti pemadu beguna ke koperasi." },
  },
  F7: {
    title: { zh: "建立年度行动计划", iban: "Ngaga Pelan Pengawa Setaun" },
    desc: { en: "An organised action plan for the year.", zh: "有条理的年度行动计划。", iban: "Pelan pengawa setaun ti tusun." },
  },
  F8: {
    title: { zh: "准备给管理层的提问", iban: "Nyedia Tanya ke Pengurusan" },
    desc: { en: "Oversight questions for the Board to ask.", zh: "董事会监督用的提问。", iban: "Tanya pengawas ke Lembaga." },
  },
  F9: {
    title: { zh: "检视目标进度", iban: "Nyemak Pemansang Berbanding Tuju" },
    desc: { en: "Assess progress against the objectives set.", zh: "评估相对于目标的进展。", iban: "Nilai pemansang berbanding tuju." },
  },
  F10: {
    title: { zh: "准备策略决策简报", iban: "Nyedia Taklimat Putus Strategik" },
    desc: { en: "A short brief for an important decision.", zh: "重要决定的精简简报。", iban: "Taklimat ti pandak ke putus penting." },
  },
};
