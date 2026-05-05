import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

const N = 2;
const shape: Record<string, z.ZodTypeAny> = {
  gewinnGKV: germanNumberField("Periodenerfolg GKV"),
  gewinnUKV: germanNumberField("Periodenerfolg UKV"),
};
for (let i = 0; i < N; i++) {
  shape[`bestandsWert${i}`] = germanNumberField(`Bestandswert Produkt ${i + 1}`);
  shape[`HKAbsatz${i}`] = germanNumberField(`HK des Absatzes Produkt ${i + 1}`);
}
const schema = z.object(shape);

export function validateGkvUkvInput(
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
