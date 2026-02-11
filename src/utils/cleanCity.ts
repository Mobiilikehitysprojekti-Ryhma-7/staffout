// Function to keep city UI clean.

// Allowed: letters (incl. ÅÄÖ), spaces, hyphen, apostrophe
const CITY_ALLOWED = /^[A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö\s'-]{2,40}$/;

function toTitleCase(s: string) {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function cleanCity(raw: unknown): string | null {
  if (typeof raw !== "string") return null;

  // Trim + collapse whitespace
  const s = raw.trim().replace(/\s+/g, " ");
  if (!s) return null;

  // Length guard
  if (s.length < 2 || s.length > 40) return null;

  // Character whitelist
  if (!CITY_ALLOWED.test(s)) return null;

  // Reject "öööö", "aaaaa" etc. (same letter repeated 3+ times)
  const lettersOnly = s.replace(/[^A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö]/g, "");
  if (lettersOnly.length >= 3) {
    const uniq = new Set(lettersOnly.toLowerCase()).size;
    if (uniq === 1) return null;
  }

  return toTitleCase(s);
}
