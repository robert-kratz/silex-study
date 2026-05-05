import { z } from "zod";

/**
 * Zod refinement for a German-locale decimal string.
 */
export function germanNumberField(label: string) {
  return z.string().refine(
    (s) => {
      const cleaned = s
        .trim()
        .replace(/\s+/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
      return cleaned !== "" && Number.isFinite(Number(cleaned));
    },
    { message: `${label}: Bitte eine Zahl eingeben (z.\u202FB. 1.234,56).` },
  );
}

/**
 * Build a `validateRawInput` function that requires every key in `labels`
 * to contain a valid German-locale decimal number.
 */
export function makeNumberValidator<TKey extends string>(
  labels: Record<TKey, string>,
): (raw: Record<string, string>) => Partial<Record<string, string>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  (Object.keys(labels) as TKey[]).forEach((k) => {
    shape[k] = germanNumberField(labels[k]);
  });
  const schema = z.object(shape);
  return (raw) => {
    const result = schema.safeParse(raw);
    if (result.success) return {};
    const errors: Partial<Record<string, string>> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0]);
      if (!errors[field]) errors[field] = issue.message;
    }
    return errors;
  };
}

/**
 * Validate that selected option keys (non-empty strings) exist for every key.
 */
export function makeChoiceValidator<TKey extends string>(
  labels: Record<TKey, string>,
): (raw: Record<string, string>) => Partial<Record<string, string>> {
  return (raw) => {
    const errors: Partial<Record<string, string>> = {};
    (Object.keys(labels) as TKey[]).forEach((k) => {
      const v = raw[k];
      if (!v || v.trim() === "") errors[k] = `${labels[k]}: Bitte auswählen.`;
    });
    return errors;
  };
}
