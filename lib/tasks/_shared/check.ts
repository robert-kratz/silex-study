import type { CheckResult, FieldResult } from "@/lib/tasks/types";

export function checkNumberField(
  expected: number,
  given: number | null,
  tolerance: number,
): FieldResult {
  if (given === null || Number.isNaN(given)) {
    return { ok: false, expected, given: null, tolerance };
  }
  return {
    ok: Math.abs(given - expected) <= tolerance + 1e-9,
    expected,
    given,
    tolerance,
  };
}

export function checkStringField(
  expected: string,
  given: string | null,
): FieldResult {
  if (!given) return { ok: false, expected, given: null };
  return {
    ok: given.trim().toLowerCase() === expected.trim().toLowerCase(),
    expected,
    given,
  };
}

export function aggregateCheck(
  fields: Record<string, FieldResult>,
): CheckResult {
  const max = Object.keys(fields).length;
  let score = 0;
  for (const k of Object.keys(fields)) if (fields[k].ok) score += 1;
  return { score, max, fields, passed: score === max };
}
