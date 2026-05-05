import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import type { DiffZuschlagsSolution } from "./solve";

export interface DiffZuschlagsAnswer {
  /** Pro Produkt 4 Zwischenwerte: materialkosten, fertigungskosten, herstellkosten, selbstkosten. */
  produkte: Array<{
    materialkosten: number | null;
    fertigungskosten: number | null;
    herstellkosten: number | null;
    selbstkosten: number | null;
  }>;
}

const TOL = 0.5;

export function fieldKey(idx: number, key: string): string {
  return `p${idx}_${key}`;
}

export function checkDiffZuschlag(
  solution: DiffZuschlagsSolution,
  answer: DiffZuschlagsAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  solution.produkte.forEach((sp, i) => {
    const ap = answer.produkte[i] ?? {
      materialkosten: null,
      fertigungskosten: null,
      herstellkosten: null,
      selbstkosten: null,
    };
    fields[fieldKey(i, "materialkosten")] = {
      ...checkNumberField(sp.materialkosten, ap.materialkosten ?? null, TOL),
      hint: `${sp.name}: Materialkosten`,
    };
    fields[fieldKey(i, "fertigungskosten")] = {
      ...checkNumberField(sp.fertigungskosten, ap.fertigungskosten ?? null, TOL),
      hint: `${sp.name}: Fertigungskosten`,
    };
    fields[fieldKey(i, "herstellkosten")] = {
      ...checkNumberField(sp.herstellkosten, ap.herstellkosten ?? null, TOL),
      hint: `${sp.name}: Herstellkosten`,
    };
    fields[fieldKey(i, "selbstkosten")] = {
      ...checkNumberField(sp.selbstkosten, ap.selbstkosten ?? null, TOL),
      hint: `${sp.name}: Selbstkosten`,
    };
  });
  return aggregateCheck(fields);
}
