# Tutorium 4 – Kostenstellenrechnung & BAB

## 4.1 Verteilung primärer Gemeinkosten (BAB Teil 1)

### Konzept
Primäre GK über Schlüssel auf Kostenstellen umlegen.

### Formeln
- Umlagesatz $u_j = \dfrac{\sum K_j}{\sum_i s_{ij}}$
- Zurechnung Kostenart $j$ auf Stelle $i$: $u_j \cdot s_{ij}$

### Generator
- 3–5 Kostenarten, jeweils Gesamtbetrag.
- 4 Kostenstellen.
- Schlüsselverteilung pro Kostenart als Vektor mit Summe = Gesamtmenge.

### UI
Matrix Kostenarten × Kostenstellen, Eingabefelder pro Zelle + Zeilensummen-Check.

### Auto-Check
Pro Zelle ±0,01 €. Optional Bonuspunkt für korrekte Spaltensumme.

---

## 4.2 Innerbetriebliche Leistungsverrechnung – Blockumlage

### Konzept
Vorkostenstellen-Kosten **direkt** auf Endkostenstellen umlegen; gegenseitige Leistungen zwischen Vorstellen ignoriert.

### Formel
$k_j = \dfrac{PK_j}{\sum_{i\in \text{Endstellen}} x_{ji}}$

### Generator
- 2 Vorkostenstellen V1, V2; 2 Endkostenstellen E1, E2.
- Leistungsmatrix bewusst mit V1→V2-Eintrag (als Falle).
- Primärkosten $PK_j$ zufällig.

### UI / Check
- Eingaben: $k_{V1}, k_{V2}$, sowie Belastungstabelle E1/E2.
- Toleranz ±0,01 €.

---

## 4.3 Innerbetriebliche Leistungsverrechnung – Treppenumlage

### Konzept
Stufenweise nur in eine Richtung: zuerst die Stelle mit den meisten Abgaben an andere Vorstellen.

### Formel
$k_j = \dfrac{PK_j + \sum_{i<j} x_{ji}\cdot k_i}{\sum_{i\ge j} x_{ji}}$ (nur abgehende Leistungen an noch nicht abgerechnete Stellen + Endstellen)

### Generator
- 3 Vorkostenstellen mit klar gerichtetem Fluss (z. B. A→B,C; B→C). Reihenfolge: A, B, C.

### UI
- Schritt 1: Drag-and-Drop / Sortier-Liste der Reihenfolge.
- Schritt 2: Eingaben $k_A, k_B, k_C$ + Endstellenbelastung.

### Auto-Check
- Reihenfolge: exakt.
- Verrechnungspreise: ±0,01 €.
- Folgefrage: „Ist Treppenumlage hier exakt?" (nur wenn keine Rückflüsse, was hier konstruktionsbedingt zutrifft).

---

## 4.4 Innerbetriebliche Leistungsverrechnung – Gleichungsverfahren

### Konzept
Lineares Gleichungssystem für wechselseitige Leistungen aufstellen und lösen.

### Formel
$x_j \cdot k_j = PK_j + \sum_i x_{ji}\cdot k_i$, gelöst nach $k$-Vektor.

### Generator
- 2 Vorkostenstellen mit wechselseitigen Mengen.
- Wähle Parameter so, dass Lösung „rund" ist (z. B. 2x2-LGS mit ganzzahligem Resultat). Hilfsweg: Lösung vorgeben, Inputs rückwärts berechnen.

### UI
- Teil 1: 4 Optionen für die korrekt aufgestellte Gleichung von $k_1$ → MC.
- Teil 2: Eingabe $k_1, k_2$ + Endstellenbelastung.

### Auto-Check
- MC: 1 Punkt.
- $k_i$: ±0,01.

---

## 4.5 Gutschrift-Lastschrift-Verfahren (Deckungsumlage)

### Konzept
Mit fixen Plan-Verrechnungspreisen werden Vorstellen entlastet (Gutschrift) und belastet (Lastschrift); verbleibender Saldo wird per Deckungsumlage auf Endstellen verteilt.

### Formeln
- Gutschrift Stelle $j$: $\sum_i x_{ji}\cdot vp_j$
- Lastschrift Stelle $j$: $\sum_i x_{ij}\cdot vp_i$
- Saldo $j$ = $PK_j$ + Lastschrift − Gutschrift (über/unterdeckt)
- Deckungsumlage: Summe Salden / Endstellen-Schlüssel.

### Generator
- 2 Vorstellen + 2 Endstellen.
- Plan-VP fest vorgeben.
- Mengen + $PK$ randomisieren so, dass Saldo ≠ 0.

### UI / Check
- Tabelle mit Saldenfeldern (±0,01 €).
- Eingabe der finalen Endstellenbelastung nach Deckungsumlage.

---

## Implementierungs-Notiz

Wiederverwendbare Komponente `KostenstellenMatrix` (Spalten konfigurierbar) für 4.1, 4.2, 4.3, 4.4, 4.5. Engine: Matrixsolver (z. B. `mathjs.lusolve`) für Gleichungsverfahren.
