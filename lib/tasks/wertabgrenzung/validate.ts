import { germanNumberField } from "@/lib/tasks/_shared/validate";

/**
 * Empty cells are accepted as 0; only non-empty cells must parse as numbers.
 */
export function validateWertabgrenzungInput(
  raw: Record<string, string>,
): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  const schema = germanNumberField("Betrag");
  Object.entries(raw).forEach(([k, v]) => {
    if (!v || v.trim() === "") return; // empty == 0 ok
    const r = schema.safeParse(v);
    if (!r.success) errors[k] = r.error.issues[0].message;
  });
  return errors;
}
