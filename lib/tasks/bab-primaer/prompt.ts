import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { BabPrimaerParams } from "./generate";

export function buildBabPrimaerPrompt(p: BabPrimaerParams): string {
  const header = `| Kostenart | Betrag | ${p.stellen.map((s) => "Schl. " + s).join(" | ")} |`;
  const sep = `| --- | ---: | ${p.stellen.map(() => "---:").join(" | ")} |`;
  const rows = p.kostenarten
    .map(
      (ka, i) =>
        `| ${ka.name} | ${eur(ka.betrag)} | ${p.schluessel[i].map((s) => fmt(s)).join(" | ")} |`,
    )
    .join("\n");
  return [
    "# Aufgabe: Verteilung primärer Gemeinkosten (BAB)",
    "",
    header,
    sep,
    rows,
    "",
    "Verteile jede Kostenart proportional zu den Schlüsselzahlen auf die Kostenstellen.",
    "",
    "u_j = Σ K_j / Σ s_ij,  Zelle = u_j · s_ij.",
  ].join("\n");
}
