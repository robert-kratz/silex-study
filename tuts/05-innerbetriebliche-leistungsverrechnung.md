# Tutorium 5 – Innerbetriebliche Leistungsverrechnung im Vergleich

Inhaltlich überlappt Tutorium 5 mit Tut 4 und Tut 6 (Aufgaben 20 & 21): dieselbe Datenbasis wird einmal mit Block-, Treppen- und Gleichungsverfahren durchgerechnet, um die Verfahren zu **vergleichen**.

## 5.1 Verfahrensvergleich auf identischer Datenbasis

### Konzept
Auf einer fixen Leistungsmatrix + Primärkosten alle drei Verfahren rechnen und Abweichungen quantifizieren.

### Formeln
Wie 4.2 / 4.3 / 4.4. Zusätzlich:
- Abweichung Verfahren $A$ vs. Gleichungsverfahren auf Endstelle $E$: $\Delta_E = K^A_E - K^{GV}_E$.

### Generator
- 2–3 Vorkostenstellen mit wechselseitigen Mengen (mind. eine Rückkopplung, damit Block- und Treppen-Verfahren ungenau werden).
- 2 Endstellen.
- Primärkosten mit gut handhabbaren Zahlen.
- Lösung im Hintergrund: alle drei Verfahren via Matrix-Solver berechnen.

### UI
Drei nebeneinander oder in Tabs angeordnete Tabellen, jede mit denselben Feldern (Verrechnungspreise + Endstellenbelastung). Toggle „Lernhilfe einblenden" zeigt Formel und Annahmen pro Verfahren.

### Auto-Check
- Pro Verfahren: separate Punkte.
- Optional Aggregat-Frage: „Welches Verfahren liefert das exakte Ergebnis?" (Antwort: Gleichungsverfahren).
- Folgefrage: „Wann ist Treppenumlage exakt?" (Theorie-Cluster).

---

## 5.2 Sortierfrage – Reihenfolge bei Treppenumlage

### Konzept
Aus 4 Vorkostenstellen die optimale Treppenreihenfolge bestimmen (Stelle mit meisten Abgaben an andere Vorstellen zuerst).

### Generator
- 3–4 Vorkostenstellen.
- Leistungsmatrix mit eindeutiger optimaler Reihenfolge (oder mehrere zulässige Reihenfolgen explizit erlauben).

### UI
shadcn `Sortable` / Drag-and-Drop-Liste.

### Auto-Check
- Liste exakt vergleichen; bei zulässigen Permutationen Set akzeptierter Reihenfolgen prüfen.

---

## Implementierungs-Notiz

Engine `ilv.ts`:
```ts
function solveBlock(input): Result;
function solveTreppe(input, order): Result;
function solveGleichung(input): Result; // via lusolve
function compareAll(input): { block, treppe, gleichung };
```
