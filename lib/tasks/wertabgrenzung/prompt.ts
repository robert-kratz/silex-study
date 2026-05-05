import { eur } from "@/lib/tasks/_shared/format";
import type { WertabgrenzungParams } from "./generate";

export function buildWertabgrenzungPrompt(p: WertabgrenzungParams): string {
  const lines = [
    "# Aufgabe: Wertabgrenzung",
    "",
    "Ordne folgende Geschäftsvorfälle den Kategorien Einzahlung, Auszahlung, Ertrag, Aufwand, Erlös und Kosten zu. Trage pro Zelle den jeweils zutreffenden Betrag ein (oder 0 €, wenn die Kategorie nicht betroffen ist).",
    "",
    "| Nr. | Geschäftsvorfall |",
    "| --- | --- |",
  ];
  p.vorfaelle.forEach((v, i) => {
    lines.push(`| ${i + 1} | ${v.text} |`);
  });
  lines.push("");
  lines.push("Hinweis: kalkulatorische Miete und kalkulatorischer Unternehmerlohn sind Zusatzkosten (Kosten ohne Aufwand). Spenden sind Aufwand, aber keine Kosten.");
  void eur;
  return lines.join("\n");
}
