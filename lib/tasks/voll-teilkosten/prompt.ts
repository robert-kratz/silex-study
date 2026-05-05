import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { VollTeilkostenParams } from "./generate";

export function buildVollTeilkostenPrompt(p: VollTeilkostenParams): string {
  return [
    "# Aufgabe: Voll- vs. Teilkostenrechnung",
    "",
    "| Produkt | Produktion | Absatz | Preis | k_var HK | K_fix HK | k_var Vt | K_fix Vt |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...p.produkte.map(
      (x) =>
        `| ${x.name} | ${fmt(x.produktion)} | ${fmt(x.absatz)} | ${eur(x.preis)} | ${eur(x.kVarHK)} | ${eur(x.KFixHK)} | ${eur(x.kVarVt)} | ${eur(x.KFixVt)} |`,
    ),
    "",
    "Berechne den Periodenerfolg nach Vollkosten- und Teilkostenrechnung sowie die Gewinndifferenz ΔG.",
    "Erkläre außerdem, warum sich die Gewinne unterscheiden.",
  ].join("\n");
}
