import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { IlvTreppeParams } from "./generate";

export function buildIlvTreppePrompt(p: IlvTreppeParams): string {
  return [
    "# Aufgabe: ILV – Treppenumlage",
    "",
    `Primärkosten: PK(A) = ${eur(p.PK.A)}, PK(B) = ${eur(p.PK.B)}, PK(C) = ${eur(p.PK.C)}.`,
    "",
    "Leistungsabgaben (Mengen):",
    "",
    "| von ↓ / an → | A | B | C | E1 | E2 |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    `| A | – | ${fmt(p.A.b)} | ${fmt(p.A.c)} | ${fmt(p.A.e1)} | ${fmt(p.A.e2)} |`,
    `| B | – | – | ${fmt(p.B.c)} | ${fmt(p.B.e1)} | ${fmt(p.B.e2)} |`,
    `| C | – | – | – | ${fmt(p.C.e1)} | ${fmt(p.C.e2)} |`,
    "",
    "Reihenfolge der Stufen: A → B → C (keine Rückflüsse).",
    "Berechne k_A, k_B, k_C sowie die Belastung E1 und E2.",
  ].join("\n");
}
