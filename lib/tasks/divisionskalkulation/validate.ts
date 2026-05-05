import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateDivisionskalkulationInput = makeNumberValidator({
  k1: "k_1",
  M2in: "Eingangsmenge Stufe 2",
  k2: "k_2 (kumuliert)",
  absatz: "Absatzmenge",
  kVertrieb: "Selbstkosten/Einheit",
});
