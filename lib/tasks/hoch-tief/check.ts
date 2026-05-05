import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { HochTiefSolution } from "./generate";

export interface HochTiefAnswer {
  kVar: number | null;
  Kfix: number | null;
  Kneu: number | null;
}

export function checkHochTief(
  solution: HochTiefSolution,
  answer: HochTiefAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    kVar: {
      ...checkNumberField(solution.kVar, answer.kVar ?? null, 0.05),
      hint: "k_var (Hoch-Tief)",
    },
    Kfix: {
      ...checkNumberField(solution.Kfix, answer.Kfix ?? null, 1),
      hint: "K_fix (Hoch-Tief)",
    },
    Kneu: {
      ...checkNumberField(solution.Kneu, answer.Kneu ?? null, 5),
      hint: "K(x_neu) Prognose",
    },
  };
  return aggregateCheck(fields);
}
