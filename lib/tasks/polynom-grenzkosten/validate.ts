import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validatePolynomGrenzkostenInput = makeNumberValidator({
  Kstrich: "Grenzkosten K'(x)",
  kAvg: "Stückkosten k(x)",
});
