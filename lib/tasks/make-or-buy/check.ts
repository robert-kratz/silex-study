import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import {
  aggregateCheck,
  checkNumberField,
  checkStringField,
} from "@/lib/tasks/_shared/check";
import type { MakeOrBuySolution } from "./generate";

export interface MakeOrBuyAnswer {
  Keigen: number | null;
  Kfremd: number | null;
  entscheidung: "eigen" | "fremd" | null;
}

export function checkMakeOrBuy(
  solution: MakeOrBuySolution,
  answer: MakeOrBuyAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    Keigen: {
      ...checkNumberField(solution.Keigen, answer.Keigen ?? null, 0.5),
      hint: "Relevante Kosten Eigenfertigung",
    },
    Kfremd: {
      ...checkNumberField(solution.Kfremd, answer.Kfremd ?? null, 0.5),
      hint: "Relevante Kosten Fremdbezug",
    },
    entscheidung: {
      ...checkStringField(solution.entscheidung, answer.entscheidung ?? ""),
      hint: "Entscheidung",
    },
  };
  return aggregateCheck(fields);
}
