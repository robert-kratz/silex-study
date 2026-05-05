import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { IlvGleichungSolution } from "./solve";

export interface IlvGleichungAnswer {
  k1: number | null;
  k2: number | null;
  E1: number | null;
  E2: number | null;
}

export function checkIlvGleichung(
  solution: IlvGleichungSolution,
  answer: IlvGleichungAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    k1: { ...checkNumberField(solution.k1, answer.k1 ?? null, 0.05), hint: "k_1" },
    k2: { ...checkNumberField(solution.k2, answer.k2 ?? null, 0.05), hint: "k_2" },
    E1: { ...checkNumberField(solution.E1, answer.E1 ?? null, 5), hint: "Belastung E1" },
    E2: { ...checkNumberField(solution.E2, answer.E2 ?? null, 5), hint: "Belastung E2" },
  };
  return aggregateCheck(fields);
}
