import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

const schema = z.object({
  art: z.string().min(1, "Bitte Über- oder Unterdeckung wählen."),
  diff: germanNumberField("Differenzbetrag"),
  writeoff: z.string().min(1, "Bitte eine Antwort auswählen."),
});

export function validateKostenabweichungInput(
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
