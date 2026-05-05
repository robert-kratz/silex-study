import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { DivisionskalkulationParams } from "./generate";

export function buildDivisionskalkulationPrompt(
  p: DivisionskalkulationParams,
): string {
  return [
    "# Aufgabe: Mehrstufige Divisionskalkulation",
    "",
    "Ein Massenfertiger produziert in zwei Fertigungsstufen und verkauft anschließend.",
    "",
    "| Größe | Wert |",
    "| --- | --- |",
    `| Ausgangsmenge Stufe 1 (M_1) | ${fmt(p.M1)} Stück |`,
    `| Kosten Stufe 1 (PK_1) | ${eur(p.PK1)} |`,
    `| Lagerveränderung Halbfabrikate (ΔL_1, + = Aufbau) | ${fmt(p.dL1)} Stück |`,
    `| Kosten Stufe 2 (PK_2) | ${eur(p.PK2)} |`,
    `| Lagerveränderung Fertigfabrikate (ΔL_2, + = Aufbau) | ${fmt(p.dL2)} Stück |`,
    `| Vertriebskosten (PK_v) | ${eur(p.PKv)} |`,
    "",
    "Berechne:",
    "1. k_1 = PK_1 / M_1",
    "2. Eingangsmenge Stufe 2 = M_1 − ΔL_1",
    "3. k_2 (kumuliert) = (PK_2 + k_1·Eingangsmenge_2) / Eingangsmenge_2",
    "4. Absatzmenge = Eingangsmenge_2 − ΔL_2",
    "5. Selbstkosten / Einheit = k_2 + PK_v / Absatzmenge",
    "",
    "Alle Werte mit zwei Nachkommastellen.",
  ].join("\n");
}
