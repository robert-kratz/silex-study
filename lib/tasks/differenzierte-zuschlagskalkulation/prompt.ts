import { eur, pct } from "@/lib/tasks/_shared/format";
import type { DiffZuschlagsParams } from "./generate";

export function buildDiffZuschlagPrompt(p: DiffZuschlagsParams): string {
  const zuschlaege = [
    `- Materialgemeinkosten-Zuschlag (auf MEK): ${pct(p.mgkSatz)}`,
    ...p.fgkSatz.map(
      (s, i) => `- Fertigungsgemeinkosten-Zuschlag Stufe ${i + 1} (auf FEK${i + 1}): ${pct(s)}`,
    ),
    `- Verwaltungsgemeinkosten-Zuschlag (auf HK): ${pct(p.vwgkSatz)}`,
    `- Vertriebsgemeinkosten-Zuschlag (auf HK): ${pct(p.vtgkSatz)}`,
  ].join("\n");

  const produkte = p.produkte
    .map((prod) => {
      const fekRows = prod.fek
        .map((f, i) => `  - FEK Stufe ${i + 1}: ${eur(f)}`)
        .join("\n");
      return [
        `**${prod.name}**`,
        `  - Materialeinzelkosten (MEK): ${eur(prod.mek)}`,
        fekRows,
        `  - Sondereinzelkosten der Fertigung: ${eur(prod.sekFert)}`,
        `  - Sondereinzelkosten des Vertriebs: ${eur(prod.sekVt)}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    "# Aufgabe: Differenzierte Zuschlagskalkulation",
    "",
    "## Zuschlagssätze",
    zuschlaege,
    "",
    "## Produkte",
    produkte,
    "",
    "Berechne pro Produkt schrittweise:",
    "1. **Materialkosten** = MEK + MEK · MGK-Satz",
    "2. **Fertigungskosten** = Σ FEK + Σ (FEK · FGK-Satz) + Sondereinzelkosten der Fertigung",
    "3. **Herstellkosten** = Materialkosten + Fertigungskosten",
    "4. **Selbstkosten** = HK + HK · VwGK + HK · VtGK + Sondereinzelkosten des Vertriebs",
  ].join("\n");
}
