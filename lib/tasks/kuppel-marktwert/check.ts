import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { KuppelMarktwertSolution } from "./solve";

export interface KuppelMarktwertAnswer {
  anteil: (number | null)[];
  k: (number | null)[];
}

export function checkKuppelMarktwert(
  solution: KuppelMarktwertSolution,
  answer: KuppelMarktwertAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  for (let i = 0; i < solution.rows.length; i++) {
    fields[`anteil${i}`] = {
      ...checkNumberField(solution.rows[i].anteil, answer.anteil[i] ?? null, 0.5),
      hint: `Anteil Produkt ${i + 1}`,
    };
    fields[`k${i}`] = {
      ...checkNumberField(solution.rows[i].k, answer.k[i] ?? null, 0.01),
      hint: `Stückkosten Produkt ${i + 1}`,
    };
  }
  return aggregateCheck(fields);
}
