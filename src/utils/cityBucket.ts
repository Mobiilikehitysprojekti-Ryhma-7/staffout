import { cleanCity } from "./cleanCity";

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
