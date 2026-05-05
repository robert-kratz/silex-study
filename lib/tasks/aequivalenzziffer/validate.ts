import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

const N = 3;

const shape: Record<string, z.ZodTypeAny> = {};
for (let i = 0; i < N; i++) {
  shape[`AZ${i}`] = germanNumberField(`ÄZ Sorte ${i}`);
  shape[`S${i}`] = germanNumberField(`Schlüsselzahl Sorte ${i}`);
  shape[`k${i}`] = germanNumberField(`Stückkosten Sorte ${i}`);
}
const schema = z.object(shape);

export function validateAequivalenzzifferInput(
  raw: Record<string, string>,
): Partial<Record<string, string>> {
  const r = schema.safeParse(raw);
  if (r.success) {
    // Zusätzliche Plausibilität: ÄZ der Grundsorte muss = 1.0 sein.
    const az0 = Number((raw.AZ0 ?? "").replace(/\./g, "").replace(",", "."));
    if (Math.abs(az0 - 1) > 0.01) {
      return { AZ0: "Die Äquivalenzziffer der Grundsorte muss 1,0 sein." };
    }
    return {};
  }
  const errs: Partial<Record<string, string>> = {};
  for (const i of r.error.issues) {
    const f = String(i.path[0]);
    if (!errs[f]) errs[f] = i.message;
  }
  return errs;
}
