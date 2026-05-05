import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { IlvBlockParams } from "./generate";

export function buildIlvBlockPrompt(p: IlvBlockParams): string {
  return [
    "# Aufgabe: ILV – Blockumlage",
    "",
    `Primärkosten: PK(V1) = ${eur(p.PK[0])}, PK(V2) = ${eur(p.PK[1])}.`,
    "",
    "Leistungsmatrix (Mengen):",
    "",
    "| von \\ an | V1 | V2 | E1 | E2 |",
    "| --- | ---: | ---: | ---: | ---: |",
    `| V1 | – | ${fmt(p.v1.v2)} | ${fmt(p.v1.e1)} | ${fmt(p.v1.e2)} |`,
    `| V2 | ${fmt(p.v2.v1)} | – | ${fmt(p.v2.e1)} | ${fmt(p.v2.e2)} |`,
    "",
    "Bei der Blockumlage werden gegenseitige Vorstellen-Leistungen ignoriert. Berechne die Verrechnungspreise k_V1, k_V2 sowie die Belastung der Endstellen E1, E2.",
  ].join("\n");
}
