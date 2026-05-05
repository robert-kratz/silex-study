import { createRng, rngInt } from "@/lib/random";

export interface GewinnmaximierungParams {
  /** Produktivitätskoeffizient. */
  a: number;
  /** Marktpreis. */
  p: number;
  /** Lohnsatz. */
  w: number;
}

export interface GewinnmaximierungSolution {
  /** Optimaler Input. */
  xStar: number;
  /** Optimaler Output a·√x*. */
  outputStar: number;
  /** Maximaler Gewinn p·output − w·x. */
  pi: number;
}

export function generateGewinnmaximierung(seed: number): GewinnmaximierungParams {
  const rng = createRng(seed);
  // Choose integers so that x* = (p·a/(2w))² is integer.
  // Pick m = pa/(2w) ∈ ℕ ⇒ x* = m².
  const m = rngInt(rng, 5, 20);
  const w = rngInt(rng, 1, 4);
  // pick p, a such that p*a = 2*w*m
  const target = 2 * w * m;
  // factor target into p (1..10) and a (rest); ensure a ≤ 50
  let p = 0,
    a = 0;
  for (let candidate = Math.min(target, 10); candidate >= 1; candidate--) {
    if (target % candidate === 0) {
      const aCandidate = target / candidate;
      if (aCandidate >= 2 && aCandidate <= 50) {
        p = candidate;
        a = aCandidate;
        break;
      }
    }
  }
  if (p === 0) {
    // fallback: just keep simple values
    p = 4;
    a = 10;
    // recompute m
    const newM = (p * a) / (2 * w);
    return { a, p, w };
    void newM;
  }
  return { a, p, w };
}
