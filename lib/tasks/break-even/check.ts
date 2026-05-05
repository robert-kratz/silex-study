import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import type { BreakEvenSolution } from "./generate";

export interface BreakEvenAnswer {
  d: number | null;
  xb: number | null;
  xZG: number | null;
  Ub: number | null;
}

const TOLERANCE: Record<keyof BreakEvenAnswer, number> = {
  d: 0.01,
  xb: 0.5,
  xZG: 0.5,
  Ub: 0.5,
};

const LABELS: Record<keyof BreakEvenAnswer, string> = {
  d: "Stückdeckungsbeitrag d",
  xb: "Break-Even-Menge xᵦ",
  xZG: "Menge für Zielgewinn",
  Ub: "Break-Even-Umsatz",
};

function checkField(
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

export function checkBreakEven(
  solution: BreakEvenSolution,
  answer: BreakEvenAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  let score = 0;

  (Object.keys(LABELS) as (keyof BreakEvenAnswer)[]).forEach((key) => {
    const res = checkField(solution[key], answer[key], TOLERANCE[key]);
    fields[key] = { ...res, hint: LABELS[key] };
    if (res.ok) score += 1;
  });

  const max = Object.keys(LABELS).length;
  return { score, max, fields, passed: score === max };
}
