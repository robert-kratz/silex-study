import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateLinearerFitInput = makeNumberValidator({
  Kfix: "Fixkosten",
  kVar: "Variable Stückkosten",
});
