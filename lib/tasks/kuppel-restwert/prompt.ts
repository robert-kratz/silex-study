import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { KuppelRestwertParams } from "./generate";

export function buildKuppelRestwertPrompt(p: KuppelRestwertParams): string {
  const rows = p.produkte.map(
    (x) =>
      `| ${x.name} | ${fmt(x.menge)} | ${eur(x.preis)} | ${eur(x.direkt)} |`,
  );
  return [
    "# Aufgabe: Kuppelproduktion – Restwertmethode",
    "",
    `Kuppelkosten K = ${eur(p.K)}.`,
    "",
    "| Produkt | Menge | Preis | Direkte Kosten |",
    "| --- | --- | --- | --- |",
    ...rows,
    "",
    "Berechne:",
    "1. Kostendeckungsanteil = Σ_{NB} (Erlös_NB − direkte Kosten_NB)",
    "2. HK Hauptprodukt = K − Kostendeckungsanteil + direkte Kosten Hauptprodukt",
    "3. Stückkosten Hauptprodukt = HK_HP / Menge_HP",
  ].join("\n");
}
