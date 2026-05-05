import { createRng, rngInt } from "@/lib/random";

export interface IlvAufstellenParams {
  /** Primärkosten der drei Vorkostenstellen V1, V2, V3 (€). */
  PK: [number, number, number];
  /**
   * Leistungsmenge zwischen den Vorkostenstellen.
   * cross[i][j] = Leistung von V_{i+1} an V_{j+1}, i ≠ j; Diagonale 0.
   */
  cross: number[][];
  /** Eigene Gesamtleistung pro Vorkostenstelle (Spaltensumme der abgegebenen Mengen). */
  total: [number, number, number];
}

export function generateIlvAufstellen(seed: number): IlvAufstellenParams {
  const rng = createRng(seed);
  const cross: number[][] = Array.from({ length: 3 }, () => Array(3).fill(0));
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i !== j) cross[i][j] = rngInt(rng, 20, 80);
    }
  }
  // Gesamtleistung = Summe der Abgaben (an Endstellen + andere Vorstellen).
  // Wir fixieren eine plausible Gesamtleistung, die ≥ Σ Abgaben an Vorstellen ist.
  const total: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const abgegebenAnVorstellen = cross[i].reduce((a, b) => a + b, 0);
    const endAbgaben = rngInt(rng, 300, 800);
    total[i] = abgegebenAnVorstellen + endAbgaben;
  }
  return {
    PK: [
      rngInt(rng, 8, 30) * 1000,
      rngInt(rng, 8, 30) * 1000,
      rngInt(rng, 8, 30) * 1000,
    ],
    cross,
    total,
  };
}
