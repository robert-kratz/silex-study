/**
 * Mulberry32 — deterministic, tiny PRNG.
 * Returns a function `() => number` that yields values in [0, 1).
 */
export function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(): number {
  // 31-bit positive integer to keep URLs short and JSON-safe.
  return Math.floor(Math.random() * 2 ** 31);
}

export function rngInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function rngFloat(
  rng: () => number,
  min: number,
  max: number,
  decimals = 2,
): number {
  const v = rng() * (max - min) + min;
  const f = 10 ** decimals;
  return Math.round(v * f) / f;
}

export function rngPick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}
