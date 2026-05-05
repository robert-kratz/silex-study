import { eur, pct } from "@/lib/tasks/_shared/format";
import type { PreiskalkulationParams } from "./generate";

export function buildPreiskalkulationPrompt(p: PreiskalkulationParams): string {
  return [
    "# Aufgabe: Preiskalkulation (progressiv)",
    "",
    "Vom Herstellkosten-Wert zum Listenverkaufspreis hochrechnen.",
    "",
    "| Größe | Wert |",
    "| --- | --- |",
    `| Herstellkosten (HK) | ${eur(p.HK)} |`,
    `| VwGK-Zuschlag | ${pct(p.vwgk)} |`,
    `| VtGK-Zuschlag | ${pct(p.vtgk)} |`,
    `| Gewinnaufschlag | ${pct(p.gewinn)} |`,
    `| Skonto | ${pct(p.skonto)} |`,
    `| Rabatt | ${pct(p.rabatt)} |`,
    "",
    "Berechne in dieser Reihenfolge:",
    "1. Selbstkosten = HK · (1 + VwGK + VtGK)",
    "2. Gewinnbetrag = Selbstkosten · Gewinnaufschlag",
    "3. Barverkaufspreis = Selbstkosten + Gewinnbetrag",
    "4. Zielverkaufspreis = Barverkaufspreis / (1 − Skonto)",
    "5. Listenverkaufspreis = Zielverkaufspreis / (1 − Rabatt)",
    "",
    "Ergebnisse mit zwei Nachkommastellen.",
  ].join("\n");
}
