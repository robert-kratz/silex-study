import { createRng, rngInt } from "@/lib/random";

export interface BreakEvenParams {
  /** Verkaufspreis pro Stück in € */
  p: number;
  /** Variable Stückkosten in € */
  kv: number;
  /** Periodische Fixkosten in € */
  Kf: number;
  /** Zielgewinn in € */
  ZG: number;
}

export interface BreakEvenSolution {
  /** Stückdeckungsbeitrag */
  d: number;
  /** Break-Even-Menge in Stück (auf 0,01 gerundet) */
  xb: number;
  /** Break-Even-Umsatz in € */
  Ub: number;
  /** Menge zur Erreichung des Zielgewinns */
  xZG: number;
}

export function generateBreakEven(seed: number): BreakEvenParams {
  const rng = createRng(seed);

  // Pick whole-euro values that yield a clean d so the BE-quantity is
  // representable with at most 2 decimals.
  const p = rngInt(rng, 20, 200); // €/Stück
  // kv between 30% and 70% of p, rounded to whole euros to keep d "clean"
  const kvMin = Math.max(1, Math.round(p * 0.3));
  const kvMax = Math.max(kvMin + 1, Math.round(p * 0.7));
  const kv = rngInt(rng, kvMin, kvMax);
  const d = p - kv; // ≥ 1

  // Choose Kf as a multiple of d so xb is an integer (nicer for the player).
  const xbBase = rngInt(rng, 200, 4000);
  const Kf = xbBase * d;

  // Choose ZG as a multiple of d on top.
  const zgFactor = rngInt(rng, 100, 1500);
  const ZG = zgFactor * d;

  return { p, kv, Kf, ZG };
}
