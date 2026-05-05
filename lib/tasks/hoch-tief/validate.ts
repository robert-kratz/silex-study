import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateHochTiefInput = makeNumberValidator({
  kVar: "Variable Stückkosten",
  Kfix: "Fixkosten",
  Kneu: "Prognosekosten",
});
