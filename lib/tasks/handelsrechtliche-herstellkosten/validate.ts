import { makeNumberValidator } from "@/lib/tasks/_shared/validate";

export const validateHgbHerstellkostenInput = makeNumberValidator({
  untergrenze: "Wertuntergrenze",
  obergrenze: "Wertobergrenze",
});
