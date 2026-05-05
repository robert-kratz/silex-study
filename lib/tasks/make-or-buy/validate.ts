import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

const numSchema = germanNumberField("Wert");
const choice = z.enum(["eigen", "fremd"]);

export function validateMakeOrBuyInput(
  raw: Record<string, string>,
): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  (["Keigen", "Kfremd"] as const).forEach((k) => {
    const v = raw[k] ?? "";
    if (!v.trim()) {
      errors[k] = "Pflichtfeld";
      return;
    }
    const r = numSchema.safeParse(v);
    if (!r.success) errors[k] = r.error.issues[0].message;
  });
  if (!raw.entscheidung) errors.entscheidung = "Bitte wählen";
  else if (!choice.safeParse(raw.entscheidung).success)
    errors.entscheidung = "Ungültige Auswahl";
  return errors;
}
