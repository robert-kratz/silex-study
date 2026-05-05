import type { GewinnmaximierungParams } from "./generate";

export function buildGewinnmaximierungPrompt(p: GewinnmaximierungParams): string {
  return [
    "# Aufgabe: Gewinnmaximierung mit Produktionsfunktion",
    "",
    `Ein Unternehmen mit Produktionsfunktion f(x) = ${p.a}·√x verkauft seinen Output zum Marktpreis p = ${p.p} €. Der Lohnsatz beträgt w = ${p.w} €/Inputmengeneinheit.`,
    "",
    "Berechne:",
    "1. Den gewinnmaximalen Inputeinsatz x* (Bedingung: π'(x) = 0).",
    "2. Den maximalen Gewinn π(x*) = p·a·√x* − w·x*.",
    "",
    "π(x) = p·a·√x − w·x.",
  ].join("\n");
}
