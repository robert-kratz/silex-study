import type { WertabgrenzungDetailParams } from "./generate";

export function buildWertabgrenzungDetailPrompt(
  p: WertabgrenzungDetailParams,
): string {
  const lines = [
    "# Aufgabe: Wertabgrenzung mit Anders- und Zusatzkosten",
    "",
    "Trage pro Vorfall den Betrag in jeder betroffenen Kategorie ein. Achte auf Anders- und Zusatzkosten (kalk. Abschreibung, kalk. Zinsen, kalk. Unternehmerlohn).",
    "",
    "| Nr. | Geschäftsvorfall |",
    "| --- | --- |",
  ];
  p.vorfaelle.forEach((v, i) => {
    lines.push(`| ${i + 1} | ${v.text} |`);
  });
  return lines.join("\n");
}
