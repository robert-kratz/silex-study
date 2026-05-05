import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField, checkStringField } from "@/lib/tasks/_shared/check";
import type { MehrproduktBeSolution } from "./solve";

export interface MehrproduktBeAnswer {
  x1: number | null;
  x2: number | null;
  hoehererDb: string | null;
}

export function checkMehrproduktBe(
  solution: MehrproduktBeSolution,
  answer: MehrproduktBeAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    x1: { ...checkNumberField(solution.x1, answer.x1, 0.5), hint: "Break-Even-Menge Produkt 1" },
    x2: { ...checkNumberField(solution.x2, answer.x2, 0.5), hint: "Break-Even-Menge Produkt 2" },
    hoehererDb: {
      ...checkStringField(solution.hoehererDb, answer.hoehererDb),
      hint: "Produkt mit höherem Stückdeckungsbeitrag",
    },
  };
  return aggregateCheck(fields);
}
