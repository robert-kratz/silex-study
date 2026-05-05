import { createRng, rngInt } from "@/lib/random";

export interface PolynomGrenzkostenParams {
  /** K(x) = a + b·x − c·x² + d·x³. */
  a: number;
  b: number;
  c: number;
  d: number;
  /** Auswertungspunkt. */
  x: number;
}

export interface PolynomGrenzkostenSolution {
  /** K'(x). */
  Kstrich: number;
  /** Durchschnittskosten K(x)/x. */
  kAvg: number;
  /** K(x). */
  Kx: number;
}

export function generatePolynomGrenzkosten(seed: number): PolynomGrenzkostenParams {
  const rng = createRng(seed);
  const a = rngInt(rng, 100, 2000);
  const b = rngInt(rng, 5, 30);
  // c, d small to keep K' positive near x
  const c = rngInt(rng, 1, 5) / 10; // 0.1..0.5
  const d = rngInt(rng, 1, 5) / 1000; // 0.001..0.005
  const x = rngInt(rng, 5, 40);
  return { a, b, c, d, x };
}
