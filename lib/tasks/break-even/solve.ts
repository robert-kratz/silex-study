import type { BreakEvenParams, BreakEvenSolution } from "./generate";

const round2 = (n: number): number => Math.round(n * 100) / 100;

export function solveBreakEven(p: BreakEvenParams): BreakEvenSolution {
  const d = round2(p.p - p.kv);
  const xb = round2(p.Kf / d);
  const xZG = round2((p.Kf + p.ZG) / d);
  const Ub = round2(xb * p.p);
  return { d, xb, Ub, xZG };
}
