import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { DivisionskalkulationSolution } from "./solve";

export interface DivisionskalkulationAnswer {
  k1: number | null;
  M2in: number | null;
  k2: number | null;
  absatz: number | null;
  kVertrieb: number | null;
}

export function checkDivisionskalkulation(
  solution: DivisionskalkulationSolution,
  answer: DivisionskalkulationAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {
    k1: { ...checkNumberField(solution.k1, answer.k1, 0.01), hint: "k_1" },
    M2in: { ...checkNumberField(solution.M2in, answer.M2in, 0.5), hint: "Eingangsmenge Stufe 2" },
    k2: { ...checkNumberField(solution.k2, answer.k2, 0.01), hint: "k_2" },
    absatz: { ...checkNumberField(solution.absatz, answer.absatz, 0.5), hint: "Absatzmenge" },
    kVertrieb: { ...checkNumberField(solution.kVertrieb, answer.kVertrieb, 0.01), hint: "Selbstkosten/Einh." },
  };
  return aggregateCheck(fields);
}
