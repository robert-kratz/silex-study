import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import { aggregateCheck, checkNumberField, checkStringField } from "@/lib/tasks/_shared/check";
import type { DbStufenSolution } from "./solve";

export interface DbStufenAnswer {
  /** Map produkt-id → { dbI, dbII }. */
  produkt: Record<string, { dbI: number | null; dbII: number | null }>;
  gruppe: Record<string, number | null>;
  sparte: Record<string, number | null>;
  betriebserfolg: number | null;
  eliminieren: string | null;
}

export function checkDbStufen(
  solution: DbStufenSolution,
  answer: DbStufenAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  for (const id of Object.keys(solution.produkt)) {
    fields[`dbI_${id}`] = {
      ...checkNumberField(solution.produkt[id].dbI, answer.produkt[id]?.dbI ?? null, 0.5),
      hint: `DB I (${id})`,
    };
    fields[`dbII_${id}`] = {
      ...checkNumberField(solution.produkt[id].dbII, answer.produkt[id]?.dbII ?? null, 0.5),
      hint: `DB II (${id})`,
    };
  }
  for (const id of Object.keys(solution.gruppe)) {
    fields[`dbIII_${id}`] = {
      ...checkNumberField(solution.gruppe[id], answer.gruppe[id] ?? null, 0.5),
      hint: `DB III (${id})`,
    };
  }
  for (const id of Object.keys(solution.sparte)) {
    fields[`dbIV_${id}`] = {
      ...checkNumberField(solution.sparte[id], answer.sparte[id] ?? null, 0.5),
      hint: `DB IV (${id})`,
    };
  }
  fields.betriebserfolg = {
    ...checkNumberField(solution.betriebserfolg, answer.betriebserfolg, 0.5),
    hint: "Betriebserfolg",
  };
  fields.eliminieren = {
    ...checkStringField(solution.eliminieren, answer.eliminieren),
    hint: "Sortimentsentscheidung",
  };
  return aggregateCheck(fields);
}
