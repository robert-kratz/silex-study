import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

const NPROZ = 3;
const NAUF = 2;

const shape: Record<string, z.ZodTypeAny> = {};
for (let i = 0; i < NPROZ; i++) {
  shape[`PKS${i}`] = germanNumberField(`Prozesskostensatz Prozess ${i + 1}`);
}
for (let i = 0; i < NAUF; i++) {
  shape[`A${i}`] = germanNumberField(`Kosten Auftrag ${i + 1}`);
}
const schema = z.object(shape);

export function validateProzesskostenInput(
  raw: Record<string, string>,
): Partial<Record<string, string>> {
  const r = schema.safeParse(raw);
  if (r.success) return {};
  const errs: Partial<Record<string, string>> = {};
  for (const i of r.error.issues) {
    const f = String(i.path[0]);
    if (!errs[f]) errs[f] = i.message;
  }
  return errs;
}
