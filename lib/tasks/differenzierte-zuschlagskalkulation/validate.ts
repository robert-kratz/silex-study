import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";
import type { DiffZuschlagsParams } from "./generate";
import { fieldKey } from "./check";

export function validateDiffZuschlagInput(
  params: DiffZuschlagsParams,
): (raw: Record<string, string>) => Partial<Record<string, string>> {
  return (raw) => {
    const shape: Record<string, z.ZodTypeAny> = {};
    params.produkte.forEach((p, i) => {
      shape[fieldKey(i, "materialkosten")] = germanNumberField(
        `${p.name}: Materialkosten`,
      );
      shape[fieldKey(i, "fertigungskosten")] = germanNumberField(
        `${p.name}: Fertigungskosten`,
      );
      shape[fieldKey(i, "herstellkosten")] = germanNumberField(
        `${p.name}: Herstellkosten`,
      );
      shape[fieldKey(i, "selbstkosten")] = germanNumberField(
        `${p.name}: Selbstkosten`,
      );
    });
    const schema = z.object(shape);
    const r = schema.safeParse(raw);
    if (r.success) return {};
    const errs: Partial<Record<string, string>> = {};
    for (const i of r.error.issues) {
      const f = String(i.path[0]);
      if (!errs[f]) errs[f] = i.message;
    }
    return errs;
  };
}
