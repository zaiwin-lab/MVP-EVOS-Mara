# CEOnita Strategik — Women’s Leadership Programme Portal

> **Maturity: active pre-event programme build · recovery candidate on a non-default branch**

CEOnita Strategik is a bilingual-first digital programme portal for a two-day women’s leadership and business-development experience. The application combines programme information, participant registration, attendance, an AI-readiness snapshot, a reusable prompt toolkit, resources, an administrative view and attendance-gated e-certificates.

## Source-capture status

This source is currently preserved on the `claude/ceonita-strategik` branch of the unrelated `MVP-EVOS-Mara` repository.

- The branch is **46 commits ahead** of the repository’s Attendify default branch.
- Its latest inspected commit is [`1fefffaa`](https://github.com/zaiwin-lab/MVP-EVOS-Mara/commit/1fefffaa655eefc875a9d69913b3a9690c468de3).
- The default branch still presents Attendify EventOS, not CEOnita.
- No dedicated CEOnita repository or verified public live URL was found during the 27 September 2026 review.
- This README documents the branch truthfully; it does not make the branch the canonical release.

Do **not** merge this branch into Attendify or deploy it over another programme. The safest recovery is a dedicated CEOnita repository created from an audited source snapshot using the actual recovery date.

## Programme identity represented in the source

The inspected configuration identifies:

- **Product:** CEOnita
- **Module:** Strategik
- **Theme:** Transformasi Kepimpinan Wanita Dalam Ekosistem Ekonomi MADANI
- **Dates:** 28–29 September 2026
- **Venue:** Mines Beach Resort, Seri Kembangan, Selangor
- **Expected capacity:** 30 participants
- **Delivery collaborator named in the configuration:** KOBIS Berhad

These are source-recorded programme details, not independent proof of attendance, organiser approval, outcomes, accreditation, sponsorship or public launch.

## Business problem

Leadership programmes often scatter the agenda, participant records, learning tools, attendance, resources and certificates across separate forms and files. CEOnita explores one mobile-friendly journey that keeps those touchpoints together while giving the delivery team an operational view.

## Intended users

- women entrepreneurs and business owners
- CEOs, managing directors, board members and senior managers
- programme facilitators and administrators
- KOBIS delivery personnel supporting the programme

These are intended users described by the source, not evidence of adoption.

## Capabilities evidenced in this branch

- Bahasa Malaysia and English programme experience, with additional Mandarin and Iban interface foundations
- programme agenda, participant information and trainer pages
- participant registration with programme-specific reference generation
- separate QR-based attendance rather than treating registration as attendance
- optional phone-camera QR scanning with a browser fallback
- five-question AI-readiness guidance
- a 60-prompt library across six business work areas
- generated prompts for use in external tools such as ChatGPT, Claude or Gemini
- resource and gallery links
- an administrative dashboard for registration, attendance and prompt activity
- attendance-gated e-certificate generation
- browser-local storage by default and an optional Supabase storage adapter
- event-specific data separation through the `ceonita-strategik-2026` slug

The prompt builder is deterministic template assembly. It does not call a paid AI API or operate as an autonomous AI system.

## Technology

- React 18, TypeScript and Vite
- React Router
- Tailwind CSS
- Supabase client integration when configured
- localStorage fallback
- QRCode and jsQR
- Netlify static-site configuration

## Delivery role

Product direction, programme workflow and supervised AI-assisted delivery are led by **Ts. Zaiwin Kassim** with the **KOBIS AI Prodigy Team**. AI-assisted implementation does not transfer responsibility for programme facts, participant data, testing or release approval away from human owners.

## Responsible use and known limitations

- **Repository placement is wrong.** CEOnita is mixed into an Attendify repository and should be recovered into its own governed project.
- **Documentation drift remains.** `package.json`, `HANDOVER.md` and several internal labels still contain ProgramOS Lite, ANGKASA, cooperative or Attendify wording. They must be reconciled before calling this a clean CEOnita release.
- **No live deployment was verified.** Repository code and configuration do not prove that the current branch is deployed.
- **Client-side admin access is not production authentication.** A `VITE_ADMIN_PASSWORD` is delivered to the browser bundle. Real participant administration requires server-side authentication and role-based authorization.
- **Participant sign-in is lightweight.** Mobile number and email matching is not identity verification.
- **Self-service attendance needs supervision.** Anyone with the attendance link may attempt to mark attendance; the administrator remains responsible for the final record.
- **Supabase mode needs policy verification.** A configured client and event slug do not by themselves prove correct RLS, isolation, backup, retention or deletion controls.
- **Personal data requires consent and governance.** Names, phone numbers, emails, companies, roles, attendance and prompt content should only be collected with an approved notice, minimum-data rules, restricted access and retention/deletion procedures.
- **Trainer, programme and institutional statements need owner approval.** Profiles, credentials, schedules, logos, claims and resource links must be verified by the organiser before publication.
- **Translations need human review.** Iban content is explicitly marked in source as requiring native-speaker validation.
- **Certificate issuance is not accreditation.** Attendance-gated generation does not establish external recognition or qualification.

## Recovery checklist

1. Obtain the exact deployed CEOnita source or deployment artifact, if a deployment exists.
2. Compare it with this branch and record any live-only differences.
3. Create a dedicated CEOnita repository from the audited source using a current-date recovery commit.
4. Preserve a provenance note linking back to this branch and its commit history.
5. Remove stale Attendify, ANGKASA, cooperative and ProgramOS labels.
6. confirm authorised programme copy, trainer information, logos, folders and public URL.
7. replace client-side administration with governed server-side access before real participant-data operations.
8. build, test and document the final default-branch release.

## Evidence boundary

This README describes inspected repository evidence only. It does not claim programme delivery, participant numbers, outcomes, revenue, credentials, affiliations, endorsements, accreditation or production readiness.
