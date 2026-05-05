import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateGewinnmaximierungInput = makeNumberValidator({
  xStar: "Optimaler Input x*",
  pi: "Maximaler Gewinn π*",
});
