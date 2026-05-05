import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import type { IlvTreppeOrderSolution } from "./solve";

export interface IlvTreppeOrderAnswer {
  /** Antwort: Liste der gewählten Stations-Indizes in Reihenfolge der Positionen 1..4. */
  order: number[];
}

export function checkIlvTreppeOrder(
  solution: IlvTreppeOrderSolution,
  answer: IlvTreppeOrderAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  let score = 0;
  for (let pos = 0; pos < 4; pos++) {
    const expected = solution.order[pos];
    const given = answer.order[pos];
    const ok = given === expected;
    fields[`pos${pos + 1}`] = {
      ok,
      expected: expected as unknown as number,
      given: given ?? null,
      hint: `Position ${pos + 1}`,
    };
    if (ok) score += 1;
  }
  return { score, max: 4, fields, passed: score === 4 };
}
