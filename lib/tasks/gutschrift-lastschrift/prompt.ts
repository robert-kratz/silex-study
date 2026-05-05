import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { GutschriftLastschriftParams } from "./generate";

export function buildGutschriftLastschriftPrompt(
  p: GutschriftLastschriftParams,
): string {
  return [
    "# Aufgabe: Gutschrift- / Lastschriftverfahren",
    "",
    `Plan-Verrechnungspreise: vp(V1) = ${eur(p.vp[0])}, vp(V2) = ${eur(p.vp[1])}.`,
    `Primärkosten: PK(V1) = ${eur(p.PK[0])}, PK(V2) = ${eur(p.PK[1])}.`,
    `Gesamtleistung: x_1 = ${fmt(p.x[0])}, x_2 = ${fmt(p.x[1])}.`,
    `Wechselseitig: V1 → V2 = ${fmt(p.x12)}, V2 → V1 = ${fmt(p.x21)}.`,
    "",
    "Ermittle für V1 und V2:",
    "- Gutschrift G_j = vp_j · x_j",
    "- Lastschrift L_j = PK_j + Menge·vp der bezogenen Leistung",
    "- Saldo S_j = L_j − G_j",
  ].join("\n");
}
