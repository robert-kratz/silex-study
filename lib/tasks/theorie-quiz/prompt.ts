import type { QuizParams } from "./generate";
import { getItem } from "./solve";

export function buildTheorieQuizPrompt(params: QuizParams): string {
  const lines: string[] = [
    "# Aufgabe: Theorie- & Konzept-Quiz",
    "",
    "Beantworte die folgenden Multiple-Choice-Fragen zum internen Rechnungswesen. Markiere jeweils die korrekte Option und begründe kurz.",
    "",
  ];
  params.itemIds.forEach((id, qi) => {
    const item = getItem(id);
    const order = params.optionOrder[qi];
    lines.push(`## Frage ${qi + 1} – ${item.cluster}`);
    lines.push(item.question);
    lines.push("");
    order.forEach((origIdx, j) => {
      lines.push(`${String.fromCharCode(65 + j)}) ${item.options[origIdx]}`);
    });
    lines.push("");
  });
  return lines.join("\n");
}
