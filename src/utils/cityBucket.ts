import { cleanCity } from "./cleanCity";

type BuildChartBucketsOpts = {
  minCustomCount?: number;
  maxCities?: number;
  otherLabel?: string;
  missingLabel?: string;
};

// Turn user city values into pie-chart buckets (preset, promoted custom, and "Muu" category)
export function buildChartCityBuckets(
  users: Array<{ city?: unknown }>,
  presetMap: Map<string, string>,
  opts: {
    minCustomCount?: number;
    maxCities?: number;
    otherLabel?: string;
    missingLabel?: string;
  } = {}
) {
  const {
    minCustomCount = 2,
    maxCities = 6,
    otherLabel = "Muu",
    missingLabel = "Ei asetettu",
  } = opts;

  const presetCounts: Record<string, number> = {};
  const customCounts: Record<string, number> = {};
  let otherCount = 0;

  // Count preset cities and collect custom city candidates.
  for (const u of users ?? []) {
    const cleaned = cleanCity(u?.city);

    // Empty/invalid city -> "Muu".
    if (!cleaned) {
      otherCount += 1;
      continue;
    }

    const lowered = cleaned.toLowerCase();

    // If city was saved as "Muu"/missing label text, keep it in "Muu".
    if (
      lowered === otherLabel.toLowerCase() ||
      lowered === missingLabel.toLowerCase()
    ) {
      otherCount += 1;
      continue;
    }

    const presetLabel = presetMap.get(lowered);
    if (presetLabel) {
      presetCounts[presetLabel] = (presetCounts[presetLabel] ?? 0) + 1;
    } else {
      // Non-preset city -> count as a custom city candidate.
      customCounts[cleaned] = (customCounts[cleaned] ?? 0) + 1;
    }
  }

  // Promote frequent custom cities into their own buckets.
  const promoted = Object.entries(customCounts)
    .filter(([, n]) => n >= minCustomCount)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fi"));

  const promotedSet = new Set(promoted.map(([city]) => city));

  // Everything not promoted is rolled up into the "Muu" bucket.
  for (const [city, n] of Object.entries(customCounts)) {
    if (!promotedSet.has(city)) otherCount += n;
  }

  // Merge preset + promoted, keep top maxCities. Send the rest to "Muu".
  const merged: Array<[string, number]> = [
    ...Object.entries(presetCounts),
    ...promoted,
  ].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fi"));

  const top = merged.slice(0, maxCities);
  const rest = merged.slice(maxCities);
  otherCount += rest.reduce((sum, [, n]) => sum + n, 0);

  const finalEntries: Array<[string, number]> = [...top];
  if (otherCount > 0) finalEntries.push([otherLabel, otherCount]);

  const total = finalEntries.reduce((sum, [, n]) => sum + n, 0);
  return { finalEntries, total };
}

// Build a lookup map for preset cities.
export function buildPresetCityMap(presets: string[]) {
  const map = new Map<string, string>();
  presets.forEach((p) => {
    const key = (cleanCity(p) ?? p).toLowerCase();
    map.set(key, p);
  });
  return map;
}

// Convert a raw city value into a chart bucket:
// - missing/invalid = "Muu" - preset city = preset label - anything else = "Muu"
export function cityToBucket(raw: unknown, presetMap: Map<string, string>) {
  const rawStr = typeof raw === "string" ? raw.trim() : "";
  if (!rawStr) return "Muu";

  const cleaned = cleanCity(rawStr);
  if (!cleaned) return "Muu";

  const key = cleaned.toLowerCase();
  return presetMap.get(key) ?? "Muu";
}
