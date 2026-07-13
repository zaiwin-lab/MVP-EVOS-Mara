import type { ParticipantRecord } from "../data/types";
import { INDICATORS } from "../content/assessment";
import { eventConfig } from "../config/eventConfig";

function esc(value: unknown): string {
  const s = value === undefined || value === null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function recordsToCsv(records: ParticipantRecord[]): string {
  const headers = [
    "Reference",
    "Full Name",
    "Mobile",
    "Email",
    "Company",
    "CIDB Grade",
    "Category",
    "Checked In",
    "Profile Completed",
    "Assessment Completed",
    "Total Score",
    "Readiness Category",
    ...INDICATORS.map((i) => i.titleShort),
    "Action Plan Completed",
    ...eventConfig.attendanceSessions.map((s) => `Attendance ${s.label}`),
  ];

  const rows = records.map((r) => {
    const { participant: p, profile, result, actionPlan, attendance } = r;
    const attended = new Set(attendance.map((a) => a.session));
    return [
      p.ref,
      p.fullName,
      p.mobile,
      p.email ?? "",
      p.companyName,
      profile?.cidbGrade ?? "",
      profile?.category ?? "",
      p.checkedInAt,
      profile ? "Yes" : "No",
      result ? "Yes" : "No",
      result ? result.totalScore : "",
      result ? result.readinessCategory : "",
      ...INDICATORS.map((i) => (result ? result.indicatorScores[i.id] ?? "" : "")),
      actionPlan ? "Yes" : "No",
      ...eventConfig.attendanceSessions.map((s) => (attended.has(s.id) ? "Present" : "")),
    ]
      .map(esc)
      .join(",");
  });

  return [headers.map(esc).join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
