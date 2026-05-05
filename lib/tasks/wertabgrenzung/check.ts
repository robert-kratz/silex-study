import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import { KATEGORIEN, type Kategorie } from "./generate";
import type { WertabgrenzungSolution } from "./solve";

export type WertabgrenzungAnswer = (Record<Kategorie, number | null>)[];

export function fieldKey(row: number, k: Kategorie): string {
  return `r${row}_${k}`;
}

export function checkWertabgrenzung(
  solution: WertabgrenzungSolution,
  answer: WertabgrenzungAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  solution.matrix.forEach((row, i) => {
    KATEGORIEN.forEach((k) => {
      const expected = row[k];
      // Empty input is treated as 0 (per spec).
      const givenRaw = answer[i]?.[k];
      const given = givenRaw === null || givenRaw === undefined ? 0 : givenRaw;
      fields[fieldKey(i, k)] = {
        ...checkNumberField(expected, given, 0.005),
      };
    });
  });
  return aggregateCheck(fields);
}
