import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { IlvAufstellenSolution } from "./solve";

export interface IlvAufstellenAnswer {
  /** Vom Spieler ausgewählte Bausteine pro Gleichung (Set-Angabe). */
  selected: [Set<string>, Set<string>, Set<string>];
  k1: number | null;
  k2: number | null;
  k3: number | null;
}

function setEquals(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

export function checkIlvAufstellen(
  solution: IlvAufstellenSolution,
  answer: IlvAufstellenAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  for (let j = 0; j < 3; j++) {
    const ok = setEquals(answer.selected[j], solution.correctBlocks[j]);
    fields[`eq${j + 1}`] = {
      ok,
      expected: [...solution.correctBlocks[j]].sort().join(", "),
      given: [...answer.selected[j]].sort().join(", "),
      hint: `Gleichung V${j + 1}`,
    };
  }
  fields.k1 = { ...checkNumberField(solution.k[0], answer.k1, 0.05), hint: "k_1" };
  fields.k2 = { ...checkNumberField(solution.k[1], answer.k2, 0.05), hint: "k_2" };
  fields.k3 = { ...checkNumberField(solution.k[2], answer.k3, 0.05), hint: "k_3" };
  return aggregateCheck(fields);
}
