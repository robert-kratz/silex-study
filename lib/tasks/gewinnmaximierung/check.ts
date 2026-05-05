import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { GewinnmaximierungSolution } from "./generate";

export interface GewinnmaximierungAnswer {
  xStar: number | null;
  pi: number | null;
}

export function checkGewinnmaximierung(
  solution: GewinnmaximierungSolution,
  answer: GewinnmaximierungAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    xStar: {
      ...checkNumberField(solution.xStar, answer.xStar ?? null, 0.5),
      hint: "Optimale Inputmenge x*",
    },
    pi: {
      ...checkNumberField(solution.pi, answer.pi ?? null, 0.05),
      hint: "Maximaler Gewinn π*",
    },
  };
  return aggregateCheck(fields);
}
