import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { ProzesskostenSolution } from "./solve";

export interface ProzesskostenAnswer {
  PKS: (number | null)[];
  auftragKosten: (number | null)[];
}

export function checkProzesskosten(
  solution: ProzesskostenSolution,
  answer: ProzesskostenAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  for (let i = 0; i < solution.PKS.length; i++) {
    fields[`PKS${i}`] = {
      ...checkNumberField(solution.PKS[i], answer.PKS[i] ?? null, 0.05),
      hint: `Prozesskostensatz Prozess ${i + 1}`,
    };
  }
  for (let i = 0; i < solution.auftragKosten.length; i++) {
    fields[`A${i}`] = {
      ...checkNumberField(solution.auftragKosten[i], answer.auftragKosten[i] ?? null, 0.5),
      hint: `Kosten Auftrag ${i + 1}`,
    };
  }
  return aggregateCheck(fields);
}
