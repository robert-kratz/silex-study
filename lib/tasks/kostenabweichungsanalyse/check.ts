import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import {
  aggregateCheck,
  checkNumberField,
  checkStringField,
} from "@/lib/tasks/_shared/check";
import type { KostenabwSolution } from "./solve";

export interface KostenabwAnswer {
  art: string;
  diff: number | null;
  writeoff: string;
}

const TOL = 0.5;

export function checkKostenabweichung(
  solution: KostenabwSolution,
  answer: KostenabwAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    art: {
      ...checkStringField(solution.art, answer.art),
      hint: "Über- oder Unterdeckung",
    },
    diff: {
      ...checkNumberField(solution.diff, answer.diff ?? null, TOL),
      hint: "Differenzbetrag",
    },
    writeoff: {
      ...checkStringField(solution.writeoff, answer.writeoff),
      hint: "Writeoff Approach",
    },
  };
  return aggregateCheck(fields);
}
