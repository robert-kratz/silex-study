import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField, checkStringField } from "@/lib/tasks/_shared/check";
import type { VollTeilkostenSolution } from "./solve";

export interface VollTeilkostenAnswer {
  gewinnVoll: number | null;
  gewinnTeil: number | null;
  deltaG: number | null;
  ursache: string | null;
}

export function checkVollTeilkosten(
  solution: VollTeilkostenSolution,
  answer: VollTeilkostenAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    gewinnVoll: {
      ...checkNumberField(solution.gewinnVoll, answer.gewinnVoll, 0.5),
      hint: "Gewinn Vollkostenrechnung",
    },
    gewinnTeil: {
      ...checkNumberField(solution.gewinnTeil, answer.gewinnTeil, 0.5),
      hint: "Gewinn Teilkostenrechnung",
    },
    deltaG: {
      ...checkNumberField(solution.deltaG, answer.deltaG, 0.5),
      hint: "Differenz ΔG",
    },
    ursache: {
      ...checkStringField(solution.ursache, answer.ursache),
      hint: "Ursache der Differenz",
    },
  };
  return aggregateCheck(fields);
}
