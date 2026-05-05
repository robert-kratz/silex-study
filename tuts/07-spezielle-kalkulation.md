# Tutorium 7 – Spezielle Kalkulationsverfahren

## 7.1 Äquivalenzziffernrechnung

### Konzept
Sortenfertigung: artverwandte Produkte, deren Kostenrelationen über physikalische Eigenschaften abgebildet werden.

### Formeln
- $\text{ÄZ}_X = \dfrac{\text{Eigenschaft}_X}{\text{Eigenschaft}_{Grundsorte}}$
- Schlüsselzahl $S_X = \text{Stückzahl}_X \cdot \text{ÄZ}_X$
- Stückkosten Sorte $X$: $k_X = \dfrac{K_{gesamt}}{\sum_X S_X} \cdot \text{ÄZ}_X$

### Generator
- 3–4 Sorten; pro Sorte zwei Eigenschaften (z. B. Länge, Breite). ÄZ = Produkt der Verhältnisse zur Grundsorte (oder explizit definiert).
- Stückzahlen pro Sorte zufällig.
- Gesamtkosten zufällig.
- Optional Verkaufspreise → Gewinn pro Stück.

### UI
Tabelle mit Spalten: ÄZ, Schlüsselzahl, Stückkosten, optional Gewinn/Stück. Alles Eingabefelder.

### Auto-Check
- ÄZ-Spalte muss Grundsorte=1,0 enthalten (sonst Fehlermeldung).
- Toleranz ±0,01 pro Wert.

---

## 7.2 Kuppelproduktion – Restwertmethode

### Konzept
Ein Hauptprodukt + mehrere Nebenprodukte. Erlöse der Nebenprodukte (abzüglich deren direkter Kosten) reduzieren die Kosten des Hauptprodukts.

### Formeln
- Kostendeckungsanteil = $\sum_{NB} (\text{Erlös}_{NB} - \text{direkte Kosten}_{NB})$
- HK_Hauptprodukt = Kuppelkosten − Kostendeckungsanteil + direkte Kosten Hauptprodukt
- $k_{HP} = HK_{HP} / \text{Menge}_{HP}$

### Generator
- 1 Hauptprodukt + 2 Nebenprodukte mit Mengen, Marktpreisen, direkten Kosten.
- Kuppelkosten zufällig.

### UI / Check
- Eingabe: Kostendeckungsanteil, HK Hauptprodukt, Stückkosten Hauptprodukt.
- Toleranz ±0,01 €.

---

## 7.3 Kuppelproduktion – Marktwertmethode

### Konzept
Kein Hauptprodukt; Kuppelkosten werden im Verhältnis der Markterlöse umgelegt.

### Formel
$\text{Anteil}_i = \dfrac{E_i}{\sum_j E_j} \cdot K_{Kuppel}$, $k_i = \text{Anteil}_i / \text{Menge}_i$

### Generator
Selbe Daten wie 7.2; jetzt alle Produkte gleichberechtigt.

### UI / Check
Tabelle mit Anteil-Kuppelkosten + Stückkosten pro Produkt. Toleranz ±0,01 €.

Folgefrage: „Wann eignet sich Restwert-, wann Marktwertmethode?" (Theorie-Cluster).

---

## 7.4 Prozesskostenrechnung (Activity-Based Costing)

### Konzept
Gemeinkosten über Kostentreiber (statt %-Zuschlag) auf Aufträge umlegen → Komplexitätseffekt.

### Formeln
- Prozesskostensatz $PKS_p = \dfrac{K_p}{M_p}$ (budgetierte Kosten / Menge)
- Auftragskosten $A_a = \sum_p PKS_p \cdot m_{p,a}$
- Vergleich mit traditioneller Zuschlagskalkulation: $\text{Zuschlag} = K_{GK}/K_{EK} \cdot EK_a$

### Generator
- 3 Prozesse mit $K_p$ und $M_p$ (z. B. 50.000 € / 1.000 Bestellungen).
- 2 Aufträge: Massenprodukt (große Lose, wenige Prozessauslösungen) und Spezialprodukt (umgekehrt).

### UI
- Eingabe: 3 Prozesskostensätze, 2 Aufträge × Gesamtumlage.
- Optional Vergleichstabelle mit Zuschlagskalkulation.
- MC-Folgefrage: „Warum unterscheiden sich die Verfahren?" (Allokationseffekt).

### Auto-Check
Pro Wert ±0,01 €. MC-Frage 1 Punkt.
