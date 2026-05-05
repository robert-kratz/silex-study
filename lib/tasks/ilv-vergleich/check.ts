import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField, checkStringField } from "@/lib/tasks/_shared/check";
import type { IlvVergleichSolution } from "./solve";

export interface IlvVergleichAnswer {
  bk1: number | null;
  bk2: number | null;
  tk1: number | null;
  tk2: number | null;
  gk1: number | null;
  gk2: number | null;
  exakt: string | null;
}

export function checkIlvVergleich(
  solution: IlvVergleichSolution,
  answer: IlvVergleichAnswer,
): CheckResult {
  const tol = 0.05;
  const fields: Record<string, FieldResult> = {
    bk1: { ...checkNumberField(solution.block.k1, answer.bk1, tol), hint: "k_1 (Block)" },
    bk2: { ...checkNumberField(solution.block.k2, answer.bk2, tol), hint: "k_2 (Block)" },
    tk1: { ...checkNumberField(solution.treppe.k1, answer.tk1, tol), hint: "k_1 (Treppe)" },
    tk2: { ...checkNumberField(solution.treppe.k2, answer.tk2, tol), hint: "k_2 (Treppe)" },
    gk1: { ...checkNumberField(solution.gleichung.k1, answer.gk1, tol), hint: "k_1 (Gleichung)" },
    gk2: { ...checkNumberField(solution.gleichung.k2, answer.gk2, tol), hint: "k_2 (Gleichung)" },
    exakt: { ...checkStringField(solution.exakt, answer.exakt), hint: "exaktes Verfahren" },
  };
  return aggregateCheck(fields);
}
