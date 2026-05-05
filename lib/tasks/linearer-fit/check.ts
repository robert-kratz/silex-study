import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { LinearerFitSolution } from "./generate";

export interface LinearerFitAnswer {
  Kfix: number | null;
  kVar: number | null;
}

export function checkLinearerFit(
  solution: LinearerFitSolution,
  answer: LinearerFitAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    Kfix: {
      ...checkNumberField(solution.Kfix, answer.Kfix ?? null, 0.01),
      hint: "Fixkosten K_fix",
    },
    kVar: {
      ...checkNumberField(solution.kVar, answer.kVar ?? null, 0.01),
      hint: "Variable Stückkosten k_var",
    },
  };
  return aggregateCheck(fields);
}
