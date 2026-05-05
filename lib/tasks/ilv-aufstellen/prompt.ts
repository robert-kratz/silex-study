import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { IlvAufstellenParams } from "./generate";

export function buildIlvAufstellenPrompt(p: IlvAufstellenParams): string {
  const matrixRows = ["V1", "V2", "V3"].map((label, i) => {
    const cells = [0, 1, 2].map((j) => (i === j ? "—" : fmt(p.cross[i][j])));
    return `| ${label} | ${cells.join(" | ")} |`;
  });
  return [
    "# Aufgabe: Großes Gleichungssystem aufstellen",
    "",
    "Drei Vorkostenstellen V1, V2, V3 haben folgende Daten:",
    "",
    `| | V1 | V2 | V3 |`,
    `| --- | --- | --- | --- |`,
    ...matrixRows,
    "",
    "Primärkosten + Gesamtleistung:",
    "",
    "| Stelle | PK | Gesamtleistung |",
    "| --- | --- | --- |",
    `| V1 | ${eur(p.PK[0])} | ${fmt(p.total[0])} |`,
    `| V2 | ${eur(p.PK[1])} | ${fmt(p.total[1])} |`,
    `| V3 | ${eur(p.PK[2])} | ${fmt(p.total[2])} |`,
    "",
    "Aufgabe:",
    "1. Stelle pro Vorkostenstelle die Gleichung x_j·k_j = PK_j + Σ_{i≠j} (i→j)·k_i auf,",
    "   indem du die korrekten Bausteine auswählst.",
    "2. Löse das Gleichungssystem und gib k_1, k_2, k_3 an.",
  ].join("\n");
}
