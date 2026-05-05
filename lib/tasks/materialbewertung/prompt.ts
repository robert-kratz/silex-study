import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { MaterialbewertungParams } from "./generate";

export function buildMaterialbewertungPrompt(p: MaterialbewertungParams): string {
  const rows = p.buchungen
    .map((b, i) => {
      if (b.type === "AB")
        return `| ${i + 1} | Anfangsbestand | ${fmt(b.menge)} | ${eur(b.preis)} |`;
      if (b.type === "Z")
        return `| ${i + 1} | Zugang | ${fmt(b.menge)} | ${eur(b.preis)} |`;
      return `| ${i + 1} | Abgang | ${fmt(b.menge)} | – |`;
    })
    .join("\n");
  return [
    "# Aufgabe: Materialbewertung – FIFO, LIFO und Durchschnittsverfahren",
    "",
    "| # | Vorgang | Menge | Preis (€/Stück) |",
    "| --- | --- | ---: | ---: |",
    rows,
    "",
    "Berechne jeweils Verbrauchswert und wertmäßigen Endbestand nach folgenden Verfahren:",
    "1. FIFO (verbrauche zuerst die ältesten Bestände)",
    "2. Permanentes LIFO (verbrauche pro Abgang den jüngsten verfügbaren Bestand)",
    "3. Nachträglicher (periodischer) Durchschnittspreis: $\\bar p = \\frac{\\text{Wert AB} + \\sum \\text{Werte Zugänge}}{\\text{Menge AB} + \\sum \\text{Mengen Zugänge}}$ – alle Abgänge mit diesem einen Preis bewerten.",
    "4. Gleitender Durchschnittspreis: nach jedem Zugang neuen Preis $\\bar p_{\\text{neu}} = \\frac{\\text{Wert Lager} + \\text{Wert Zugang}}{\\text{Menge Lager} + \\text{Menge Zugang}}$ berechnen; Abgänge mit dem unmittelbar davor gültigen Preis bewerten.",
  ].join("\n");
}
