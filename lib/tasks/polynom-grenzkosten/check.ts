import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { PolynomGrenzkostenSolution } from "./generate";

export interface PolynomGrenzkostenAnswer {
  Kstrich: number | null;
  kAvg: number | null;
}

export function checkPolynomGrenzkosten(
  solution: PolynomGrenzkostenSolution,
  answer: PolynomGrenzkostenAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    Kstrich: {
      ...checkNumberField(solution.Kstrich, answer.Kstrich ?? null, 0.05),
      hint: "Grenzkosten K'(x)",
    },
    kAvg: {
      ...checkNumberField(solution.kAvg, answer.kAvg ?? null, 0.05),
      hint: "Stückkosten k(x)",
    },
  };
  return aggregateCheck(fields);
}
