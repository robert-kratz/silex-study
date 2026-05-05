import type { ProzesskostenParams } from "./generate";

export interface ProzesskostenSolution {
  /** Prozesskostensatz pro Prozess. */
  PKS: number[];
  /** Gesamtkosten pro Auftrag. */
  auftragKosten: number[];
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveProzesskosten(p: ProzesskostenParams): ProzesskostenSolution {
  const PKS = p.prozesse.map((x) => x.K / x.M);
  const auftragKosten = p.auftraege.map((a) =>
    a.inanspruchnahme.reduce((acc, m, i) => acc + m * PKS[i], 0),
  );
  return {
    PKS: PKS.map(r2),
    auftragKosten: auftragKosten.map(r2),
  };
}
