import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateIlvBlockInput = makeNumberValidator({
  k1: "k_V1",
  k2: "k_V2",
  E1: "Belastung E1",
  E2: "Belastung E2",
});
