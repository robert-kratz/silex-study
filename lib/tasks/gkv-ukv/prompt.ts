import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { GkvUkvParams } from "./generate";

export function buildGkvUkvPrompt(p: GkvUkvParams): string {
  const lines = [
    "# Aufgabe: Erfolgsrechnung – GKV vs. UKV",
    "",
    "| Produkt | Produktion | Absatz | Preis | k_var HK | K_fix HK | k_var Vt | K_fix Vt |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...p.produkte.map(
      (x) =>
        `| ${x.name} | ${fmt(x.produktion)} | ${fmt(x.absatz)} | ${eur(x.preis)} | ${eur(x.kVarHK)} | ${eur(x.KFixHK)} | ${eur(x.kVarVt)} | ${eur(x.KFixVt)} |`,
    ),
    "",
    "Berechne pro Produkt:",
    "1. Bestandsänderung × Herstellkostensatz (Bestandswert, vorzeichenbehaftet)",
    "2. HK des Absatzes",
    "",
    "Sowie den Periodenerfolg nach GKV und nach UKV (beide müssen identisch sein).",
  ];
  return lines.join("\n");
}
