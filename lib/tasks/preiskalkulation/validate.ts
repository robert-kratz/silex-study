import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validatePreiskalkulationInput = makeNumberValidator({
  selbstkosten: "Selbstkosten",
  gewinnBetrag: "Gewinnbetrag",
  barverkaufspreis: "Barverkaufspreis",
  zielverkaufspreis: "Zielverkaufspreis",
  listenverkaufspreis: "Listenverkaufspreis",
});
