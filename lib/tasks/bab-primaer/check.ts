import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { BabPrimaerSolution } from "./solve";

export type BabPrimaerAnswer = (number | null)[][];

export function fieldKey(ka: number, st: number): string {
  return `${ka}_${st}`;
}

export function checkBabPrimaer(
  solution: BabPrimaerSolution,
  answer: BabPrimaerAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  solution.matrix.forEach((row, i) => {
    row.forEach((expected, j) => {
      fields[fieldKey(i, j)] = {
        ...checkNumberField(expected, answer[i]?.[j] ?? null, 0.05),
      };
    });
  });
  return aggregateCheck(fields);
}
