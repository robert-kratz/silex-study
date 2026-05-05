import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { DbStufenParams } from "./generate";

export function buildDbStufenPrompt(p: DbStufenParams): string {
  const lines: string[] = [
    "# Aufgabe: Mehrstufige Deckungsbeitragsrechnung",
    "",
    `Unternehmensfixkosten = ${eur(p.unternehmenFix)}.`,
    "",
  ];
  for (const s of p.sparten) {
    lines.push(`## ${s.name} (Sparten-Fixkosten ${eur(s.sparteFix)})`);
    for (const g of s.gruppen) {
      lines.push(`### ${g.name} (Gruppen-Fixkosten ${eur(g.pgFix)})`);
      lines.push("| Produkt | Preis | Menge | k_var | Produktfix |");
      lines.push("| --- | --- | --- | --- | --- |");
      for (const pr of g.produkte) {
        lines.push(
          `| ${pr.id} ${pr.name} | ${eur(pr.preis)} | ${fmt(pr.menge)} | ${eur(pr.kVar)} | ${eur(pr.produktFix)} |`,
        );
      }
      lines.push("");
    }
  }
  lines.push(
    "Berechne stufenweise: DB I, DB II, DB III, DB IV und Betriebserfolg.",
    "Welches Produkt sollte sofort aus dem Sortiment entfernt werden?",
  );
  return lines.join("\n");
}
