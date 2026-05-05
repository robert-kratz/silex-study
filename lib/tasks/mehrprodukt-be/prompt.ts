import { eur } from "@/lib/tasks/_shared/format";
import type { MehrproduktBeParams } from "./generate";

export function buildMehrproduktBePrompt(p: MehrproduktBeParams): string {
  return [
    "# Aufgabe: Mehrprodukt-Break-Even (festes Verkaufsverhältnis)",
    "",
    `Fixkosten K_f = ${eur(p.Kf)}, Verkaufsverhältnis v = x_1/x_2 = ${p.v}.`,
    "",
    "| Produkt | Preis | k_var |",
    "| --- | --- | --- |",
    ...p.produkte.map((x) => `| ${x.name} | ${eur(x.preis)} | ${eur(x.kv)} |`),
    "",
    "Berechne die Break-Even-Mengen x_1 und x_2 sowie das Produkt mit dem höheren Stückdeckungsbeitrag.",
  ].join("\n");
}
