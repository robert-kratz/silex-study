import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField, checkStringField } from "@/lib/tasks/_shared/check";
import type { SensitivitaetSolution } from "./solve";

export interface SensitivitaetAnswer {
  S: number | null;
  deltaG: number | null;
  empfehlung: string | null;
}

export function checkSensitivitaet(
  solution: SensitivitaetSolution,
  answer: SensitivitaetAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    S: {
      ...checkNumberField(solution.S, answer.S, 0.1),
      hint: "Sicherheitskoeffizient in %",
    },
    deltaG: {
      ...checkNumberField(solution.deltaG, answer.deltaG, 0.5),
      hint: "Gewinnwirkung der Werbemaßnahme",
    },
    empfehlung: {
      ...checkStringField(solution.empfehlung, answer.empfehlung),
      hint: "Empfehlung",
    },
  };
  return aggregateCheck(fields);
}
