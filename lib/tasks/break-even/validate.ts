import { z } from "zod";

/**
 * A Zod preprocessor that accepts a German-locale decimal string
 * (e.g. "1.234,56" or "1234,56" or "12.5") and validates it is a finite number.
 */
function germanNumberField(label: string) {
  return z.string().refine(
    (s) => {
      const cleaned = s.trim().replace(/\s+/g, "").replace(/\./g, "").replace(",", ".");
      return cleaned !== "" && Number.isFinite(Number(cleaned));
    },
    {
      message: `${label}: Bitte eine Zahl eingeben (z.\u202FB. 1.234,56).`,
    },
  );
}

const breakEvenInputSchema = z.object({
  d: germanNumberField("Stückdeckungsbeitrag"),
  xb: germanNumberField("Break-Even-Menge"),
  Ub: germanNumberField("Break-Even-Umsatz"),
  xZG: germanNumberField("Menge für Zielgewinn"),
});

export type BreakEvenRawInput = z.input<typeof breakEvenInputSchema>;

/**
 * Validates the raw string form values for the break-even task.
 * Returns an object with field names pointing to the first error message;
 * an empty object means all fields are valid.
 */
export function validateBreakEvenInput(
  raw: Record<string, string>,
): Partial<Record<string, string>> {
  const result = breakEvenInputSchema.safeParse(raw);
  if (result.success) return {};
  const errors: Partial<Record<string, string>> = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0]);
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}
