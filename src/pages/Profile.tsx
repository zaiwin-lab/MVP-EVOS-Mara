import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";
import type {
  CidbGrade,
  CompanyProfile,
  DigitalStatus,
  DocumentStatus,
} from "../data/types";

const CIDB_GRADES: CidbGrade[] = ["G1", "G2", "G3", "G4", "G5", "G6", "G7"];
const CATEGORIES = [
  "Building works",
  "Civil engineering",
  "Roadworks",
  "Mechanical",
  "Electrical",
  "Infrastructure",
  "Maintenance",
  "Supplies",
  "Technical services",
  "Consultancy",
  "Other",
];
const CAPABILITIES = [
  "Building works",
  "Civil engineering",
  "Roadworks",
  "Mechanical",
  "Electrical",
  "Infrastructure",
  "Maintenance",
  "Supplies",
  "Technical services",
  "Consultancy",
  "Other",
];
const AGE_RANGES = ["Under 35", "35–44", "45–54", "55–65", "Above 65"];
const DIGITAL_LINK_FIELDS: { key: keyof CompanyProfile["digitalLinks"]; label: string; placeholder: string }[] = [
  { key: "website", label: "Website", placeholder: "https://" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/…" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/…" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@…" },
  { key: "googleBusiness", label: "Google Business / Maps", placeholder: "https://maps.app…" },
  { key: "whatsappBusiness", label: "WhatsApp Business", placeholder: "e.g. 0138765432" },
  { key: "corporateEmail", label: "Corporate Email", placeholder: "info@company.com" },
];
const DOCUMENTS = [
  { key: "companyProfile", label: "Company Profile" },
  { key: "capabilityStatement", label: "Capability Statement" },
  { key: "cidbCertificate", label: "CIDB Certificate" },
  { key: "mofRegistration", label: "MOF / Relevant Registration" },
  { key: "orgChart", label: "Organisation Chart" },
  { key: "projectPortfolio", label: "Project Portfolio" },
];
const DOC_STATUSES: { value: DocumentStatus; label: string }[] = [
  { value: "available_updated", label: "Available & updated" },
  { value: "needs_improvement", label: "Available, needs improvement" },
  { value: "not_available", label: "Not yet available" },
];

const SECTIONS = ["Participant", "Company", "Capabilities", "Digital", "Documents"];

export default function Profile() {
  const navigate = useNavigate();
  const { participantId, record, loading, refresh } = useParticipant();
  const [section, setSection] = useState(0);
  const [saving, setSaving] = useState(false);

  // participant-level fields
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [district, setDistrict] = useState("");

  // company profile fields
  const [profile, setProfile] = useState<CompanyProfile>({
    participantId: "",
    registrationNumber: "",
    establishedYear: "",
    cidbGrade: "",
    category: "",
    employeeCount: "",
    mainServiceArea: "",
    experienceYears: "",
    completedProjects: "",
    capabilities: [],
    digitalLinks: {},
    digitalStatus: "",
    documents: {},
    documentLinks: {},
    updatedAt: "",
  });

  useEffect(() => {
    if (record?.participant) {
      setEmail(record.participant.email ?? "");
      setPosition(record.participant.position ?? "");
      setAgeRange(record.participant.ageRange ?? "");
      setDistrict(record.participant.district ?? "");
    }
    if (record?.profile) {
      setProfile({ ...record.profile });
    }
  }, [record]);

  const set = <K extends keyof CompanyProfile>(key: K, value: CompanyProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const toggleCapability = (cap: string) =>
    setProfile((p) => ({
      ...p,
      capabilities: p.capabilities.includes(cap)
        ? p.capabilities.filter((c) => c !== cap)
        : [...p.capabilities, cap],
    }));

  const pct = useMemo(() => Math.round(((section + 1) / SECTIONS.length) * 100), [section]);

  if (!loading && !participantId) {
    return (
      <AppShell header title="My Profile">
        <NeedCheckIn onCheckIn={() => navigate("/check-in")} />
      </AppShell>
    );
  }

  async function saveAll(goNext: boolean) {
    if (!participantId) return;
    setSaving(true);
    try {
      await store.updateParticipant(participantId, { email, position, ageRange, district });
      await store.saveProfile({ ...profile, participantId, updatedAt: new Date().toISOString() });
      await refresh();
      if (goNext) navigate("/journey");
    } finally {
      setSaving(false);
    }
  }

  const isLast = section === SECTIONS.length - 1;

  return (
    <AppShell
      header
      title="Contractor Profile"
      onBack={() => (section === 0 ? navigate("/journey") : setSection((s) => s - 1))}
      footer={
        <div className="flex gap-3">
          {section > 0 && (
            <button onClick={() => setSection((s) => s - 1)} className="btn-outline flex-1">
              Back
            </button>
          )}
          {isLast ? (
            <button onClick={() => saveAll(true)} disabled={saving} className="btn-gold flex-[2]">
              {saving ? "Saving…" : "Save Profile"}
              {!saving && <Icon name="check" className="h-5 w-5" />}
            </button>
          ) : (
            <button
              onClick={async () => {
                await saveAll(false);
                setSection((s) => s + 1);
              }}
              disabled={saving}
              className="btn-primary flex-[2]"
            >
              Continue
              <Icon name="arrowRight" className="h-5 w-5" />
            </button>
          )}
        </div>
      }
    >
      {/* progress */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between text-xs font-semibold text-navy-500">
          <span>
            Section {section + 1} of {SECTIONS.length} · {SECTIONS[section]}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-100">
          <div className="h-full rounded-full bg-gold-400 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="px-5 py-6">
        {section === 0 && (
          <Sec title="Participant Information" desc="Confirm your personal details.">
            <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@company.com" />
            <Field label="Position in Company" value={position} onChange={setPosition} placeholder="e.g. Managing Director" />
            <Select label="Age Range (optional)" value={ageRange} onChange={setAgeRange} options={AGE_RANGES} />
            <Field label="District / Operating Location" value={district} onChange={setDistrict} placeholder="e.g. Miri" />
          </Sec>
        )}

        {section === 1 && (
          <Sec title="Company Information" desc="Tell us about your business.">
            <Field label="Company Registration Number" value={profile.registrationNumber ?? ""} onChange={(v) => set("registrationNumber", v)} placeholder="e.g. 202301012345 (SSM)" />
            <Field label="Year Established" value={profile.establishedYear ?? ""} onChange={(v) => set("establishedYear", v)} placeholder="e.g. 2015" inputMode="numeric" />
            <Select label="CIDB Grade" value={profile.cidbGrade ?? ""} onChange={(v) => set("cidbGrade", v as CidbGrade)} options={CIDB_GRADES} />
            <Select label="Primary Business Category" value={profile.category ?? ""} onChange={(v) => set("category", v)} options={CATEGORIES} />
            <Field label="Number of Employees" value={profile.employeeCount ?? ""} onChange={(v) => set("employeeCount", v)} placeholder="e.g. 12" inputMode="numeric" />
            <Field label="Main Service Area" value={profile.mainServiceArea ?? ""} onChange={(v) => set("mainServiceArea", v)} placeholder="e.g. Northern Sarawak" />
            <Field label="Years of Experience" value={profile.experienceYears ?? ""} onChange={(v) => set("experienceYears", v)} placeholder="e.g. 8" inputMode="numeric" />
            <Field label="Approx. Completed Projects" value={profile.completedProjects ?? ""} onChange={(v) => set("completedProjects", v)} placeholder="e.g. 20" inputMode="numeric" />
          </Sec>
        )}

        {section === 2 && (
          <Sec title="Construction Capabilities" desc="Select all that apply to your company.">
            <div className="grid grid-cols-2 gap-2.5">
              {CAPABILITIES.map((cap) => {
                const active = profile.capabilities.includes(cap);
                return (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => toggleCapability(cap)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left text-sm font-semibold transition ${
                      active
                        ? "border-gold-400 bg-gold-50 text-navy-900"
                        : "border-navy-100 bg-white text-navy-600"
                    }`}
                  >
                    <span>{cap}</span>
                    {active && <Icon name="check" className="h-4 w-4 text-gold-600" />}
                  </button>
                );
              })}
            </div>
          </Sec>
        )}

        {section === 3 && (
          <Sec title="Digital Presence" desc="Share your online links. Leave blank if not available yet.">
            <div className="mb-2">
              <span className="field-label">Overall digital status</span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { v: "available", l: "Available" },
                    { v: "planning", l: "Developing" },
                    { v: "not_available", l: "Not yet" },
                  ] as { v: DigitalStatus; l: string }[]
                ).map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => set("digitalStatus", o.v)}
                    className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                      profile.digitalStatus === o.v
                        ? "border-navy-800 bg-navy-800 text-white"
                        : "border-navy-100 bg-white text-navy-600"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
            {DIGITAL_LINK_FIELDS.map((f) => (
              <Field
                key={f.key}
                label={f.label}
                value={profile.digitalLinks[f.key] ?? ""}
                onChange={(v) => set("digitalLinks", { ...profile.digitalLinks, [f.key]: v })}
                placeholder={f.placeholder}
              />
            ))}
          </Sec>
        )}

        {section === 4 && (
          <Sec title="Business Documents" desc="Tell us the status of each document. Uploads are optional for now.">
            <div className="space-y-4">
              {DOCUMENTS.map((doc) => (
                <div key={doc.key} className="rounded-xl border border-navy-100 p-3">
                  <div className="mb-2 text-sm font-bold text-navy-800">{doc.label}</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {DOC_STATUSES.map((st) => (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() =>
                          set("documents", { ...profile.documents, [doc.key]: st.value })
                        }
                        className={`rounded-lg border px-1.5 py-2 text-[11px] font-semibold leading-tight transition ${
                          profile.documents[doc.key] === st.value
                            ? "border-gold-400 bg-gold-50 text-navy-900"
                            : "border-navy-100 bg-white text-navy-500"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                  <input
                    className="field-input mt-2 text-sm"
                    placeholder="Optional: link to this document"
                    value={profile.documentLinks[doc.key] ?? ""}
                    onChange={(e) =>
                      set("documentLinks", { ...profile.documentLinks, [doc.key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
          </Sec>
        )}
      </div>
    </AppShell>
  );
}

// ── small form primitives ─────────────────────────────────────
function Sec({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up">
      <h2 className="font-display text-xl font-extrabold text-navy-900">{title}</h2>
      <p className="mt-1 text-sm text-navy-500">{desc}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        value={value}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function NeedCheckIn({ onCheckIn }: { onCheckIn: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <Icon name="lock" className="h-10 w-10 text-navy-300" />
      <h2 className="mt-4 font-display text-lg font-extrabold text-navy-900">Please check in first</h2>
      <p className="mt-1 max-w-xs text-sm text-navy-500">
        Complete your quick check-in to unlock your contractor profile.
      </p>
      <button onClick={onCheckIn} className="btn-gold mt-6 w-full">
        Check In Now
      </button>
    </div>
  );
}
