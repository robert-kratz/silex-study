import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { KuppelMarktwertParams } from "./generate";

export function buildKuppelMarktwertPrompt(p: KuppelMarktwertParams): string {
  const rows = p.produkte.map(
    (x) => `| ${x.name} | ${fmt(x.menge)} | ${eur(x.preis)} |`,
  );
  return [
    "# Aufgabe: Kuppelproduktion – Marktwertmethode",
    "",
    `Kuppelkosten K = ${eur(p.K)}. Kein Hauptprodukt.`,
    "",
    "| Produkt | Menge | Preis |",
    "| --- | --- | --- |",
    ...rows,
    "",
    "Berechne pro Produkt:",
    "1. Anteil_i = (Erlös_i / Σ Erlöse) · K",
    "2. Stückkosten k_i = Anteil_i / Menge_i",
  ].join("\n");
}
