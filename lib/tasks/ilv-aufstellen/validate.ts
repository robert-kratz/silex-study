import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

const numberSchema = z.object({
  k1: germanNumberField("k_1"),
  k2: germanNumberField("k_2"),
  k3: germanNumberField("k_3"),
});

/**
 * Validates only the numerical raw inputs. Block selections are validated
 * implicitly (no constraint – an empty set is also a "valid format").
 */
export function validateIlvAufstellenInput(
  raw: Record<string, string>,
): Partial<Record<string, string>> {
  const r = numberSchema.safeParse({ k1: raw.k1, k2: raw.k2, k3: raw.k3 });
  if (r.success) return {};
  const errs: Partial<Record<string, string>> = {};
  for (const i of r.error.issues) {
    const f = String(i.path[0]);
    if (!errs[f]) errs[f] = i.message;
  }
  return errs;
}
