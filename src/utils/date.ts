export function formatFiDate(d?: Date) {
  if (!d) return "Ei voimassa";
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}