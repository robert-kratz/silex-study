# Tutorium 3 – Kostenartenrechnung: Abschreibung, Material, kalk. Zinsen

## 3.1 Abschreibungspläne (4 Verfahren)

### Konzept
Vollständigen Abschreibungsplan über $T$ Jahre nach 4 Methoden erstellen.

### Formeln
- **Linear**: $\text{AfA} = (AW - RW)/T$
- **Geometrisch-degressiv**: konstanter %-Satz $q = 1 - \sqrt[T]{RW/AW}$, Abschreibungsbetrag $= q \cdot \text{Buchwert}_{Jahr-1}$
- **Arithmetisch-degressiv (digital)**: Degressionsbetrag $d=(AW-RW)/\sum_{i=1}^{T} i$, AfA$_t = (T-t+1)\cdot d$
- **Leistungsabhängig**: AfA$_t = \dfrac{AW-RW}{\text{Gesamtleistung}} \cdot \text{Leistung}_t$

### Generator
- $AW\in[20\,000, 100\,000]$, $RW\in[1\,000, 10\,000]$, $T\in\{3,4,5\}$.
- Leistung pro Jahr: zufällige Verteilung, Summe = Gesamtleistung.
- Achtung: bei geometrisch-degressiv ggf. Restbuchwert exakt = $RW$ → Wahl der Eingaben so, dass es aufgeht (z. B. AW=64.000, RW=1.000, T=4 → q=50 %).

### UI
4 Tabellen (eine pro Verfahren), Spalten: Buchwert Anfang, AfA, Buchwert Ende. Pro Zelle Eingabefeld.

### Auto-Check
- Pro Zelle ±0,01 €.
- Teilpunkte pro Zelle.
- Folgefrage (Theorie-Cluster): „Welches Verfahren maximiert den Gewinn in Jahr 1?"

---

## 3.2 Materialbewertung – FIFO / LIFO

### Konzept
Bei schwankenden Einstandspreisen Verbrauchswert und Endbestand ermitteln.

### Verfahren
- **FIFO**: ältester Bestand zuerst verbraucht → Endbestand mit jüngsten Preisen bewertet.
- **Permanent LIFO**: pro Abgang den jüngsten verfügbaren Bestand verbrauchen.
- **Periodisches LIFO** (optional): Verbrauch insgesamt vom letzten Zugang her.
- **Inventur (Befund)**: $V = AB + Z - EB$.

### Generator
- $AB$: Menge + Preis.
- 3–5 Zugänge mit zufälligem Preis (Drift z. B. ±5 % pro Zugang).
- 3–5 Abgänge nur mit Mengen (kein Preis).
- Constraint: Mengen so, dass kein Bestand negativ wird.

### UI
Tabelle der Buchungen + Eingabefelder:
- Verbrauchswert FIFO, Endbestand FIFO
- Verbrauchswert LIFO, Endbestand LIFO

Optional: schrittweise Lager-Tabelle (jeder Schritt mit Restbestand und Preis-Layern).

### Auto-Check
±0,01 € pro Wert. Folge-Theoriefrage: Effekt auf Gewinn bei steigenden/fallenden Preisen.

---

## 3.3 Kalkulatorische Zinsen & Betriebsnotwendiges Kapital

### Konzept
Aus Bilanz nicht betriebsnotwendige Positionen herausrechnen, Abzugskapital subtrahieren, mit WACC verzinsen.

### Formeln
- BN-Vermögen = AV + UV − nicht betriebsnotwendige Posten + nicht bilanzierte betriebsnotwendige Posten
- Abzugskapital = zinsfrei überlassenes FK (z. B. Lieferantenverbindlichkeiten, Kundenanzahlungen)
- BN-Kapital = BN-Vermögen − Abzugskapital
- Kalk. Zinsen = BN-Kapital · WACC

### Generator
- Bilanzpositionen mit zufälligen Beträgen, davon:
  - 1–2 Posten als „Falle" (z. B. spekulative Wertpapiere → nicht betriebsnotwendig).
  - 1 Posten Abzugskapital.
- WACC $\in [3\%, 8\%]$.

### UI
Schrittweises Formular: BN-Vermögen → Abzugskapital → BN-Kapital → kalk. Zinsen.

### Auto-Check
Pro Zwischenergebnis ±0,01 €. Bei Fehlern Hinweis, welcher Posten falsch klassifiziert wurde.
