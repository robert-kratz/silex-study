# Tutorium 6 – Divisionskalkulation & großes Gleichungssystem

## 6.1 Mehrstufige Divisionskalkulation

### Konzept
Massenfertigung in mehreren Stufen mit Lagerbestandsänderungen. Pro Stufe werden eigene Stufenkosten + übernommene Vorstufenkosten durch die **Ausbringungsmenge** der Stufe geteilt.

### Formeln
- Stufe $s$: $k_s = \dfrac{PK_s + k_{s-1}\cdot M_s^{Eingang}}{M_s^{Ausgang}}$
- Selbstkosten/Einheit (Vertrieb): $k_{vertrieb} = k_{prod}^{kumuliert} + \dfrac{PK_{vertrieb}}{Absatzmenge}$

### Generator
- 2 Fertigungsstufen + 1 Vertriebsstufe.
- Stufe 1: Einsatzmenge $M_1$, Kosten $PK_1$.
- Lagerbewegung $\Delta L_1$: $M_2^{Eingang} = M_1 - \Delta L_1$ (oder + bei Lagerabbau).
- Stufe 2: $PK_2$, $\Delta L_2$.
- Vertrieb: Absatzmenge.

### UI
Stufen-Tabelle mit Spalten: Eingangsmenge, Ausgangsmenge, Stufenkosten, kumulative Kosten, Stückkosten.

### Auto-Check
Pro Zelle ±0,01 €. Finalfeld: Selbstkosten je Einheit (±0,01 €).

---

## 6.2 Großes Gleichungssystem – Drag-and-Drop-Aufstellung

### Konzept
Klausurfokus: korrektes **Aufstellen** der Gleichung pro Vorkostenstelle aus der Leistungsmatrix; Lösung wird vom System übernommen.

### Formel
$x_j\cdot k_j = PK_j + \sum_{i\ne j} x_{ji}\cdot k_i$

### Generator
- 3 Vorkostenstellen, 2 Endkostenstellen.
- Leistungsmatrix in Mengen (m², Std., kWh) plus Primärkosten pro Stelle.
- Gesamtleistung pro Stelle (Spaltensumme der abgegebenen Leistungen).

### UI
Pro Vorkostenstelle:
- Linke Seite vorgegeben: $X_j \cdot k_j = $
- Rechte Seite: aus Bausteinen drag-and-droppen
  - Verfügbare Bausteine: $PK_j$, $\{x_{ji}\cdot k_i\}$ (alle Stellen, auch Distraktoren mit falschen Indizes)

Optional Schritt 2: numerische Eingabe der Lösung $k_1, k_2, k_3$ (Solver dahinter).

### Auto-Check
- Drag-and-Drop: Set-Vergleich der Bausteine pro Gleichung; Reihenfolge irrelevant, aber Distraktoren müssen ausgeschlossen sein.
- Numerische Lösung: ±0,01.
- Folgefrage: „Wie viele Gleichungen brauchst du, um $k_1 \dots k_n$ zu lösen?" (Antwort: $n$).
