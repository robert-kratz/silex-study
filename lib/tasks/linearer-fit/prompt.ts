import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { LinearerFitParams } from "./generate";

export function buildLinearerFitPrompt(p: LinearerFitParams): string {
  return [
    "# Aufgabe: Lineare Kostenfunktion aus Punkt-Daten",
    "",
    `Bei einer Auslastung von ${fmt(p.x)} Stück betragen die Durchschnittskosten ${eur(p.kDurchschnitt)} pro Stück und die Grenzkosten ${eur(p.kVar)} pro Stück.`,
    "",
    "Bestimme die zugrundeliegende lineare Kostenfunktion K(x) = K_fix + k_var·x.",
    "",
    "1. k_var = Grenzkosten",
    "2. K_fix = (k_durchschnitt − k_var) · x",
  ].join("\n");
}
