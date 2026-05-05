import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateGutschriftLastschriftInput = makeNumberValidator({
  G1: "Gutschrift V1",
  G2: "Gutschrift V2",
  L1: "Lastschrift V1",
  L2: "Lastschrift V2",
  S1: "Saldo V1",
  S2: "Saldo V2",
});
