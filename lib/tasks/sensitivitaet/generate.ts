import { createRng, rngInt } from "@/lib/random";

export interface SensitivitaetParams {
  p: number;
  kv: number;
  Kf: number;
  /** Erwarteter Absatz (Stück). */
  xe: number;
  /** Werbemaßnahme: zusätzliche Fixkosten. */
  deltaKf: number;
  /** Werbemaßnahme: zusätzlicher Absatz (Stück). */
  deltaX: number;
}

export function generateSensitivitaet(seed: number): SensitivitaetParams {
  const rng = createRng(seed);
  while (true) {
    const p = rngInt(rng, 30, 200);
    const kv = rngInt(rng, Math.floor(0.3 * p), Math.floor(0.7 * p));
    const d = p - kv;
    if (d <= 0) continue;
    // xb gerade Zahl zwischen 200 und 5000
    const xb = rngInt(rng, 5, 50) * 100;
    const Kf = xb * d;
    const xe = rngInt(rng, Math.ceil(1.3 * xb), Math.ceil(2.5 * xb));
    const deltaX = rngInt(rng, 100, 800);
    const deltaKf = rngInt(rng, 5, 60) * 1000;
    return { p, kv, Kf, xe, deltaKf, deltaX };
  }
}
