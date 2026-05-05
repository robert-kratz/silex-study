import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { GutschriftLastschriftSolution } from "./solve";

export interface GutschriftLastschriftAnswer {
  G1: number | null;
  G2: number | null;
  L1: number | null;
  L2: number | null;
  S1: number | null;
  S2: number | null;
}

export function checkGutschriftLastschrift(
  solution: GutschriftLastschriftSolution,
  answer: GutschriftLastschriftAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    G1: { ...checkNumberField(solution.G[0], answer.G1 ?? null, 1), hint: "Gutschrift V1" },
    G2: { ...checkNumberField(solution.G[1], answer.G2 ?? null, 1), hint: "Gutschrift V2" },
    L1: { ...checkNumberField(solution.L[0], answer.L1 ?? null, 1), hint: "Lastschrift V1" },
    L2: { ...checkNumberField(solution.L[1], answer.L2 ?? null, 1), hint: "Lastschrift V2" },
    S1: { ...checkNumberField(solution.S[0], answer.S1 ?? null, 1), hint: "Saldo V1" },
    S2: { ...checkNumberField(solution.S[1], answer.S2 ?? null, 1), hint: "Saldo V2" },
  };
  return aggregateCheck(fields);
}
