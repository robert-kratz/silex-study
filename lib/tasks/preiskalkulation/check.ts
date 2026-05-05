import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { PreiskalkulationSolution } from "./generate";

export interface PreiskalkulationAnswer {
  selbstkosten: number | null;
  gewinnBetrag: number | null;
  barverkaufspreis: number | null;
  zielverkaufspreis: number | null;
  listenverkaufspreis: number | null;
}

const TOL = 0.05;

const LABELS: Record<keyof PreiskalkulationAnswer, string> = {
  selbstkosten: "Selbstkosten",
  gewinnBetrag: "Gewinnbetrag",
  barverkaufspreis: "Barverkaufspreis",
  zielverkaufspreis: "Zielverkaufspreis",
  listenverkaufspreis: "Listenverkaufspreis",
};

export function checkPreiskalkulation(
  solution: PreiskalkulationSolution,
  answer: PreiskalkulationAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  (Object.keys(LABELS) as (keyof PreiskalkulationAnswer)[]).forEach((k) => {
    fields[k] = {
      ...checkNumberField(solution[k], answer[k] ?? null, TOL),
      hint: LABELS[k],
    };
  });
  return aggregateCheck(fields);
}
