import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateIlvTreppeInput = makeNumberValidator({
  kA: "k_A",
  kB: "k_B",
  kC: "k_C",
  E1: "Belastung E1",
  E2: "Belastung E2",
});
