import { createRng, rngInt } from "@/lib/random";

export interface DivisionskalkulationParams {
  /** Ausgangsmenge Stufe 1 (Stück). */
  M1: number;
  /** Kosten Stufe 1 (€). */
  PK1: number;
  /**
   * Lagerveränderung der Halbfabrikate (positiv = Aufbau ⇒ weniger geht in Stufe 2).
   * eingangsmenge_stufe2 = M1 − dL1
   */
  dL1: number;
  /** Kosten Stufe 2 (€). */
  PK2: number;
  /**
   * Lagerveränderung der Fertigfabrikate (positiv = Aufbau ⇒ weniger Absatz).
   * absatzmenge = ausgangsmenge_stufe2 − dL2 = (M1 − dL1) − dL2
   */
  dL2: number;
  /** Vertriebskosten (€). */
  PKv: number;
}

export function generateDivisionskalkulation(seed: number): DivisionskalkulationParams {
  const rng = createRng(seed);
  // Pick M1 such that M2_in and absatz are positive and yield cleanish values.
  const M1 = rngInt(rng, 4, 20) * 1000; // z. B. 8.000
  const dL1 = rngInt(rng, -5, 10) * 100; // ±500..1000
  const M2in = M1 - dL1;
  const dL2 = rngInt(rng, -3, 8) * 100;
  const absatz = M2in - dL2;
  // Ensure absatz > 0 by clipping if needed.
  const dL2Safe = absatz > 0 ? dL2 : 0;
  return {
    M1,
    PK1: rngInt(rng, 30, 120) * 1000,
    dL1,
    PK2: rngInt(rng, 20, 90) * 1000,
    dL2: dL2Safe,
    PKv: rngInt(rng, 10, 50) * 1000,
  };
}
