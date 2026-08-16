# Attendify EventOS™

> **Portfolio maturity:** Pilot Ready · Digital Participant Journey & Programme Operations Platform

[Open live demonstration](https://kbtmaravdp.uk)

**One Scan. One Journey. From Attendance to Action.**

A mobile-first platform that unifies attendance, participant profiling, readiness assessment, learning resources, action planning and programme reporting for training, entrepreneurship and community initiatives.

## Business Value

- replaces fragmented forms, links and spreadsheets with one participant journey;
- gives programme teams clearer evidence of attendance, readiness and completion;
- supports personalised results and 90-day participant action plans;
- provides supervisors with searchable records, summary insights and CSV export;
- can be configured for different programmes without rebuilding the entire platform.

> Attendify™ is an independent event-platform prototype by **KOBIS Berhad**.
> Event configurations are illustrative and do not imply platform ownership,
> commissioning or endorsement by any external organisation.

---

## What it does

Turns a three-day training programme into a simple digital journey:

```
Scan QR → Confirm Attendance → Contractor Profile → Readiness Assessment
        → Personalised Results → Resources → 90-Day Action Plan → Reflections
```

Plus a password-protected **admin dashboard** for the event supervisor:
live attendance, completion stats, group readiness averages, per-participant
results, search/filter, and CSV export.

---

## Tech stack

- **React 18 + TypeScript + Vite** — fast, reliable, no SSR complexity
- **Tailwind CSS** — navy/gold design system (see `tailwind.config.js`)
- **Storage abstraction** (`src/data/store.ts`):
  - **localStorage** by default — works instantly, zero setup, great for a
    single kiosk device or a demo.
  - **Supabase** when env vars are present — a shared backend so the admin
    dashboard sees every participant's phone in real time.
- **qrcode** — in-app + scripted QR PNG generation
- Deploys to **Netlify** (config included) or any static host.

No backend is required to run or demo the app.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

Build for production:

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

---

## Configuration (all optional)

Copy `.env.example` → `.env`:

| Variable | Purpose | Default |
|---|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Shared backend (see below) | unset → localStorage |
| `VITE_ADMIN_PASSWORD` | Required password for `/admin`; set securely in the deployment environment | no public default |
| `VITE_PUBLIC_URL` | Live origin used for QR links | current browser origin |

### Enabling the shared backend (recommended for the live event)

Without this, each device stores its own data locally — fine for a demo, but
the admin on device A won't see participants who checked in on device B. For the
real event where one supervisor watches everyone, enable Supabase:

1. Create a free project at <https://supabase.com>.
2. In the SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql).
3. Put the Project URL + anon key into `.env` (the two `VITE_SUPABASE_*` vars).
4. Redeploy. The app auto-detects the env and switches backend — the admin
   header shows **“Shared backend”** instead of **“On-device data.”**

---

## Deployment (Netlify)

1. Push this repo to GitHub and “Add new site → Import” in Netlify, **or** drag
   the `dist/` folder into Netlify Drop.
2. Build command `npm run build`, publish directory `dist` (already set in
   `netlify.toml`, which also handles SPA deep-link routing).
3. Add the environment variables from `.env` in **Site settings → Environment**.
4. After deploy, set `VITE_PUBLIC_URL` to your live URL and re-generate QR codes
   (below) so they point at production.

Works the same on Vercel or any static host (ensure SPA fallback to
`index.html`).

---

## QR codes

Two entry points:

| QR | Links to | Use |
|---|---|---|
| **Check-In** | `/event/vdp-frontier-miri/check-in` | Registration counter |
| **Portal** | `/event/vdp-frontier-miri` | General access, WhatsApp, slides |

- **In-app:** visit `/qr` to view and download both as high-res PNGs.
- **Scripted:** `node scripts/generate-qr.mjs https://your-live-url` writes
  print-ready PNGs to `public/qr/`.

---

## Admin

- Set a strong `VITE_ADMIN_PASSWORD` in the protected deployment environment before launch.
- Go to `/admin` and use the privately managed administrator credential.
- Summary stats, group readiness averages, insight cards, participant table with
  search/filter, per-participant detail (`/admin/participant/:id`), and **Export
  CSV**.

---

## Sample data

On a fresh device, 20 realistic sample participants are seeded automatically so
the dashboard is never empty during a demo (`src/data/seed.ts`). This runs only
against localStorage and never against Supabase. To clear it, clear the browser's
site data.

---

## Project structure

```
src/
  config/eventConfig.ts     # single source of truth for event branding/details
  content/
    programme.ts            # days, trainers, resources
    assessment.ts           # KBT Readiness Index: indicators, questions, scale
  data/
    types.ts  store.ts  supabaseClient.ts  seed.ts
  lib/  scoring.ts  csv.ts
  components/                # AppShell, Brand, Icon, RadarChart, ScoreRing, QRCode…
  context/                   # ParticipantContext, I18nContext (EN/BM)
  pages/                     # Landing, CheckIn, Journey, Profile, Assessment,
                             # Results, ActionPlan, Reflection, Resources, QR
    admin/                   # AdminDashboard, AdminParticipant
supabase/schema.sql
scripts/generate-qr.mjs
```

See [`HANDOVER.md`](HANDOVER.md) for “how to change the event, resources, and
create another event from the same platform.”

---

## Status & Delivery Role

**Status:** Pilot Ready — suitable for controlled demonstrations and stakeholder testing. A live multi-device programme requires the shared Supabase backend, securely managed administrator access, verified programme content, privacy notices, consent, retention rules and operational support.

Product strategy, participant journey, programme workflow and solution direction are led by **Ts. Zaiwin Kassim**, together with the **KOBIS AI Prodigy Team**, using supervised AI-assisted development.

Powered by **Attendify EventOS™** · An innovation by KOBIS Berhad
*Smart Digital Solutions. Sustainable Impact.*
