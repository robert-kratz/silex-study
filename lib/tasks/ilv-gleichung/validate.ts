import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateIlvGleichungInput = makeNumberValidator({
  k1: "k_1",
  k2: "k_2",
  E1: "Belastung E1",
  E2: "Belastung E2",
});
