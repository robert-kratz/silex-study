import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { AbschreibungsplanParams } from "./generate";

export function buildAbschreibungsplanPrompt(p: AbschreibungsplanParams): string {
  return [
    "# Aufgabe: Abschreibungsplan (4 Verfahren)",
    "",
    `Anschaffungswert AW = ${eur(p.AW)}, Restwert RW = ${eur(p.RW)}, Nutzungsdauer T = ${p.T} Jahre.`,
    `Geometrisch-degressiver Abschreibungssatz q = ${fmt(p.q * 100)} %.`,
    "",
    `Leistung pro Jahr: ${p.leistung.map((l, i) => `t=${i + 1}: ${fmt(l)}`).join(", ")} (Summe = ${fmt(p.leistung.reduce((a, b) => a + b, 0))}).`,
    "",
    "Erstelle den Abschreibungsplan (AfA pro Jahr) nach:",
    "1. Linear",
    "2. Geometrisch-degressiv (q · Buchwert)",
    "3. Arithmetisch-degressiv (digital)",
    "4. Leistungsabhängig",
  ].join("\n");
}
