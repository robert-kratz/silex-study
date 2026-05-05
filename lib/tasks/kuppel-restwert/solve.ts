import type { KuppelRestwertParams } from "./generate";

export interface KuppelRestwertSolution {
  /** Σ (Erlös_NB − direkte Kosten_NB). */
  kostendeckung: number;
  /** HK des Hauptprodukts = K − Kostendeckung + direkt_HP. */
  HK_HP: number;
  /** Stückkosten Hauptprodukt. */
  k_HP: number;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

export function solveKuppelRestwert(
  p: KuppelRestwertParams,
): KuppelRestwertSolution {
  const HP = p.produkte[0];
  const NBs = p.produkte.slice(1);
  const kostendeckung = NBs.reduce(
    (acc, x) => acc + (x.menge * x.preis - x.direkt),
    0,
  );
  const HK_HP = p.K - kostendeckung + HP.direkt;
  const k_HP = HK_HP / HP.menge;
  return {
    kostendeckung: r2(kostendeckung),
    HK_HP: r2(HK_HP),
    k_HP: r2(k_HP),
  };
}
