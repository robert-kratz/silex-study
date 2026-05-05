import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import {
  ABSCHREIBUNGS_METHODEN,
  type AbschreibungsMethode,
} from "./generate";
import type { AbschreibungsplanSolution } from "./solve";

export type AbschreibungsplanAnswer = Record<
  AbschreibungsMethode,
  (number | null)[]
>;

export function fieldKey(m: AbschreibungsMethode, t: number): string {
  return `${m}_${t}`;
}

export function checkAbschreibungsplan(
  solution: AbschreibungsplanSolution,
  answer: AbschreibungsplanAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  ABSCHREIBUNGS_METHODEN.forEach((m) => {
    solution.afa[m].forEach((expected, idx) => {
      const got = answer[m]?.[idx] ?? null;
      fields[fieldKey(m, idx)] = {
        ...checkNumberField(expected, got, 0.01),
      };
    });
  });
  return aggregateCheck(fields);
}
