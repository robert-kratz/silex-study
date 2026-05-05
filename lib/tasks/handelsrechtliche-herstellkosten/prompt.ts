import { eur } from "@/lib/tasks/_shared/format";
import type { HgbHerstellkostenParams } from "./generate";

export function buildHgbHerstellkostenPrompt(p: HgbHerstellkostenParams): string {
  const rows = p.bloecke
    .map((b, i) => `| ${i + 1} | ${b.label} | ${eur(b.betrag)} |`)
    .join("\n");
  return [
    "# Aufgabe: Handelsrechtliche Herstellkosten (§ 255 Abs. 2 HGB)",
    "",
    "Folgende Kostenpositionen sind angefallen:",
    "",
    "| # | Position | Betrag |",
    "| --- | --- | ---: |",
    rows,
    "",
    "Bestimme die handelsrechtliche **Wertuntergrenze** und **Wertobergrenze** der Herstellkosten.",
    "",
    "**Pflichtbestandteile (Untergrenze):** Material- und Fertigungseinzelkosten, Sondereinzelkosten der Fertigung, Material- und Fertigungsgemeinkosten, Werteverzehr Anlagevermögen Fertigung.",
    "",
    "**Wahlrecht (Obergrenze = Pflicht + Wahlrecht):** Allg. Verwaltungskosten, herstellungsbezogene Fremdkapitalkosten, freiwillige soziale Leistungen, Altersvorsorge.",
    "",
    "**Verbotene Bestandteile:** Forschungskosten, Vertriebskosten, kalkulatorische Kosten.",
  ].join("\n");
}
