import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

const PRODUKTE = ["P1", "P2", "P3", "P4"] as const;
const GRUPPEN = ["G1", "G2"] as const;
const SPARTEN = ["S1", "S2"] as const;

const shape: Record<string, z.ZodTypeAny> = {
  betriebserfolg: germanNumberField("Betriebserfolg"),
  eliminieren: z.string().min(1, "Bitte eine Antwort auswählen."),
};
for (const id of PRODUKTE) {
  shape[`dbI_${id}`] = germanNumberField(`DB I (${id})`);
  shape[`dbII_${id}`] = germanNumberField(`DB II (${id})`);
}
for (const id of GRUPPEN) shape[`dbIII_${id}`] = germanNumberField(`DB III (${id})`);
for (const id of SPARTEN) shape[`dbIV_${id}`] = germanNumberField(`DB IV (${id})`);

const schema = z.object(shape);

export function validateDbStufenInput(
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
