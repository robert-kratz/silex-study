import { z } from "zod";
import { germanNumberField } from "@/lib/tasks/_shared/validate";

const schema = z.object({
  bk1: germanNumberField("k_1 (Block)"),
  bk2: germanNumberField("k_2 (Block)"),
  tk1: germanNumberField("k_1 (Treppe)"),
  tk2: germanNumberField("k_2 (Treppe)"),
  gk1: germanNumberField("k_1 (Gleichung)"),
  gk2: germanNumberField("k_2 (Gleichung)"),
  exakt: z
    .string()
    .refine((s) => ["block", "treppe", "gleichung"].includes(s.trim().toLowerCase()), {
      message: "Bitte ein Verfahren auswählen.",
    }),
});

export function validateIlvVergleichInput(
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
