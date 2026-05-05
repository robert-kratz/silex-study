import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { IlvTreppeSolution } from "./solve";

export interface IlvTreppeAnswer {
  kA: number | null;
  kB: number | null;
  kC: number | null;
  E1: number | null;
  E2: number | null;
}

export function checkIlvTreppe(
  solution: IlvTreppeSolution,
  answer: IlvTreppeAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    kA: { ...checkNumberField(solution.kA, answer.kA ?? null, 0.05), hint: "k_A" },
    kB: { ...checkNumberField(solution.kB, answer.kB ?? null, 0.05), hint: "k_B" },
    kC: { ...checkNumberField(solution.kC, answer.kC ?? null, 0.05), hint: "k_C" },
    E1: { ...checkNumberField(solution.E1, answer.E1 ?? null, 5), hint: "Belastung E1" },
    E2: { ...checkNumberField(solution.E2, answer.E2 ?? null, 5), hint: "Belastung E2" },
  };
  return aggregateCheck(fields);
}
