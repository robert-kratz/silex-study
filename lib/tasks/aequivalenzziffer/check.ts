import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { AequivalenzzifferSolution } from "./solve";

export interface AequivalenzzifferAnswer {
  AZ: (number | null)[];
  S: (number | null)[];
  k: (number | null)[];
}

export function checkAequivalenzziffer(
  solution: AequivalenzzifferSolution,
  answer: AequivalenzzifferAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  for (let i = 0; i < solution.rows.length; i++) {
    fields[`AZ${i}`] = {
      ...checkNumberField(solution.rows[i].AZ, answer.AZ[i] ?? null, 0.01),
      hint: `ÄZ Sorte ${i}`,
    };
    fields[`S${i}`] = {
      ...checkNumberField(solution.rows[i].S, answer.S[i] ?? null, 0.5),
      hint: `Schlüsselzahl Sorte ${i}`,
    };
    fields[`k${i}`] = {
      ...checkNumberField(solution.rows[i].k, answer.k[i] ?? null, 0.05),
      hint: `Stückkosten Sorte ${i}`,
    };
  }
  return aggregateCheck(fields);
}
