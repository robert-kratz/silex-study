import { fmt } from "@/lib/tasks/_shared/format";
import type { IlvTreppeOrderParams } from "./generate";

export function buildIlvTreppeOrderPrompt(p: IlvTreppeOrderParams): string {
  const header = ["| von ↓ / an →", ...p.names, "an Endstellen"].join(" | ");
  const sep = ["|", ...p.names.map(() => "---"), "---", "---"].join(" | ");
  const rows = p.names.map((n, i) => {
    const cells = p.names.map((_, j) => (i === j ? "—" : fmt(p.matrix[i][j])));
    return `| ${n} | ${cells.join(" | ")} | ${fmt(p.endTotals[i])} |`;
  });
  return [
    "# Aufgabe: Reihenfolge bei der Treppenumlage",
    "",
    "Aus 4 Vorkostenstellen ist die optimale Reihenfolge für das Treppenverfahren zu bestimmen.",
    "Daumenregel: Stelle mit den **meisten Abgaben an andere Vorkostenstellen** zuerst umlegen.",
    "",
    `${header} |`,
    `${sep} |`,
    ...rows,
    "",
    "Gib für jede Stelle ihre Position (1 = zuerst) an.",
  ].join("\n");
}
