import { createRng, rngInt } from "@/lib/random";

export interface IlvTreppeOrderParams {
  /** Anzahl Vorkostenstellen (fix 4). */
  names: ["A", "B", "C", "D"];
  /** matrix[i][j] = Leistung von i an j (i,j ∈ {0,1,2,3}); Diagonale 0. */
  matrix: number[][];
  /** Leistung an Endstellen pro Stelle. */
  endTotals: number[];
}

export function generateIlvTreppeOrder(seed: number): IlvTreppeOrderParams {
  const rng = createRng(seed);
  const names: ["A", "B", "C", "D"] = ["A", "B", "C", "D"];

  // Hidden truth: order is by row-sum (Abgaben an andere Vorstellen) desc.
  // Build with strictly distinct row sums by construction.

  // Try until we get strictly distinct sums.
  let attempt = 0;
  while (attempt < 50) {
    attempt++;
    const m: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i !== j) m[i][j] = rngInt(rng, 0, 80);
      }
    }
    const sums = m.map((row) => row.reduce((a, b) => a + b, 0));
    const distinct = new Set(sums).size === 4;
    if (!distinct) continue;
    // ensure each sum differs by at least 5 to avoid borderline ambiguity
    const sorted = [...sums].sort((a, b) => a - b);
    let ok = true;
    for (let i = 1; i < 4; i++) {
      if (sorted[i] - sorted[i - 1] < 5) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    const endTotals = Array.from({ length: 4 }, () => rngInt(rng, 200, 500));
    return { names, matrix: m, endTotals };
  }
  // fallback (should rarely hit): fixed pattern
  return {
    names,
    matrix: [
      [0, 60, 50, 40],
      [10, 0, 35, 20],
      [5, 8, 0, 25],
      [3, 4, 6, 0],
    ],
    endTotals: [300, 280, 260, 240],
  };
}
