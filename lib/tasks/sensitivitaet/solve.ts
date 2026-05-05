import type { SensitivitaetParams } from "./generate";

export interface SensitivitaetSolution {
  d: number;
  xb: number;
  /** Sicherheitskoeffizient in Prozent. */
  S: number;
  /** Gewinnwirkung der Werbemaßnahme. */
  deltaG: number;
  empfehlung: "ja" | "nein";
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveSensitivitaet(p: SensitivitaetParams): SensitivitaetSolution {
  const d = p.p - p.kv;
  const xb = p.Kf / d;
  const S = ((p.xe - xb) / p.xe) * 100;
  const deltaG = d * p.deltaX - p.deltaKf;
  return {
    d: r2(d),
    xb: r2(xb),
    S: r2(S),
    deltaG: r2(deltaG),
    empfehlung: deltaG > 0 ? "ja" : "nein",
  };
}
