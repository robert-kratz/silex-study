import { createRng, rngInt } from "@/lib/random";

export interface MakeOrBuyParams {
  /** Bedarfsmenge. */
  menge: number;
  /** Variable Stückkosten Eigenfertigung. */
  kVarEigen: number;
  /** Abbaubare Fixkosten Eigenfertigung. */
  KfixAbbaubar: number;
  /** Sunk costs (nicht entscheidungsrelevant) — Anzeige. */
  KfixSunk: number;
  /** Externer Stückpreis. */
  pExtern: number;
}

export interface MakeOrBuySolution {
  /** Relevante Kosten Eigenfertigung. */
  Keigen: number;
  /** Relevante Kosten Fremdbezug. */
  Kfremd: number;
  /** "eigen" oder "fremd". */
  entscheidung: "eigen" | "fremd";
  /** Kostenvorteil der besseren Option. */
  vorteil: number;
}

export function generateMakeOrBuy(seed: number): MakeOrBuyParams {
  const rng = createRng(seed);
  const menge = rngInt(rng, 500, 5000);
  const kVarEigen = rngInt(rng, 4, 20);
  const KfixAbbaubar = rngInt(rng, 5, 30) * 1000;
  const KfixSunk = rngInt(rng, 5, 20) * 1000;
  // Set pExtern around full eigen-stückkosten ± 20%
  const stueckEigen = kVarEigen + KfixAbbaubar / menge;
  const factor = 0.8 + (rngInt(rng, 0, 40) / 100); // 0.8..1.2
  const pExtern = Math.max(1, Math.round(stueckEigen * factor * 100) / 100);
  return { menge, kVarEigen, KfixAbbaubar, KfixSunk, pExtern };
}
