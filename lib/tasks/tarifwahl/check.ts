import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { TarifwahlSolution } from "./generate";

export interface TarifwahlAnswer {
  tarif: ("A" | "B" | "C" | null)[];
  stueckkosten: (number | null)[];
}

export function checkTarifwahl(
  solution: TarifwahlSolution,
  answer: TarifwahlAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  solution.results.forEach((r, i) => {
    const givenTarif = answer.tarif[i] ?? null;
    fields[`tarif${i}`] = {
      ok: givenTarif === r.tarif,
      expected: r.tarif,
      given: givenTarif,
      hint: `Günstigster Tarif (Menge ${i + 1})`,
    };
    fields[`k${i}`] = {
      ...checkNumberField(r.stueckkosten, answer.stueckkosten[i] ?? null, 0.01),
      hint: `Stückkosten (Menge ${i + 1})`,
    };
  });
  return aggregateCheck(fields);
}
