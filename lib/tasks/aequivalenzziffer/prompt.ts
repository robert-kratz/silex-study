import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { AequivalenzzifferParams } from "./generate";

export function buildAequivalenzzifferPrompt(p: AequivalenzzifferParams): string {
  const rows = p.sorten.map(
    (s) => `| ${s.name} | ${fmt(s.L)} cm | ${fmt(s.B)} cm | ${fmt(s.menge)} |`,
  );
  return [
    "# Aufgabe: Äquivalenzziffernrechnung",
    "",
    `Grundsorte: **${p.sorten[p.grundIdx].name}** (Länge × Breite). Gesamtkosten: ${eur(p.K)}.`,
    "",
    "| Sorte | Länge | Breite | Stückzahl |",
    "| --- | --- | --- | --- |",
    ...rows,
    "",
    "Berechne pro Sorte:",
    "1. Äquivalenzziffer ÄZ = (L·B) / (L_Grund·B_Grund)",
    "2. Schlüsselzahl S = Stückzahl · ÄZ",
    "3. Stückkosten k = (K / Σ S) · ÄZ",
    "",
    "Hinweis: Die ÄZ der Grundsorte ist 1,0.",
  ].join("\n");
}
