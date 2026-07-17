// ── Participant PDF export ───────────────────────────────────
// Builds a clean, text-based (crisp, small) multi-page PDF containing
// EVERYTHING a participant filled in — registration, full company profile,
// attendance, readiness assessment result, 90-day action plan, reflections.
// jsPDF is imported dynamically by the caller so it stays out of the main
// bundle until the admin actually exports.
import type { jsPDF } from "jspdf";
import type { ParticipantRecord } from "../data/types";
import { INDICATORS } from "../content/assessment";
import { eventConfig } from "../config/eventConfig";

const NAVY: [number, number, number] = [14, 26, 52];
const GOLD: [number, number, number] = [176, 137, 43];
const GRAY: [number, number, number] = [110, 120, 140];
const LINE: [number, number, number] = [222, 226, 234];

const MARGIN = 15;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;

const indicatorTitle = (id: string) =>
  INDICATORS.find((i) => i.id === id)?.title ?? id;

const sessionLabel = (id: string) => {
  const s = eventConfig.attendanceSessions.find((x) => x.id === id);
  if (s) return `${s.label} · ${s.weekday}`;
  return id
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
};

const fmtDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleString("en-MY", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const val = (v: unknown) => {
  if (v === undefined || v === null || v === "") return "—";
  return String(v);
};

export async function generateParticipantsPdf(
  records: ParticipantRecord[],
  opts: { filename?: string } = {}
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  let y = MARGIN;

  const ensure = (h: number) => {
    if (y + h > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const rule = () => {
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 3;
  };

  const heading = (text: string) => {
    ensure(12);
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(text, MARGIN, y);
    y += 2;
    rule();
  };

  const kv = (label: string, value: string) => {
    const labelW = 46;
    const wrapped = doc.splitTextToSize(value, CONTENT_W - labelW);
    const h = wrapped.length * 5 + 1;
    ensure(h);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text(label, MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...NAVY);
    doc.text(wrapped, MARGIN + labelW, y);
    y += h;
  };

  const para = (text: string) => {
    const wrapped = doc.splitTextToSize(text, CONTENT_W);
    const h = wrapped.length * 5 + 1;
    ensure(h);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);
    doc.text(wrapped, MARGIN, y);
    y += h;
  };

  const bullet = (text: string) => {
    const wrapped = doc.splitTextToSize(text, CONTENT_W - 5);
    const h = wrapped.length * 5 + 1;
    ensure(h);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);
    doc.text("•", MARGIN, y);
    doc.text(wrapped, MARGIN + 5, y);
    y += h;
  };

  // ── Cover ──────────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Participant Report", MARGIN, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GOLD);
  doc.text(eventConfig.eventName, MARGIN, 26);
  doc.setTextColor(210, 216, 228);
  doc.setFontSize(9);
  doc.text(
    `KBT EventOS · Attendify™   ·   ${eventConfig.venue}   ·   ${eventConfig.dates}`,
    MARGIN,
    33
  );
  y = 50;
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${fmtDate(new Date().toISOString())}`, MARGIN, y);
  y += 6;
  doc.text(`Total participants in this report: ${records.length}`, MARGIN, y);
  y += 4;

  // ── One page (or more) per participant ─────────────────────
  records.forEach((rec, idx) => {
    doc.addPage();
    y = MARGIN;
    const p = rec.participant;

    // Name band
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, PAGE_W, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(p.fullName || "(no name)", MARGIN, 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(210, 216, 228);
    doc.text(p.companyName || "—", MARGIN, 18);
    doc.setTextColor(...GOLD);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${p.ref}    (${idx + 1}/${records.length})`,
      PAGE_W - MARGIN,
      12,
      { align: "right" }
    );
    y = 30;

    // Registration
    heading("Registration");
    kv("Full name", val(p.fullName));
    kv("Company", val(p.companyName));
    kv("Mobile", val(p.mobile));
    kv("Email", val(p.email));
    kv("Position", val(p.position));
    kv("Age range", val(p.ageRange));
    kv("District", val(p.district));
    kv("Reference", val(p.ref));
    kv("Checked in", fmtDate(p.checkedInAt));

    // Company profile
    heading("Company Profile");
    if (rec.profile) {
      const cp = rec.profile;
      kv("Registration No.", val(cp.registrationNumber));
      kv("Established", val(cp.establishedYear));
      kv("CIDB grade", val(cp.cidbGrade));
      kv("Category", val(cp.category));
      kv("Employees", val(cp.employeeCount));
      kv("Main service area", val(cp.mainServiceArea));
      kv("Experience (yrs)", val(cp.experienceYears));
      kv("Completed projects", val(cp.completedProjects));
      kv("Digital status", val(cp.digitalStatus));
      kv(
        "Capabilities",
        cp.capabilities && cp.capabilities.length ? cp.capabilities.join(", ") : "—"
      );
      const links = Object.entries(cp.digitalLinks || {}).filter(
        ([, v]) => v && String(v).trim()
      );
      if (links.length) {
        links.forEach(([k, v]) =>
          kv(k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()), String(v))
        );
      } else {
        kv("Digital links", "—");
      }
      const docs = Object.entries(cp.documents || {}).filter(([, v]) => v);
      if (docs.length) {
        docs.forEach(([k, v]) =>
          kv(
            `Doc · ${k}`,
            String(v).replace(/_/g, " ")
          )
        );
      }
    } else {
      para("Not completed yet.");
    }

    // Attendance
    heading("Attendance");
    if (rec.attendance && rec.attendance.length) {
      rec.attendance
        .slice()
        .sort((a, b) => a.session.localeCompare(b.session))
        .forEach((a) => kv(sessionLabel(a.session), fmtDate(a.markedAt)));
    } else {
      para("No attendance recorded.");
    }

    // Readiness result
    heading("Readiness Assessment Result");
    if (rec.result) {
      const r = rec.result;
      kv("Total score", `${r.totalScore} / 100`);
      kv("Readiness category", val(r.readinessCategory));
      kv("Strongest area", indicatorTitle(r.strongestIndicator));
      kv("Priority area", indicatorTitle(r.priorityIndicator));
      y += 1;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      ensure(6);
      doc.text("Score breakdown (out of 20):", MARGIN, y);
      y += 5;
      INDICATORS.forEach((ind) => {
        const s = r.indicatorScores?.[ind.id];
        kv(ind.title, s === undefined ? "—" : `${s} / 20`);
      });
      if (r.summary) {
        y += 1;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        ensure(6);
        doc.text("Summary:", MARGIN, y);
        y += 5;
        para(r.summary);
      }
      if (r.recommendations && r.recommendations.length) {
        y += 1;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...GRAY);
        ensure(6);
        doc.text("Recommended actions:", MARGIN, y);
        y += 5;
        r.recommendations.forEach((rec) => bullet(rec));
      }
    } else {
      para("Assessment not completed yet.");
    }

    // 90-day action plan
    heading("90-Day Business Action Plan");
    if (rec.actionPlan) {
      const ap = rec.actionPlan;
      kv("Business goal", val(ap.businessGoal));
      kv("Top priority", val(ap.priority));
      kv("Day 30 action", val(ap.day30Action));
      kv("Day 30 by", val(ap.day30Date));
      kv("Day 60 action", val(ap.day60Action));
      kv("Day 60 by", val(ap.day60Date));
      kv("Day 90 action", val(ap.day90Action));
      kv("Day 90 by", val(ap.day90Date));
      kv("Commitment", ap.commitment ? "Yes — committed" : "No");
    } else {
      para("Action plan not submitted yet.");
    }

    // Reflections
    if (rec.reflections && rec.reflections.length) {
      heading("Daily Reflections");
      rec.reflections
        .slice()
        .sort((a, b) => a.dayNumber - b.dayNumber)
        .forEach((rf) => {
          y += 1;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(...NAVY);
          ensure(6);
          doc.text(`Day ${rf.dayNumber}`, MARGIN, y);
          y += 5;
          const responses = Object.values(rf.responses || {}).filter(
            (v) => v && String(v).trim()
          );
          if (responses.length) responses.forEach((v) => bullet(String(v)));
          else para("—");
        });
    }
  });

  // Footer page numbers
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(
      `KBT EventOS · Attendify™ — ${eventConfig.eventName}`,
      MARGIN,
      PAGE_H - 8
    );
    doc.text(`Page ${i} / ${pages}`, PAGE_W - MARGIN, PAGE_H - 8, {
      align: "right",
    });
  }

  const filename =
    opts.filename ||
    `attendify-participants-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// Convenience for a single participant.
export async function generateSingleParticipantPdf(
  rec: ParticipantRecord
): Promise<void> {
  const p = rec.participant;
  const safe = (p.fullName || p.ref || "participant")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  await generateParticipantsPdf([rec], {
    filename: `attendify-${safe}-${p.ref}.pdf`,
  });
}

// Keep the jsPDF type referenced (dynamic import erases it otherwise).
export type _Doc = jsPDF;
