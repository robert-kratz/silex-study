# Tutorium 2 – Kostenverläufe, Schätzung & Entscheidungsrechnung

## 2.1 Detaillierte Wertabgrenzung (Beträge pro Kategorie)

### Konzept
Wie 1.2, aber mit exakter Beträge-Abfrage je Kategorie inkl. Zusatz-/Anderskosten.

### Formeln / Definitionen
- Zusatzkosten: Kosten ohne korrespondierenden Aufwand.
- Anderskosten: Kosten in anderer Höhe als der Aufwand (typisch: kalk. Abschreibung vs. bilanzielle).

### Generator / Check
Wie Typ 1.2, jedoch
- Vorfälle gezielt mit unterschiedlichen Beträgen pro Spalte (z. B. bilanzielle AfA = 1.000, kalk. AfA = 1.200 → Aufwand 1.000, Kosten 1.200).
- 6–10 Vorfälle, Tabelleneingabe mit ±0,00 € Toleranz.

---

## 2.2 Lineare Kostenfunktionen aus Punkt-Daten

### Konzept
Aus Durchschnittskosten und Grenzkosten an einem Auslastungspunkt $K(x)=K_{fix}+k_{var}\cdot x$ rekonstruieren.

### Formeln
- Bei linearer Funktion: Grenzkosten $=k_{var}$.
- $K_{fix} = (k_{durchschnitt} - k_{var}) \cdot x$.

### Generator
- Wähle $k_{var}\in[2,15]$, $K_{fix}\in[1\,000, 10\,000]$, $x_1\in[100,1\,000]$.
- Berechne $k_{durchschnitt}=K_{fix}/x_1 + k_{var}$ und gib $k_{durchschnitt}, k_{var}, x_1$ aus.

### UI / Check
Zwei numerische Felder ($K_{fix}$, $k_{var}$); Toleranz ±0,01.

---

## 2.3 Hoch-Tief-Methode (Zwei-Punkt)

### Konzept
Aus Tabelle historischer Auslastungs-/Kostenpaare die maximale und minimale Periode wählen und Funktion fitten.

### Formeln
- $k_{var} = \dfrac{K_{max}-K_{min}}{x_{max}-x_{min}}$
- $K_{fix} = K_{max} - k_{var}\cdot x_{max}$

### Generator
- 4–8 Perioden, $x_i\in[100, 1\,000]$.
- True $K_{fix}, k_{var}$ wählen, $K_i = K_{fix} + k_{var}\cdot x_i + \epsilon_i$ mit kleinem Rauschen $\epsilon_i$.
- Stelle sicher, dass max./min. eindeutig sind.

### UI / Check
Eingaben: $k_{var}$, $K_{fix}$, Prognose $K(x_{neu})$. Toleranz ±0,5 %.

---

## 2.4 Eigenfertigung vs. Fremdbezug (Make-or-Buy)

### Konzept
Nur **entscheidungsrelevante Kosten** vergleichen; nicht abbaubare Fixkosten ignorieren.

### Formel
$\text{Relevante Kosten} = \text{variable Kosten} + \text{abbaubare Fixkosten} \;(+\;\text{Einmalgebühren beim Fremdbezug})$

### Generator
- Bedarf $x \in [1\,000, 50\,000]$ Stück.
- Eigenfertigung: $k_{var}, K_{fix,abbaubar}, K_{fix,sunk}$.
- Fremdbezug: Stückpreis $p_{ext}$, optional Einmalgebühr.
- Tuning so, dass Entscheidung nicht trivial ist (Differenz < 10 %).

### UI / Check
Zwei numerische Felder (rel. Kosten Eigen/ Fremd) + MC „Welche Alternative wählen?". Toleranz ±0,01 €. Bonus-MC: „Welche Position ist NICHT entscheidungsrelevant?"

---

## 2.5 Polynom-Kostenfunktion: Grenz- & Stückkosten

### Konzept
Ableitung und Stückkosten bei kubischer Kostenfunktion.

### Formeln
- $K(x) = a + bx - cx^2 + dx^3$
- $K'(x) = b - 2cx + 3dx^2$
- $k(x) = K(x)/x$

### Generator
- $a\in[100,1\,000]$, $b\in[5,20]$, $c\in[0{,}1,1]$, $d\in[0{,}001,0{,}05]$
- Zufällige Auswertestelle $x\in[5,30]$, ganzzahlig.

### UI / Check
Zwei numerische Felder ($K'(x)$, $k(x)$). Toleranz ±0,01.

Optional: Eingabe der ganzen $K'$- und $k$-Funktion via Koeffizientenfelder (strenger).
