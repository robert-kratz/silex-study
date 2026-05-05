import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { HochTiefParams } from "./generate";

export function buildHochTiefPrompt(p: HochTiefParams): string {
  const rows = p.periods
    .map((q, i) => `| ${i + 1} | ${fmt(q.x)} | ${eur(q.K)} |`)
    .join("\n");
  return [
    "# Aufgabe: Hoch-Tief-Methode",
    "",
    "Beobachtete Auslastungen und Gesamtkosten:",
    "",
    "| Periode | x (Stück) | K (€) |",
    "| --- | ---: | ---: |",
    rows,
    "",
    `Bestimme mit der Hoch-Tief-Methode k_var, K_fix und prognostiziere K(x = ${fmt(p.xNeu)}).`,
  ].join("\n");
}
