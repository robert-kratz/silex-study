import type { MaterialBuchung, MaterialbewertungParams } from "./generate";

export interface MaterialbewertungSolution {
  fifoVerbrauch: number;
  fifoEndbestand: number;
  lifoVerbrauch: number;
  lifoEndbestand: number;
  /** Nachträglicher (periodischer) Durchschnittspreis – Verbrauchswert. */
  avgPeriodVerbrauch: number;
  /** Nachträglicher Durchschnittspreis – wertmäßiger Endbestand. */
  avgPeriodEndbestand: number;
  /** Gleitender Durchschnittspreis – kumulierter Verbrauchswert. */
  avgGleitendVerbrauch: number;
  /** Gleitender Durchschnittspreis – wertmäßiger Endbestand. */
  avgGleitendEndbestand: number;
}

const r2 = (n: number): number => Math.round(n * 100) / 100;

interface Layer {
  menge: number;
  preis: number;
}

function applyAbgaenge(
  buchungen: MaterialBuchung[],
  fromEnd: boolean,
): { verbrauch: number; remaining: Layer[] } {
  const layers: Layer[] = [];
  let verbrauch = 0;
  for (const b of buchungen) {
    if (b.type === "AB" || b.type === "Z") {
      layers.push({ menge: b.menge, preis: b.preis });
    } else {
      // Abgang
      let need = b.menge;
      while (need > 0 && layers.length > 0) {
        const idx = fromEnd ? layers.length - 1 : 0;
        const layer = layers[idx];
        const take = Math.min(need, layer.menge);
        verbrauch += take * layer.preis;
        layer.menge -= take;
        need -= take;
        if (layer.menge === 0) layers.splice(idx, 1);
      }
    }
  }
  return { verbrauch, remaining: layers };
}

function endbestandValue(remaining: Layer[]): number {
  return remaining.reduce((s, l) => s + l.menge * l.preis, 0);
}

/** Nachträglicher (periodischer) Durchschnittspreis. */
function avgPeriod(buchungen: MaterialBuchung[]): {
  verbrauch: number;
  endbestand: number;
} {
  let totalMenge = 0;
  let totalWert = 0;
  let abgangMenge = 0;
  for (const b of buchungen) {
    if (b.type === "AB" || b.type === "Z") {
      totalMenge += b.menge;
      totalWert += b.menge * b.preis;
    } else {
      abgangMenge += b.menge;
    }
  }
  const preis = totalMenge === 0 ? 0 : totalWert / totalMenge;
  const endMenge = totalMenge - abgangMenge;
  return {
    verbrauch: abgangMenge * preis,
    endbestand: endMenge * preis,
  };
}

/** Gleitender Durchschnittspreis (permanent). */
function avgGleitend(buchungen: MaterialBuchung[]): {
  verbrauch: number;
  endbestand: number;
} {
  let menge = 0;
  let wert = 0;
  let verbrauch = 0;
  for (const b of buchungen) {
    if (b.type === "AB" || b.type === "Z") {
      menge += b.menge;
      wert += b.menge * b.preis;
    } else {
      const preis = menge === 0 ? 0 : wert / menge;
      const v = b.menge * preis;
      verbrauch += v;
      menge -= b.menge;
      wert -= v;
    }
  }
  return { verbrauch, endbestand: wert };
}

export function solveMaterialbewertung(
  p: MaterialbewertungParams,
): MaterialbewertungSolution {
  const fifo = applyAbgaenge(p.buchungen, false);
  const lifo = applyAbgaenge(p.buchungen, true);
  const ap = avgPeriod(p.buchungen);
  const ag = avgGleitend(p.buchungen);
  return {
    fifoVerbrauch: r2(fifo.verbrauch),
    fifoEndbestand: r2(endbestandValue(fifo.remaining)),
    lifoVerbrauch: r2(lifo.verbrauch),
    lifoEndbestand: r2(endbestandValue(lifo.remaining)),
    avgPeriodVerbrauch: r2(ap.verbrauch),
    avgPeriodEndbestand: r2(ap.endbestand),
    avgGleitendVerbrauch: r2(ag.verbrauch),
    avgGleitendEndbestand: r2(ag.endbestand),
  };
}
