import type { LinearerFitParams, LinearerFitSolution } from "./generate";

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveLinearerFit(p: LinearerFitParams): LinearerFitSolution {
  const Kfix = (p.kDurchschnitt - p.kVar) * p.x;
  return { Kfix: r2(Kfix), kVar: r2(p.kVar) };
}
