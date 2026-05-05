import type { PolynomGrenzkostenParams } from "./generate";

export function buildPolynomGrenzkostenPrompt(p: PolynomGrenzkostenParams): string {
  return [
    "# Aufgabe: Grenz- und Durchschnittskosten aus Polynom",
    "",
    `Gegeben: K(x) = ${p.a} + ${p.b}·x − ${p.c}·x² + ${p.d}·x³.`,
    "",
    `Berechne K'(x) und k(x) = K(x)/x für x = ${p.x}.`,
    "",
    "1. K'(x) = b − 2c·x + 3d·x²",
    "2. k(x) = K(x)/x",
  ].join("\n");
}
