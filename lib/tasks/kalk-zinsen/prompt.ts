import { eur, fmt, pct } from "@/lib/tasks/_shared/format";
import type { KalkZinsenParams } from "./generate";

const KATEGORIE_LABEL: Record<string, string> = {
  "av-bn": "Anlagevermögen (betriebsnotw.)",
  "uv-bn": "Umlaufvermögen (betriebsnotw.)",
  "av-nicht-bn": "Anlagevermögen (nicht betriebsnotw.)",
  "uv-nicht-bn": "Umlaufvermögen (nicht betriebsnotw.)",
  abzugskapital: "Abzugskapital",
};

export function buildKalkZinsenPrompt(p: KalkZinsenParams): string {
  const rows = p.posten
    .map(
      (q) =>
        `| ${q.name} | ${KATEGORIE_LABEL[q.kategorie]} | ${eur(q.betrag)} |`,
    )
    .join("\n");
  return [
    "# Aufgabe: Kalkulatorische Zinsen",
    "",
    "| Posten | Klassifikation | Betrag |",
    "| --- | --- | ---: |",
    rows,
    "",
    `WACC = ${pct(p.wacc)}.`,
    "",
    "Berechne BN-Vermögen, Abzugskapital, BN-Kapital und kalkulatorische Zinsen.",
    "",
    "Hinweis: Nicht betriebsnotwendige Posten gehen nicht in das BN-Vermögen ein. Abzugskapital wird vom BN-Vermögen subtrahiert.",
  ].join("\n");
}
