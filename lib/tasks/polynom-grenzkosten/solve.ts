import type {
  PolynomGrenzkostenParams,
  PolynomGrenzkostenSolution,
} from "./generate";

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solvePolynomGrenzkosten(
  p: PolynomGrenzkostenParams,
): PolynomGrenzkostenSolution {
  const Kx = p.a + p.b * p.x - p.c * p.x * p.x + p.d * p.x * p.x * p.x;
  const Kstrich = p.b - 2 * p.c * p.x + 3 * p.d * p.x * p.x;
  const kAvg = Kx / p.x;
  return { Kstrich: r2(Kstrich), kAvg: r2(kAvg), Kx: r2(Kx) };
}
