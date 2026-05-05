import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateKuppelRestwertInput = makeNumberValidator({
  kostendeckung: "Kostendeckungsanteil",
  HK_HP: "HK Hauptprodukt",
  k_HP: "Stückkosten Hauptprodukt",
});
