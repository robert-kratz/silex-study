import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateMaterialbewertungInput = makeNumberValidator({
  fifoVerbrauch: "Verbrauchswert FIFO",
  fifoEndbestand: "Endbestand FIFO",
  lifoVerbrauch: "Verbrauchswert LIFO",
  lifoEndbestand: "Endbestand LIFO",
  avgPeriodVerbrauch: "Verbrauch ∅ (nachträglich)",
  avgPeriodEndbestand: "Endbestand ∅ (nachträglich)",
  avgGleitendVerbrauch: "Verbrauch ∅ (gleitend)",
  avgGleitendEndbestand: "Endbestand ∅ (gleitend)",
});
