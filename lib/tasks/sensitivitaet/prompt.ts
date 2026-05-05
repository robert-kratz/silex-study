import { eur, fmt } from "@/lib/tasks/_shared/format";
import type { SensitivitaetParams } from "./generate";

export function buildSensitivitaetPrompt(p: SensitivitaetParams): string {
  return [
    "# Aufgabe: Sensitivitätsanalyse & Sicherheitskoeffizient",
    "",
    `Preis p = ${eur(p.p)}, k_var = ${eur(p.kv)}, Fixkosten K_f = ${eur(p.Kf)}.`,
    `Erwarteter Absatz x_e = ${fmt(p.xe)} Stück.`,
    "",
    `Werbemaßnahme: zusätzliche Fixkosten ΔK_f = ${eur(p.deltaKf)}, zusätzlicher Absatz Δx = ${fmt(p.deltaX)} Stück.`,
    "",
    "Berechne:",
    "1. Sicherheitskoeffizient S = (x_e − x_b) / x_e in %",
    "2. Gewinnwirkung der Werbemaßnahme ΔG = d · Δx − ΔK_f",
    "3. Empfehlung: Werbemaßnahme durchführen (ja/nein)?",
  ].join("\n");
}
