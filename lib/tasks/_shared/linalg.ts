/**
 * Solve a 2×2 linear system A·x = b via Cramer.
 * Returns null if singular.
 */
export function solve2x2(
  A: [[number, number], [number, number]],
  b: [number, number],
): [number, number] | null {
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (Math.abs(det) < 1e-12) return null;
  const x0 = (b[0] * A[1][1] - A[0][1] * b[1]) / det;
  const x1 = (A[0][0] * b[1] - b[0] * A[1][0]) / det;
  return [x0, x1];
}

/**
 * Solve a square n×n linear system A·x = b via Gauss-Jordan elimination
 * with partial pivoting. Returns null if singular.
 */
export function solveLinear(A: number[][], b: number[]): number[] | null {
  const n = A.length;
  // Build augmented matrix (deep copy)
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    // partial pivot
    let pivotRow = i;
    let pivotVal = Math.abs(M[i][i]);
    for (let r = i + 1; r < n; r++) {
      const v = Math.abs(M[r][i]);
      if (v > pivotVal) {
        pivotVal = v;
        pivotRow = r;
      }
    }
    if (pivotVal < 1e-12) return null;
    if (pivotRow !== i) {
      const tmp = M[i];
      M[i] = M[pivotRow];
      M[pivotRow] = tmp;
    }
    // normalise pivot row
    const piv = M[i][i];
    for (let c = i; c <= n; c++) M[i][c] /= piv;
    // eliminate
    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const f = M[r][i];
      if (f === 0) continue;
      for (let c = i; c <= n; c++) M[r][c] -= f * M[i][c];
    }
  }
  return M.map((row) => row[n]);
}
