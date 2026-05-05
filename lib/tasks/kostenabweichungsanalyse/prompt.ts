import { eur, pct } from "@/lib/tasks/_shared/format";
import type { KostenabwParams } from "./generate";

export function buildKostenabweichungPrompt(p: KostenabwParams): string {
  return [
    "# Aufgabe: Kostenabweichungsanalyse (Writeoff Approach)",
    "",
    "Folgende Werte einer Periode sind gegeben:",
    `- Plan-Gemeinkostenzuschlagssatz: ${pct(p.planSatz)}`,
    `- Tatsächliche Einzelkosten (Bezugsgröße): ${eur(p.istEinzelkosten)}`,
    `- Tatsächlich angefallene Ist-Gemeinkosten: ${eur(p.istGemeinkosten)}`,
    "",
    "1. Berechne die verrechneten Gemeinkosten = Ist-Einzelkosten · Plan-Zuschlagssatz.",
    "2. Bestimme, ob eine **Kostenüberdeckung** (verrechnet > ist) oder **Kostenunterdeckung** (verrechnet < ist) vorliegt und gib den **Differenzbetrag** an.",
    "3. Beim *Writeoff Approach* wird die Abweichung **vollständig über die Umsatzkosten der Periode** verrechnet (keine Bestandsanpassung).",
  ].join("\n");
}
