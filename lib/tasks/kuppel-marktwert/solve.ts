import type { KuppelMarktwertParams } from "./generate";

export interface KuppelMarktwertRow {
  /** Anteil an den Kuppelkosten (€). */
  anteil: number;
  /** Stückkosten = anteil / menge. */
  k: number;
}

export interface KuppelMarktwertSolution {
  rows: KuppelMarktwertRow[];
  /** Σ Erlöse (für Verteilungsfaktor). */
  sumErloese: number;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveKuppelMarktwert(
  p: KuppelMarktwertParams,
): KuppelMarktwertSolution {
  const erloese = p.produkte.map((x) => x.menge * x.preis);
  const sumE = erloese.reduce((a, b) => a + b, 0);
  const rows = p.produkte.map((x, i) => {
    const anteil = (erloese[i] / sumE) * p.K;
    return { anteil: r2(anteil), k: r2(anteil / x.menge) };
  });
  return { rows, sumErloese: r2(sumE) };
}
