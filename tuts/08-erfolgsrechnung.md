# Tutorium 8 – Erfolgsrechnung (GKV / UKV, Voll- vs. Teilkosten)

## 8.1 Gesamtkostenverfahren (GKV) vs. Umsatzkostenverfahren (UKV)

### Konzept
Beide Verfahren liefern denselben Periodenerfolg, aber mit unterschiedlicher Struktur. GKV stellt Gesamtkosten den Erlösen + Bestandsveränderung gegenüber. UKV nur den Selbstkosten der abgesetzten Produkte.

### Formeln
- **GKV**: $G = E \pm \Delta B \cdot HK - K_{gesamt}$ (Bestand zu Herstellkosten!)
- **UKV**: $G = E - \text{Selbstkosten}_{Absatz}$
- Bestandsveränderung $\Delta B = \text{Produktionsmenge} - \text{Absatzmenge}$

### Generator
- 2 Produkte (A, B).
- Pro Produkt: Produktionsmenge, Absatzmenge (verschieden!), Verkaufspreis.
- Kostenarten getrennt: Materialkosten (var/fix), Fertigungskosten (var/fix), Vertriebskosten (var/fix).
- Stelle sicher: $\Delta B_A > 0$ und $\Delta B_B < 0$ (Lageraufbau bei A, Lagerabbau bei B).

### UI
Zwei nebeneinanderliegende Schemata:
- GKV: Erlöse + Bestandserhöhung − Bestandsminderung − Kostenarten
- UKV: Erlöse − Herstellkosten der abgesetzten Produkte − Vertriebskosten

Eingabefeld pro Position; Endbetrag (Periodenerfolg) muss in beiden Schemata gleich sein → Quervalidierung.

### Auto-Check
- Pro Position ±0,01 €.
- Endgewinn beider Verfahren konsistent → Bonus.

---

## 8.2 Vollkosten vs. Teilkosten – Gewinndifferenz

### Konzept
Bei Lageraufbau aktiviert die Vollkostenrechnung Fixkosten in Bestand → höherer ausgewiesener Gewinn als Teilkosten.

### Formel
$\Delta G = \Delta B \cdot k_{fix}^{HK}$

### Generator
Selbe Datenbasis wie 8.1; zusätzlich Aufteilung der Herstellkosten in fix/variabel.

### UI
- Eingabe: Periodenerfolg Teilkosten (niedriger).
- MC: „Warum weichen Voll- und Teilkostengewinn ab?" (4 Optionen, korrekte: „Fixkosten werden in Vollkostenrechnung mit Bestand aktiviert").

### Auto-Check
- Numerisch ±0,01 €.
- MC: 1 Punkt.
- Bonus: $\Delta G$ als separates Feld berechnen lassen.
