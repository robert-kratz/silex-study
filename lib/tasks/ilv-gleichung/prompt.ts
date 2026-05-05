import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { IlvGleichungParams } from "./generate";

export function buildIlvGleichungPrompt(p: IlvGleichungParams): string {
  return [
    "# Aufgabe: ILV – Gleichungsverfahren",
    "",
    `Primärkosten: PK(V1) = ${eur(p.PK[0])}, PK(V2) = ${eur(p.PK[1])}.`,
    "",
    `Gesamtleistung: x_1 = ${fmt(p.x[0])}, x_2 = ${fmt(p.x[1])}.`,
    `Wechselseitig: V1 → V2 = ${fmt(p.x12)}, V2 → V1 = ${fmt(p.x21)}.`,
    `An Endstellen: V1 → E1 = ${fmt(p.v1End[0])}, V1 → E2 = ${fmt(p.v1End[1])}, V2 → E1 = ${fmt(p.v2End[0])}, V2 → E2 = ${fmt(p.v2End[1])}.`,
    "",
    "Stelle das LGS auf:",
    "",
    "x_1·k_1 = PK_1 + x_21·k_2",
    "x_2·k_2 = PK_2 + x_12·k_1",
    "",
    "Bestimme k_1, k_2 sowie die Endstellen-Belastung E1 und E2.",
  ].join("\n");
}
