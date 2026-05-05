import { createRng, rngInt } from "@/lib/random";

export type HgbKategorie = "pflicht" | "wahlrecht" | "verbot";

export interface KostenBlock {
  label: string;
  betrag: number;
  kategorie: HgbKategorie;
}

export interface HgbHerstellkostenParams {
  bloecke: KostenBlock[];
}

const POOL: { label: string; kategorie: HgbKategorie }[] = [
  { label: "Materialeinzelkosten", kategorie: "pflicht" },
  { label: "Fertigungseinzelkosten", kategorie: "pflicht" },
  { label: "Sondereinzelkosten der Fertigung", kategorie: "pflicht" },
  { label: "Materialgemeinkosten", kategorie: "pflicht" },
  { label: "Fertigungsgemeinkosten (variabel)", kategorie: "pflicht" },
  { label: "Werteverzehr des Anlagevermögens (Abschreibung Fertigung)", kategorie: "pflicht" },
  { label: "Allgemeine Verwaltungskosten", kategorie: "wahlrecht" },
  { label: "Herstellungsbezogene Fremdkapitalkosten", kategorie: "wahlrecht" },
  { label: "Freiwillige soziale Leistungen", kategorie: "wahlrecht" },
  { label: "Aufwendungen für betriebliche Altersvorsorge", kategorie: "wahlrecht" },
  { label: "Forschungskosten", kategorie: "verbot" },
  { label: "Vertriebskosten", kategorie: "verbot" },
  { label: "Kalkulatorische Zinsen", kategorie: "verbot" },
  { label: "Kalkulatorischer Unternehmerlohn", kategorie: "verbot" },
];

function shuffle<T>(rng: () => number, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateHgbHerstellkosten(seed: number): HgbHerstellkostenParams {
  const rng = createRng(seed);
  // Stelle sicher, dass mindestens ein Eintrag jeder Kategorie enthalten ist.
  const pflicht = POOL.filter((p) => p.kategorie === "pflicht");
  const wahl = POOL.filter((p) => p.kategorie === "wahlrecht");
  const verbot = POOL.filter((p) => p.kategorie === "verbot");

  const pickedPflicht = shuffle(rng, pflicht).slice(0, 4);
  const pickedWahl = shuffle(rng, wahl).slice(0, 3);
  const pickedVerbot = shuffle(rng, verbot).slice(0, 3);

  const bloecke = shuffle(rng, [...pickedPflicht, ...pickedWahl, ...pickedVerbot]).map(
    (b) => ({
      ...b,
      betrag: rngInt(rng, 1, 80) * 1000, // glatte 1.000er
    }),
  );
  return { bloecke };
}
