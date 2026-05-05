import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { MakeOrBuyParams } from "./generate";

export function buildMakeOrBuyPrompt(p: MakeOrBuyParams): string {
  return [
    "# Aufgabe: Make-or-Buy Entscheidung",
    "",
    `Bedarf: ${fmt(p.menge)} Stück.`,
    "",
    "Eigenfertigung:",
    `- variable Stückkosten: ${eur(p.kVarEigen)}/Stück`,
    `- abbaubare Fixkosten: ${eur(p.KfixAbbaubar)}`,
    `- nicht abbaubare (sunk) Fixkosten: ${eur(p.KfixSunk)}`,
    "",
    `Fremdbezug: Stückpreis ${eur(p.pExtern)}.`,
    "",
    "Berechne die entscheidungsrelevanten Kosten beider Alternativen und gib die kostenoptimale Entscheidung an. Sunk Costs sind nicht relevant.",
  ].join("\n");
}
