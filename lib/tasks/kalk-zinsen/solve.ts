import type { KalkZinsenParams } from "./generate";

export interface KalkZinsenSolution {
  bnVermoegen: number;
  abzugskapital: number;
  bnKapital: number;
  zinsen: number;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveKalkZinsen(p: KalkZinsenParams): KalkZinsenSolution {
  const bnVermoegen = p.posten
    .filter((q) => q.kategorie === "av-bn" || q.kategorie === "uv-bn")
    .reduce((s, q) => s + q.betrag, 0);
  const abzugskapital = p.posten
    .filter((q) => q.kategorie === "abzugskapital")
    .reduce((s, q) => s + q.betrag, 0);
  const bnKapital = bnVermoegen - abzugskapital;
  const zinsen = bnKapital * p.wacc;
  return {
    bnVermoegen: r2(bnVermoegen),
    abzugskapital: r2(abzugskapital),
    bnKapital: r2(bnKapital),
    zinsen: r2(zinsen),
  };
}
