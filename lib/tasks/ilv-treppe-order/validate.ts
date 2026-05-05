/**
 * Validates a permutation of 4 stations selected via per-station position picks.
 * raw keys: "posA","posB","posC","posD" with values "1".."4".
 */
export function validateIlvTreppeOrderInput(
  raw: Record<string, string>,
): Partial<Record<string, string>> {
  const errs: Partial<Record<string, string>> = {};
  const keys = ["posA", "posB", "posC", "posD"];
  const positions: number[] = [];
  for (const k of keys) {
    const v = (raw[k] ?? "").trim();
    if (!/^[1-4]$/.test(v)) {
      errs[k] = "Bitte eine Position 1–4 auswählen.";
    } else {
      positions.push(Number(v));
    }
  }
  if (Object.keys(errs).length > 0) return errs;
  const set = new Set(positions);
  if (set.size !== 4) {
    for (const k of keys) errs[k] = "Jede Position 1–4 darf nur einmal vergeben werden.";
  }
  return errs;
}
