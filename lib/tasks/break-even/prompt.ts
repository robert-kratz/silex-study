import type { BreakEvenParams } from "./generate";

const eur = (n: number): string =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);

export function buildBreakEvenPrompt(params: BreakEvenParams): string {
  return [
    "# Aufgabe: Einprodukt-Break-Even mit Zielgewinn",
    "",
    "Ein Unternehmen produziert ein einzelnes Produkt mit folgenden Daten:",
    "",
    "| Größe | Wert |",
    "| --- | --- |",
    `| Verkaufspreis pro Stück (p) | ${eur(params.p)} |`,
    `| Variable Stückkosten (k_v) | ${eur(params.kv)} |`,
    `| Periodische Fixkosten (K_f) | ${eur(params.Kf)} |`,
    `| Zielgewinn (ZG) | ${eur(params.ZG)} |`,
    "",
    "Berechne:",
    "1. Stückdeckungsbeitrag d = p − k_v",
    "2. Break-Even-Menge x_b = K_f / d",
    "3. Break-Even-Umsatz U_b = x_b · p",
    "4. Menge zur Erreichung des Zielgewinns x_ZG = (K_f + ZG) / d",
    "",
    "Gib alle Zwischenschritte und Endergebnisse mit zwei Nachkommastellen an.",
  ].join("\n");
}
