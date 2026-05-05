import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { IlvVergleichParams } from "./generate";

export function buildIlvVergleichPrompt(p: IlvVergleichParams): string {
  return [
    "# Aufgabe: ILV – Verfahrensvergleich",
    "",
    "Auf identischer Datenbasis sind Block-, Treppen- und Gleichungsverfahren zu rechnen.",
    "",
    `Primärkosten: PK(V1) = ${eur(p.PK[0])}, PK(V2) = ${eur(p.PK[1])}.`,
    `Wechselseitige Mengen: V1 → V2 = ${fmt(p.x12)}, V2 → V1 = ${fmt(p.x21)}.`,
    `An Endstellen: V1 → E1 = ${fmt(p.v1End[0])}, V1 → E2 = ${fmt(p.v1End[1])}, V2 → E1 = ${fmt(p.v2End[0])}, V2 → E2 = ${fmt(p.v2End[1])}.`,
    "",
    "Aufgabe:",
    "1. Berechne k_1 und k_2 mit dem **Blockverfahren** (V↔V wird ignoriert).",
    "2. Berechne k_1 und k_2 mit dem **Treppenverfahren** (Reihenfolge V1 → V2).",
    "3. Berechne k_1 und k_2 mit dem **Gleichungsverfahren** (LGS).",
    "4. Welches Verfahren liefert das exakte Ergebnis?",
  ].join("\n");
}
