/**
 * Tidy a name or a co-operative name for print.
 *
 * Someone filling in a form on a phone at a venue types "dominic anak jugah"
 * or "koperasi serba guna kuching". That is fine on screen and wrong on a
 * certificate, so the site capitalises it before it is stored.
 *
 * The rule is deliberately one-directional: it only ever ADDS a capital to a
 * word that is entirely lowercase. It never takes one away. That is what lets
 * "KOBIS", "SDEC", "UNIMAS", "KO-BIS", "McDonald" and "IBM" survive untouched —
 * there is no way to tell an acronym from a shouted word, so the safe choice is
 * to trust any capital the person typed themselves.
 *
 * A consequence worth knowing: someone who types their whole name in capitals
 * keeps it that way. Lower-casing it would destroy the acronyms above, and on
 * a certificate an all-capitals name still reads as formal.
 */

/**
 * Words that stay lowercase inside a name: Malay and Iban patronymics, and the
 * particles that turn up in names across the region. They are only lowered
 * when they sit between other words — a co-operative actually called "Anak
 * Sarawak" keeps its capital.
 */
const PARTICLES = new Set([
  // Malay / Iban patronymics
  "bin", "binti", "binte", "bt", "bte", "anak", "ak",
  // a/l, a/p — anak lelaki / anak perempuan
  "a", "l", "p",
  // Arabic and European particles
  "al", "el", "de", "del", "di", "da", "do", "dos", "van", "von", "der", "den",
]);

/** Capitalise one run of letters, but only if the person typed it all lowercase. */
function capitalise(segment: string): string {
  if (!segment) return segment;
  // Any capital at all means they meant it — an acronym, or a name like
  // "McDonald" that a naive rule would flatten.
  if (segment !== segment.toLowerCase()) return segment;
  return segment[0].toUpperCase() + segment.slice(1);
}

/**
 * Capitalise a word, treating the punctuation inside it as word boundaries so
 * "pekerja-pekerja" becomes "Pekerja-Pekerja" and "a/l" stays "a/l".
 */
function properWord(word: string, isFirst: boolean): string {
  if (PARTICLES.has(word.toLowerCase()) && !isFirst) return word.toLowerCase();

  // Split on hyphens, slashes and apostrophes, keeping them in place.
  return word.replace(/[^-/'’.]+/g, (segment, offset: number) => {
    const first = isFirst && offset === 0;
    if (PARTICLES.has(segment.toLowerCase()) && !first) return segment.toLowerCase();
    return capitalise(segment);
  });
}

/**
 * Trim, collapse runs of whitespace, and capitalise each word.
 * Returns "" for empty input, so callers can keep their own fallbacks.
 */
export function toProperName(value: string | undefined | null): string {
  const words = (value ?? "").trim().split(/\s+/).filter(Boolean);
  return words.map((word, i) => properWord(word, i === 0)).join(" ");
}
