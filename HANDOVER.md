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

### Registering is not attending

These are two separate steps, deliberately:

1. **Before the day** — people create an account at `/check-in` or `/register`,
   or sign in at `/login`. Nothing about this marks them present.
2. **On the day** — they scan the QR at the venue, which marks attendance.

No sign-up path touches the attendance table. The only two things that mark
someone present are the scan page and the organiser's toggle in the admin
participant list.

### The QR everyone scans on the day

The admin console (`/admin`) generates it under **QR Kehadiran — Hari Program**.
It points at `/hadir`, not at the registration form.

What a participant sees when they scan:

1. Not signed in → phone number and email, right there on the page. No
   redirect: bouncing people between pages after they have scanned is where
   check-ins get lost at a venue.
2. Signed in → their name, and one **Saya Hadir** button.
   - A walk-in with no account follows "Daftar di sini", which carries
     `?next=/hadir`; after registering, the success screen's main button takes
     them straight back to the scan page rather than leaving them stranded.
3. Tapped → confirmation, and the room counter moves.

The counter on that page and on the admin dashboard reads **present / expected**.
The denominator is `expectedParticipants` in `src/config/eventConfig.ts` — change
that one number if the group size changes. It refreshes every 12 seconds while
the page is open, so the organiser can leave the dashboard up on a laptop.

Scanning twice does not double count.

The second QR, collapsed under the first, still points at `/check-in` for
sign-ups before the day.

### Scanning inside the website

Participants do not have to leave the site. **Ruang Saya** (the profile page)
carries an **Imbas QR** button: it opens the phone camera inside the page, reads
the QR, and marks attendance without navigating anywhere. The same button is on
`/hadir`.

Both paths work, deliberately:

- Scanning with the phone's own camera app opens `/hadir`, where one tap marks
  attendance.
- Scanning from inside the site marks it directly.

That is why the QR holds a URL rather than a bare token.

A scan only counts if the code belongs to this programme — anything else is
rejected with "bukan kod QR kehadiran". The check accepts any URL whose path
ends in `/hadir` or `/attend`; the origin is deliberately not pinned, so a code
generated against a preview URL still works on the day.

Requirements and fallbacks:

- The camera needs **https**. Netlify provides it. Over plain http the page says
  so rather than failing silently.
- If the camera is blocked or missing, the panel explains and points at the
  **Saya Hadir** button, which marks attendance without a camera.
- Decoding uses the browser's native barcode reader where there is one
  (Chrome on Android) and falls back to jsQR everywhere else, including iOS
  Safari. jsQR is a separate 130KB chunk fetched only when the scanner opens,
  so it costs nothing to anyone who never scans.
- The camera is released as soon as the panel closes.

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

### Partner logos

The three logos live in `public/logos/` (`kobis.png`, `angkasa.png`,
`sdec.png`) and are referenced from `partners[].logo` in
`src/config/eventConfig.ts`. To replace one, drop a new PNG with a
transparent or white background in that folder under the same name.

`partners[].logoScale` next to it is an optical correction, not a bug: the
logos are set to one common height, which makes a wide wordmark like KO-BIS
dominate a squarer emblem like ANGKASA even though both are technically the
same size. The current values were measured off the printed reference —
KOBIS 1.4, ANGKASA 2.45, SDEC 1.7. Adjust until the row looks even, not until
the numbers match.

The certificate shows the partners in the printed design's order —
KOBIS · ANGKASA · SDEC — which is not the order the site footer uses. That
order is `CERT_PARTNER_ORDER` at the top of `src/pages/Certificate.tsx`.

### The date on the certificate

`certificate.issuedDate` in `src/config/eventConfig.ts` decides it:

- `"programme"` (current) — every certificate reads the programme date, which
  is what the printed reference shows and what keeps them all identical.
- `"attendance"` — the moment that person was actually marked present. More
  literally true, but someone the organiser marks present a day late would
  carry a different date to everyone else.

The attendance timestamp is recorded either way; this only changes what the
sheet prints.

### The certificate artwork

The certificate is the organiser's own artwork, `public/sijil.jpg`. Everything
printed on it — the heading, the programme name, the date, the venue, the three
partner logos and the Chairman's signature — is part of that image. The site
adds exactly two things: the participant's name on the upper gold rule, and
their co-operative on the rule below "of".

Both are positioned in `src/config/eventConfig.ts` under `certificate`:

- `fieldInsetPct` — how far in from each edge the fields start, matching the
  width of the printed rules (22%).
- `name` and `organisation` — each has `bottomPct` (where the bottom of the
  line sits, as a percentage of the height, so the text rests on the rule),
  `sizePct` (type size as a percentage of the width), `color` and `weight`.
- `showSerial` — off, because the artwork leaves no clear margin for one. The
  reference is still shown on screen under the certificate.
- `issuedDate` — only read when `showSerial` is on.

The numbers came from measuring the supplied file: the upper rule sits at
44.45% of the height, the lower one at 52.65%, and both run from 21.9% to
78.1% across. If the artwork is ever redrawn, re-measure and update those.

Long names are handled by shrinking the line, not by wrapping or truncating —
`CertLine` in `src/pages/Certificate.tsx` measures after the webfont loads and
steps the size down until the line fits, to a floor of half the configured
size. Co-operative names here run long, and a smaller line is better than a
second one.

### Replacing the artwork

1. Export the new design as an image, A4 landscape (297×210mm). At 300dpi that
   is 3508×2480px. The current file is 1491×1055, which is what was supplied.
2. Put it in `public/` and point `certificate.artworkUrl` at it.
3. Measure the new rule positions and update `name.bottomPct`,
   `organisation.bottomPct` and `fieldInsetPct`.

Set `artworkUrl` to `""` to fall back to the layout the site draws itself,
which is still in `Certificate.tsx` and needs no artwork.

### Changing the signature

The signature on the sheet is part of the artwork, so a new one means a new
image — there is nothing to change in the code unless the rules move.

