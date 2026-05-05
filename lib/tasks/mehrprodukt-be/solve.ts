import type { MehrproduktBeParams } from "./generate";

export interface MehrproduktBeSolution {
  d1: number;
  d2: number;
  x1: number;
  x2: number;
  hoehererDb: "1" | "2";
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveMehrproduktBe(p: MehrproduktBeParams): MehrproduktBeSolution {
  const d1 = p.produkte[0].preis - p.produkte[0].kv;
  const d2 = p.produkte[1].preis - p.produkte[1].kv;
  const x1 = p.Kf / (d1 + d2 / p.v);
  const x2 = x1 / p.v;
  return {
    d1: r2(d1),
    d2: r2(d2),
    x1: r2(x1),
    x2: r2(x2),
    hoehererDb: d1 >= d2 ? "1" : "2",
  };
}
