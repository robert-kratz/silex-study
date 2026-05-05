import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { GkvUkvSolution } from "./solve";

export interface GkvUkvAnswer {
  bestandsWert: (number | null)[];
  HKAbsatz: (number | null)[];
  gewinnGKV: number | null;
  gewinnUKV: number | null;
}

export function checkGkvUkv(
  solution: GkvUkvSolution,
  answer: GkvUkvAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  for (let i = 0; i < solution.rows.length; i++) {
    fields[`bestandsWert${i}`] = {
      ...checkNumberField(solution.rows[i].bestandsWert, answer.bestandsWert[i] ?? null, 0.5),
      hint: `Bestandswert Produkt ${i + 1}`,
    };
    fields[`HKAbsatz${i}`] = {
      ...checkNumberField(solution.rows[i].HKAbsatz, answer.HKAbsatz[i] ?? null, 0.5),
      hint: `HK des Absatzes Produkt ${i + 1}`,
    };
  }
  fields.gewinnGKV = {
    ...checkNumberField(solution.gewinn, answer.gewinnGKV, 0.5),
    hint: "Periodenerfolg GKV",
  };
  fields.gewinnUKV = {
    ...checkNumberField(solution.gewinn, answer.gewinnUKV, 0.5),
    hint: "Periodenerfolg UKV",
  };
  return aggregateCheck(fields);
}
