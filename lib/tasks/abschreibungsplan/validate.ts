import { germanNumberField } from "@/lib/tasks/_shared/validate";

export function validateAbschreibungsplanInput(
  raw: Record<string, string>,
): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  const schema = germanNumberField("AfA");
  Object.entries(raw).forEach(([k, v]) => {
    if (!v || v.trim() === "") {
      errors[k] = "Pflichtfeld";
      return;
    }
    const r = schema.safeParse(v);
    if (!r.success) errors[k] = r.error.issues[0].message;
  });
  return errors;
}
