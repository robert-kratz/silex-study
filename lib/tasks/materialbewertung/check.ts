import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { MaterialbewertungSolution } from "./solve";

export interface MaterialbewertungAnswer {
  fifoVerbrauch: number | null;
  fifoEndbestand: number | null;
  lifoVerbrauch: number | null;
  lifoEndbestand: number | null;
  avgPeriodVerbrauch: number | null;
  avgPeriodEndbestand: number | null;
  avgGleitendVerbrauch: number | null;
  avgGleitendEndbestand: number | null;
}

const TOL_EXACT = 0.05;
// Etwas größere Toleranz für Durchschnittsverfahren wegen Rundung des
// Durchschnittspreises (z. B. auf 4 Nachkommastellen).
const TOL_AVG = 1.5;

export function checkMaterialbewertung(
  solution: MaterialbewertungSolution,
  answer: MaterialbewertungAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    fifoVerbrauch: {
      ...checkNumberField(solution.fifoVerbrauch, answer.fifoVerbrauch ?? null, TOL_EXACT),
      hint: "Verbrauchswert FIFO",
    },
    fifoEndbestand: {
      ...checkNumberField(solution.fifoEndbestand, answer.fifoEndbestand ?? null, TOL_EXACT),
      hint: "Endbestand FIFO",
    },
    lifoVerbrauch: {
      ...checkNumberField(solution.lifoVerbrauch, answer.lifoVerbrauch ?? null, TOL_EXACT),
      hint: "Verbrauchswert LIFO",
    },
    lifoEndbestand: {
      ...checkNumberField(solution.lifoEndbestand, answer.lifoEndbestand ?? null, TOL_EXACT),
      hint: "Endbestand LIFO",
    },
    avgPeriodVerbrauch: {
      ...checkNumberField(solution.avgPeriodVerbrauch, answer.avgPeriodVerbrauch ?? null, TOL_AVG),
      hint: "Verbrauch ∅ (nachträglich)",
    },
    avgPeriodEndbestand: {
      ...checkNumberField(solution.avgPeriodEndbestand, answer.avgPeriodEndbestand ?? null, TOL_AVG),
      hint: "Endbestand ∅ (nachträglich)",
    },
    avgGleitendVerbrauch: {
      ...checkNumberField(solution.avgGleitendVerbrauch, answer.avgGleitendVerbrauch ?? null, TOL_AVG),
      hint: "Verbrauch ∅ (gleitend)",
    },
    avgGleitendEndbestand: {
      ...checkNumberField(solution.avgGleitendEndbestand, answer.avgGleitendEndbestand ?? null, TOL_AVG),
      hint: "Endbestand ∅ (gleitend)",
    },
  };
  return aggregateCheck(fields);
}
