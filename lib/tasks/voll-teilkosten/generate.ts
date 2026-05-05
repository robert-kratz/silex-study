import { createRng, rngInt } from "@/lib/random";

export interface VtkProdukt {
  name: string;
  produktion: number;
  absatz: number;
  preis: number;
  kVarHK: number;
  KFixHK: number;
  kVarVt: number;
  KFixVt: number;
}

export interface VollTeilkostenParams {
  produkte: VtkProdukt[];
}

export function generateVollTeilkosten(seed: number): VollTeilkostenParams {
  const rng = createRng(seed);
  const prodA = rngInt(rng, 800, 2000);
  const absA = rngInt(rng, 400, prodA - 100); // Lageraufbau
  const prodB = rngInt(rng, 600, 1500);
  const absB = rngInt(rng, 200, prodB - 100); // ebenfalls Aufbau, damit ΔG > 0
  return {
    produkte: [
      {
        name: "Produkt A",
        produktion: prodA, absatz: absA,
        preis: rngInt(rng, 40, 120),
        kVarHK: rngInt(rng, 10, 40),
        KFixHK: rngInt(rng, 10, 40) * 1000,
        kVarVt: rngInt(rng, 2, 10),
        KFixVt: rngInt(rng, 2, 10) * 1000,
      },
      {
        name: "Produkt B",
        produktion: prodB, absatz: absB,
        preis: rngInt(rng, 30, 100),
        kVarHK: rngInt(rng, 8, 35),
        KFixHK: rngInt(rng, 8, 30) * 1000,
        kVarVt: rngInt(rng, 2, 10),
        KFixVt: rngInt(rng, 2, 10) * 1000,
      },
    ],
  };
}
