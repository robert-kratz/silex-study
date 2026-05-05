import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

const schema = z.object({
  S: germanNumberField("Sicherheitskoeffizient in %"),
  deltaG: germanNumberField("Gewinnwirkung ΔG"),
  empfehlung: z.string().min(1, "Bitte eine Antwort auswählen."),
});

export function validateSensitivitaetInput(
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
