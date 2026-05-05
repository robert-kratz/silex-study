import { createRng, rngInt, rngPick } from "@/lib/random";

export interface MbeProdukt {
  name: string;
  preis: number;
  kv: number;
}

export interface MehrproduktBeParams {
  produkte: [MbeProdukt, MbeProdukt];
  Kf: number;
  /** v = x1 / x2 (festes Verkaufsverhältnis). */
  v: number;
}

export function generateMehrproduktBe(seed: number): MehrproduktBeParams {
  const rng = createRng(seed);
  const v = rngPick(rng, [0.5, 1, 2, 3]);
  const p1 = rngInt(rng, 40, 200);
  const kv1 = rngInt(rng, Math.floor(0.3 * p1), Math.floor(0.7 * p1));
  const p2 = rngInt(rng, 40, 200);
  let kv2 = rngInt(rng, Math.floor(0.3 * p2), Math.floor(0.7 * p2));
  // Stelle sicher, dass d1 ≠ d2 (für klare Folgeantwort)
  if (p1 - kv1 === p2 - kv2) kv2 += 1;
  return {
    produkte: [
      { name: "Produkt 1", preis: p1, kv: kv1 },
      { name: "Produkt 2", preis: p2, kv: kv2 },
    ],
    Kf: rngInt(rng, 30, 250) * 1000,
    v,
  };
}
