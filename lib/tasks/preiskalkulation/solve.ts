import type { PreiskalkulationParams, PreiskalkulationSolution } from "./generate";

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solvePreiskalkulation(
  p: PreiskalkulationParams,
): PreiskalkulationSolution {
  const selbstkosten = p.HK * (1 + p.vwgk + p.vtgk);
  const gewinnBetrag = selbstkosten * p.gewinn;
  const barverkaufspreis = selbstkosten + gewinnBetrag;
  const zielverkaufspreis = barverkaufspreis / (1 - p.skonto);
  const listenverkaufspreis = zielverkaufspreis / (1 - p.rabatt);
  return {
    selbstkosten: r2(selbstkosten),
    gewinnBetrag: r2(gewinnBetrag),
    barverkaufspreis: r2(barverkaufspreis),
    zielverkaufspreis: r2(zielverkaufspreis),
    listenverkaufspreis: r2(listenverkaufspreis),
  };
}
