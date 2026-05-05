import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

const N = 3;

const shape: Record<string, z.ZodTypeAny> = {};
for (let i = 0; i < N; i++) {
  shape[`anteil${i}`] = germanNumberField(`Anteil Produkt ${i + 1}`);
  shape[`k${i}`] = germanNumberField(`Stückkosten Produkt ${i + 1}`);
}
const schema = z.object(shape);

export function validateKuppelMarktwertInput(
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
