import { createRng, rngInt } from "@/lib/random";

export interface HochTiefParams {
  /** Beobachtete Perioden. */
  periods: { x: number; K: number }[];
  /** Neue Auslastung, für die K vorhergesagt werden soll. */
  xNeu: number;
  /** "Wahres" k_var für die Musterlösung-Anzeige. */
  kVarTrue: number;
  /** "Wahres" K_fix. */
  KfixTrue: number;
}

export interface HochTiefSolution {
  /** Variable Stückkosten via Hoch-Tief. */
  kVar: number;
  /** Fixkostenanteil via Hoch-Tief. */
  Kfix: number;
  /** Prognose K(xNeu). */
  Kneu: number;
}

export function generateHochTief(seed: number): HochTiefParams {
  const rng = createRng(seed);
  const kVarTrue = rngInt(rng, 4, 25);
  const KfixTrue = rngInt(rng, 5, 40) * 1000;
  const n = rngInt(rng, 5, 7);
  const xs: number[] = [];
  while (xs.length < n) {
    const x = rngInt(rng, 100, 1500);
    if (!xs.includes(x)) xs.push(x);
  }
  xs.sort((a, b) => a - b);
  const periods = xs.map((x) => {
    // small noise so observed cost is messy but min/max definable
    const noise = (rngInt(rng, -50, 50) / 10);
    return { x, K: Math.round((KfixTrue + kVarTrue * x + noise) * 100) / 100 };
  });
  // ensure unambiguous min/max
  periods[0].K = KfixTrue + kVarTrue * periods[0].x; // exact at min
  periods[periods.length - 1].K =
    KfixTrue + kVarTrue * periods[periods.length - 1].x; // exact at max
  const xNeu = rngInt(rng, periods[periods.length - 1].x + 50, 2000);
  return { periods, xNeu, kVarTrue, KfixTrue };
}
