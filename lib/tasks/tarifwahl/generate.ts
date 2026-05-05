import { createRng, rngInt, rngFloat } from "@/lib/random";

export interface TarifFunction {
  fix: number;
  vk: number;
}

export interface TarifwahlParams {
  tarife: { A: TarifFunction; B: TarifFunction; C: TarifFunction };
  /** Three quantities to evaluate. */
  mengen: number[];
}

export interface TarifwahlSolution {
  /** Per quantity: cheapest tariff key ("A" | "B" | "C") and its unit cost. */
  results: { tarif: "A" | "B" | "C"; gesamtkosten: number; stueckkosten: number }[];
}

export function generateTarifwahl(seed: number): TarifwahlParams {
  const rng = createRng(seed);
  const A: TarifFunction = { fix: rngInt(rng, 20, 60), vk: 0 };
  const B: TarifFunction = { fix: 0, vk: rngFloat(rng, 0.1, 0.4, 2) };
  const C: TarifFunction = {
    fix: rngInt(rng, 5, 25),
    vk: rngFloat(rng, 0.05, 0.2, 2),
  };
  const baseMengen = [50, 200, 500];
  const mengen = baseMengen.map((m) => Math.round(m * (0.8 + rng() * 0.4)));
  return { tarife: { A, B, C }, mengen };
}
