import type { HochTiefParams, HochTiefSolution } from "./generate";

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveHochTief(p: HochTiefParams): HochTiefSolution {
  const xs = p.periods.map((q) => q.x);
  const minIdx = xs.indexOf(Math.min(...xs));
  const maxIdx = xs.indexOf(Math.max(...xs));
  const lo = p.periods[minIdx];
  const hi = p.periods[maxIdx];
  const kVar = (hi.K - lo.K) / (hi.x - lo.x);
  const Kfix = lo.K - kVar * lo.x;
  const Kneu = Kfix + kVar * p.xNeu;
  return { kVar: r2(kVar), Kfix: r2(Kfix), Kneu: r2(Kneu) };
}
