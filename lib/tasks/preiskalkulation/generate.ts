import { createRng, rngFloat, rngInt } from "@/lib/random";

export interface PreiskalkulationParams {
  /** Herstellkosten in €. */
  HK: number;
  /** Verwaltungs-GK Zuschlag (z. B. 0.08 = 8 %). */
  vwgk: number;
  /** Vertriebs-GK Zuschlag. */
  vtgk: number;
  /** Gewinnaufschlag. */
  gewinn: number;
  /** Skonto. */
  skonto: number;
  /** Rabatt. */
  rabatt: number;
}

export interface PreiskalkulationSolution {
  selbstkosten: number;
  gewinnBetrag: number;
  barverkaufspreis: number;
  zielverkaufspreis: number;
  listenverkaufspreis: number;
}

export function generatePreiskalkulation(seed: number): PreiskalkulationParams {
  const rng = createRng(seed);
  return {
    HK: rngInt(rng, 10, 100),
    vwgk: rngFloat(rng, 0.05, 0.15, 2),
    vtgk: rngFloat(rng, 0.03, 0.12, 2),
    gewinn: rngFloat(rng, 0.1, 0.3, 2),
    skonto: rngFloat(rng, 0.01, 0.05, 2),
    rabatt: rngFloat(rng, 0.05, 0.15, 2),
  };
}
