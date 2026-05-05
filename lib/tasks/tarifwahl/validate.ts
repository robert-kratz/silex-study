import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

export function validateTarifwahlInput(
  raw: Record<string, string>,
  count: number,
): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  for (let i = 0; i < count; i++) {
    const t = raw[`tarif${i}`];
    if (!t) errors[`tarif${i}`] = "Bitte einen Tarif auswählen.";
    const k = raw[`k${i}`];
    const result = z.object({ k: germanNumberField("Stückkosten") }).safeParse({ k });
    if (!result.success) {
      errors[`k${i}`] = result.error.issues[0].message;
    }
  }
  return errors;
}
