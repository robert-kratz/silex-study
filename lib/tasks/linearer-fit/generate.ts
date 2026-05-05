import { createRng, rngInt } from "@/lib/random";

export interface LinearerFitParams {
  /** Auslastungspunkt. */
  x: number;
  /** Durchschnittskosten am Punkt. */
  kDurchschnitt: number;
  /** Grenzkosten = variable Stückkosten. */
  kVar: number;
}

export interface LinearerFitSolution {
  Kfix: number;
  kVar: number;
}

export function generateLinearerFit(seed: number): LinearerFitParams {
  const rng = createRng(seed);
  const kVar = rngInt(rng, 2, 15);
  // Pick Kfix as multiple of x for clean kDurchschnitt
  const x = rngInt(rng, 100, 1000);
  // Make Kfix divisible by x for clean kDurchschnitt
  const fixPerUnit = rngInt(rng, 5, 30);
  const Kfix = fixPerUnit * x;
  const kDurchschnitt = Kfix / x + kVar;
  return { x, kDurchschnitt, kVar };
}
