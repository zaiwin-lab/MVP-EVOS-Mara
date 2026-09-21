# Attendify™ — Handover Note

A short, practical guide for the event administrator and the next developer.
No deep technical knowledge needed for the day-to-day tasks.

---

## 1. How to update event information

All event branding and details live in **one file**:
`src/config/eventConfig.ts`.

```ts
export const eventConfig = {
  product: "KBT EventOS",
  module: "Attendify™",
  eventName: "VDP Frontier MARA Miri",
  dates: "14–16 July 2026",
  venue: "MARA Miri",
  organiser: "Majlis Amanah Rakyat — MARA",
  collaborator: "KOBIS Berhad",
  expectedParticipants: 20,
  // …
};
```

Change the values, rebuild (`npm run build`), redeploy. The whole UI updates —
nothing is hard-coded elsewhere.

Programme days and trainer profiles live in `src/content/programme.ts`.

---

## 2. How to replace resource links

Open `src/content/programme.ts` → the `RESOURCES` array. Each card:

```ts
{ id: "brochure", title: "Programme Brochure", description: "…", icon: "doc",
  url: "https://link-to-file" }
```

- **Add a `url`** → the card becomes a working download/open link.
- **Leave `url` empty** → the card shows **“Coming During the Programme.”**

Rebuild and redeploy. (These are intentionally kept in one file so a
non-developer can edit them quickly during the event.)

---

## 3. How to view participant records

1. Go to `/admin` and sign in (default password `attendify2026`, change via the
   `VITE_ADMIN_PASSWORD` env var).
2. The dashboard shows attendance, completion counts, group readiness averages,
   and insight cards.
3. Use **search** (name / company / mobile / grade) and the **filter** dropdown.
4. Click **View** on any participant to see their full profile, readiness result
   (score, radar, recommendations), action plan, and reflections.

> **Important:** if you want ONE admin device to see EVERY participant, the app
> must run with the **shared Supabase backend** enabled (see README → “Enabling
> the shared backend”). On the default on-device mode, each phone only holds its
> own data. The admin header tells you which mode is active.

---

## 4. How to export results

On the admin dashboard, click **Export CSV** (top right). You get one row per
participant with contact details, CIDB grade, category, total score, each of the
five indicator scores, readiness category, and completion flags. Opens directly
in Excel / Google Sheets.

---

## 4b. Languages (English · Bahasa Melayu · 中文 · Bahasa Iban)

A language picker (globe icon, top-right of every screen) lets participants
switch between the four languages; the choice is remembered on their device.

What is translated in all four languages today:
- The interface: navigation, buttons, the check-in flow, and the assessment
  **answer options**.
- The 20 assessment **questions**: English, Bahasa Melayu and 中文 are fully
  translated. For **Bahasa Iban**, the long questions currently fall back to
  Bahasa Melayu (which Iban speakers in Sarawak read fluently) — the Iban
  answer labels and interface labels are best-effort and **should be reviewed
  by a native Iban speaker** (your Sarawak trainers can do this quickly).
- Still in English for now (can be expanded later): the marketing landing
  copy, and the results narrative (personalised summary + recommendations).

Where to edit translations:
- Interface labels: `src/context/I18nContext.tsx` (the `DICT` object —
  each entry has `en`, `bm`, `zh`, `iban`).
- Assessment questions & answers: `src/content/assessment.ts`
  (`ANSWER_SCALE` labels, and each question's `text` / `textLocal` / `textZh`).

Add or correct a language string, rebuild, redeploy — the picker does the rest.

## 5. How to create another event from the same platform

Attendify is built to be reused. To stand up a new programme:

1. **Copy the event config.** Edit `src/config/eventConfig.ts` with the new
   event's name, slug, dates, venue, branding, and expected participants.
   (The `slug` drives the QR URLs, e.g. `/event/<slug>/check-in`.)
2. **Swap the content** in `src/content/programme.ts` (days, trainers,
   resources).
3. **Reuse or swap the assessment.** The assessment is a data-driven engine
   (`src/content/assessment.ts`, template id `contractor-readiness-v1`). The same
   components can render other templates — *SME / Cooperative / Digital / ESG /
   Startup / Vendor Readiness* — by editing the `INDICATORS`, `ANSWER_SCALE`, and
   `RESULT_CATEGORIES` objects. Scoring, radar, results, and CSV all follow
   automatically.
4. **Re-theme (optional).** Colours are Tailwind tokens (`navy`, `gold`, `sand`)
   in `tailwind.config.js` — change them to match a new client's brand.
5. **Regenerate QR codes** for the new slug:
   `node scripts/generate-qr.mjs https://new-live-url`.
6. Rebuild and deploy as a new site.

Because event data is separated from UI, a second event is a config change, not a
rewrite — the foundation for future **multi-event / multi-client / KBT ProgramOS**
expansion.

---

## Deferred to Version 2 (clean extension points, intentionally not built)

- File **uploads** (currently status selectors + optional URL fields)
- PDF readiness report / certificate generator
- Email / WhatsApp / SMS confirmations
- Full bilingual translation (core EN/BM labels are in place)
- Multi-event switching UI, multi-tenant admin roles & permissions
- Feedback surveys, alumni engagement, trainer dashboards
- Live external AI calls (recommendations are rule-based by design)

Each of these has a natural home in the existing structure (config objects, the
storage abstraction, or the assessment engine) and can be added without
reworking the core.

---

Powered by **KBT EventOS — Attendify™** · An Innovation by KOBIS Berhad

---

## Programme day: attendance and the e-certificate

### The QR everyone scans on the day

The admin console (`/admin`) generates it under **QR Kehadiran — Hari Program**.
It points at `/hadir`, not at the registration form.

What a participant sees when they scan:

1. Not signed in → phone number and email, right there on the page. No
   redirect: bouncing people between pages after they have scanned is where
   check-ins get lost at a venue.
2. Signed in → their name, and one **Saya Hadir** button.
3. Tapped → confirmation, and the room counter moves.

The counter on that page and on the admin dashboard reads **present / expected**.
The denominator is `expectedParticipants` in `src/config/eventConfig.ts` — change
that one number if the group size changes. It refreshes every 12 seconds while
the page is open, so the organiser can leave the dashboard up on a laptop.

Scanning twice does not double count.

The second QR, collapsed under the first, still points at `/check-in` for
sign-ups before the day.

### Who counts as present

Check-in is self-service: anyone holding the QR link can mark themselves. The
organiser has the last word in the participant table — the attendance cell is a
button. Clicking it marks someone present, or revokes it after a confirmation
that warns their e-certificate goes with it.

### The e-certificate

Lives at `/sijil`. It is issued off attendance: no attendance mark, no
certificate. Participants reach it from My Space, which tells them whether it is
ready or what it is waiting for.

They save it with **Cetak / Simpan PDF**, which opens the print dialog — "Save as
PDF" there gives them the sheet on its own, without the site's header and footer.
This works on a phone as well as a laptop.

### Using your own certificate design

The site draws a certificate by default. To use your own instead:

1. Export your design as an image, A4 landscape (297×210mm). At 300dpi that is
   3508×2480px, which prints cleanly.
2. Put it in `public/` — for example `public/sijil.png`.
3. In `src/config/eventConfig.ts`, set `certificate.artworkUrl` to `"/sijil.png"`.

Your image then becomes the certificate, and the site overlays only what changes
per participant: their name, their co-operative, and (if `showSerial` is on) the
serial and issue date along the bottom. Leave space for those in your design.

The other knobs in `certificate`:

- `namePositionPct` — how far down the sheet the name sits, as a percentage.
- `nameColor` / `metaColor` — ink for the overlaid text, so it can be tuned to
  your artwork.
- `showSerial` — set to `false` if your design carries its own reference.
