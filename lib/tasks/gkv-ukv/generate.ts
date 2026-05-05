import { createRng, rngInt } from "@/lib/random";

export interface GkvUkvProdukt {
  name: string;
  produktion: number;
  absatz: number;
  preis: number;
  /** Variable Herstellkosten je Stück. */
  kVarHK: number;
  /** Fixe Herstellkosten gesamt (für dieses Produkt). */
  KFixHK: number;
  /** Variable Vertriebskosten je abgesetzter Stück. */
  kVarVt: number;
  /** Fixe Vertriebskosten gesamt. */
  KFixVt: number;
}

export interface GkvUkvParams {
  produkte: GkvUkvProdukt[];
}

export function generateGkvUkv(seed: number): GkvUkvParams {
  const rng = createRng(seed);
  // Produkt A: Lageraufbau (produktion > absatz)
  const prodA = rngInt(rng, 800, 2000);
  const absA = rngInt(rng, 400, prodA - 100);
  // Produkt B: Lagerabbau (absatz > produktion)
  const prodB = rngInt(rng, 500, 1500);
  const absB = rngInt(rng, prodB + 100, prodB + 600);
  return {
    produkte: [
      {
        name: "Produkt A",
        produktion: prodA,
        absatz: absA,
        preis: rngInt(rng, 40, 120),
        kVarHK: rngInt(rng, 10, 40),
        KFixHK: rngInt(rng, 8, 30) * 1000,
        kVarVt: rngInt(rng, 2, 10),
        KFixVt: rngInt(rng, 2, 10) * 1000,
      },
      {
        name: "Produkt B",
        produktion: prodB,
        absatz: absB,
        preis: rngInt(rng, 30, 100),
        kVarHK: rngInt(rng, 8, 35),
        KFixHK: rngInt(rng, 6, 25) * 1000,
        kVarVt: rngInt(rng, 2, 10),
        KFixVt: rngInt(rng, 2, 10) * 1000,
      },
    ],
  };
}
