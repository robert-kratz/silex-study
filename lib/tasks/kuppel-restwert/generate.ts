import { createRng, rngInt } from "@/lib/random";

export interface KuppelProdukt {
  name: string;
  menge: number;
  preis: number;
  /** Direkte (separate) Kosten dieses Produkts. */
  direkt: number;
}

export interface KuppelRestwertParams {
  /** Reihenfolge: Index 0 = Hauptprodukt. */
  produkte: KuppelProdukt[];
  /** Kuppelkosten (gemeinsam erzeugte Kosten). */
  K: number;
}

export function generateKuppelRestwert(seed: number): KuppelRestwertParams {
  const rng = createRng(seed);
  const produkte: KuppelProdukt[] = [
    {
      name: "Hauptprodukt",
      menge: rngInt(rng, 800, 3000),
      preis: rngInt(rng, 30, 120),
      direkt: rngInt(rng, 5, 30) * 1000,
    },
    {
      name: "Nebenprodukt 1",
      menge: rngInt(rng, 100, 800),
      preis: rngInt(rng, 10, 60),
      direkt: rngInt(rng, 1, 8) * 1000,
    },
    {
      name: "Nebenprodukt 2",
      menge: rngInt(rng, 100, 800),
      preis: rngInt(rng, 10, 60),
      direkt: rngInt(rng, 1, 8) * 1000,
    },
  ];
  return {
    produkte,
    K: rngInt(rng, 60, 300) * 1000,
  };
}
