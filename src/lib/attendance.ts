import { eventConfig } from "../config/eventConfig";

/** The one session this programme runs. */
export const SESSION = eventConfig.attendanceSessions[0].id;

/** Paths the attendance QR is allowed to point at. */
const ATTEND_PATHS = ["/hadir", "/attend"];

/**
 * Does this scanned text look like the attendance QR for this programme?
 *
 * The QR the admin console prints holds a URL, so it works two ways: a phone's
 * own camera app opens it, and the in-page scanner reads the same code. The
 * origin is deliberately not pinned — the QR may have been generated against a
 * preview URL, or the site may move to its own domain, and a code that stops
 * working on the morning of the programme is worse than a loose check.
 */
export function isAttendanceCode(text: string): boolean {
  const raw = text.trim();
  if (!raw) return false;

  // A plain token, for an organiser who generates the QR themselves.
  if (raw.toLowerCase() === `${eventConfig.slug}:hadir`) return true;

  try {
    // `base` lets a relative path like "/hadir" parse too.
    const url = new URL(raw, window.location.origin);
    const path = url.pathname.replace(/\/+$/, "").toLowerCase();
    return ATTEND_PATHS.some((p) => path === p || path.endsWith(p));
  } catch {
    return false;
  }
}
