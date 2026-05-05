import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { KalkZinsenSolution } from "./solve";

export interface KalkZinsenAnswer {
  bnVermoegen: number | null;
  abzugskapital: number | null;
  bnKapital: number | null;
  zinsen: number | null;
}

export function checkKalkZinsen(
  solution: KalkZinsenSolution,
  answer: KalkZinsenAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    bnVermoegen: {
      ...checkNumberField(solution.bnVermoegen, answer.bnVermoegen ?? null, 0.5),
      hint: "Betriebsnotwendiges Vermögen",
    },
    abzugskapital: {
      ...checkNumberField(solution.abzugskapital, answer.abzugskapital ?? null, 0.5),
      hint: "Abzugskapital",
    },
    bnKapital: {
      ...checkNumberField(solution.bnKapital, answer.bnKapital ?? null, 0.5),
      hint: "Betriebsnotwendiges Kapital",
    },
    zinsen: {
      ...checkNumberField(solution.zinsen, answer.zinsen ?? null, 1),
      hint: "Kalkulatorische Zinsen",
    },
  };
  return aggregateCheck(fields);
}
