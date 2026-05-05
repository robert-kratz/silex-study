import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { KuppelRestwertSolution } from "./solve";

export interface KuppelRestwertAnswer {
  kostendeckung: number | null;
  HK_HP: number | null;
  k_HP: number | null;
}

export function checkKuppelRestwert(
  solution: KuppelRestwertSolution,
  answer: KuppelRestwertAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    kostendeckung: {
      ...checkNumberField(solution.kostendeckung, answer.kostendeckung, 0.5),
      hint: "Kostendeckungsanteil",
    },
    HK_HP: {
      ...checkNumberField(solution.HK_HP, answer.HK_HP, 0.5),
      hint: "HK Hauptprodukt",
    },
    k_HP: {
      ...checkNumberField(solution.k_HP, answer.k_HP, 0.01),
      hint: "Stückkosten Hauptprodukt",
    },
  };
  return aggregateCheck(fields);
}
