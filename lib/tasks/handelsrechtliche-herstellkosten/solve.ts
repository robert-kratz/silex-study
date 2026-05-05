import type { HgbHerstellkostenParams } from "./generate";

export interface HgbHerstellkostenSolution {
  /** Wertuntergrenze (Pflichtbestandteile). */
  untergrenze: number;
  /** Wertobergrenze (Pflicht + Wahlrechtsbestandteile). */
  obergrenze: number;
  /** Summe der Verbotsbestandteile (zur Anzeige in der Lösung). */
  verbotSumme: number;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveHgbHerstellkosten(
  p: HgbHerstellkostenParams,
): HgbHerstellkostenSolution {
  let pflicht = 0;
  let wahl = 0;
  let verbot = 0;
  for (const b of p.bloecke) {
    if (b.kategorie === "pflicht") pflicht += b.betrag;
    else if (b.kategorie === "wahlrecht") wahl += b.betrag;
    else verbot += b.betrag;
  }
  return {
    untergrenze: r2(pflicht),
    obergrenze: r2(pflicht + wahl),
    verbotSumme: r2(verbot),
  };
}
