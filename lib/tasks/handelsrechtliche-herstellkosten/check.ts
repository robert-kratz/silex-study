import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { HgbHerstellkostenSolution } from "./solve";

export interface HgbHerstellkostenAnswer {
  untergrenze: number | null;
  obergrenze: number | null;
}

const TOL = 0.5;

export function checkHgbHerstellkosten(
  solution: HgbHerstellkostenSolution,
  answer: HgbHerstellkostenAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    untergrenze: {
      ...checkNumberField(solution.untergrenze, answer.untergrenze ?? null, TOL),
      hint: "Wertuntergrenze (nur Pflichtbestandteile)",
    },
    obergrenze: {
      ...checkNumberField(solution.obergrenze, answer.obergrenze ?? null, TOL),
      hint: "Wertobergrenze (Pflicht + Wahlrecht)",
    },
  };
  return aggregateCheck(fields);
}
