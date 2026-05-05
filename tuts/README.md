# Silex-Study – Aufgabenkatalog Internes Rechnungswesen

Dieser Ordner enthält die strukturierte Spezifikation aller Aufgabentypen aus dem Modul *Internes Rechnungswesen*. Jede Datei beschreibt:

1. **Konzept** – Worum geht es fachlich?
2. **Definitionen & Formeln** – Wissen, das im UI als „Lernhilfe" eingeblendet werden kann.
3. **Generator-Plan** – Wie wird eine zufällige Aufgabe deterministisch erzeugt (Eingabeparameter, Ranges, Constraints).
4. **Lösungsalgorithmus** – Wie berechnet der Server / Client die Referenzlösung.
5. **UI-/Eingabeschema** – Welche Eingabefelder braucht der Spieler.
6. **Auto-Check** – Welche Toleranz, welche Teilpunkte, welche Folgeprüfungen (z. B. „Warum?"-Multiple-Choice).

## Übersicht

| Datei | Tutorium | Schwerpunkt |
| --- | --- | --- |
| [00-theorie-quiz.md](00-theorie-quiz.md) | übergreifend | Theorie- & Konzeptfragen (Aufgabentyp 0) |
| [01-grundbegriffe-kostenfunktionen.md](01-grundbegriffe-kostenfunktionen.md) | Tut 1 | Tarifwahl, Wertabgrenzung, Preiskalkulation, Gewinnmaximierung |
| [02-kostenverlaeufe-entscheidung.md](02-kostenverlaeufe-entscheidung.md) | Tut 2 | Wertabgrenzung, lineare Kosten, Hoch-Tief, Make-or-Buy, Polynom-Kosten |
| [03-kostenarten-abschreibung.md](03-kostenarten-abschreibung.md) | Tut 3 | Abschreibungspläne, FIFO/LIFO, kalkulatorische Zinsen |
| [04-kostenstellen-bab.md](04-kostenstellen-bab.md) | Tut 4 | BAB Primärverteilung, Block-/Treppen-/Gleichungsverfahren, Gutschrift-Lastschrift |
| [05-innerbetriebliche-leistungsverrechnung.md](05-innerbetriebliche-leistungsverrechnung.md) | Tut 5 | Vergleich der drei ILV-Verfahren auf identischer Datenbasis |
| [06-divisionskalkulation.md](06-divisionskalkulation.md) | Tut 6 | Mehrstufige Divisionskalkulation, großes Gleichungssystem (Matrix) |
| [07-spezielle-kalkulation.md](07-spezielle-kalkulation.md) | Tut 7 | Äquivalenzziffern, Kuppelproduktion (Restwert/Marktwert), Prozesskostenrechnung |
| [08-erfolgsrechnung.md](08-erfolgsrechnung.md) | Tut 8 | GKV vs. UKV, Voll- vs. Teilkosten, Gewinndifferenz |
| [09-deckungsbeitragsrechnung.md](09-deckungsbeitragsrechnung.md) | Tut 9 | Mehrstufige Deckungsbeitragsrechnung, Sortimentsentscheidung |
| [10-break-even-analyse.md](10-break-even-analyse.md) | Tut 10 | Einprodukt-Break-Even, Sensitivität, Mehrprodukt-Break-Even |

## Konventionen für die Implementierung (Next.js / TypeScript / shadcn)

- **Aufgaben-Engine**: Pro Aufgabentyp ein Modul mit zwei reinen Funktionen
  - `generate(seed: number, difficulty?: 'easy'|'medium'|'hard'): TaskInput` – deterministisch via Seed (z. B. `seedrandom`).
  - `solve(input: TaskInput): TaskSolution` – Referenzlösung; nie auf den Client schicken, bevor abgegeben wurde.
- **Rendering**: Pro Aufgabentyp eine React-Komponente, die `TaskInput` rendert und `UserAnswer` erfasst.
- **Validierung**: `check(solution, userAnswer): { score, fieldResults, feedback }` – pro Feld separat, mit Toleranz (siehe unten) und Teilpunkten.
- **Toleranzen**:
  - Geldbeträge: ±0,01 € (alternativ ±0,5 % bei großen Summen).
  - Prozentsätze: ±0,01 Prozentpunkte.
  - Mengen/Stück: exakt (ganzzahlig) oder ±1, falls aus Rundung resultierend.
  - Verrechnungspreise mit irrationalen Resultaten: ±0,01 oder ±0,5 %.
- **Eingabe-Parsing**: Komma und Punkt als Dezimaltrenner akzeptieren; Tausenderpunkte/Spaces ignorieren; leere Felder = 0 (für Matrizen).
- **State & Persistenz**: pro Übungssession Seed + Eingaben in `localStorage`/Server-DB; History pro Aufgabentyp für Lernfortschritt.
- **Lernhilfen**: Formeln als KaTeX-Komponenten (Tooltip / Drawer in shadcn). Pro Aufgabentyp eine `formulas.ts` mit den eingeblendeten Definitionen.
- **„Warum?"-Folgefragen**: Nach jeder Rechenaufgabe optional ein 1–2-Klick-Multiple-Choice (Typ 0 wiederverwenden) zur Konzeptverankerung.

## Gemeinsamer Datentyp-Vorschlag (TypeScript-Skizze)

```ts
type TaskInput = { kind: string; seed: number; params: Record<string, unknown> };
type TaskSolution = { fields: Record<string, number | string | number[]> };
type FieldResult = { ok: boolean; expected: unknown; tolerance?: number };
type CheckResult = { score: number; max: number; fields: Record<string, FieldResult>; explanation?: string };
```

Jede Tutoriums-Datei verwendet diese Struktur und konkretisiert `params` und `fields` pro Aufgabentyp.
