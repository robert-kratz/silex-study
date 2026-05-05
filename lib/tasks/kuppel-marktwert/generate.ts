import { createRng, rngInt } from "@/lib/random";

export interface KuppelMarktwertProdukt {
  name: string;
  menge: number;
  preis: number;
}

export interface KuppelMarktwertParams {
  produkte: KuppelMarktwertProdukt[];
  K: number;
}

export function generateKuppelMarktwert(seed: number): KuppelMarktwertParams {
  const rng = createRng(seed);
  return {
    produkte: [
      { name: "Produkt A", menge: rngInt(rng, 500, 2500), preis: rngInt(rng, 30, 120) },
      { name: "Produkt B", menge: rngInt(rng, 300, 1500), preis: rngInt(rng, 20, 90) },
      { name: "Produkt C", menge: rngInt(rng, 200, 1000), preis: rngInt(rng, 15, 80) },
    ],
    K: rngInt(rng, 60, 300) * 1000,
  };
}
