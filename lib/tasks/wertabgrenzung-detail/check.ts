import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField } from "@/lib/tasks/_shared/check";
import { KATEGORIEN, type Kategorie } from "./generate";
import type { WertabgrenzungDetailSolution } from "./solve";

export type WertabgrenzungDetailAnswer = (Record<Kategorie, number | null>)[];

export function fieldKey(row: number, k: Kategorie): string {
  return `r${row}_${k}`;
}

export function checkWertabgrenzungDetail(
  solution: WertabgrenzungDetailSolution,
  answer: WertabgrenzungDetailAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  solution.matrix.forEach((row, i) => {
    KATEGORIEN.forEach((k) => {
      const expected = row[k];
      const givenRaw = answer[i]?.[k];
      const given = givenRaw === null || givenRaw === undefined ? 0 : givenRaw;
      fields[fieldKey(i, k)] = { ...checkNumberField(expected, given, 0.01) };
    });
  });
  return aggregateCheck(fields);
}
