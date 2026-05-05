import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateKalkZinsenInput = makeNumberValidator({
  bnVermoegen: "BN-Vermögen",
  abzugskapital: "Abzugskapital",
  bnKapital: "BN-Kapital",
  zinsen: "Kalkulatorische Zinsen",
});
